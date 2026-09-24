#!/usr/bin/env python3
"""Create a bounded EDITOR response to a CHALLENGER turn.

This adapter deliberately avoids pretending to expose model chain-of-thought. It produces
an auditable response from the supplied session evidence and questions, suitable for a
second challenger pass. A provider-backed EDITOR can replace this adapter later without
changing the discussion contract.
"""
import json, os
from pathlib import Path

session=Path(os.getenv('DISCUSSION_SESSION','discussion-session.json'))
output=Path(os.getenv('EDITOR_RESPONSE_OUTPUT','editor-response.json'))
s=json.loads(session.read_text(encoding='utf-8'))
turns=s.get('turns',[])
if not turns or turns[-1].get('role')!='challenger': raise SystemExit('latest turn is not challenger')
c=turns[-1]
questions=[str(x)[:300] for x in c.get('questions',[])[:5]]
evidence=[str(x)[:500] for x in c.get('evidence',[])[:10]]
if c.get('stance') in ('support','withdraw'):
    message='CHALLENGERの重要懸念は維持されていないため、追加反論は行いません。提示された合意をREVIEWERへ送ります。'
    stance='support'
else:
    q=' / '.join(questions) if questions else '明示的な質問なし'
    message=('CHALLENGERの異論を受けて再検討します。今回の提案は自動会議の実働検証を目的とし、production公開や記事変更を行わず、'
             '討論結果も自動採用せずREVIEWER裁定へ送ります。未解決の質問: '+q)[:1200]
    stance='revise'
out={'stance':stance,'message':message,'evidence':evidence,'questions':['この回答で重大な懸念は解消しましたか？'],'confidence':0.82}
output.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'stance':stance,'questions':len(questions),'evidence':len(evidence)},ensure_ascii=False))
