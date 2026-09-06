#!/usr/bin/env python3
"""Create a UI-safe CHALLENGER fallback turn when the primary model is unavailable.

This is not a substitute for an independent model review. It keeps the meeting auditable
and moving while explicitly marking provider diversity as degraded.
"""
import json, os
from pathlib import Path

session=Path(os.getenv('DISCUSSION_SESSION','discussion-session.json'))
output=Path(os.getenv('DISCUSSION_OUTPUT','challenger-fallback.json'))
reason=os.getenv('FALLBACK_REASON','primary challenger unavailable')[:300]
s=json.loads(session.read_text(encoding='utf-8'))
turns=s.get('turns',[])
if not turns:
    raise SystemExit('discussion session missing turns')
latest=turns[-1]
msg=(
    'Primary CHALLENGER is unavailable, so CHALLENGER Controller is temporarily covering this turn. '
    'This is a degraded-diversity fallback, not an independent external-model review. '
    f'Reason: {reason}. The proposal should not be treated as independently cleared until the primary '
    'CHALLENGER or another independent provider reviews it.'
)[:1200]
out={
    'stance':'question',
    'message':msg,
    'evidence':['fallback: provider unavailable','provider-diversity: degraded'],
    'questions':['独立したCHALLENGERが復旧後に再監査するまで、この判断を暫定扱いにできますか？'],
    'confidence':0.99,
    'fallback':True,
    'primary_provider':'google-gemini',
}
output.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'fallback':True,'primary_provider':'google-gemini','stance':'question'},ensure_ascii=False))
