#!/usr/bin/env python3
"""Read-only probe for Search Console searchAppearance values.

Prints only aggregate Search Appearance labels and metrics. It never writes to Supabase
and never prints OAuth credentials.
"""
from __future__ import annotations
import datetime as dt
import json
import urllib.parse
import search_data_sync as sync

def main() -> int:
    token = sync.refresh_google_access_token()
    site_url = sync.env("GSC_SITE_URL")
    end = dt.date.today() - dt.timedelta(days=3)
    start = end - dt.timedelta(days=89)
    endpoint = f"{sync.GSC_API_BASE}/sites/{urllib.parse.quote(site_url, safe='')}/searchAnalytics/query"
    payload = {
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
        "dimensions": ["searchAppearance"],
        "type": "web",
        "dataState": "final",
        "rowLimit": 1000,
        "startRow": 0,
    }
    data = sync.json_request(endpoint, method="POST",
        headers={"Authorization": f"Bearer {token}"}, json_body=payload) or {}
    rows = []
    for row in data.get("rows") or []:
        keys = list(row.get("keys") or [])
        rows.append({
            "searchAppearance": keys[0] if keys else "",
            "clicks": row.get("clicks", 0),
            "impressions": row.get("impressions", 0),
            "ctr": row.get("ctr", 0),
            "position": row.get("position"),
        })
    print(json.dumps({"startDate": start.isoformat(), "endDate": end.isoformat(),
                      "rows": rows}, ensure_ascii=False, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
