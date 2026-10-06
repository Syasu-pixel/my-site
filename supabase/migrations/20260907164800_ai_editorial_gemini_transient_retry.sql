create or replace function public.ai_editorial_claim_retry()
returns jsonb
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_row public.ai_editorial_commands%rowtype;
  v_match text[];
  v_hours integer := 0;
  v_mins integer := 0;
  v_secs double precision := 0;
  v_retry_at timestamptz;
  v_is_gemini boolean := false;
begin
  if v_uid is null then raise exception 'authentication required' using errcode='42501'; end if;
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id=v_uid) then raise exception 'admin required' using errcode='42501'; end if;
  select * into v_row from public.ai_editorial_commands
  where status='failed' and last_error is not null
    and last_error ~* '(rate[ -]?limit|rate_limit_exceeded|openai\s+429|gemini\s+(429|503)|quota exceeded|resource_exhausted|requests per day|tokens per minute|high demand|temporar(y|ily)|unavailable)'
  order by updated_at asc limit 1 for update skip locked;
  if not found then return jsonb_build_object('claimed',false,'reason','none'); end if;

  v_is_gemini := v_row.last_error ~* 'gemini|generativelanguage|resource_exhausted|quota exceeded|high demand';
  v_match := regexp_match(v_row.last_error, '(?:try again|retry)\s+in\s+(?:(\d+)h)?(?:(\d+)m)?(?:(\d+(?:\.\d+)?)s)?', 'i');
  if v_match is not null then
    v_hours := coalesce(nullif(v_match[1],''),'0')::integer;
    v_mins := coalesce(nullif(v_match[2],''),'0')::integer;
    v_secs := coalesce(nullif(v_match[3],''),'0')::double precision;
  end if;
  if v_hours=0 and v_mins=0 and v_secs=0 then
    v_mins := case when v_is_gemini then 1 else 5 end;
  end if;
  v_retry_at := v_row.updated_at + make_interval(hours=>v_hours, mins=>v_mins, secs=>v_secs);
  if now() < v_retry_at then
    return jsonb_build_object('claimed',false,'reason','cooldown','command_id',v_row.id,'retry_at',v_retry_at,'seconds_remaining',greatest(0,extract(epoch from (v_retry_at-now()))::integer),'provider',case when v_is_gemini then 'gemini' else 'openai' end);
  end if;
  update public.ai_editorial_commands set status='queued',updated_at=now() where id=v_row.id and status='failed';
  if not found then return jsonb_build_object('claimed',false,'reason','raced'); end if;
  return jsonb_build_object('claimed',true,'command_id',v_row.id,'retry_at',v_retry_at,'provider',case when v_is_gemini then 'gemini' else 'openai' end);
end;
$function$;
grant execute on function public.ai_editorial_claim_retry() to authenticated;
