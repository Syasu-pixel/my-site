create or replace function public.ai_editorial_submit_command(
  p_instruction text,
  p_requested_count integer default null,
  p_options jsonb default '{}'::jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_job_id text;
  v_instruction text := btrim(coalesce(p_instruction, ''));
  v_count integer;
  i integer;
begin
  if v_uid is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id = v_uid) then raise exception 'admin required' using errcode = '42501'; end if;
  if char_length(v_instruction) < 1 or char_length(v_instruction) > 4000 then raise exception 'instruction must be 1..4000 characters' using errcode = '22023'; end if;
  if p_requested_count is not null and (p_requested_count < 1 or p_requested_count > 50) then raise exception 'requested_count must be 1..50' using errcode = '22023'; end if;

  v_count := coalesce(p_requested_count, 1);
  insert into public.ai_editorial_commands(created_by, instruction, requested_count, options)
  values (v_uid, v_instruction, p_requested_count, coalesce(p_options, '{}'::jsonb) || jsonb_build_object(
    'queue_policy','one-deliverable-one-queue','retry_policy','same-queue','artifact_policy','one-url-per-queue'
  )) returning id into v_id;
  v_job_id := 'command-' || v_id::text;

  for i in 1..v_count loop
    insert into public.orchestrator_events(event_id,job_id,role,provider,event_type,summary,evidence,severity,state,created_at,discussion,availability)
    values (
      gen_random_uuid(),
      case when v_count=1 then v_job_id else v_job_id||'-'||lpad(i::text,2,'0') end,
      'human','dashboard-admin','instruction',
      case when v_count=1 then left(v_instruction,2000) else left(format('[成果物 %s/%s] %s',i,v_count,v_instruction),2000) end,
      jsonb_build_array(jsonb_build_object('kind','command','ref',v_id::text)),
      'info','QUEUED',now(),
      jsonb_build_object('command_id',v_id,'requested_count',p_requested_count,'deliverable_index',i,'deliverable_count',v_count,'queue_policy','one-deliverable-one-queue','retry_policy','same-queue','artifact_policy','one-url-per-queue','source','ai-editorial-dashboard'),
      null
    );
  end loop;

  return jsonb_build_object('ok',true,'command_id',v_id,'job_id',v_job_id,'status','queued','queue_count',v_count,'queue_policy','one-deliverable-one-queue');
end;
$$;
revoke all on function public.ai_editorial_submit_command(text, integer, jsonb) from public;
grant execute on function public.ai_editorial_submit_command(text, integer, jsonb) to authenticated;
