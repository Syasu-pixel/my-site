create or replace function public.ai_editorial_finalize_monday_weekly_plan()
returns trigger
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_command_id uuid;
  v_cmd public.ai_editorial_commands%rowtype;
  v_routine_day integer;
  v_parent text;
begin
  if new.event_type <> 'review'
     or coalesce(new.discussion->>'stage','') <> 'prebuild-review-pass'
     or upper(coalesce(new.state,'')) <> 'BUILDING' then
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

  v_parent := 'command-'||v_command_id::text;

  if exists (
    select 1 from public.orchestrator_events e
    where e.job_id=v_parent and e.event_type='weekly-plan-saved'
  ) then
    return new;
  end if;

  insert into public.orchestrator_events(
    event_id,job_id,role,provider,event_type,summary,evidence,severity,state,created_at,discussion,availability
  ) values (
    gen_random_uuid(),v_parent,'system','orchestrator','status',
    '月曜の調査・企画が検証を通過しました。今週の編集方針として保存し、月曜案件を完了します。',
    jsonb_build_array(jsonb_build_object('kind','command','ref',v_command_id::text)),
    'info','PLANNING',now(),
    jsonb_build_object(
      'command_id',v_command_id,
      'stage','challenge-complete',
      'final_weekly_plan',true,
      'source_stage','prebuild-review-pass',
      'routine_day',1
    ),
    jsonb_build_object('primary_provider','orchestrator','status','online')
  );

  return new;
end;
$function$;

drop trigger if exists trg_ai_editorial_finalize_monday_weekly_plan on public.orchestrator_events;
create trigger trg_ai_editorial_finalize_monday_weekly_plan
after insert on public.orchestrator_events
for each row execute function public.ai_editorial_finalize_monday_weekly_plan();
