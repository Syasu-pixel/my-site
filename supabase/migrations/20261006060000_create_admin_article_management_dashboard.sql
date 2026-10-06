create or replace function public.admin_article_management_dashboard(p_days integer default 28)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_uid uuid:=auth.uid(); v_days integer:=greatest(7,least(coalesce(p_days,28),90)); v_latest date; v_start date; v_result jsonb;
begin
 if v_uid is null then raise exception 'authentication required' using errcode='28000'; end if;
 if not exists(select 1 from public.ai_editorial_admins a where a.user_id=v_uid) then raise exception 'administrator access required' using errcode='42501'; end if;
 select max(data_date) into v_latest from public.search_performance_daily where grain='page';
 v_start:=v_latest-(v_days-1);
 with perf as (
  select regexp_replace(page,'^https?://(www\.)?denkicontrol\.com/articles/([^?#]+)\.html.*$','\2') slug,source,
   sum(clicks)::bigint clicks,sum(impressions)::bigint impressions,
   case when sum(impressions)>0 then sum(clicks)::double precision/sum(impressions) else 0 end ctr,
   case when sum(impressions)>0 then sum(coalesce(avg_position,0)*impressions)/sum(impressions) else null end avg_position
  from public.search_performance_daily where grain='page' and data_date between v_start and v_latest and page like '%denkicontrol.com/articles/%.html%' group by 1,source
 ), votes as (
  select article_slug slug,count(*)::int votes,count(*) filter(where vote='helpful')::int helpful,count(*) filter(where vote='not_helpful')::int not_helpful,
   case when count(*)>0 then round((count(*) filter(where vote='helpful'))::numeric*100/count(*),1) else 0 end helpful_rate,max(updated_at) last_vote_at
  from public.article_feedback group by article_slug
 ), slugs as (select slug from perf union select slug from votes)
 select jsonb_build_object('days',v_days,'latest_date',v_latest,'articles',
  coalesce(jsonb_agg(jsonb_build_object('slug',s.slug,'google',coalesce((select to_jsonb(p) from perf p where p.slug=s.slug and p.source='google'),'{}'::jsonb),'bing',coalesce((select to_jsonb(p) from perf p where p.slug=s.slug and p.source='bing'),'{}'::jsonb),'feedback',coalesce(to_jsonb(v),'{}'::jsonb)) order by coalesce((select clicks from perf p where p.slug=s.slug and p.source='google'),0)+coalesce((select clicks from perf p where p.slug=s.slug and p.source='bing'),0) desc),'[]'::jsonb))
 into v_result from slugs s left join votes v using(slug);
 return v_result;
end; $$;
revoke all on function public.admin_article_management_dashboard(integer) from public,anon,authenticated;
grant execute on function public.admin_article_management_dashboard(integer) to authenticated;