create or replace function public.admin_article_feedback_dashboard()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_summary jsonb;
  v_articles jsonb;
  v_recent jsonb;
begin
  if v_uid is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  if not exists (
    select 1
    from public.ai_editorial_admins a
    where a.user_id = v_uid
  ) then
    raise exception 'administrator access required' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'total_votes', count(*)::integer,
    'helpful', count(*) filter (where vote = 'helpful')::integer,
    'not_helpful', count(*) filter (where vote = 'not_helpful')::integer,
    'helpful_rate', case
      when count(*) = 0 then 0
      else round((count(*) filter (where vote = 'helpful'))::numeric * 100 / count(*), 1)
    end,
    'last_7_days', count(*) filter (where updated_at >= now() - interval '7 days')::integer,
    'last_30_days', count(*) filter (where updated_at >= now() - interval '30 days')::integer,
    'last_vote_at', max(updated_at)
  ) into v_summary
  from public.article_feedback;

  select coalesce(jsonb_agg(to_jsonb(t) order by t.total_votes desc, t.article_slug), '[]'::jsonb)
  into v_articles
  from (
    select
      article_slug,
      count(*)::integer as total_votes,
      count(*) filter (where vote = 'helpful')::integer as helpful,
      count(*) filter (where vote = 'not_helpful')::integer as not_helpful,
      case
        when count(*) = 0 then 0
        else round((count(*) filter (where vote = 'helpful'))::numeric * 100 / count(*), 1)
      end as helpful_rate,
      max(updated_at) as last_vote_at
    from public.article_feedback
    group by article_slug
  ) t;

  select coalesce(jsonb_agg(to_jsonb(r) order by r.updated_at desc), '[]'::jsonb)
  into v_recent
  from (
    select article_slug, vote, updated_at
    from public.article_feedback
    order by updated_at desc
    limit 20
  ) r;

  return jsonb_build_object(
    'summary', v_summary,
    'articles', v_articles,
    'recent', v_recent
  );
end;
$function$;

revoke all on function public.admin_article_feedback_dashboard() from public;
revoke all on function public.admin_article_feedback_dashboard() from anon;
revoke all on function public.admin_article_feedback_dashboard() from authenticated;
grant execute on function public.admin_article_feedback_dashboard() to authenticated;

comment on function public.admin_article_feedback_dashboard() is
  'Admin-only article feedback aggregate. Requires auth.uid() to exist in ai_editorial_admins; voter identifiers are never returned.';
