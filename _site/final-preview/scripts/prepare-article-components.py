"""Extract only from the current sources. Never import previous preview HTML."""
import argparse, json, re, sys, hashlib
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
ROOT=Path(__file__).resolve().parent.parent
PACKAGE=ROOT/'.github/article-components'
sys.path.insert(0,str(PACKAGE/'sidebar'))
from html_spans import Parser,text
from integrate import transform
def read(p):return p.read_bytes().decode('utf-8')
def sha(s):return hashlib.sha256(s.encode()).hexdigest()
def ancestors(n):
 while n.parent:
  n=n.parent;yield n
def local_path(page,href):return unquote(urlsplit(urljoin('https://denkicontrol.com/'+page,href)).path).lstrip('/')
def inner(s,n):return s[n.open_end:s.rfind('</'+n.tag,n.start,n.end)]
def end_data(page,s):
 nodes=Parser(s).nodes
 grids=[n for n in nodes if (n.has('related-grid') or n.has('internal-grid') and n.ancestor(lambda a:a.attrs.get('id') in ['related','related-career'])) and not n.ancestor(lambda a:a.tag=='aside')]
 if len(grids)!=1:raise ValueError('Expected one article-ending grid: '+str(len(grids)))
 g=grids[0];block=next((a for a in ancestors(g) if a.tag=='section' or a.has('section-card') or a.has('article-card')),None)
 if not block:raise ValueError('No enclosing related block')
 cards=[]
 for a in g.children:
  if a.tag!='a' or not a.attrs.get('href'):raise ValueError('Unknown card structure')
  href=a.attrs['href'];target=local_path(page,href)
  if not re.fullmatch(r'(en/)?articles/[a-z0-9-]+\.html',target):cards.append({'kind':'navigation','raw':s[a.start:a.end]});continue
  target_file=ROOT/target
  if not target_file.is_file():raise ValueError('Missing related target: '+target)
  meta=Parser(read(target_file)).nodes
  og=[n.attrs.get('content') for n in meta if n.tag=='meta' and n.attrs.get('property')=='og:image']
  titles=[n.attrs.get('content') for n in meta if n.tag=='meta' and n.attrs.get('property')=='og:title']
  if len(og)!=1 or not og[0]:raise ValueError('Missing/ambiguous OGP: '+target)
  descendants=[n for n in nodes if n.ancestor(lambda x:x is a)]
  title=next((n for n in descendants if n.tag in ['h3','strong']),None)
  if not title:raise ValueError('Missing card title')
  body=next((n for n in descendants if n.has('related-card-body')),a)
  content=inner(s,body);offset=body.open_end
  remove=[n for n in descendants if n.start>=offset and n.end<=offset+len(content) and (n.tag=='img' or n.has('related-card-media') or n.has('related-card-thumb'))]
  remove=[n for n in remove if not any(x.start<=n.start and x.end>=n.end and x is not n for x in remove)]
  for n in sorted(remove,key=lambda n:n.start,reverse=True):content=content[:n.start-offset]+content[n.end-offset:]
  cards.append({'kind':'article','href':href,'attributes':{k:v for k,v in a.attrs.items() if k not in ['class','href']},'target':target,'image':'/'+local_path(target,og[0]),'alt':titles[0] if titles else text(inner(s,title)),'contentHtml':content,'ogpSource':og[0],'label':text(inner(s,title)),'originalImages':[n.attrs.get('src') for n in descendants if n.tag=='img']})
 replacements=[{'start':g.start,'end':g.end,'type':'related','cards':cards}]
 feedback=[n for n in nodes if n.attrs.get('id')=='articleFeedbackCard']
 if page.startswith('en/') and feedback:raise ValueError('English source unexpectedly contains feedback')
 if not page.startswith('en/'):
  if len(feedback)>1:raise ValueError('Duplicate source feedback')
  replacements += [{'start':n.start,'end':n.end,'type':'remove'} for n in feedback]
  replacements.append({'start':block.start,'end':block.start,'type':'feedback'})
 cursor=0;segments=[]
 for r in sorted(replacements,key=lambda r:(r['start'],r['end'])):
  if r['start']<cursor:raise ValueError('Overlapping component boundaries')
  segments.extend([{'type':'raw','html':s[cursor:r['start']]},r]);cursor=r['end']
 segments.append({'type':'raw','html':s[cursor:]})
 return {'path':page,'language':'en' if page.startswith('en/') else 'ja','sourceSha256':sha(s),'segments':segments}
def audit(config):
 selected=set(config.get('targets',config['representatives']));rows=[]
 for path in sorted([p for d in ['articles','en/articles'] for p in (ROOT/d).glob('*.html')]):
  page=path.relative_to(ROOT).as_posix();s=read(path);nodes=Parser(s).nodes
  row={'path':page,'language':'en' if page.startswith('en/') else 'ja','integrationRepresentative':page in selected,'asideCount':sum(n.tag=='aside' for n in nodes),'bodySha256':sha(s),'visualIntegrationStatus':'planned-integration' if page in selected else 'not-integrated-not-visually-verified'}
  try:
   data=end_data(page,s);cards=[c for seg in data['segments'] if seg['type']=='related' for c in seg['cards'] if c['kind']=='article'];row.update(endAdapter='supported-structure',articleCards=len(cards),knownSelfLinks=[{'title':c['label'],'href':c['href'],'target':c['target']} for c in cards if c['target']==page])
  except Exception as e:row.update(endAdapter='exception',reason=str(e))
  rows.append(row)
 return rows
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--headers',type=Path);ap.add_argument('--out',type=Path,required=True);ap.add_argument('--audit-only',action='store_true');args=ap.parse_args();out=args.out.resolve();out.mkdir(parents=True,exist_ok=True)
 config=json.loads(read(PACKAGE/'integration.json'));rows=audit(config);(out/'coverage.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
 if args.audit_only:print(json.dumps({'articles':len(rows),'endExceptions':sum(r['endAdapter']=='exception' for r in rows)}));return
 # Approved display packages are immutable. Any mismatch is a reviewable failure.
 for folder in ['sidebar','end']:
  adoption=json.loads(read(PACKAGE/folder/'adoption.json'))
  for name,digest in adoption['filesSha256'].items():
   if hashlib.sha256((PACKAGE/folder/name).read_bytes()).hexdigest()!=digest:raise ValueError('Approved component modified: '+folder+'/'+name)
 specs=json.loads(read(PACKAGE/'sidebar/pages.json'))['pages'];specs={p['path']:p for p in specs}
 additions=PACKAGE/'sidebar/all-pages.json'
 if not additions.exists():additions=PACKAGE/'sidebar/additional-pages.json'
 if additions.exists():specs.update({p['path']:p for p in json.loads(read(additions))['pages']})
 baseline=json.loads(read(ROOT/'.github/site-shells/manifest.json'));hashes={p['output']:p['baselineSha256'] for p in baseline['pages']}
 pages=[];provenance=[]
 for page in config.get('targets',config['representatives']):
  original=read(ROOT/page)
  if sha(original)!=hashes[page]:raise ValueError('Current source changed; review/rebase registration: '+page)
  if page not in specs:raise ValueError('No reviewed sidebar role decisions: '+page)
  header=read(args.headers/page);sidebar=transform(header,specs[page]);data=end_data(page,sidebar);pages.append(data)
  dest=out/'sidebar'/page;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(sidebar.encode())
  provenance.append({'path':page,'originalSha256':sha(original),'headerSha256':sha(header),'sidebarSha256':sha(sidebar),'sidebarKind':specs[page]['kind'],'compactMaxWidth':specs[page]['compactMaxWidth'],'removedSidebarTocCards':specs[page]['removedTocCardIndices'],'retainedSidebarCardOrder':specs[page]['retainedCardOrder']})
 (out/'pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf-8');(out/'provenance.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps({'representatives':len(pages),'allArticleInventory':len(rows),'sourceModified':False}))
if __name__=='__main__':main()
