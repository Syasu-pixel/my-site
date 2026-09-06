#!/usr/bin/env python3
"""Publish sanitized Orchestrator events to the isolated dashboard-data branch.

The destination branch/path are intentionally hard-coded. This script never writes main.
"""
import base64
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

REPO = "Syasu-pixel/my-site"
BRANCH = "ai-dashboard-events"
DEST_PATH = "dashboard-data/events.json"
EVENTS_PATH = os.environ.get("ORCHESTRATOR_EVENTS", "orchestrator-events.jsonl")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
API = f"https://api.github.com/repos/{REPO}/contents/{DEST_PATH}"

if not TOKEN:
    raise SystemExit("missing GITHUB_TOKEN")
path = Path(EVENTS_PATH)
if not path.is_file():
    raise SystemExit("event file missing")

incoming = []
for line in path.read_text(encoding="utf-8").splitlines():
    if line.strip():
        row = json.loads(line)
        if not isinstance(row, dict) or not row.get("event_id"):
            raise SystemExit("invalid event row")
        incoming.append(row)
if not 1 <= len(incoming) <= 100:
    raise SystemExit("invalid event count")

headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": f"Bearer {TOKEN}",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "denkicontrol-orchestrator/0.1",
}

def request(method, url, payload=None):
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method=method, headers={**headers, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.status, json.loads(r.read().decode("utf-8"))

for attempt in range(1, 4):
    try:
        _, current = request("GET", API + "?" + urllib.parse.urlencode({"ref": BRANCH}))
        sha = current.get("sha")
        raw = base64.b64decode(current.get("content", "")).decode("utf-8")
        document = json.loads(raw)
        existing = document.get("events", []) if isinstance(document, dict) else []
        if not isinstance(existing, list):
            raise SystemExit("invalid remote feed")

        by_id = {str(x.get("event_id")): x for x in existing if isinstance(x, dict) and x.get("event_id")}
        for row in incoming:
            by_id[str(row["event_id"])] = row
        merged = list(by_id.values())
        merged.sort(key=lambda x: str(x.get("created_at", "")))
        merged = merged[-1000:]
        body = (json.dumps({"schema_version": "0.1", "events": merged}, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8")
        if len(body) > 1_000_000:
            raise SystemExit("dashboard feed too large")
        payload = {
            "message": "Update AI dashboard event feed",
            "content": base64.b64encode(body).decode("ascii"),
            "sha": sha,
            "branch": BRANCH,
        }
        status, _ = request("PUT", API, payload)
        if status not in (200, 201):
            raise SystemExit(f"dashboard feed rejected: HTTP {status}")
        print(json.dumps({"accepted": len(incoming), "stored": len(merged), "branch": BRANCH}, ensure_ascii=False))
        break
    except urllib.error.HTTPError as e:
        if e.code in (409, 422) and attempt < 3:
            time.sleep(attempt * 2)
            continue
        raise SystemExit(f"dashboard feed HTTP error: {e.code}")
    except urllib.error.URLError:
        if attempt < 3:
            time.sleep(attempt * 2)
            continue
        raise SystemExit("dashboard feed network error")
else:
    raise SystemExit("dashboard feed update failed")
