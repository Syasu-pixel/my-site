create or replace function public.ai_editorial_command_add_events(p_command_id uuid,p_events jsonb)
returns jsonb
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
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id=v_uid) then raise exception 'admin required' using errcode='42501'; end if;
  if not exists (select 1 from public.ai_editorial_commands c where c.id=p_command_id) then raise exception 'command not found' using errcode='P0002'; end if;
  if jsonb_typeof(p_events) <> 'array' or jsonb_array_length(p_events) > 100 then raise exception 'events must be an array of at most 100 items' using errcode='22023'; end if;
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
revoke all on function public.ai_editorial_command_add_events(uuid,jsonb) from public;
grant execute on function public.ai_editorial_command_add_events(uuid,jsonb) to authenticated;
