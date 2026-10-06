create or replace function public.ai_editorial_resume_snapshot(p_command_id uuid)
returns jsonb
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_cmd public.ai_editorial_commands%rowtype;
  v_parent text;
  v_plan_started timestamptz;
  v_plan_summary text := '';
  v_jobs jsonb := '[]'::jsonb;
  v_research jsonb := '[]'::jsonb;
  v_latest jsonb := '{}'::jsonb;
  v_challenge jsonb := '{}'::jsonb;
  v_revision_round integer := 0;
  v_routine_day integer;
begin
  if v_uid is null then
    raise exception 'authentication required' using errcode='42501';
  end if;
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id=v_uid) then
    raise exception 'admin required' using errcode='42501';
  end if;

  select * into v_cmd
  from public.ai_editorial_commands
  where id=p_command_id;
  if not found then
    raise exception 'command not found' using errcode='P0002';
  end if;

  v_parent := 'command-' || p_command_id::text;

  select max(e.created_at) into v_plan_started
  from public.orchestrator_events e
  where e.job_id=v_parent
    and e.event_type='proposal'
    and e.discussion->>'stage'='editor-plan';

  begin
    v_routine_day := nullif(v_cmd.options->>'routine_day','')::integer;
  exception when others then
    v_routine_day := null;
  end;
  if v_routine_day is null then
    v_routine_day := case
      when v_cmd.instruction ~ '^[[:space:]]*月曜' then 1
      when v_cmd.instruction ~ '^[[:space:]]*火曜' then 2
      when v_cmd.instruction ~ '^[[:space:]]*水曜' then 3
      when v_cmd.instruction ~ '^[[:space:]]*木曜' then 4
      when v_cmd.instruction ~ '^[[:space:]]*金曜' then 5
      when v_cmd.instruction ~ '^[[:space:]]*土曜' then 6
      when v_cmd.instruction ~ '^[[:space:]]*日曜' then 7
      else null end;
  end if;

  if v_plan_started is not null then
    select coalesce(e.summary,'') into v_plan_summary
    from public.orchestrator_events e
    where e.job_id=v_parent
      and e.event_type='proposal'
      and e.discussion->>'stage'='editor-plan'
      and e.created_at=v_plan_started
    order by e.id desc
    limit 1;

    with base as (
      select distinct on ((e.discussion->>'child_index')::integer)
        (e.discussion->>'child_index')::integer as child_index,
        e.summary,
        e.discussion,
        e.created_at,
        e.id
      from public.orchestrator_events e
      where e.created_at>=v_plan_started
        and e.job_id like v_parent || '-%'
        and e.event_type='proposal'
        and e.discussion->>'stage'='editor-child-job'
        and e.discussion ? 'child_index'
      order by (e.discussion->>'child_index')::integer, e.created_at desc, e.id desc
    ), rev as (
      select distinct on ((e.discussion->>'child_index')::integer)
        (e.discussion->>'child_index')::integer as child_index,
        e.summary,
        e.created_at,
        e.id
      from public.orchestrator_events e
      where e.created_at>=v_plan_started
        and e.job_id like v_parent || '-%'
        and e.event_type='revision'
        and e.discussion->>'stage'='editor-auto-revision'
        and e.discussion ? 'child_index'
      order by (e.discussion->>'child_index')::integer,
               coalesce(nullif(e.discussion->>'round','')::integer,0) desc,
               e.created_at desc, e.id desc
    )
    select coalesce(jsonb_agg(
      jsonb_build_object(
        'child_index',b.child_index,
        'title',split_part(coalesce(r.summary,b.summary),E'\n',1),
        'goal',case
          when position(E'\n' in coalesce(r.summary,b.summary))>0
            then substr(coalesce(r.summary,b.summary),position(E'\n' in coalesce(r.summary,b.summary))+1)
          else coalesce(r.summary,b.summary)
        end,
        'content_type',coalesce(b.discussion->>'content_type','research'),
        'priority',coalesce(b.discussion->>'priority','medium'),
        'needs_research',coalesce((b.discussion->>'needs_research')::boolean,false),
        'research_brief',coalesce(b.discussion->>'research_brief','')
      ) order by b.child_index
    ),'[]'::jsonb) into v_jobs
    from base b
    left join rev r using(child_index);

    with rr as (
      select distinct on ((e.discussion->>'child_index')::integer)
        (e.discussion->>'child_index')::integer as child_index,
        e.summary,
        e.discussion,
        e.evidence,
        e.created_at,
        e.id
      from public.orchestrator_events e
      where e.created_at>=v_plan_started
        and e.job_id like v_parent || '-%'
        and e.event_type='research'
        and e.discussion->>'stage'='official-web-research'
        and e.discussion ? 'child_index'
      order by (e.discussion->>'child_index')::integer, e.created_at desc, e.id desc
    )
    select coalesce(jsonb_agg(
      jsonb_build_object(
        'child_index',rr.child_index,
        'summary',rr.summary,
        'key_points','[]'::jsonb,
        'sources',coalesce(rr.discussion->'sources','[]'::jsonb),
        'confidence',coalesce(nullif(rr.discussion->>'confidence','')::numeric,0),
        'evidence',coalesce(rr.evidence,'[]'::jsonb)
      ) order by rr.child_index
    ),'[]'::jsonb) into v_research
    from rr;

    select coalesce(e.discussion,'{}'::jsonb) into v_challenge
    from public.orchestrator_events e
    where e.created_at>=v_plan_started
      and e.job_id=v_parent
      and e.event_type='status'
      and e.discussion->>'stage'='challenge-complete'
    order by e.created_at desc,e.id desc
    limit 1;

    select coalesce(max(nullif(e.discussion->>'round','')::integer),0)
      into v_revision_round
    from public.orchestrator_events e
    where e.created_at>=v_plan_started
      and (e.job_id=v_parent or e.job_id like v_parent || '-%')
      and e.discussion->>'stage' in ('editor-auto-revision','gemini-challenge','challenge-complete');

    select jsonb_build_object(
      'event_type',e.event_type,
      'state',e.state,
      'provider',e.provider,
      'stage',coalesce(e.discussion->>'stage',''),
      'created_at',e.created_at,
      'discussion',coalesce(e.discussion,'{}'::jsonb)
    ) into v_latest
    from public.orchestrator_events e
    where e.created_at>=v_plan_started
      and (e.job_id=v_parent or e.job_id like v_parent || '-%')
    order by e.created_at desc,e.id desc
    limit 1;
  else
    select jsonb_build_object(
      'event_type',e.event_type,
      'state',e.state,
      'provider',e.provider,
      'stage',coalesce(e.discussion->>'stage',''),
      'created_at',e.created_at,
      'discussion',coalesce(e.discussion,'{}'::jsonb)
    ) into v_latest
    from public.orchestrator_events e
    where e.job_id=v_parent or e.job_id like v_parent || '-%'
    order by e.created_at desc,e.id desc
    limit 1;
  end if;

  return jsonb_build_object(
    'available',v_plan_started is not null,
    'command',jsonb_build_object(
      'id',v_cmd.id,
      'instruction',v_cmd.instruction,
      'status',v_cmd.status,
      'requested_count',v_cmd.requested_count,
      'options',coalesce(v_cmd.options,'{}'::jsonb)
    ),
    'parent_job_id',v_parent,
    'routine_day',v_routine_day,
    'plan_started_at',v_plan_started,
    'plan_summary',v_plan_summary,
    'jobs',v_jobs,
    'research',v_research,
    'challenge_complete',coalesce(v_challenge,'{}'::jsonb),
    'revision_round',v_revision_round,
    'latest',coalesce(v_latest,'{}'::jsonb)
  );
end;
$function$;

grant execute on function public.ai_editorial_resume_snapshot(uuid) to authenticated;
