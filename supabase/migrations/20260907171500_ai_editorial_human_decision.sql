create or replace function public.ai_editorial_human_decision(
  p_command_id uuid,
  p_decision text,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $$
declare
  v_uid uuid := auth.uid();
  v_status text;
  v_prefix text := 'command-' || p_command_id::text;
  v_decision text := lower(btrim(coalesce(p_decision,'')));
  v_note text := nullif(btrim(coalesce(p_note,'')),'');
  v_has_preview boolean := false;
  v_next_status text;
  v_state text;
  v_summary text;
  v_payload jsonb;
  v_options jsonb;
begin
  if v_uid is null then raise exception 'authentication required' using errcode='42501'; end if;
  if not exists(select 1 from public.ai_editorial_admins a where a.user_id=v_uid) then raise exception 'admin required' using errcode='42501'; end if;
  if v_decision not in ('approve','revise','reject') then raise exception 'decision must be approve, revise, or reject' using errcode='22023'; end if;
  if v_decision='revise' and v_note is null then raise exception 'revision note required' using errcode='22023'; end if;
  if v_note is not null and char_length(v_note)>2000 then raise exception 'note must be 2000 characters or fewer' using errcode='22023'; end if;

  perform pg_advisory_xact_lock(hashtext('ai_editorial_human_decision:'||p_command_id::text)::bigint);
  select status,coalesce(options,'{}'::jsonb) into v_status,v_options
  from public.ai_editorial_commands where id=p_command_id for update;
  if not found then raise exception 'command not found' using errcode='P0002'; end if;
  if v_status <> 'needs_human' then raise exception 'command is not waiting for human decision: %',v_status using errcode='55000'; end if;

  select exists(
    select 1 from public.orchestrator_events e
    where (e.job_id=v_prefix or e.job_id like v_prefix||'-%')
      and (
        lower(coalesce(e.event_type,'')) in ('preview','preview-ready')
        or lower(coalesce(e.summary,'')) like '%netlify%'
        or lower(coalesce(e.evidence::text,'')) like '%netlify%'
        or lower(coalesce(e.evidence::text,'')) like '%"kind": "preview"%'
        or lower(coalesce(e.discussion::text,'')) like '%preview%'
      )
  ) into v_has_preview;

  if v_decision='approve' then
    if v_has_preview then v_next_status:='publishing';v_state:='PUBLISHING';v_summary:='管理者が採用しました。Preview承認済みとして公開工程へ進みます。';
    else v_next_status:='building';v_state:='BUILDING';v_summary:='管理者が採用しました。制作工程を継続します。'; end if;
  elsif v_decision='revise' then
    if v_has_preview then v_next_status:='building';v_state:='BUILDING';v_summary:='管理者から修正指示が入りました。同じ案件で制作工程へ戻します。';
    else v_next_status:='reviewing';v_state:='REVIEWING';v_summary:='管理者から修正指示が入りました。同じ案件で編集・確認工程へ戻します。'; end if;
  else
    v_next_status:='cancelled';v_state:='REJECTED';v_summary:='管理者が不採用と判断しました。案件を終了し、履歴のみ保持します。';
  end if;

  v_payload:=jsonb_build_object('decision',v_decision,'note',v_note,'decided_by',v_uid,'decided_at',now(),'had_preview',v_has_preview,'next_status',v_next_status);
  v_options:=jsonb_set(v_options,'{human_decision_history}',coalesce(v_options->'human_decision_history','[]'::jsonb)||jsonb_build_array(v_payload),true);
  v_options:=v_options||jsonb_build_object('latest_human_decision',v_payload);

  update public.ai_editorial_commands
  set status=v_next_status,options=v_options,last_error=null,updated_at=now(),completed_at=case when v_decision='reject' then coalesce(completed_at,now()) else completed_at end
  where id=p_command_id;

  insert into public.orchestrator_events(event_id,job_id,role,provider,event_type,summary,evidence,severity,state,created_at,discussion,availability)
  values(gen_random_uuid(),v_prefix,'human','dashboard-admin',case v_decision when 'approve' then 'human-approved' when 'revise' then 'human-revision-request' else 'human-rejected' end,left(case when v_note is null then v_summary else v_summary||E'\n'||v_note end,2000),jsonb_build_array(jsonb_build_object('kind','command','ref',p_command_id::text)),case when v_decision='reject' then 'medium' else 'info' end,v_state,now(),jsonb_build_object('command_id',p_command_id,'stage','human-decision','decision',v_decision,'note',v_note,'had_preview',v_has_preview,'next_status',v_next_status,'source','ai-editorial-dashboard'),jsonb_build_object('primary_provider','human','status','decided'));

  return jsonb_build_object('ok',true,'command_id',p_command_id,'decision',v_decision,'next_status',v_next_status,'had_preview',v_has_preview);
end;
$$;

revoke all on function public.ai_editorial_human_decision(uuid,text,text) from public;
grant execute on function public.ai_editorial_human_decision(uuid,text,text) to authenticated;