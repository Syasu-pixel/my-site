create or replace function public.ai_editorial_get_current_weekly_plan()
returns jsonb
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $$
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
    return jsonb_build_object('available',false,'week_start',v_week_start,'week_end',v_week_start+6);
  end if;
  return jsonb_build_object(
    'available',true,
    'week_start',v_row.week_start,
    'week_end',v_row.week_start+6,
    'source_command_id',v_row.source_command_id,
    'summary',v_row.summary,
    'plan',v_row.plan,
    'updated_at',v_row.updated_at
  );
end;
$$;

grant execute on function public.ai_editorial_get_current_weekly_plan() to authenticated;

create or replace function public.ai_editorial_block_duplicate_monday()
returns trigger
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $$
declare
  v_today date := (now() at time zone 'Asia/Tokyo')::date;
  v_week_start date;
  v_day integer;
begin
  begin
    v_day := nullif(new.options->>'routine_day','')::integer;
  exception when others then
    v_day := null;
  end;
  if v_day is null and new.instruction ~ '^[[:space:]]*月曜' then v_day := 1; end if;
  if v_day <> 1 then return new; end if;

  v_week_start := v_today - (extract(isodow from v_today)::int - 1);
  if exists (
    select 1 from public.ai_editorial_weekly_plans w
    where w.week_start=v_week_start and w.status='active'
  ) then
    raise exception 'monday routine already completed this week'
      using errcode='55000', hint='Use the saved weekly plan for Tuesday through Sunday. Monday becomes available again next week.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_ai_editorial_block_duplicate_monday on public.ai_editorial_commands;
create trigger trg_ai_editorial_block_duplicate_monday
before insert on public.ai_editorial_commands
for each row execute function public.ai_editorial_block_duplicate_monday();