-- Admin-only read RPC for Google Search Console + Bing Webmaster dashboard.
create or replace function public.admin_search_performance_dashboard(p_days integer default 28)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_days integer:=greatest(7,least(coalesce(p_days,28),90)); v_latest date; v_start date; v_prev_start date; v_result jsonb;
begin
  if auth.uid() is null then raise exception 'authentication required' using errcode='28000'; end if;
  if not exists (select 1 from public.ai_editorial_admins a where a.user_id=auth.uid()) then raise exception 'administrator access required' using errcode='42501'; end if;
  select max(data_date) into v_latest from public.search_performance_daily where grain='site';
  if v_latest is null then return jsonb_build_object('days',v_days,'latest_date',null,'summary','[]'::jsonb,'daily','[]'::jsonb,'pages','[]'::jsonb,'queries','[]'::jsonb,'health','[]'::jsonb); end if;
  v_start:=v_latest-(v_days-1); v_prev_start:=v_start-v_days;
  with site as (
    select source,data_date,sum(clicks)::bigint clicks,sum(impressions)::bigint impressions,
      case when sum(impressions)>0 then sum(clicks)::double precision/sum(impressions) else 0 end ctr,
      case when sum(impressions)>0 then sum(coalesce(avg_position,0)*impressions)/sum(impressions) else null end avg_position
    from public.search_performance_daily where grain='site' and data_date between v_prev_start and v_latest group by source,data_date
  ), summary as (
    select source,sum(clicks) filter(where data_date>=v_start)::bigint clicks,sum(impressions) filter(where data_date>=v_start)::bigint impressions,
      case when sum(impressions) filter(where data_date>=v_start)>0 then (sum(clicks) filter(where data_date>=v_start))::double precision/(sum(impressions) filter(where data_date>=v_start)) else 0 end ctr,
      case when sum(impressions) filter(where data_date>=v_start)>0 then sum(avg_position*impressions) filter(where data_date>=v_start)/sum(impressions) filter(where data_date>=v_start) else null end avg_position,
      sum(clicks) filter(where data_date<v_start)::bigint prev_clicks,sum(impressions) filter(where data_date<v_start)::bigint prev_impressions
    from site group by source
  ), pages as (
    select source,page,sum(clicks)::bigint clicks,sum(impressions)::bigint impressions,
      case when sum(impressions)>0 then sum(clicks)::double precision/sum(impressions) else 0 end ctr,
      case when sum(impressions)>0 then sum(coalesce(avg_position,0)*impressions)/sum(impressions) else null end avg_position
    from public.search_performance_daily where grain='page' and data_date between v_start and v_latest and page<>'' group by source,page
  ), queries as (
    select source,query,sum(clicks)::bigint clicks,sum(impressions)::bigint impressions,
      case when sum(impressions)>0 then sum(clicks)::double precision/sum(impressions) else 0 end ctr,
      case when sum(impressions)>0 then sum(coalesce(avg_position,0)*impressions)/sum(impressions) else null end avg_position
    from public.search_performance_daily where grain='query' and data_date between v_start and v_latest and query<>'' group by source,query
  )
  select jsonb_build_object('days',v_days,'latest_date',v_latest,'start_date',v_start,
    'summary',(select coalesce(jsonb_agg(to_jsonb(s) order by source),'[]'::jsonb) from summary s),
    'daily',(select coalesce(jsonb_agg(to_jsonb(d) order by data_date,source),'[]'::jsonb) from site d where data_date>=v_start),
    'previous_daily',(select coalesce(jsonb_agg(jsonb_build_object('source',d.source,'data_date',d.data_date,'period_day',(d.data_date-v_prev_start)+1,'clicks',d.clicks,'impressions',d.impressions) order by data_date,source),'[]'::jsonb) from site d where data_date<v_start),
    'pages',(select coalesce(jsonb_agg(to_jsonb(p)),'[]'::jsonb) from (select * from pages order by clicks desc,impressions desc limit 20)p),
    'queries',(select coalesce(jsonb_agg(to_jsonb(q)),'[]'::jsonb) from (select * from queries order by clicks desc,impressions desc limit 20)q),
    'health',(select coalesce(jsonb_agg(to_jsonb(h) order by source),'[]'::jsonb) from public.search_collection_health h)) into v_result;
  return v_result;
end; $$;
revoke all on function public.admin_search_performance_dashboard(integer) from public,anon;
grant execute on function public.admin_search_performance_dashboard(integer) to authenticated;
