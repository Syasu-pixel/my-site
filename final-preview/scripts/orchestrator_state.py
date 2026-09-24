#!/usr/bin/env python3
"""Small fail-closed state machine for Multi-AI Orchestrator Phase A."""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

STATES = {
    "QUEUED", "EDITING", "BUILDING", "CHALLENGING", "REVIEWING", "REVISING",
    "PREVIEWING", "HUMAN_GATE", "APPROVED", "PUBLISHING", "VERIFYING", "DONE",
    "ESCALATED", "FAILED", "CANCELLED",
}
TERMINAL = {"DONE", "ESCALATED", "FAILED", "CANCELLED"}
TRANSITIONS = {
    "QUEUED": {"EDITING", "FAILED", "CANCELLED"},
    "EDITING": {"BUILDING", "ESCALATED", "FAILED", "CANCELLED"},
    "BUILDING": {"CHALLENGING", "FAILED", "CANCELLED"},
    "CHALLENGING": {"REVIEWING", "FAILED", "CANCELLED"},
    "REVIEWING": {"REVISING", "PREVIEWING", "ESCALATED", "FAILED", "CANCELLED"},
    "REVISING": {"BUILDING", "ESCALATED", "FAILED", "CANCELLED"},
    "PREVIEWING": {"HUMAN_GATE", "FAILED", "CANCELLED"},
    "HUMAN_GATE": {"APPROVED", "CANCELLED"},
    "APPROVED": {"PUBLISHING", "FAILED", "CANCELLED"},
    "PUBLISHING": {"VERIFYING", "FAILED", "CANCELLED"},
    "VERIFYING": {"DONE", "FAILED", "CANCELLED"},
}


def now():
    return datetime.now(timezone.utc).isoformat()


def load(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if data.get("schema_version") != "0.1" or data.get("state") not in STATES:
        raise SystemExit("invalid orchestrator job record")
    return data


def save(path, data):
    tmp = Path(str(path) + ".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(path)


def transition(data, target, actor, reason):
    current = data["state"]
    if current in TERMINAL:
        raise SystemExit(f"terminal state cannot transition: {current}")
    if target not in TRANSITIONS.get(current, set()):
        raise SystemExit(f"illegal transition: {current} -> {target}")
    if target == "REVISING":
        revision = int(data.get("revision", 0)) + 1
        maximum = int(data.get("max_revisions", 3))
        if revision > maximum:
            target = "ESCALATED"
            reason = f"revision limit exceeded ({maximum}); " + reason
        else:
            data["revision"] = revision
    if current == "HUMAN_GATE" and target == "APPROVED":
        if data.get("human_gate", {}).get("status") != "approved":
            raise SystemExit("human gate is not approved")
    data["state"] = target
    data.setdefault("events", []).append({
        "at": now(), "actor": actor, "from": current, "to": target, "reason": reason[:1000]
    })
    return data


def main():
    p = argparse.ArgumentParser()
    p.add_argument("job")
    sub = p.add_subparsers(dest="cmd", required=True)
    t = sub.add_parser("transition")
    t.add_argument("target", choices=sorted(STATES))
    t.add_argument("--actor", required=True)
    t.add_argument("--reason", required=True)
    g = sub.add_parser("gate")
    g.add_argument("decision", choices=["approved", "rejected"])
    g.add_argument("--actor", required=True)
    g.add_argument("--reason", required=True)
    args = p.parse_args()
    data = load(args.job)
    if args.cmd == "gate":
        if data["state"] != "HUMAN_GATE":
            raise SystemExit("gate decision only allowed at HUMAN_GATE")
        data.setdefault("human_gate", {})["status"] = args.decision
        data["human_gate"]["actor"] = args.actor
        data["human_gate"]["reason"] = args.reason[:1000]
        data["human_gate"]["at"] = now()
        data.setdefault("events", []).append({"at": now(), "actor": args.actor, "event": "human_gate", "decision": args.decision, "reason": args.reason[:1000]})
    else:
        transition(data, args.target, args.actor, args.reason)
    save(args.job, data)
    print(json.dumps({"job_id": data.get("job_id"), "state": data["state"], "revision": data.get("revision", 0)}, ensure_ascii=False))

if __name__ == "__main__":
    main()
