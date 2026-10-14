create or replace function public.ai_editorial_claim_stalled(p_stale_seconds integer default 180)
returns jsonb
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_rec record;
  v_stale_seconds integer := greatest(120, least(coalesce(p_stale_seconds,180),1800));
  v_count integer := 0;
  v_parent text;
begin
  if v_uid is null then
    raise exception 'authentication required' using errcode='42501';
  end if;
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id=v_uid) then
    raise exception 'admin required' using errcode='42501';
  end if;

  select c.id,c.status,c.options,c.created_at,c.updated_at,
         greatest(
           coalesce(c.updated_at,c.created_at),
           coalesce(ev.last_event_at,c.created_at)
         ) as last_activity
    into v_rec
  from public.ai_editorial_commands c
  left join lateral (
    select max(e.created_at) as last_event_at
    from public.orchestrator_events e
    where e.job_id='command-'||c.id::text
       or e.job_id like 'command-'||c.id::text||'-%'
  ) ev on true
  where c.status in ('planning','needs_research','running')
    and greatest(
          coalesce(c.updated_at,c.created_at),
          coalesce(ev.last_event_at,c.created_at)
        ) <= now() - make_interval(secs=>v_stale_seconds)
  order by greatest(
             coalesce(c.updated_at,c.created_at),
             coalesce(ev.last_event_at,c.created_at)
           ) asc
  limit 1
  for update of c skip locked;

  if not found then
    return jsonb_build_object('claimed',false,'reason','none','stale_seconds',v_stale_seconds);
  end if;

  begin
    v_count := coalesce(nullif(v_rec.options->>'stall_recovery_count','')::integer,0);
  exception when others then
    v_count := 0;
  end;

  v_parent := 'command-'||v_rec.id::text;

  if v_count >= 3 then
    update public.ai_editorial_commands
       set status='failed',
           last_error=format('Processor stalled for at least %s seconds. Automatic stalled recovery limit reached (3).',v_stale_seconds),
           options=coalesce(options,'{}'::jsonb)||jsonb_build_object(
             'stall_recovery_count',v_count,
             'stall_recovery_exhausted',true,
             'stall_recovery_exhausted_at',now()
           ),
           updated_at=now()
     where id=v_rec.id;

    if not exists (
      select 1 from public.orchestrator_events e
      where e.job_id=v_parent
        and e.event_type='error'
        and e.discussion->>'stage'='stall-recovery-exhausted'
    ) then
      insert into public.orchestrator_events(
        event_id,job_id,role,provider,event_type,summary,evidence,severity,state,created_at,discussion,availability
      ) values (
        gen_random_uuid(),v_parent,'system','orchestrator','error',
        '処理停止の自動再開を3回試しましたが進捗が戻らないため、安全のため自動再開を停止しました。管理者確認が必要です。',
        jsonb_build_array(jsonb_build_object('kind','command','ref',v_rec.id::text)),
        'high','ERROR',now(),
        jsonb_build_object(
          'command_id',v_rec.id,'stage','stall-recovery-exhausted','stall_recovery_count',v_count,
          'stale_seconds',v_stale_seconds,'last_activity',v_rec.last_activity,'retry_policy','same-queue'
        ),
        jsonb_build_object('primary_provider','orchestrator','status','error')
      );
    end if;

    return jsonb_build_object(
      'claimed',false,'reason','exhausted','command_id',v_rec.id,
      'stall_recovery_count',v_count,'last_activity',v_rec.last_activity,'stale_seconds',v_stale_seconds
    );
  end if;

  update public.ai_editorial_commands
     set status='queued',
         last_error=null,
         options=coalesce(options,'{}'::jsonb)||jsonb_build_object(
           'stall_recovery_count',v_count+1,
           'stall_recovery_last_at',now(),
           'stall_recovery_previous_status',v_rec.status
         ),
         updated_at=now()
   where id=v_rec.id
     and status=v_rec.status;

  if not found then
    return jsonb_build_object('claimed',false,'reason','raced');
  end if;

  return jsonb_build_object(
    'claimed',true,
    'reason','stalled',
    'command_id',v_rec.id,
    'previous_status',v_rec.status,
    'last_activity',v_rec.last_activity,
    'stale_seconds',v_stale_seconds,
    'stall_recovery_count',v_count+1
  );
end;
$function$;

grant execute on function public.ai_editorial_claim_stalled(integer) to authenticated;
