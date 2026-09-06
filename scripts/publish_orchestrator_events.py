#!/usr/bin/env python3
"""Publish sanitized orchestrator JSONL events to the dashboard feed."""
import json
import os
import urllib.error
import urllib.request
from pathlib import Path

URL = os.environ.get("AI_EDITORIAL_FEED_URL", "")
TOKEN = os.environ.get("AI_EDITORIAL_FEED_TOKEN", "")
EVENTS_PATH = os.environ.get("ORCHESTRATOR_EVENTS", "orchestrator-events.jsonl")

if not URL.startswith("https://pavitnsnmoaiospswiys.supabase.co/functions/v1/ai-editorial-feed"):
    raise SystemExit("invalid dashboard feed URL")
if not TOKEN:
    raise SystemExit("missing dashboard feed token")
path = Path(EVENTS_PATH)
if not path.is_file():
    raise SystemExit("event file missing")
rows=[]
for line in path.read_text(encoding="utf-8").splitlines():
    if line.strip(): rows.append(json.loads(line))
if not 1 <= len(rows) <= 100:
    raise SystemExit("invalid event count")
payload=json.dumps({"events":rows},ensure_ascii=False).encode("utf-8")
if len(payload)>200_000:
    raise SystemExit("event payload too large")
req=urllib.request.Request(URL,data=payload,method="POST",headers={
    "Content-Type":"application/json","x-ingest-token":TOKEN,"User-Agent":"denkicontrol-orchestrator/0.1"
})
try:
    with urllib.request.urlopen(req,timeout=15) as r:
        body=r.read(4096).decode("utf-8","replace")
        if r.status != 202: raise SystemExit(f"dashboard feed rejected: HTTP {r.status}")
        result=json.loads(body)
        print(json.dumps({"accepted":result.get("accepted",0)},ensure_ascii=False))
except urllib.error.HTTPError as e:
    raise SystemExit(f"dashboard feed HTTP error: {e.code}")
except urllib.error.URLError:
    raise SystemExit("dashboard feed network error")
