#!/usr/bin/env python3
"""Append auditable, UI-safe events for AI Editorial Dashboard v0.1."""
import argparse, json, uuid
from datetime import datetime, timezone
from pathlib import Path

ROLES={"editor","builder","challenger","reviewer","system","human","image-reviewer"}
TYPES={"status","proposal","build","finding","review","revision","heartbeat","preview","gate","decision","error"}
SEVERITIES={"info","low","medium","high","blocker"}

def now(): return datetime.now(timezone.utc).isoformat()

def main():
    p=argparse.ArgumentParser()
    p.add_argument("output")
    p.add_argument("--job-id",required=True)
    p.add_argument("--role",required=True,choices=sorted(ROLES))
    p.add_argument("--provider",required=True)
    p.add_argument("--type",required=True,choices=sorted(TYPES))
    p.add_argument("--summary",required=True)
    p.add_argument("--state",required=True)
    p.add_argument("--severity",default="info",choices=sorted(SEVERITIES))
    p.add_argument("--evidence",action="append",default=[])
    a=p.parse_args()
    if len(a.summary)>2000: raise SystemExit("summary too long")
    if len(a.provider)>100 or any(x in a.provider.lower() for x in ("key=","token=","secret=")):
        raise SystemExit("unsafe provider value")
    evidence=[]
    for raw in a.evidence[:20]:
        if len(raw)>500: raise SystemExit("evidence ref too long")
        evidence.append({"kind":"reference","ref":raw})
    event={
      "schema_version":"0.1","event_id":str(uuid.uuid4()),"job_id":a.job_id,
      "role":a.role,"provider":a.provider,"type":a.type,"summary":a.summary,
      "evidence":evidence,"severity":a.severity,"state":a.state,"created_at":now()
    }
    path=Path(a.output); path.parent.mkdir(parents=True,exist_ok=True)
    with path.open("a",encoding="utf-8") as f: f.write(json.dumps(event,ensure_ascii=False)+"\n")
    print(json.dumps(event,ensure_ascii=False))
if __name__=="__main__": main()
