create table if not exists public.ai_editorial_weekly_plans (
  id uuid primary key default gen_random_uuid(),
  week_start date not null unique,
  source_command_id uuid not null references public.ai_editorial_commands(id) on delete restrict,
  summary text not null default '',
  plan jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active','superseded','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(source_command_id)
);

alter table public.ai_editorial_weekly_plans enable row level security;
revoke all on public.ai_editorial_weekly_plans from anon, authenticated;

create or replace function public.ai_editorial_weekly_plan_get_current()
returns jsonb
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_today date := (now() at time zone 'Asia/Tokyo')::date;
  v_week_start date;
  v_row public.ai_editorial_weekly_plans%rowtype;
begin
  if v_uid is null then raise exception 'authentication required' using errcode='42501'; end if;
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id=v_uid) then
    raise exception 'admin required' using errcode='42501';
  end if;
  v_week_start := v_today - (extract(isodow from v_today)::int - 1);
  select * into v_row
  from public.ai_editorial_weekly_plans
  where week_start=v_week_start and status='active'
  order by updated_at desc
  limit 1;
  if not found then
    return jsonb_build_object('available',false,'week_start',v_week_start);
  end if;
  return jsonb_build_object(
    'available',true,
    'id',v_row.id,
    'week_start',v_row.week_start,
    'week_end',v_row.week_start+6,
    'source_command_id',v_row.source_command_id,
    'summary',v_row.summary,
    'plan',v_row.plan,
    'updated_at',v_row.updated_at
  );
end;
$function$;

grant execute on function public.ai_editorial_weekly_plan_get_current() to authenticated;

create or replace function public.ai_editorial_capture_weekly_plan_from_challenge()
returns trigger
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_command_id uuid;
  v_cmd public.ai_editorial_commands%rowtype;
  v_routine_day integer;
  v_today date := (now() at time zone 'Asia/Tokyo')::date;
  v_week_start date;
  v_parent text;
  v_plan_started timestamptz;
  v_summary text := '';
  v_priorities jsonb := '[]'::jsonb;
  v_research jsonb := '[]'::jsonb;
  v_challenges jsonb := '[]'::jsonb;
  v_plan jsonb;
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
  where e.job_id=v_parent and e.event_type='proposal' and e.discussion->>'stage'='editor-plan';
  if v_plan_started is null then v_plan_started := v_cmd.created_at; end if;

  select coalesce(e.summary,'') into v_summary
  from public.orchestrator_events e
  where e.job_id=v_parent and e.event_type='proposal' and e.created_at>=v_plan_started
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
  v_plan := jsonb_build_object(
    'source','monday-editorial-cycle',
    'source_command_id',v_command_id,
    'captured_at',now(),
    'priorities',v_priorities,
    'research',v_research,
    'challenges',v_challenges
  );

  update public.ai_editorial_weekly_plans
     set status='superseded',updated_at=now()
   where status='active' and week_start<>v_week_start;

  insert into public.ai_editorial_weekly_plans(week_start,source_command_id,summary,plan,status)
  values(v_week_start,v_command_id,left(coalesce(v_summary,''),4000),v_plan,'active')
  on conflict (week_start) do update
    set source_command_id=excluded.source_command_id,
        summary=excluded.summary,
        plan=excluded.plan,
        status='active',
        updated_at=now();

  update public.ai_editorial_commands
     set status='completed',last_error=null,completed_at=coalesce(completed_at,now()),updated_at=now(),
         options=coalesce(options,'{}'::jsonb) || jsonb_build_object('routine_day',1,'weekly_plan_saved',true,'weekly_plan_week_start',v_week_start)
   where id=v_command_id and status not in ('completed','cancelled');

  if not exists (
    select 1 from public.orchestrator_events e
    where e.job_id=v_parent and e.event_type='weekly-plan-saved'
  ) then
    insert into public.orchestrator_events(event_id,job_id,role,provider,event_type,summary,evidence,severity,state,created_at,discussion,availability)
    values(
      gen_random_uuid(),v_parent,'system','orchestrator','weekly-plan-saved',
      left('月曜の調査・企画を今週の編集方針として保存しました。火〜日はこの週次方針を自動参照します。 ' || coalesce(v_summary,''),2000),
      jsonb_build_array(jsonb_build_object('kind','weekly-plan','ref',v_week_start::text)),
      'info','COMPLETED',now(),
      jsonb_build_object('command_id',v_command_id,'stage','weekly-plan-saved','week_start',v_week_start,'cycle','monday-to-sunday'),
      jsonb_build_object('primary_provider','supabase','status','online')
    );
  end if;

  return new;
end;
$function$;

drop trigger if exists trg_ai_editorial_capture_weekly_plan on public.orchestrator_events;
create trigger trg_ai_editorial_capture_weekly_plan
after insert on public.orchestrator_events
for each row execute function public.ai_editorial_capture_weekly_plan_from_challenge();

create or replace function public.ai_editorial_submit_command(
  p_instruction text,
  p_requested_count integer default null,
  p_options jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_job_id text;
  v_instruction text := btrim(coalesce(p_instruction, ''));
  v_count integer;
  v_active_id uuid;
  v_active_status text;
  v_routine_day integer;
  v_today date := (now() at time zone 'Asia/Tokyo')::date;
  v_week_start date;
  v_weekly_context jsonb;
  v_options jsonb := coalesce(p_options,'{}'::jsonb);
  i integer;
begin
  if v_uid is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id = v_uid) then raise exception 'admin required' using errcode = '42501'; end if;
  if char_length(v_instruction) < 1 or char_length(v_instruction) > 4000 then raise exception 'instruction must be 1..4000 characters' using errcode = '22023'; end if;
  if p_requested_count is not null and (p_requested_count < 1 or p_requested_count > 50) then raise exception 'requested_count must be 1..50' using errcode = '22023'; end if;

  perform pg_advisory_xact_lock(hashtext('ai_editorial_single_active_command')::bigint);
  select c.id,c.status into v_active_id,v_active_status
  from public.ai_editorial_commands c
  where c.status not in ('completed','cancelled')
  order by c.created_at desc limit 1;
  if found then
    raise exception 'active editorial command exists: % (%)',v_active_id,v_active_status
      using errcode='55000',hint='Complete, automatically resume, or close the current command before creating another one.';
  end if;

  begin
    v_routine_day := nullif(v_options->>'routine_day','')::integer;
  exception when others then
    v_routine_day := null;
  end;
  if v_routine_day is null then
    v_routine_day := case
      when v_instruction ~ '^[[:space:]]*月曜' then 1
      when v_instruction ~ '^[[:space:]]*火曜' then 2
      when v_instruction ~ '^[[:space:]]*水曜' then 3
      when v_instruction ~ '^[[:space:]]*木曜' then 4
      when v_instruction ~ '^[[:space:]]*金曜' then 5
      when v_instruction ~ '^[[:space:]]*土曜' then 6
      when v_instruction ~ '^[[:space:]]*日曜' then 7
      else null end;
  end if;

  v_week_start := v_today - (extract(isodow from v_today)::int - 1);
  if v_routine_day between 2 and 7 then
    select jsonb_build_object(
      'available',true,
      'week_start',w.week_start,
      'week_end',w.week_start+6,
      'source_command_id',w.source_command_id,
      'summary',w.summary,
      'plan',w.plan
    ) into v_weekly_context
    from public.ai_editorial_weekly_plans w
    where w.week_start=v_week_start and w.status='active'
    order by w.updated_at desc limit 1;
    if v_weekly_context is null then
      v_weekly_context := jsonb_build_object('available',false,'week_start',v_week_start);
    end if;
    v_options := v_options || jsonb_build_object('weekly_plan_context',v_weekly_context);
  end if;
  if v_routine_day is not null then
    v_options := v_options || jsonb_build_object('routine_day',v_routine_day,'routine_cycle','monday-to-sunday');
  end if;

  v_count := coalesce(p_requested_count, 1);
  v_options := v_options || jsonb_build_object(
    'queue_policy','one-deliverable-one-queue',
    'retry_policy','same-queue',
    'artifact_policy','one-url-per-queue'
  );

  insert into public.ai_editorial_commands(created_by,instruction,requested_count,options)
  values(v_uid,v_instruction,v_count,v_options)
  returning id into v_id;
  v_job_id := 'command-' || v_id::text;

  for i in 1..v_count loop
    insert into public.orchestrator_events(event_id,job_id,role,provider,event_type,summary,evidence,severity,state,created_at,discussion,availability)
    values(
      gen_random_uuid(),
      case when v_count=1 then v_job_id else v_job_id || '-' || lpad(i::text,2,'0') end,
      'human','dashboard-admin','instruction',
      case when v_count=1 then left(v_instruction,2000) else left(format('[成果物 %s/%s] %s',i,v_count,v_instruction),2000) end,
      jsonb_build_array(jsonb_build_object('kind','command','ref',v_id::text)),
      'info','QUEUED',now(),
      jsonb_build_object(
        'command_id',v_id,'requested_count',v_count,'deliverable_index',i,'deliverable_count',v_count,
        'queue_policy','one-deliverable-one-queue','retry_policy','same-queue','artifact_policy','one-url-per-queue',
        'routine_day',v_routine_day,'weekly_plan_attached',coalesce((v_weekly_context->>'available')::boolean,false),
        'source','ai-editorial-dashboard'
      ),null
    );
  end loop;

  return jsonb_build_object(
    'ok',true,'command_id',v_id,'job_id',v_job_id,'status','queued','queue_count',v_count,
    'queue_policy','one-deliverable-one-queue','routine_day',v_routine_day,
    'weekly_plan_attached',coalesce((v_weekly_context->>'available')::boolean,false)
  );
end;
$function$;
