-- Review only; requires the moderation and public-list review migrations.
-- Provision/bind a restricted server role separately. Never grant it to a browser role.
begin;
create table dc_comment_private.receipt (
 path text not null references dc_comment_private.article(path),
 actor uuid not null,
 request_id uuid not null,
 fingerprint bytea not null,
 entry_id uuid not null,
 received_at timestamptz not null default clock_timestamp(),
 primary key(path,actor,request_id),
 foreign key(entry_id,path) references dc_comment_private.entry(id,path)
);
alter table dc_comment_private.receipt enable row level security;
revoke all on dc_comment_private.receipt from public, anon, authenticated, dc_comment_gateway;
create index comment_receipt_actor_recent on dc_comment_private.receipt(actor,received_at desc);
create index comment_entries_author on dc_comment_private.entry(path,author_id,created_at desc,id);
create index comment_visible_children on dc_comment_private.entry(path,parent,created_at,id) where not hidden and published is not null;
create function public.dc_comment_gateway_eligible(p_path text)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from dc_comment_private.article where path=p_path and enabled)
$$;
create function public.dc_comment_gateway_own(p_path text,p_actor uuid)
returns jsonb language sql stable security definer set search_path='' as $$
 with page as (
  select c.id,c.parent,c.rev,c.created_at,c.pending,
         coalesce(c.pending,c.published) as displayed
  from dc_comment_private.article a
  join dc_comment_private.entry c on a.path=c.path and c.author_id=p_actor
  left join dc_comment_private.entry p on p.id=c.parent and p.path=c.path and p.parent is null
  where a.path=p_path and a.enabled and not c.hidden
   and (c.pending is not null or (c.published is not null and
     (c.parent is null or (not p.hidden and p.published is not null))))
  order by c.created_at desc,c.id limit 100
 )
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'parent',parent,'rev',rev,
   'state',case when pending is null then 'published' else 'pending' end,
   'body',displayed->>'body','nickname',displayed->>'nickname','editor',displayed->>'editor')
   order by created_at desc,id),'[]'::jsonb) from page
$$;
create function public.dc_comment_gateway_write(p_path text,p_actor uuid,p_request uuid,p_entry uuid,
 p_parent uuid,p_rev integer,p_body text,p_nickname text,p_consent boolean)
returns uuid language plpgsql security definer set search_path='' as $$
declare payload jsonb; fingerprint bytea; previous dc_comment_private.receipt%rowtype; result uuid; current_entry dc_comment_private.entry%rowtype;
begin
 if p_actor is null or p_request is null or p_body is null or p_nickname is null then
  raise exception 'invalid input' using errcode='22023';
 end if;
 p_body:=regexp_replace(p_body,'^[[:space:]]+|[[:space:]]+$','','g');
 p_nickname:=regexp_replace(p_nickname,'^[[:space:]]+|[[:space:]]+$','','g');
 if char_length(p_body) not between 1 and 500 or char_length(p_nickname)>24 or
    (p_entry is null and p_rev is not null) or (p_entry is not null and (p_parent is not null or p_rev is null or p_rev<1)) then
  raise exception 'invalid input' using errcode='22023';
 end if;
 perform 1 from dc_comment_private.article where path=p_path and enabled for share;
 if not found then raise exception 'article is unavailable' using errcode='P0002'; end if;
 perform pg_catalog.pg_advisory_xact_lock(641245,pg_catalog.hashtext(p_actor::text));
 payload:=jsonb_build_object('body',p_body,'nickname',coalesce(nullif(p_nickname,''),'匿名'),'editor','投稿者','consent',p_consent is true);
 fingerprint:=pg_catalog.sha256(pg_catalog.convert_to(jsonb_build_object('entry',p_entry,'parent',p_parent,'rev',p_rev,'payload',payload)::text,'UTF8'));
 select * into previous from dc_comment_private.receipt where path=p_path and actor=p_actor and request_id=p_request;
 if found then
  if previous.fingerprint<>fingerprint then raise exception 'request changed' using errcode='DC409'; end if;
  return previous.entry_id;
 end if;
 if (select count(*) from dc_comment_private.receipt where actor=p_actor and received_at>clock_timestamp()-interval '10 minutes')>=10 then
  raise exception 'retry later' using errcode='DC429';
 end if;
 if p_entry is null then
  if p_parent is not null then
   perform 1 from dc_comment_private.entry where id=p_parent and path=p_path and parent is null
     and not hidden and published is not null for share;
   if not found then raise exception 'parent unavailable' using errcode='DC409'; end if;
  end if;
  insert into dc_comment_private.entry(path,author_id,parent,pending) values(p_path,p_actor,p_parent,payload)
   returning id into result;
 else
  select * into current_entry from dc_comment_private.entry where id=p_entry and path=p_path and author_id=p_actor and not hidden for update;
  if not found then raise exception 'entry unavailable' using errcode='P0002'; end if;
  if current_entry.rev<>p_rev then raise exception 'revision changed' using errcode='DC409'; end if;
  update dc_comment_private.entry set pending=payload,rev=rev+1 where id=p_entry;
  result:=p_entry;
 end if;
 insert into dc_comment_private.receipt(path,actor,request_id,fingerprint,entry_id) values(p_path,p_actor,p_request,fingerprint,result);
 return result;
end $$;
revoke all on function public.dc_comment_gateway_eligible(text),public.dc_comment_gateway_own(text,uuid),public.dc_comment_gateway_write(text,uuid,uuid,uuid,uuid,integer,text,text,boolean) from public, anon, authenticated;
grant execute on function public.dc_comment_gateway_eligible(text),public.dc_comment_gateway_own(text,uuid),public.dc_comment_gateway_write(text,uuid,uuid,uuid,uuid,integer,text,text,boolean) to dc_comment_gateway;
commit;
