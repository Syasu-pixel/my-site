create or replace function public.emit_ai_editorial_command_failure_event()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_summary text;
  v_kind text;
  v_provider text;
begin
  if new.status = 'failed' and old.status is distinct from new.status then
    if coalesce(new.last_error,'') ~* '(rate[ -]?limit|429|quota exceeded|resource_exhausted|gemini\s+503|high demand|temporar(y|ily)|unavailable)' then
      v_kind := 'rate_limit';
      v_provider := case
        when coalesce(new.last_error,'') ~* 'gemini|generativelanguage|resource_exhausted|quota exceeded|high demand' then 'Gemini API'
        when coalesce(new.last_error,'') ~* 'openai' then 'OpenAI API'
        else 'AI API'
      end;
      v_summary := v_provider || 'が一時的な利用上限・混雑状態のため停止しています。回復後に同じ案件を途中工程から自動再開します。';
    else
      v_summary := '処理中にエラーが発生したため、この案件は一時停止しています。同じ案件の途中工程から再試行できます。';
      v_kind := 'processing_error';
      v_provider := 'orchestrator';
    end if;

    insert into public.orchestrator_events(
      id,event_id,job_id,role,provider,event_type,summary,evidence,severity,state,created_at,discussion,availability
    ) values (
      nextval('public.orchestrator_events_id_seq'),
      gen_random_uuid(),
      'command-' || new.id::text,
      'system','orchestrator','status',v_summary,'[]'::jsonb,
      case when v_kind='rate_limit' then 'medium' else 'high' end,
      'ERROR',now(),
      jsonb_build_object(
        'command_id',new.id,'stage','command-failed','error_kind',v_kind,
        'error_provider',v_provider,
        'retry_policy',coalesce(new.options->>'retry_policy','same-queue'),
        'last_error',left(coalesce(new.last_error,''),1500)
      ),
      jsonb_build_object('primary_provider','orchestrator','status','blocked')
    );
  end if;
  return new;
end;
$function$;
