-- Review only. No deployment, project link, auth changes or production seed.
-- Run under a controlled owner role in an isolated Postgres installation.
begin;

create schema dc_comment_private;
revoke all on schema dc_comment_private from public, anon, authenticated;

create table dc_comment_private.article (
 path text primary key check (path ~ '^/articles/[a-z0-9-]{1,120}[.]html$'),
 enabled boolean not null default false
);
create table dc_comment_private.entry (
 id uuid primary key default gen_random_uuid(),
 path text not null references dc_comment_private.article(path),
 parent uuid,
 author_id uuid not null,
 rev integer not null default 1 check (rev > 0),
 pending jsonb,
 published jsonb,
 hidden boolean not null default false,
 created_at timestamptz not null default clock_timestamp(),
 unique (id, path),
 foreign key (parent, path) references dc_comment_private.entry(id, path),
 check (parent is distinct from id),
 check (pending is null or jsonb_typeof(pending)='object'),
 check (published is null or jsonb_typeof(published)='object')
);
create table dc_comment_private.moderation_event (
 id bigint generated always as identity primary key,
 entry_id uuid not null references dc_comment_private.entry(id),
 actor_id uuid not null,
 action text not null check (action in ('approve','decline','hide','edit')),
 from_rev integer not null,
 happened_at timestamptz not null default clock_timestamp()
);
alter table dc_comment_private.article enable row level security;
alter table dc_comment_private.entry enable row level security;
alter table dc_comment_private.moderation_event enable row level security;
revoke all on all tables in schema dc_comment_private from public, anon, authenticated;
revoke all on all sequences in schema dc_comment_private from public, anon, authenticated;
create index entry_pending_order on dc_comment_private.entry(created_at desc, id) where not hidden and pending is not null;
create index entry_published_order on dc_comment_private.entry(created_at desc, id) where not hidden and published is not null;

create function dc_comment_private.moderator(p_lock boolean)
returns boolean language plpgsql security definer set search_path='' as $$
declare actor uuid := auth.uid();
begin
  if actor is null or auth.jwt()->>'is_anonymous' is distinct from 'false' then return false; end if;
  if p_lock then
    perform 1 from public.ai_editorial_admins where user_id=actor for share;
  else
    perform 1 from public.ai_editorial_admins where user_id=actor;
  end if;
  return found;
end $$;
revoke execute on function dc_comment_private.moderator(boolean) from public, anon, authenticated;

create function public.dc_comment_moderator_self()
returns boolean language sql security definer set search_path='' as $$
 select dc_comment_private.moderator(false);
$$;

create function public.dc_comment_moderation_list(p_state text, p_limit integer, p_after uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; anchor_time timestamptz;
begin
 if not dc_comment_private.moderator(false) then
   raise exception 'moderator required' using errcode='42501';
 end if;
 if p_state is null or p_state not in ('pending','published') or p_limit is null or p_limit not between 1 and 51 then
   raise exception 'invalid list parameters' using errcode='22023';
 end if;
 if p_after is not null then
   select e.created_at into anchor_time from dc_comment_private.entry e
   join dc_comment_private.article a on a.path=e.path and a.enabled where e.id=p_after;
   if not found then raise exception 'invalid cursor' using errcode='22023'; end if;
 end if;
 select coalesce(jsonb_agg(jsonb_build_object(
   'id', x.id,'path', x.path,'parent', x.parent,'state',p_state,
   'body',x.version->>'body','nickname',x.version->>'nickname',
   'editor',x.version->>'editor','rev',x.rev,
   'parentUnavailable',p_state='pending' and x.parent is not null and not exists (
     select 1 from dc_comment_private.entry parent where parent.id=x.parent and parent.path=x.path
       and parent.parent is null and not parent.hidden and parent.published is not null),
   'hasPendingEdit',p_state='published' and x.pending is not null,
   'mayFeature',p_state='published' and x.pending is null and x.version->'consent'='true'::jsonb
 ) order by x.created_at desc,x.id),'[]'::jsonb) into result
 from (
   select e.*,case p_state when 'pending' then e.pending else e.published end as version
   from dc_comment_private.entry e
   join dc_comment_private.article a on a.path=e.path and a.enabled
   where not e.hidden
   and (p_after is null or e.created_at < anchor_time or (e.created_at=anchor_time and e.id>p_after)) and (
      (p_state='pending' and e.pending is not null)
      or (p_state='published' and e.published is not null and (e.parent is null or exists (
        select 1 from dc_comment_private.entry pe where pe.id=e.parent and pe.path=e.path
          and pe.parent is null and not pe.hidden and pe.published is not null)))
   )
   order by e.created_at desc,e.id limit p_limit
 ) x;
 return result;
end $$;

create function public.dc_comment_moderation_apply(p_path text,p_id uuid,p_action text,p_rev integer,p_body text,p_nickname text)
returns boolean language plpgsql security definer set search_path='' as $$
declare item dc_comment_private.entry%rowtype; new_body text; new_nick text;
begin
 -- Shared membership lock serializes revocation against an in-flight mutation.
 if not dc_comment_private.moderator(true) then
   raise exception 'moderator required' using errcode='42501';
 end if;
 if p_path is null or p_path !~ '^/articles/[a-z0-9-]{1,120}[.]html$' or p_id is null or
    p_action is null or p_action not in ('approve','decline','hide','edit') or p_rev is null or p_rev<1 then
   raise exception 'invalid moderation parameters' using errcode='22023';
 end if;
 perform 1 from dc_comment_private.article where path=p_path and enabled for share;
 if not found then raise exception 'missing article' using errcode='P0002'; end if;
 select * into item from dc_comment_private.entry where path=p_path and id=p_id and not hidden for update;
 if not found then raise exception 'missing entry' using errcode='P0002'; end if;
 if item.rev<>p_rev or (p_action in ('approve','decline') and item.pending is null)
     or (p_action='hide' and item.published is null) then
   raise exception 'stale revision or incompatible state' using errcode='DC409';
 end if;
 if p_action='approve' and item.parent is not null then
   perform 1 from dc_comment_private.entry where id=item.parent and path=p_path
      and parent is null and not hidden and published is not null for share;
   if not found then raise exception 'parent is not public' using errcode='DC409'; end if;
 end if;
 if p_action='edit' then
   new_body := regexp_replace(p_body,'^[[:space:]]+|[[:space:]]+$','','g');
   new_nick := regexp_replace(p_nickname,'^[[:space:]]+|[[:space:]]+$','','g');
   if new_body is null or char_length(new_body) not between 1 and 500 or new_nick is null or char_length(new_nick)>24 then
     raise exception 'invalid edit' using errcode='22023';
   end if;
 end if;
 update dc_comment_private.entry
 set rev=rev+1,
     pending=case p_action when 'approve' then null when 'decline' then null
       when 'edit' then jsonb_build_object('body',new_body,'nickname',coalesce(nullif(new_nick,''),'匿名'),'editor','運営','consent',false)
       else pending end,
     published=case p_action when 'approve' then pending else published end,
     hidden=hidden or p_action='hide'
 where id=p_id and path=p_path and rev=p_rev;
 if not found then raise exception 'revision changed' using errcode='DC409'; end if;
 insert into dc_comment_private.moderation_event(entry_id,actor_id,action,from_rev)
 values (p_id,auth.uid(),p_action,p_rev);
 return true;
end $$;

revoke all on function public.dc_comment_moderator_self() from public, anon, authenticated;
revoke all on function public.dc_comment_moderation_list(text,integer,uuid) from public, anon, authenticated;
revoke all on function public.dc_comment_moderation_apply(text,uuid,text,integer,text,text) from public, anon, authenticated;
grant execute on function public.dc_comment_moderator_self() to authenticated;
grant execute on function public.dc_comment_moderation_list(text,integer,uuid) to authenticated;
grant execute on function public.dc_comment_moderation_apply(text,uuid,text,integer,text,text) to authenticated;
commit;
