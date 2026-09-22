#!/usr/bin/env python3
"""Validate and append bounded AI editorial discussion turns."""
import argparse, json, uuid
from datetime import datetime, timezone
from pathlib import Path

ROLES={"editor","challenger","reviewer","human"}
STANCES={"propose","support","oppose","revise","withdraw","adjudicate","question"}
MAX_TURNS=7
MAX_MESSAGE=1200
MAX_EVIDENCE=10
MAX_QUESTIONS=5

def now(): return datetime.now(timezone.utc).isoformat()

def load(path):
    p=Path(path)
    if not p.exists():
        return {"schema_version":"0.1","session_id":str(uuid.uuid4()),"status":"open","round":1,"turns":[]}
    d=json.loads(p.read_text(encoding="utf-8"))
    if d.get("schema_version")!="0.1" or not isinstance(d.get("turns"),list):
        raise SystemExit("invalid discussion session")
    return d

def save(path,d):
    Path(path).write_text(json.dumps(d,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

def main():
    p=argparse.ArgumentParser()
    p.add_argument("session")
    p.add_argument("--role",required=True,choices=sorted(ROLES))
    p.add_argument("--provider",required=True)
    p.add_argument("--stance",required=True,choices=sorted(STANCES))
    p.add_argument("--message",required=True)
    p.add_argument("--evidence",action="append",default=[])
    p.add_argument("--question",action="append",default=[])
    p.add_argument("--confidence",type=float,required=True)
    p.add_argument("--close",choices=["adopt","revise","escalate"])
    a=p.parse_args()
    d=load(a.session)
    if d.get("status")!="open": raise SystemExit("discussion already closed")
    if len(d["turns"])>=MAX_TURNS: raise SystemExit("discussion turn limit reached")
    if not 1<=len(a.message)<=MAX_MESSAGE: raise SystemExit("invalid message length")
    if not 0<=a.confidence<=1: raise SystemExit("invalid confidence")
    if len(a.evidence)>MAX_EVIDENCE or len(a.question)>MAX_QUESTIONS: raise SystemExit("discussion payload too large")
    if a.close and a.role!="reviewer": raise SystemExit("only reviewer may close discussion")
    turn={"turn":len(d["turns"])+1,"role":a.role,"provider":a.provider,"stance":a.stance,"message":a.message,
          "evidence":[x[:500] for x in a.evidence],"questions":[x[:500] for x in a.question],"confidence":a.confidence,"created_at":now()}
    d["turns"].append(turn)
    # A second editor turn starts round 2; never exceed two rounds.
    if a.role=="editor" and len([x for x in d["turns"] if x["role"]=="editor"])>1: d["round"]=2
    if d["round"]>2: raise SystemExit("discussion round limit reached")
    if a.close:
        d["status"]="closed"; d["decision"]=a.close; d["closed_at"]=now()
    save(a.session,d)
    print(json.dumps({"session_id":d["session_id"],"turn":turn["turn"],"round":d["round"],"status":d["status"],"decision":d.get("decision")},ensure_ascii=False))

if __name__=="__main__": main()
