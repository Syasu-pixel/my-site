-- Review only: apply after moderation-postgres.review.sql in an isolated database.
-- Exposes approved article text only; the caller identity or cookie is never needed.
begin;
create function public.dc_comment_public_list(p_path text)
returns jsonb language sql stable security definer set search_path='' as $$
 with roots as (
   select c.id,c.created_at,c.published
   from dc_comment_private.article a
   join dc_comment_private.entry c on c.path=a.path
   where a.path=p_path and a.enabled and c.parent is null and not c.hidden and c.published is not null
   order by c.created_at desc,c.id
   limit 50
 ), visible as (
   select r.id,null::uuid as parent,r.created_at,r.published,r.created_at as group_time,r.id as group_id,0 as depth
   from roots r
   union all
   select child.id,r.id,child.created_at,child.published,r.created_at,r.id,1
   from roots r
   cross join lateral (
     select c.id,c.created_at,c.published
     from dc_comment_private.entry c
     where c.path=p_path and c.parent=r.id and not c.hidden and c.published is not null
     order by c.created_at,c.id
     limit 20
   ) child
 )
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'parent',parent,'body',published->>'body',
    'nickname',published->>'nickname','editor',published->>'editor')
    order by group_time desc,group_id,depth,created_at,id),'[]'::jsonb)
 from visible
$$;
revoke all on function public.dc_comment_public_list(text) from public, anon, authenticated;
grant execute on function public.dc_comment_public_list(text) to anon, authenticated;
commit;
