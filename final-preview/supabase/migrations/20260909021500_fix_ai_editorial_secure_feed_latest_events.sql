create or replace function public.ai_editorial_secure_feed(p_limit integer default 1000, p_job_id text default null::text)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_uid uuid := auth.uid();
  v_limit integer := least(greatest(coalesce(p_limit,1000),1),1000);
  v_events jsonb;
begin
  if v_uid is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  if not exists (
    select 1 from public.ai_editorial_admins a where a.user_id = v_uid
  ) then
    raise exception 'administrator access required' using errcode = '42501';
  end if;

  -- The dashboard feed is capped at 1000 events. Always choose the newest
  -- events first, then restore chronological order for rendering.
  select coalesce(jsonb_agg(to_jsonb(t) order by t.created_at), '[]'::jsonb)
    into v_events
  from (
    select *
    from (
      select event_id, job_id, role, provider, event_type as type, summary,
             evidence, severity, state, created_at, discussion, availability
      from public.orchestrator_events
      where p_job_id is null or job_id = left(p_job_id,160)
      order by created_at desc
      limit v_limit
    ) newest
    order by created_at asc
  ) t;

  return jsonb_build_object('version','secure-feed-rpc-v2-latest','events',v_events);
end;
$function$;
