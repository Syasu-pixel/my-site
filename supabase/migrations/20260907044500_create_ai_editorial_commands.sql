create table if not exists public.ai_editorial_commands (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete restrict,
  instruction text not null check (char_length(instruction) between 1 and 4000),
  status text not null default 'queued' check (status in ('queued','planning','running','needs_research','building','reviewing','needs_human','completed','failed','cancelled')),
  requested_count integer null check (requested_count is null or requested_count between 1 and 50),
  options jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  started_at timestamptz null,
  completed_at timestamptz null,
  last_error text null
);

comment on table public.ai_editorial_commands is 'Administrator instructions submitted from the AI Editorial Dashboard. Direct table access is denied; use security-definer RPCs.';

create index if not exists ai_editorial_commands_status_created_idx
  on public.ai_editorial_commands(status, created_at);

alter table public.ai_editorial_commands enable row level security;
revoke all on table public.ai_editorial_commands from anon, authenticated;

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
begin
  if v_uid is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id = v_uid) then
    raise exception 'admin required' using errcode = '42501';
  end if;
  if char_length(v_instruction) < 1 or char_length(v_instruction) > 4000 then
    raise exception 'instruction must be 1..4000 characters' using errcode = '22023';
  end if;
  if p_requested_count is not null and (p_requested_count < 1 or p_requested_count > 50) then
    raise exception 'requested_count must be 1..50' using errcode = '22023';
  end if;

  insert into public.ai_editorial_commands(created_by, instruction, requested_count, options)
  values (v_uid, v_instruction, p_requested_count, coalesce(p_options, '{}'::jsonb))
  returning id into v_id;

  v_job_id := 'command-' || v_id::text;

  insert into public.orchestrator_events(
    event_id, job_id, role, provider, event_type, summary, evidence, severity, state, created_at, discussion, availability
  ) values (
    gen_random_uuid(),
    v_job_id,
    'human',
    'dashboard-admin',
    'instruction',
    left(v_instruction, 2000),
    jsonb_build_array(jsonb_build_object('kind','command','ref',v_id::text)),
    'info',
    'QUEUED',
    now(),
    jsonb_build_object('command_id', v_id, 'requested_count', p_requested_count, 'source', 'ai-editorial-dashboard'),
    null
  );

  return jsonb_build_object(
    'ok', true,
    'command_id', v_id,
    'job_id', v_job_id,
    'status', 'queued'
  );
end;
$$;

revoke all on function public.ai_editorial_submit_command(text, integer, jsonb) from public;
grant execute on function public.ai_editorial_submit_command(text, integer, jsonb) to authenticated;
