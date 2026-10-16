create or replace function public.ai_editorial_claim_autonomous_gate()
returns jsonb
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_stage text;
  v_action text;
  v_prev_status text;
begin
  if v_uid is null then
    raise exception 'authentication required' using errcode='42501';
  end if;
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id=v_uid) then
    raise exception 'admin required' using errcode='42501';
  end if;

  select c.id,
         c.status,
         ev.stage
    into v_id, v_prev_status, v_stage
  from public.ai_editorial_commands c
  join lateral (
    select e.discussion->>'stage' as stage
    from public.orchestrator_events e
    where e.job_id='command-'||c.id::text
       or e.job_id like 'command-'||c.id::text||'-%'
    order by e.created_at desc
    limit 1
  ) ev on true
  where c.status='needs_human'
    and ev.stage in ('gpt-proxy-prebuild-hold','revision-limit-human-gate')
  order by c.updated_at asc
  limit 1
  for update of c skip locked;

  if not found then
    return jsonb_build_object('claimed',false,'reason','none');
  end if;

  if v_stage='gpt-proxy-prebuild-hold' then
    v_action := 'resume';
    update public.ai_editorial_commands
       set status='reviewing',
           last_error=null,
           options=coalesce(options,'{}'::jsonb)||jsonb_build_object(
             'human_gate_policy','final-preview-only',
             'autonomous_gate_last_stage',v_stage,
             'autonomous_gate_last_at',now()
           ),
           updated_at=now()
     where id=v_id and status='needs_human';
  else
    v_action := 'builder';
    update public.ai_editorial_commands
       set status='building',
           last_error=null,
           options=coalesce(options,'{}'::jsonb)||jsonb_build_object(
             'human_gate_policy','final-preview-only',
             'autonomous_gate_last_stage',v_stage,
             'autonomous_gate_last_at',now(),
             'autonomous_degraded',true
           ),
           updated_at=now()
     where id=v_id and status='needs_human';
  end if;

  if not found then
    return jsonb_build_object('claimed',false,'reason','raced');
  end if;

  return jsonb_build_object(
    'claimed',true,
    'command_id',v_id,
    'previous_status',v_prev_status,
    'stage',v_stage,
    'action',v_action,
    'human_gate_policy','final-preview-only'
  );
end;
$function$;

grant execute on function public.ai_editorial_claim_autonomous_gate() to authenticated;
