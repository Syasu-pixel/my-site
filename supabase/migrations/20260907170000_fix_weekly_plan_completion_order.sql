-- Ensure the Monday completion event is chronologically later than the
-- challenge-complete event that triggers it. `now()` is transaction-stable,
-- while the incoming event may already carry a slightly later timestamp.

create or replace function public.ai_editorial_capture_weekly_plan_from_challenge()
returns trigger
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_command_id uuid;
  v_cmd public.ai_editorial_commands%rowtype;
  v_routine_day integer;
  v_today date := (clock_timestamp() at time zone 'Asia/Tokyo')::date;
  v_week_start date;
  v_parent text;
  v_plan_started timestamptz;
  v_summary text := '';
  v_priorities jsonb := '[]'::jsonb;
  v_research jsonb := '[]'::jsonb;
  v_challenges jsonb := '[]'::jsonb;
  v_plan jsonb;
  v_completed_at timestamptz;
begin
  if new.event_type <> 'status'
     or coalesce(new.discussion->>'stage','') <> 'challenge-complete'
     or upper(coalesce(new.state,'')) <> 'PLANNING' then
    return new;
  end if;

  begin
    v_command_id := nullif(new.discussion->>'command_id','')::uuid;
  exception when others then
    return new;
  end;
  if v_command_id is null then return new; end if;

  select * into v_cmd from public.ai_editorial_commands where id=v_command_id;
  if not found then return new; end if;

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
  if v_routine_day <> 1 then return new; end if;

  v_parent := 'command-' || v_command_id::text;

  select max(e.created_at) into v_plan_started
  from public.orchestrator_events e
  where e.job_id=v_parent
    and e.event_type='proposal'
    and e.discussion->>'stage'='editor-plan';
  if v_plan_started is null then v_plan_started := v_cmd.created_at; end if;

  select coalesce(e.summary,'') into v_summary
  from public.orchestrator_events e
  where e.job_id=v_parent
    and e.event_type='proposal'
    and e.created_at>=v_plan_started
  order by e.created_at desc, e.id desc
  limit 1;

  select coalesce(jsonb_agg(x.obj order by x.created_at, x.id),'[]'::jsonb) into v_priorities
  from (
    select e.created_at,e.id,jsonb_build_object(
      'title',split_part(e.summary,E'\n',1),
      'goal',case when position(E'\n' in e.summary)>0 then substr(e.summary,position(E'\n' in e.summary)+1) else e.summary end,
      'priority',e.discussion->>'priority',
      'content_type',e.discussion->>'content_type',
      'child_index',e.discussion->>'child_index'
    ) obj
    from public.orchestrator_events e
    where e.job_id like v_parent || '-%'
      and e.event_type='proposal'
      and e.discussion->>'stage'='editor-child-job'
      and e.created_at>=v_plan_started
  ) x;

  select coalesce(jsonb_agg(x.obj order by x.created_at, x.id),'[]'::jsonb) into v_research
  from (
    select e.created_at,e.id,jsonb_build_object(
      'summary',e.summary,
      'evidence',e.evidence,
      'discussion',e.discussion
    ) obj
    from public.orchestrator_events e
    where e.job_id like v_parent || '-%'
      and e.event_type='research'
      and e.created_at>=v_plan_started
  ) x;

  select coalesce(jsonb_agg(x.obj order by x.created_at, x.id),'[]'::jsonb) into v_challenges
  from (
    select e.created_at,e.id,jsonb_build_object(
      'summary',e.summary,
      'severity',e.severity,
      'discussion',e.discussion
    ) obj
    from public.orchestrator_events e
    where e.job_id like v_parent || '-%'
      and e.event_type='challenge'
      and e.created_at>=v_plan_started
  ) x;

  v_week_start := v_today - (extract(isodow from v_today)::int - 1);
  v_completed_at := greatest(
    clock_timestamp(),
    coalesce(new.created_at, clock_timestamp()) + interval '1 millisecond'
  );

  v_plan := jsonb_build_object(
    'source','monday-editorial-cycle',
    'source_command_id',v_command_id,
    'captured_at',v_completed_at,
    'priorities',v_priorities,
    'research',v_research,
    'challenges',v_challenges
  );

  update public.ai_editorial_weekly_plans
     set status='superseded',updated_at=v_completed_at
   where status='active' and week_start<>v_week_start;

  insert into public.ai_editorial_weekly_plans(
    week_start,source_command_id,summary,plan,status,updated_at
  ) values(
    v_week_start,v_command_id,left(coalesce(v_summary,''),4000),v_plan,'active',v_completed_at
  )
  on conflict (week_start) do update
    set source_command_id=excluded.source_command_id,
        summary=excluded.summary,
        plan=excluded.plan,
        status='active',
        updated_at=v_completed_at;

  update public.ai_editorial_commands
     set status='completed',
         last_error=null,
         completed_at=coalesce(completed_at,v_completed_at),
         updated_at=v_completed_at,
         options=coalesce(options,'{}'::jsonb) || jsonb_build_object(
           'routine_day',1,
           'weekly_plan_saved',true,
           'weekly_plan_week_start',v_week_start
         )
   where id=v_command_id and status not in ('completed','cancelled');

  if not exists (
    select 1 from public.orchestrator_events e
    where e.job_id=v_parent and e.event_type='weekly-plan-saved'
  ) then
    insert into public.orchestrator_events(
      event_id,job_id,role,provider,event_type,summary,evidence,severity,state,created_at,discussion,availability
    ) values(
      gen_random_uuid(),v_parent,'system','orchestrator','weekly-plan-saved',
      left('月曜の調査・企画を今週の編集方針として保存しました。火〜日はこの週次方針を自動参照します。 ' || coalesce(v_summary,''),2000),
      jsonb_build_array(jsonb_build_object('kind','weekly-plan','ref',v_week_start::text)),
      'info','COMPLETED',v_completed_at,
      jsonb_build_object(
        'command_id',v_command_id,
        'stage','weekly-plan-saved',
        'week_start',v_week_start,
        'cycle','monday-to-sunday'
      ),
      jsonb_build_object('primary_provider','supabase','status','online')
    );
  end if;

  return new;
end;
$function$;

-- Repair any existing Monday record where the completion event was stamped
-- a fraction earlier than its triggering challenge-complete event.
with latest_challenge as (
  select job_id, max(created_at) as challenge_at
  from public.orchestrator_events
  where event_type='status'
    and discussion->>'stage'='challenge-complete'
  group by job_id
)
update public.orchestrator_events w
set created_at = c.challenge_at + interval '1 millisecond'
from latest_challenge c
where w.job_id=c.job_id
  and w.event_type='weekly-plan-saved'
  and w.created_at <= c.challenge_at;
