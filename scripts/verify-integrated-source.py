import json,re,sys,hashlib,collections,csv
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent;PKG=ROOT/'.github/article-components'
sys.path.insert(0,str(PKG/'sidebar'));from html_spans import Parser,text
def read(p):return p.read_bytes().decode('utf-8')
def digest(s):return hashlib.sha256(s.encode()).hexdigest()
def raw(s,n):return s[n.start:n.end]
def inner(s,n):return s[n.open_end:s.rfind('</'+n.tag,n.start,n.end)]
def end_grid(n):return (n.has('related-grid') or n.has('internal-grid') and n.ancestor(lambda a:a.attrs.get('id') in ['related','related-career'])) and not n.ancestor(lambda a:a.tag=='aside')
def outer_content(s):
 nodes=Parser(s).nodes;ranges=[]
 for n in nodes:
  if n.tag=='header' or n.tag=='aside' or end_grid(n) or n.attrs.get('id')=='articleFeedbackCard':ranges.append((n.start,n.end))
  elif n.tag=='style' and n.attrs.get('data-ui-proposal')=='header':ranges.append((n.start,n.end))
  elif n.tag=='script' and (n.attrs.get('data-ui-proposal')=='header' or n.attrs.get('id')=='dc-toc-data' or n.attrs.get('src') in ['/assets/js/article-toc-v2.js','/assets/js/article-integration-compat.js']):ranges.append((n.start,n.end))
  elif n.tag=='link' and n.attrs.get('href') in ['/assets/css/article-toc-v2.css','/assets/css/article-end-related.css','/assets/css/article-end-feedback.css','/assets/css/article-integration-compat.css']:ranges.append((n.start,n.end))
 ranges=[r for r in ranges if not any(q[0]<=r[0] and q[1]>=r[1] and q!=r for q in ranges)]
 for a,b in sorted(ranges,reverse=True):s=s[:a]+s[b:]
 s=re.sub(r' id="dc-section-\d+"','',s)
 return re.sub(r'>\s+<','><',s).strip()
def seo(s):
 result=[]
 for n in Parser(s).nodes:
  if n.tag=='title':result.append(('title',inner(s,n)))
  elif n.tag=='meta':result.append(('meta',n.attrs))
  elif n.tag=='link' and (n.attrs.get('rel')=='canonical' or 'hreflang' in n.attrs):result.append(('link',n.attrs))
  elif n.tag=='script' and n.attrs.get('type')=='application/ld+json':result.append(('structured-data',inner(s,n)))
 return result
def scripts(s):return [raw(s,n) for n in Parser(s).nodes if n.tag=='script']
def body_links(s):
 return [n.attrs.get('href') for n in Parser(s).nodes if n.tag=='a' and not n.ancestor(lambda a:a.tag in ['header','aside'])]
build=Path(sys.argv[1] if len(sys.argv)>1 else '../integration-build').resolve();config=json.loads(read(PKG/'integration.json'));rows=[]
specs={p['path']:p for f in ['pages.json','additional-pages.json'] for p in json.loads(read(PKG/'sidebar'/f))['pages']}
for page in config['representatives']:
 old=read(ROOT/page);new=read(build/'candidate'/page);a=Parser(old).nodes;b=Parser(new).nodes;spec=specs[page]
 oldscripts=scripts(old);newscripts=scripts(new)
 asideold=[n for n in a if n.tag=='aside'];asidenew=[n for n in b if n.tag=='aside']
 retained=[raw(old,asideold[0].children[i]) for i in spec['retainedCardOrder']] if asideold else []
 actual=[raw(new,n) for n in asidenew[0].children] if asidenew else []
 row={'path':page,'outsideComponentsEquivalent':outer_content(old)==outer_content(new),'seoExact':seo(old)==seo(new),'bodyAndFooterHrefOrderExact':body_links(old)==body_links(new),'originalScriptsExact':all(x in newscripts for x in oldscripts),'retainedSidebarCardsExact':retained==actual,'sidebarCountPreserved':len(asideold)==len(asidenew),'footerExact':[raw(old,n) for n in a if n.tag=='footer']==[raw(new,n) for n in b if n.tag=='footer'],'feedbackCount':sum(n.attrs.get('id')=='articleFeedbackCard' for n in b),'sourceSha256':digest(old),'candidateSha256':digest(new)}
 for key in ['outsideComponentsEquivalent','seoExact','bodyAndFooterHrefOrderExact','originalScriptsExact','retainedSidebarCardsExact','sidebarCountPreserved','footerExact']:
  if not row[key]:raise ValueError(page+': '+key)
 if row['feedbackCount']!=(0 if page.startswith('en/') else 1):raise ValueError('Feedback language/count')
 if 'plc-drilling-line-design-project-' in page and len(asidenew)!=0:raise ValueError('Design series must not acquire sidebar')
 rows.append(row)
service='services/gxworks2-online-support.html';serviceold=read(ROOT/service);servicenew=read(build/'candidate'/service)
if serviceold!=servicenew:raise ValueError('Service exception modified')
service_nodes=Parser(serviceold).nodes
service_result={'path':service,'state':'excluded-service-exception-preserved','byteIdentical':True,'formCount':sum(n.tag=='form' for n in service_nodes),'formControlCount':sum(n.tag in ['input','select','textarea','button'] for n in service_nodes),'scriptsExact':True,'liveSubmissionTested':False}
(build/'preservation.json').write_text(json.dumps({'articles':rows,'serviceException':service_result},ensure_ascii=False,indent=2),encoding='utf-8')
# Reconcile the whole Git tree, including fixed pages. An untested page never becomes "done" by inference.
inventory=json.loads(read(PKG/'site-inventory.json'))['files'];coverage={r['path']:r for r in json.loads(read(build/'coverage.json'))};ledger=[]
for item in inventory:
 page=item['path'];article=bool(re.fullmatch(r'(en/)?articles/[^/]+\.html',page));spec=specs.get(page)
 source_bytes=(ROOT/page).read_bytes()
 git_blob=hashlib.sha1(b'blob '+str(len(source_bytes)).encode()+b'\0'+source_bytes).hexdigest()
 if git_blob!=item['gitBlob']:raise ValueError('Latest baseline/source mismatch: '+page)
 if page==service:state='対象外（専用サービス例外・原文保持検査済み）';kind='GX Works2オンライン相談・受付フォーム';strategy='専用構成を保持。記事部品は適用しない'
 elif not article:state='対象外';kind='固定・カテゴリ・管理等';strategy='記事統合の対象外、変更なし'
 elif page not in config['representatives']:state='未確認（統合・画面未検証）';kind='構造監査のみ・タイプ別適用未確定';strategy='部品を自動適用しない'
 else:
  kind=config.get('typeOverrides',{}).get(page,spec['kind']);exception=any(x in kind for x in ['工具','キャリア','ハブ','設計','右欄なし','トラブル'])
  state='例外として別実装（レビュー適用）' if exception else '適用済み（レビューのみ）'
  strategy='元の専用構成を保持して部品を適用' if exception else '採用済み共通部品を適用'
 entry={'path':page,'article':article,'state':state,'kind':kind,'strategy':strategy,'productionApplied':False,'gitBlob':item['gitBlob']}
 if article:entry.update(asideCount=coverage[page]['asideCount'],endAdapter=coverage[page]['endAdapter'],knownSelfLinks=coverage[page].get('knownSelfLinks',[]))
 ledger.append(entry)
counts=dict(collections.Counter(r['state'] for r in ledger))
if len(ledger)!=309 or sum(r['article'] for r in ledger)!=288 or sum(counts.values())!=309:raise ValueError('Inventory reconciliation failed')
(build/'coverage-ledger.json').write_text(json.dumps({'sourceCommit':config['mainCommit'],'totalHtml':309,'articles':288,'nonArticles':21,'representatives':17,'counts':counts,'pages':ledger},ensure_ascii=False,indent=2),encoding='utf-8')
with (build/'coverage-ledger.csv').open('w',encoding='utf-8-sig',newline='') as f:
 fields=['path','article','state','kind','strategy','productionApplied'];writer=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');writer.writeheader();writer.writerows(ledger)
print(json.dumps({'preservedArticles':len(rows),'serviceByteIdentical':True,'ledgerCounts':counts},ensure_ascii=False))
