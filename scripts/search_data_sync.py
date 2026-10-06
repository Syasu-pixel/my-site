#!/usr/bin/env python3
"""
Daily Google Search Console / Bing Webmaster -> Supabase synchronizer.

- Uses only Python stdlib.
- Reads credentials from environment variables.
- Never prints access/refresh tokens or service-role keys.
- Each provider runs independently so one provider failure does not erase the other.
"""

from __future__ import annotations

import argparse
import dataclasses
import datetime as dt
import hashlib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Iterable, Mapping, Sequence

GSC_TOKEN_URL = "https://oauth2.googleapis.com/token"
GSC_API_BASE = "https://www.googleapis.com/webmasters/v3"
BING_TOKEN_URL = "https://www.bing.com/webmasters/oauth/token"
BING_API_BASE = "https://www.bing.com/webmaster/api.svc/json"

DEFAULT_LAG_DAYS = 3
DEFAULT_LOOKBACK_DAYS = 4
DEFAULT_FINE_GRAIN_RETENTION_DAYS = 90
DEFAULT_TIMEOUT_SECONDS = 30
MAX_RETRIES = 2


class SyncError(RuntimeError):
    pass


@dataclasses.dataclass(frozen=True)
class MetricRow:
    source: str
    data_date: str
    site_url: str
    grain: str
    query: str = ""
    page: str = ""
    country: str = ""
    device: str = ""
    search_type: str = ""
    clicks: int = 0
    impressions: int = 0
    ctr: float = 0.0
    avg_position: float | None = None
    avg_click_position: float | None = None
    is_final: bool = True
    metadata: Mapping[str, Any] = dataclasses.field(default_factory=dict)

    def to_record(self) -> dict[str, Any]:
        key_payload = "\x1f".join(
            [
                self.source,
                self.data_date,
                self.site_url,
                self.grain,
                self.query,
                self.page,
                self.country,
                self.device,
                self.search_type,
            ]
        ).encode("utf-8")
        return {
            "record_key": hashlib.sha256(key_payload).hexdigest(),
            "source": self.source,
            "data_date": self.data_date,
            "site_url": self.site_url,
            "grain": self.grain,
            "query": self.query,
            "page": self.page,
            "country": self.country,
            "device": self.device,
            "search_type": self.search_type,
            "clicks": int(self.clicks),
            "impressions": int(self.impressions),
            "ctr": float(self.ctr),
            "avg_position": self.avg_position,
            "avg_click_position": self.avg_click_position,
            "is_final": bool(self.is_final),
            "metadata": dict(self.metadata),
            "fetched_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        }


def env(name: str, *, required: bool = True, default: str | None = None) -> str:
    value = os.getenv(name, default)
    if required and not value:
        raise SyncError(f"required environment variable is missing: {name}")
    return value or ""


def json_request(
    url: str,
    *,
    method: str = "GET",
    headers: Mapping[str, str] | None = None,
    json_body: Any | None = None,
    form_body: Mapping[str, str] | None = None,
    timeout: int = DEFAULT_TIMEOUT_SECONDS,
) -> Any:
    body: bytes | None = None
    request_headers = {"Accept": "application/json", "User-Agent": "denkicontrol-search-sync/1.0"}
    if headers:
        request_headers.update(headers)
    if json_body is not None:
        body = json.dumps(json_body, separators=(",", ":")).encode("utf-8")
        request_headers["Content-Type"] = "application/json"
    elif form_body is not None:
        body = urllib.parse.urlencode(form_body).encode("utf-8")
        request_headers["Content-Type"] = "application/x-www-form-urlencoded"

    request = urllib.request.Request(url, data=body, headers=request_headers, method=method)
    last_error: Exception | None = None
    for attempt in range(MAX_RETRIES + 1):
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                payload = response.read()
                return json.loads(payload.decode("utf-8")) if payload else None
        except urllib.error.HTTPError as exc:
            # Never include response bodies because providers can echo sensitive details.
            if exc.code in {429, 500, 502, 503, 504} and attempt < MAX_RETRIES:
                time.sleep(2 ** attempt)
                last_error = exc
                continue
            raise SyncError(f"HTTP {exc.code} from {urllib.parse.urlsplit(url).netloc}") from None
        except (urllib.error.URLError, TimeoutError) as exc:
            if attempt < MAX_RETRIES:
                time.sleep(2 ** attempt)
                last_error = exc
                continue
            raise SyncError(f"network error from {urllib.parse.urlsplit(url).netloc}: {type(exc).__name__}") from None
    raise SyncError(f"request failed: {type(last_error).__name__ if last_error else 'unknown'}")


def refresh_google_access_token() -> str:
    data = json_request(
        GSC_TOKEN_URL,
        method="POST",
        form_body={
            "client_id": env("GSC_CLIENT_ID"),
            "client_secret": env("GSC_CLIENT_SECRET"),
            "refresh_token": env("GSC_REFRESH_TOKEN"),
            "grant_type": "refresh_token",
        },
    )
    token = (data or {}).get("access_token")
    if not token:
        raise SyncError("Google OAuth token response did not contain access_token")
    return str(token)


def refresh_bing_access_token() -> str:
    data = json_request(
        BING_TOKEN_URL,
        method="POST",
        form_body={
            "client_id": env("BING_WEBMASTER_CLIENT_ID"),
            "client_secret": env("BING_WEBMASTER_CLIENT_SECRET"),
            "refresh_token": env("BING_WEBMASTER_REFRESH_TOKEN"),
            "grant_type": "refresh_token",
        },
    )
    token = (data or {}).get("access_token")
    if not token:
        raise SyncError("Bing OAuth token response did not contain access_token")
    return str(token)


def date_range_ending_with_lag(today: dt.date, lag_days: int, lookback_days: int) -> list[dt.date]:
    end = today - dt.timedelta(days=lag_days)
    start = end - dt.timedelta(days=max(lookback_days, 1) - 1)
    return [start + dt.timedelta(days=i) for i in range((end - start).days + 1)]


def _gsc_query(site_url: str, token: str, target_date: dt.date, dimensions: Sequence[str], row_limit: int) -> list[dict[str, Any]]:
    encoded_site = urllib.parse.quote(site_url, safe="")
    endpoint = f"{GSC_API_BASE}/sites/{encoded_site}/searchAnalytics/query"
    rows: list[dict[str, Any]] = []
    start_row = 0
    page_size = min(25000, row_limit)
    while start_row < row_limit:
        this_limit = min(page_size, row_limit - start_row)
        payload = {
            "startDate": target_date.isoformat(),
            "endDate": target_date.isoformat(),
            "dimensions": list(dimensions),
            "type": "web",
            "dataState": "final",
            "rowLimit": this_limit,
            "startRow": start_row,
        }
        data = json_request(
            endpoint,
            method="POST",
            headers={"Authorization": f"Bearer {token}"},
            json_body=payload,
        ) or {}
        batch = list(data.get("rows") or [])
        rows.extend(batch)
        if len(batch) < this_limit:
            break
        start_row += len(batch)
    return rows


def normalize_gsc_rows(
    rows: Iterable[Mapping[str, Any]],
    *,
    site_url: str,
    target_date: dt.date,
    grain: str,
    dimensions: Sequence[str],
) -> list[MetricRow]:
    result: list[MetricRow] = []
    for row in rows:
        keys = list(row.get("keys") or [])
        dims = dict(zip(dimensions, keys))
        clicks = int(round(float(row.get("clicks", 0) or 0)))
        impressions = int(round(float(row.get("impressions", 0) or 0)))
        ctr = float(row.get("ctr", (clicks / impressions if impressions else 0.0)) or 0.0)
        position_value = row.get("position")
        result.append(
            MetricRow(
                source="google",
                data_date=target_date.isoformat(),
                site_url=site_url,
                grain=grain,
                query=str(dims.get("query", "") or ""),
                page=str(dims.get("page", "") or ""),
                country=str(dims.get("country", "") or ""),
                device=str(dims.get("device", "") or ""),
                search_type="web",
                clicks=clicks,
                impressions=impressions,
                ctr=ctr,
                avg_position=float(position_value) if position_value is not None else None,
                is_final=True,
                metadata={"aggregation": "search_analytics", "dimensions": list(dimensions)},
            )
        )
    return result


def collect_google(dates: Sequence[dt.date]) -> tuple[list[MetricRow], dict[str, int]]:
    site_url = env("GSC_SITE_URL")
    token = refresh_google_access_token()
    enable_fine = env("SEARCH_ENABLE_FINE_GRAIN", required=False, default="false").lower() in {"1", "true", "yes"}
    specs: list[tuple[str, list[str], int]] = [
        ("site", ["date"], int(env("GSC_MAX_SITE_ROWS", required=False, default="10"))),
        ("page", ["date", "page"], int(env("GSC_MAX_PAGE_ROWS", required=False, default="10000"))),
        ("query", ["date", "query"], int(env("GSC_MAX_QUERY_ROWS", required=False, default="10000"))),
    ]
    if enable_fine:
        specs.append(("query_page", ["date", "query", "page"], int(env("GSC_MAX_QUERY_PAGE_ROWS", required=False, default="20000"))))

    all_rows: list[MetricRow] = []
    counts: dict[str, int] = {}
    for target_date in dates:
        for grain, dimensions, row_limit in specs:
            raw_rows = _gsc_query(site_url, token, target_date, dimensions, max(1, row_limit))
            normalized = normalize_gsc_rows(
                raw_rows,
                site_url=site_url,
                target_date=target_date,
                grain=grain,
                dimensions=dimensions,
            )
            all_rows.extend(normalized)
            counts[grain] = counts.get(grain, 0) + len(normalized)
    return all_rows, counts


_BING_DATE_RE = re.compile(r"^/Date\(([-]?\d+)([+-]\d{4})?\)/$")


def parse_bing_date(value: Any) -> str:
    if isinstance(value, str):
        match = _BING_DATE_RE.match(value)
        if match:
            millis = int(match.group(1))
            return dt.datetime.fromtimestamp(millis / 1000, tz=dt.timezone.utc).date().isoformat()
        # ISO date/time fallback for future/current REST representations.
        try:
            return dt.datetime.fromisoformat(value.replace("Z", "+00:00")).date().isoformat()
        except ValueError:
            pass
    raise SyncError("Bing response contained an unsupported date format")


def _bing_get(method_name: str, site_url: str, token: str) -> list[dict[str, Any]]:
    qs = urllib.parse.urlencode({"siteUrl": site_url})
    endpoint = f"{BING_API_BASE}/{method_name}?{qs}"
    data = json_request(endpoint, headers={"Authorization": f"Bearer {token}"}) or {}
    payload = data.get("d", data)
    if isinstance(payload, dict):
        # Some REST wrappers may nest arrays under a method-specific property.
        for value in payload.values():
            if isinstance(value, list):
                payload = value
                break
    if not isinstance(payload, list):
        raise SyncError(f"Bing {method_name} response did not contain a row list")
    return [item for item in payload if isinstance(item, dict)]


def normalize_bing_rows(
    rows: Iterable[Mapping[str, Any]],
    *,
    site_url: str,
    grain: str,
) -> list[MetricRow]:
    result: list[MetricRow] = []
    for row in rows:
        clicks = int(round(float(row.get("Clicks", 0) or 0)))
        impressions = int(round(float(row.get("Impressions", 0) or 0)))
        query_field = str(row.get("Query", "") or "")
        avg_impression_position = row.get("AvgImpressionPosition")
        avg_click_position = row.get("AvgClickPosition")
        query = query_field if grain == "query" else ""
        page = query_field if grain == "page" else ""
        result.append(
            MetricRow(
                source="bing",
                data_date=parse_bing_date(row.get("Date")),
                site_url=site_url,
                grain=grain,
                query=query,
                page=page,
                search_type="bing_webmaster",
                clicks=clicks,
                impressions=impressions,
                ctr=(clicks / impressions) if impressions else 0.0,
                avg_position=float(avg_impression_position) if avg_impression_position is not None else None,
                avg_click_position=float(avg_click_position) if avg_click_position is not None else None,
                is_final=True,
                metadata={
                    "aggregation": "bing_webmaster",
                    "source_method": {
                        "site": "GetRankAndTrafficStats",
                        "query": "GetQueryStats",
                        "page": "GetPageStats",
                    }[grain],
                },
            )
        )
    return result


def collect_bing(dates: Sequence[dt.date]) -> tuple[list[MetricRow], dict[str, int]]:
    # Bing methods return their own date field. We filter to a rolling window so
    # repeated runs are idempotent and weekly query/page refreshes can replay old rows.
    site_url = env("BING_WEBMASTER_SITE_URL")
    token = refresh_bing_access_token()
    target_dates = {d.isoformat() for d in dates}
    specs = [
        ("site", "GetRankAndTrafficStats"),
        ("query", "GetQueryStats"),
        ("page", "GetPageStats"),
    ]
    all_rows: list[MetricRow] = []
    counts: dict[str, int] = {}
    for grain, method in specs:
        raw_rows = _bing_get(method, site_url, token)
        normalized = normalize_bing_rows(raw_rows, site_url=site_url, grain=grain)
        filtered = [row for row in normalized if row.data_date in target_dates]
        all_rows.extend(filtered)
        counts[grain] = len(filtered)
    return all_rows, counts


class SupabaseStore:
    def __init__(self) -> None:
        self.base_url = env("SEARCH_DATA_SUPABASE_URL").rstrip("/")
        self.key = env("SEARCH_DATA_SUPABASE_SERVICE_ROLE_KEY")

    @property
    def headers(self) -> dict[str, str]:
        return {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
        }

    def upsert_rows(self, rows: Sequence[MetricRow], batch_size: int = 500) -> int:
        if not rows:
            return 0
        total = 0
        endpoint = f"{self.base_url}/rest/v1/search_performance_daily?on_conflict=record_key"
        headers = {**self.headers, "Prefer": "resolution=merge-duplicates,return=minimal"}
        for offset in range(0, len(rows), batch_size):
            batch = [row.to_record() for row in rows[offset : offset + batch_size]]
            json_request(endpoint, method="POST", headers=headers, json_body=batch)
            total += len(batch)
        return total

    def start_run(self, source: str, start_date: str, end_date: str, workflow_run_id: str) -> int | None:
        endpoint = f"{self.base_url}/rest/v1/search_collection_runs"
        headers = {**self.headers, "Prefer": "return=representation"}
        data = json_request(
            endpoint,
            method="POST",
            headers=headers,
            json_body={
                "source": source,
                "target_start_date": start_date,
                "target_end_date": end_date,
                "status": "running",
                "workflow_run_id": workflow_run_id,
            },
        )
        if isinstance(data, list) and data and "id" in data[0]:
            return int(data[0]["id"])
        return None

    def finish_run(
        self,
        run_id: int | None,
        *,
        status: str,
        rows_upserted: int,
        grain_counts: Mapping[str, int],
        error_class: str = "",
        error_message: str = "",
    ) -> None:
        if run_id is None:
            return
        endpoint = f"{self.base_url}/rest/v1/search_collection_runs?id=eq.{run_id}"
        headers = {**self.headers, "Prefer": "return=minimal"}
        json_request(
            endpoint,
            method="PATCH",
            headers=headers,
            json_body={
                "status": status,
                "rows_upserted": rows_upserted,
                "grain_counts": dict(grain_counts),
                "error_class": error_class[:120],
                "error_message": error_message[:500],
                "completed_at": dt.datetime.now(dt.timezone.utc).isoformat(),
            },
        )

    def prune_fine_grain(self, retention_days: int) -> None:
        cutoff = (dt.date.today() - dt.timedelta(days=retention_days)).isoformat()
        query = urllib.parse.urlencode({"grain": "eq.query_page", "data_date": f"lt.{cutoff}"})
        endpoint = f"{self.base_url}/rest/v1/search_performance_daily?{query}"
        json_request(endpoint, method="DELETE", headers={**self.headers, "Prefer": "return=minimal"})


def provider_configured(provider: str) -> bool:
    required = {
        "google": ["GSC_CLIENT_ID", "GSC_CLIENT_SECRET", "GSC_REFRESH_TOKEN", "GSC_SITE_URL"],
        "bing": [
            "BING_WEBMASTER_CLIENT_ID",
            "BING_WEBMASTER_CLIENT_SECRET",
            "BING_WEBMASTER_REFRESH_TOKEN",
            "BING_WEBMASTER_SITE_URL",
        ],
    }[provider]
    return all(os.getenv(name) for name in required)


def run_provider(provider: str, dates: Sequence[dt.date], store: SupabaseStore, dry_run: bool) -> tuple[str, int]:
    configured = provider_configured(provider)
    if not configured:
        print(f"{provider}: skipped (credentials not configured)")
        return "skipped", 0

    run_id = None
    workflow_run_id = os.getenv("GITHUB_RUN_ID", "")
    if not dry_run:
        run_id = store.start_run(provider, dates[0].isoformat(), dates[-1].isoformat(), workflow_run_id)

    try:
        if provider == "google":
            rows, counts = collect_google(dates)
        elif provider == "bing":
            rows, counts = collect_bing(dates)
        else:
            raise ValueError(provider)
        written = 0 if dry_run else store.upsert_rows(rows)
        if not dry_run:
            store.finish_run(run_id, status="succeeded", rows_upserted=written, grain_counts=counts)
        print(f"{provider}: {'validated' if dry_run else 'stored'} rows={len(rows)} grains={json.dumps(counts, sort_keys=True)}")
        return "succeeded", len(rows)
    except Exception as exc:
        safe_class = type(exc).__name__
        safe_message = str(exc)
        if not dry_run:
            try:
                store.finish_run(
                    run_id,
                    status="failed",
                    rows_upserted=0,
                    grain_counts={},
                    error_class=safe_class,
                    error_message=safe_message,
                )
            except Exception:
                pass
        print(f"{provider}: failed ({safe_class}: {safe_message})", file=sys.stderr)
        return "failed", 0


def dates_for_provider(provider: str, today: dt.date, manual_date: str = "") -> list[dt.date]:
    if manual_date:
        return [dt.date.fromisoformat(manual_date)]
    if provider == "google":
        lag_days = int(env("SEARCH_DATA_LAG_DAYS", required=False, default=str(DEFAULT_LAG_DAYS)))
        lookback_days = int(env("SEARCH_DATA_LOOKBACK_DAYS", required=False, default=str(DEFAULT_LOOKBACK_DAYS)))
        return date_range_ending_with_lag(today, lag_days, lookback_days)
    # Bing top-query/page statistics are documented as weekly-updated, so use a wider
    # overlap window than GSC to avoid missing rows when Bing refreshes older dates.
    bing_lag = int(env("BING_DATA_LAG_DAYS", required=False, default="1"))
    bing_lookback = int(env("BING_DATA_LOOKBACK_DAYS", required=False, default="14"))
    return date_range_ending_with_lag(today, bing_lag, bing_lookback)


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--provider", choices=["google", "bing", "all"], default="all")
    parser.add_argument("--dry-run", action="store_true", help="call providers and normalize but do not write Supabase")
    parser.add_argument("--date", help="single YYYY-MM-DD target date (manual backfill/testing)")
    args = parser.parse_args(argv)

    providers = ["google", "bing"] if args.provider == "all" else [args.provider]
    configured = [provider for provider in providers if provider_configured(provider)]
    for provider in providers:
        if provider not in configured:
            print(f"{provider}: skipped (credentials not configured)")

    # Before OAuth bootstrap / GitHub Secret setup, scheduled runs are intentional no-ops.
    if not configured:
        print("search-data sync: no provider credentials configured; safe no-op")
        return 0

    if not args.dry_run:
        # Only require Supabase credentials once at least one provider is configured.
        store: Any = SupabaseStore()
    else:
        class _NoopStore:
            pass
        store = _NoopStore()

    statuses: list[str] = []
    today = dt.date.today()
    for provider in configured:
        dates = dates_for_provider(provider, today, args.date or "")
        status, _ = run_provider(provider, dates, store, args.dry_run)
        statuses.append(status)

    if not args.dry_run and isinstance(store, SupabaseStore):
        try:
            retention = int(
                env(
                    "SEARCH_FINE_GRAIN_RETENTION_DAYS",
                    required=False,
                    default=str(DEFAULT_FINE_GRAIN_RETENTION_DAYS),
                )
            )
            store.prune_fine_grain(max(retention, 7))
        except Exception as exc:
            print(f"retention cleanup warning: {type(exc).__name__}: {exc}", file=sys.stderr)

    # Both providers are attempted independently. A configured provider failure marks
    # the job failed after the other provider has still had a chance to store its data.
    return 1 if "failed" in statuses else 0


if __name__ == "__main__":
    raise SystemExit(main())
