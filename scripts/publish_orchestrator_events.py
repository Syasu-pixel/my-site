#!/usr/bin/env python3
"""Publish sanitized Orchestrator events to the isolated dashboard-data branch.

The destination repository, branch, and path are intentionally hard-coded. This script
may bootstrap the dedicated data branch, but it never writes main.
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
BASE_BRANCH = "main"
DEST_PATH = "dashboard-data/events.json"
EVENTS_PATH = os.environ.get("ORCHESTRATOR_EVENTS", "orchestrator-events.jsonl")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
CONTENTS_API = f"https://api.github.com/repos/{REPO}/contents/{DEST_PATH}"
REF_API = f"https://api.github.com/repos/{REPO}/git/ref/heads/{BRANCH}"
REFS_API = f"https://api.github.com/repos/{REPO}/git/refs"
BASE_REF_API = f"https://api.github.com/repos/{REPO}/git/ref/heads/{BASE_BRANCH}"
MAX_EVENTS = 1000
MAX_BYTES = 900_000

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
        raw = r.read().decode("utf-8")
        return r.status, json.loads(raw) if raw else {}


def ensure_branch():
    try:
        request("GET", REF_API)
        return
    except urllib.error.HTTPError as e:
        if e.code != 404:
            raise
    _, base = request("GET", BASE_REF_API)
    sha = base.get("object", {}).get("sha")
    if not sha:
        raise SystemExit("cannot resolve base branch for dashboard feed")
    try:
        request("POST", REFS_API, {"ref": f"refs/heads/{BRANCH}", "sha": sha})
    except urllib.error.HTTPError as e:
        if e.code not in (409, 422):
            raise


def load_remote_feed():
    try:
        _, current = request("GET", CONTENTS_API + "?" + urllib.parse.urlencode({"ref": BRANCH}))
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return [], None
        raise
    raw = base64.b64decode(current.get("content", "")).decode("utf-8")
    document = json.loads(raw)
    existing = document.get("events", []) if isinstance(document, dict) else []
    if not isinstance(existing, list):
        raise SystemExit("invalid remote feed")
    return existing, current.get("sha")


def serialize(events):
    return (json.dumps({"schema_version": "0.1", "events": events}, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8")

ensure_branch()

for attempt in range(1, 4):
    try:
        existing, sha = load_remote_feed()
        by_id = {str(x.get("event_id")): x for x in existing if isinstance(x, dict) and x.get("event_id")}
        for row in incoming:
            by_id[str(row["event_id"])] = row
        merged = list(by_id.values())
        merged.sort(key=lambda x: str(x.get("created_at", "")))
        if len(merged) > MAX_EVENTS:
            merged = merged[-MAX_EVENTS:]
        body = serialize(merged)
        while len(body) > MAX_BYTES and merged:
            merged.pop(0)
            body = serialize(merged)
        if not merged:
            raise SystemExit("single dashboard event exceeds feed size budget")

        payload = {
            "message": "Update AI dashboard event feed",
            "content": base64.b64encode(body).decode("ascii"),
            "branch": BRANCH,
        }
        if sha:
            payload["sha"] = sha
        status, _ = request("PUT", CONTENTS_API, payload)
        if status not in (200, 201):
            raise SystemExit(f"dashboard feed rejected: HTTP {status}")
        print(json.dumps({"accepted": len(incoming), "stored": len(merged), "bytes": len(body), "branch": BRANCH}, ensure_ascii=False))
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
