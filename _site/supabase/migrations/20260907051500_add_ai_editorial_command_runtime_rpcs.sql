create or replace function public.ai_editorial_command_get(p_command_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.ai_editorial_commands%rowtype;
begin
  if v_uid is null then raise exception 'authentication required' using errcode='42501'; end if;
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id=v_uid) then
    raise exception 'admin required' using errcode='42501';
  end if;
  select * into v_row from public.ai_editorial_commands where id=p_command_id;
  if not found then raise exception 'command not found' using errcode='P0002'; end if;
  return jsonb_build_object(
    'id',v_row.id,'instruction',v_row.instruction,'status',v_row.status,
    'requested_count',v_row.requested_count,'options',v_row.options,
    'created_at',v_row.created_at,'updated_at',v_row.updated_at
  );
end;
$$;

create or replace function public.ai_editorial_command_patch(
  p_command_id uuid,
  p_status text,
  p_last_error text default null,
  p_mark_started boolean default false
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_allowed constant text[] := array['queued','planning','running','needs_research','building','reviewing','needs_human','completed','failed','cancelled'];
begin
  if v_uid is null then raise exception 'authentication required' using errcode='42501'; end if;
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id=v_uid) then
    raise exception 'admin required' using errcode='42501';
  end if;
  if not (p_status = any(v_allowed)) then raise exception 'invalid status' using errcode='22023'; end if;
  update public.ai_editorial_commands
     set status=p_status,
         last_error=case when p_last_error is null then null else left(p_last_error,2000) end,
         started_at=case when p_mark_started and started_at is null then now() else started_at end,
         completed_at=case when p_status='completed' then now() else completed_at end,
         updated_at=now()
   where id=p_command_id;
  if not found then raise exception 'command not found' using errcode='P0002'; end if;
  return jsonb_build_object('ok',true,'command_id',p_command_id,'status',p_status);
end;
$$;

create or replace function public.ai_editorial_command_add_events(
  p_command_id uuid,
  p_events jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_prefix text := 'command-' || p_command_id::text;
  e jsonb;
  v_count integer := 0;
  v_role text;
  v_job_id text;
  v_summary text;
  v_severity text;
begin
  if v_uid is null then raise exception 'authentication required' using errcode='42501'; end if;
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id=v_uid) then
    raise exception 'admin required' using errcode='42501';
  end if;
  if not exists (select 1 from public.ai_editorial_commands c where c.id=p_command_id) then
    raise exception 'command not found' using errcode='P0002';
  end if;
  if jsonb_typeof(p_events) <> 'array' or jsonb_array_length(p_events) > 100 then
    raise exception 'events must be an array of at most 100 items' using errcode='22023';
  end if;
  for e in select value from jsonb_array_elements(p_events)
  loop
    v_role := coalesce(e->>'role','system');
    v_job_id := coalesce(e->>'job_id','');
    v_summary := left(coalesce(e->>'summary',''),2000);
    v_severity := coalesce(e->>'severity','info');
    if v_job_id <> v_prefix and v_job_id not like v_prefix || '-%' then raise exception 'invalid job id' using errcode='22023'; end if;
    if v_role not in ('editor','builder','challenger','reviewer','system','human','image-reviewer') then raise exception 'invalid role' using errcode='22023'; end if;
    if v_severity not in ('info','low','medium','high','blocker') then raise exception 'invalid severity' using errcode='22023'; end if;
    insert into public.orchestrator_events(event_id,job_id,role,provider,event_type,summary,evidence,severity,state,created_at,discussion,availability)
    values(
      coalesce(nullif(e->>'event_id','')::uuid,gen_random_uuid()),
      v_job_id,v_role,left(coalesce(e->>'provider','orchestrator'),120),left(coalesce(e->>'event_type','status'),120),v_summary,
      coalesce(e->'evidence','[]'::jsonb),v_severity,left(coalesce(e->>'state','PLANNING'),80),
      coalesce(nullif(e->>'created_at','')::timestamptz,now()),e->'discussion',e->'availability'
    ) on conflict (event_id) do nothing;
    v_count := v_count + 1;
  end loop;
  return jsonb_build_object('ok',true,'inserted',v_count);
end;
$$;

revoke all on function public.ai_editorial_command_get(uuid) from public;
revoke all on function public.ai_editorial_command_patch(uuid,text,text,boolean) from public;
revoke all on function public.ai_editorial_command_add_events(uuid,jsonb) from public;
grant execute on function public.ai_editorial_command_get(uuid) to authenticated;
grant execute on function public.ai_editorial_command_patch(uuid,text,text,boolean) to authenticated;
grant execute on function public.ai_editorial_command_add_events(uuid,jsonb) to authenticated;
