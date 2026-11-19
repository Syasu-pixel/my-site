"""Pure source-preserving adapter. Never reads the old preview HTML or publishes."""
import json,re,hashlib,argparse
from pathlib import Path
from html_spans import Parser,text

CSS='/assets/css/article-toc-v2.css'
JS='/assets/js/article-toc-v2.js'

def transform(original,spec):
 if 'id="dc-toc-data"' in original:raise ValueError('Already contains TOC: use the untransformed current source')
 p=Parser(original);edits=[];toc=[];ids={n.attrs['id'] for n in p.nodes if 'id' in n.attrs}
 for n in p.nodes:
  if n.tag!='h2' or not n.ancestor(lambda x:x.tag=='main'):continue
  if n.ancestor(lambda x:x.tag=='aside' or x.has('summary-card') or x.has('mini-toc-card') or x.has('article-hero') or x.has('article-feedback')):continue
  label=text(original[n.open_end:original.rfind('</h2',n.start,n.end)])
  if any(s in label for s in ['あわせて読みたい','関連記事','この記事は役に','Related articles','Was this article','キャリアを考える前後']):continue
  target=n.attrs.get('id');parent=n.ancestor(lambda x:x.tag=='section' and bool(x.attrs.get('id')))
  if not target and parent:target=parent.attrs['id']
  if not target:
   target='dc-section-'+str(len(toc)+1)
   if target in ids:raise ValueError('Anchor collision: '+target)
   ids.add(target);edits.append((n.open_end-1,n.open_end-1,' id="'+target+'"'))
  toc.append({'id':target,'label':label})
 if toc!=spec['tocReference']:raise ValueError('Current headings changed: refresh data from current source; never copy stale body')
 if not toc or len({i['id'] for i in toc})!=len(toc):raise ValueError('Empty or duplicate TOC targets')
 asides=[n for n in p.nodes if n.tag=='aside']
 if len(asides)!=spec['asideCount']:raise ValueError('Sidebar structure changed: review current roles')
 raw=[original[n.start:n.end] for a in asides for n in a.children]
 if len(raw)!=len(spec['cardsBefore']):raise ValueError('Sidebar card count changed')
 for current,expected in zip(raw,spec['cardsBefore']):
  if hashlib.sha256(current.encode()).hexdigest()!=expected['sha256']:raise ValueError('Current sidebar changed: refresh decisions, do not overwrite it')
 if len(asides)>1:raise ValueError('Multiple asides require an explicit adapter')
 if asides:
  a=asides[0];edits.append((a.open_end,original.rfind('</aside',a.start,a.end),'\n'+'\n'.join(raw[i] for i in spec['retainedCardOrder'])+'\n'))
 output=original
 for a,b,value in sorted(edits,reverse=True):output=output[:a]+value+output[b:]
 # Verify exact main preservation outside explicitly changed sidebar and anchor attributes.
 def body(s):
  n=next(n for n in Parser(s).nodes if n.tag=='main');v=s[n.start:n.end]
  return re.sub(r' id="dc-section-\d+"','',re.sub(r'<aside\b[\s\S]*?</aside>','',v))
 if body(original)!=body(output):raise ValueError('Unexpected main/body change')
 data=json.dumps({'lang':'en' if spec['path'].startswith('en/') else 'ja','toc':toc,'compactMaxWidth':spec['compactMaxWidth'],'kind':spec['kind']},ensure_ascii=False).replace('</','<\\/')
 if output.count('</head>')!=1 or output.count('</body>')!=1:raise ValueError('Ambiguous document boundary')
 output=output.replace('</head>',f'<link rel="stylesheet" href="{CSS}"></head>').replace('</body>',f'<script type="application/json" id="dc-toc-data">{data}</script><script src="{JS}" defer></script></body>')
 return output

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--source-root',type=Path,required=True);parser.add_argument('--output-root',type=Path,required=True);args=parser.parse_args()
 source=args.source_root.resolve();out=args.output_root.resolve();pkg=Path(__file__).resolve().parent
 if source==out or source in out.parents or out in source.parents:raise ValueError('Use disjoint source and review output directories')
 if out.exists() and any(out.iterdir()):raise ValueError('Output must be empty; refusing to overwrite prior evidence')
 pending=[]
 for spec in json.loads((pkg/'pages.json').read_text('utf-8'))['pages']:
  path=Path(spec['path']);original=(source/path).read_text('utf-8');pending.append((path,transform(original,spec)))
 # No writes until all sources pass validation.
 for path,content in pending:
  dest=out/path;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(content,encoding='utf-8',newline='')
 for src,dest in [('toc.css',CSS),('toc.js',JS)]:
  target=out/dest.lstrip('/');target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes((pkg/src).read_bytes())
 print(json.dumps({'version':'sidebar-toc-v2','pages':len(pending),'sourceModified':False,'productionPublished':False}))

if __name__=='__main__':main()
