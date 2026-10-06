create table if not exists public.search_performance_daily (
  record_key text primary key,
  source text not null check (source in ('google', 'bing')),
  data_date date not null,
  site_url text not null,
  grain text not null check (grain in ('site', 'page', 'query', 'query_page')),
  query text not null default '',
  page text not null default '',
  country text not null default '',
  device text not null default '',
  search_type text not null default '',
  clicks bigint not null default 0 check (clicks >= 0),
  impressions bigint not null default 0 check (impressions >= 0),
  ctr double precision not null default 0 check (ctr >= 0),
  avg_position double precision,
  avg_click_position double precision,
  is_final boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  fetched_at timestamptz not null default now()
);

comment on table public.search_performance_daily is
  'Normalized daily Google Search Console and Bing Webmaster performance data. Written only by privileged backend automation.';
comment on column public.search_performance_daily.record_key is
  'Deterministic SHA-256 key over source/date/site/grain/dimensions, used for idempotent upsert.';
comment on column public.search_performance_daily.avg_position is
  'Google average position, or Bing AvgImpressionPosition when available. Compare source definitions before cross-engine conclusions.';

create index if not exists search_performance_daily_source_date_idx
  on public.search_performance_daily (source, data_date desc);
create index if not exists search_performance_daily_page_date_idx
  on public.search_performance_daily (page, data_date desc)
  where page <> '';
create index if not exists search_performance_daily_query_date_idx
  on public.search_performance_daily (query, data_date desc)
  where query <> '';
create index if not exists search_performance_daily_grain_date_idx
  on public.search_performance_daily (grain, data_date desc);

alter table public.search_performance_daily enable row level security;
revoke all on table public.search_performance_daily from anon, authenticated;
grant select, insert, update, delete on table public.search_performance_daily to service_role;

create table if not exists public.search_collection_runs (
  id bigint generated always as identity primary key,
  source text not null check (source in ('google', 'bing')),
  target_start_date date not null,
  target_end_date date not null,
  status text not null check (status in ('running', 'succeeded', 'partial', 'failed', 'skipped')),
  rows_upserted integer not null default 0 check (rows_upserted >= 0),
  grain_counts jsonb not null default '{}'::jsonb,
  error_class text not null default '',
  error_message text not null default '',
  workflow_run_id text not null default '',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.search_collection_runs is
  'Sanitized operational history for search-data collection. Never store access tokens, refresh tokens, client secrets, or service-role keys here.';

create index if not exists search_collection_runs_source_started_idx
  on public.search_collection_runs (source, started_at desc);

alter table public.search_collection_runs enable row level security;
revoke all on table public.search_collection_runs from anon, authenticated;
grant select, insert, update on table public.search_collection_runs to service_role;
grant usage, select on sequence public.search_collection_runs_id_seq to service_role;

create or replace view public.search_collection_health
with (security_invoker = true)
as
select distinct on (source)
  source,
  status,
  target_start_date,
  target_end_date,
  rows_upserted,
  grain_counts,
  error_class,
  error_message,
  workflow_run_id,
  started_at,
  completed_at
from public.search_collection_runs
order by source, started_at desc;

revoke all on table public.search_collection_health from anon, authenticated;
grant select on table public.search_collection_health to service_role;
