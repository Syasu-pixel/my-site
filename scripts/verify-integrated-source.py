import json,re,sys,hashlib,collections,csv,xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent;PKG=ROOT/'.github/article-components'
sys.path.insert(0,str(PKG/'sidebar'));from html_spans import Parser,text
def read(p):return p.read_bytes().decode('utf-8')
def digest(s):return hashlib.sha256(s.encode()).hexdigest()
def verify_admin_mobile_navigation(page, source, prior_blob):
 # Restore only the exact adopted admin links for the immutable page check.
 # The sixth tab appears on both desktop and mobile.
 pages={'admin/index.html':'./','admin/cases.html':'./cases.html'}
 active=pages[page]
 links=(('./','記事評価'),('./cases.html','案件管理'),('./search.html','検索分析'),('./articles.html','記事管理'),('./health.html','サイト異常'),('./comments.html','コメント管理'))
 def nav(entries,current_attrs):
  return ('<nav class="mobile-admin-nav" aria-label="スマホ管理メニュー">'+
          ''.join('<a'+(current_attrs if href==active else '')+' href="'+href+'">'+label+'</a>' for href,label in entries)+'</nav>').encode('utf-8')
 current=nav(links,' class="active" aria-current="page"')
 prior=nav(links[:3],' class="active"')
 if source.count(current)!=1:raise ValueError('Approved admin mobile nav missing or repeated: '+page)
 original=source.replace(current,prior,1)
 desktop=('        <a href="./health.html">サイト異常</a><a href="./comments.html">コメント管理</a>').encode('utf-8')
 if original.count(desktop)!=1:raise ValueError('Approved desktop comments link missing or repeated: '+page)
 original=original.replace(desktop,('        <a href="./health.html">サイト異常</a>').encode('utf-8'),1)
 restored=hashlib.sha1(b'blob '+str(len(original)).encode()+b'\0'+original).hexdigest()
 if restored!=prior_blob:raise ValueError('Unapproved non-navigation admin change: '+page)
def raw(s,n):return s[n.start:n.end]
def inner(s,n):return s[n.open_end:s.rfind('</'+n.tag,n.start,n.end)]
def end_grid(n):return (n.has('related-grid') or n.has('internal-grid') and n.ancestor(lambda a:a.attrs.get('id') in ['related','related-career'])) and not n.ancestor(lambda a:a.tag=='aside')
def outer_content(s):
 nodes=Parser(s).nodes;ranges=[]
 for n in nodes:
  if n.tag=='header' or n.tag=='aside' or end_grid(n) or n.attrs.get('id')=='articleFeedbackCard':ranges.append((n.start,n.end))
  elif n.tag=='style' and n.attrs.get('data-ui-proposal')=='header':ranges.append((n.start,n.end))
  elif n.tag=='script' and (n.attrs.get('data-ui-proposal')=='header' or n.attrs.get('id')=='dc-toc-data' or n.attrs.get('data-integration-added')=='search' or n.attrs.get('data-site-analytics')=='metricool' or n.attrs.get('src') in ['/assets/js/article-toc-v2.js','/assets/js/article-integration-compat.js']):ranges.append((n.start,n.end))
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
specs={p['path']:p for f in ['pages.json','additional-pages.json','all-pages.json'] if (PKG/'sidebar'/f).exists() for p in json.loads(read(PKG/'sidebar'/f))['pages']}
targets=config.get('targets',config['representatives'])

# Keep the publication copy byte-identical to the reviewed candidate. This
# verifier independently removes only the exact inert component once, when
# both the sitemap and published-shell inventories explicitly allow it.
comment_scope={e.text.strip().removeprefix('https://denkicontrol.com/') for e in ET.parse(ROOT/'sitemap.xml').findall('.//{*}loc') if e.text and re.fullmatch(r'https://denkicontrol\.com/articles/[a-z0-9-]+\.html',e.text.strip())}
comment_registered={p['output'] for p in json.loads(read(ROOT/'.github/site-shells/manifest.json'))['pages']}
comment_offline={p['path'] for p in json.loads(read(ROOT/'assets/data/site-health-unpublished.json'))['unpublished']}
if not comment_scope or comment_scope-comment_registered or comment_scope-set(targets) or comment_scope&comment_offline:
 raise ValueError('Unsafe independent comment scope')
comment_template=read(PKG/'end/comments-intake-off.html')
comment_marker=re.compile(r'data-(?:dc-article-comments-off|article-comments-slot|article-comments-template)|dc-comments-off-(?:title|status)',re.I)
comment_nodes=Parser(comment_template).nodes
comment_allowed_tags={'template','section','input','button','h2','p','label','legend','textarea','fieldset','details','summary'}
comment_allowed_attrs={'class','data-article-comments-template','data-dc-article-comments-off','id','aria-labelledby','aria-describedby','disabled','type','maxlength','rows'}
if (not comment_template.startswith('<template data-article-comments-template>') or not comment_template.endswith('</section></template>\n')
    or sum(n.tag=='fieldset' and 'disabled' in n.attrs for n in comment_nodes)!=1
    or any(n.tag not in comment_allowed_tags or set(n.attrs)-comment_allowed_attrs for n in comment_nodes)
    or any(n.tag in {'input','textarea','button'} and not n.ancestor(lambda a:a.tag=='fieldset' and 'disabled' in a.attrs) for n in comment_nodes)
    or any(n.tag=='button' and n.attrs.get('type')!='button' for n in comment_nodes)):
 raise ValueError('Comment template must remain inert and local')
def strip_checked_comments(page, old, new):
 if comment_marker.search(old):raise ValueError('Unexpected comment component in source: '+page)
 if page not in comment_scope:
  if comment_marker.search(new):raise ValueError('Comment component escaped eligible article scope: '+page)
  return new
 if new.count(comment_template)!=1:raise ValueError('Missing or duplicate exact comment component: '+page)
 i=new.index(comment_template)
 if not re.match(r'<footer\b[^>]*\bclass=["\x27][^"\x27]*\bsite-footer\b',new[i+len(comment_template):],re.I):
  raise ValueError('Unexpected comment component position: '+page)
 clean=new[:i]+new[i+len(comment_template):]
 if comment_marker.search(clean):raise ValueError('Unexpected extra comment component: '+page)
 return clean

for page in targets:
 old=read(ROOT/page);candidate_html=read(build/'candidate'/page);new=strip_checked_comments(page,old,candidate_html);a=Parser(old).nodes;b=Parser(new).nodes;spec=specs[page]
 oldscripts=scripts(old);newscripts=scripts(new)
 asideold=[n for n in a if n.tag=='aside'];asidenew=[n for n in b if n.tag=='aside']
 retained=[raw(old,asideold[0].children[i]) for i in spec['retainedCardOrder']] if asideold else []
 actual=[raw(new,n) for n in asidenew[0].children] if asidenew else []
 row={'path':page,'outsideComponentsEquivalent':outer_content(old)==outer_content(new),'seoExact':seo(old)==seo(new),'bodyAndFooterHrefOrderExact':body_links(old)==body_links(new),'originalScriptsExact':all(x in newscripts for x in oldscripts),'retainedSidebarCardsExact':retained==actual,'sidebarCountPreserved':len(asideold)==len(asidenew),'footerExact':[raw(old,n) for n in a if n.tag=='footer']==[raw(new,n) for n in b if n.tag=='footer'],'feedbackCount':sum(n.attrs.get('id')=='articleFeedbackCard' for n in b),'sourceSha256':digest(old),'candidateSha256':digest(candidate_html)}
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
 if git_blob!=item['gitBlob']:
  # Keep the historical inventory immutable. For articles only, verify that
  # removing one exact footer-only profile link restores the recorded Git blob.
  if not article:
   if page in ('admin/index.html','admin/cases.html'):
    verify_admin_mobile_navigation(page,source_bytes,item['gitBlob'])
   elif page=='contact/index.html':
    html=source_bytes.decode('utf-8')
    if 'id="generalConsultationForm"' not in html or 'contact-confidentiality-notice' not in html or 'id="zip-input"' in html or 'id="consultation-paused-title"' in html:
     raise ValueError('Ordinary contact contract invalid: '+page)
   elif page=='services/gxworks2-online-support.html':
    html=source_bytes.decode('utf-8')
    if '現在更新中です' not in html or 'href="/contact/"' not in html or 'mailto:kds_kurata@hm.aitai.ne.jp' in html or re.search(r'id="(?:generalConsultationForm|consultationForm|zip-input)"',html):
     raise ValueError('Paused service contract invalid: '+page)
   else:raise ValueError('Latest baseline/source mismatch: '+page)
  else:
   html=source_bytes.decode('utf-8')
   en=page.startswith('en/')
   label='About the operator &amp; editorial policy' if en else '運営者・編集方針'
   aria='About this site' if en else 'サイト運営情報'
   nav='<nav class="dc-footer-profile-link" aria-label="'+aria+'"><a href="/profile/">'+label+'</a></nav>'
   footers=re.findall(r'<footer\b[^>]*>[\s\S]*?</footer>',html)
   if len(footers)!=1 or footers[0].count(nav)!=1 or html.count(nav)!=1:
    raise ValueError('Unapproved source change or profile footer link: '+page)
   prior=html.replace(nav,'').encode('utf-8')
   prior_blob=hashlib.sha1(b'blob '+str(len(prior)).encode()+b'\0'+prior).hexdigest()
   if prior_blob!=item['gitBlob']:raise ValueError('Unapproved non-footer source change: '+page)
 if page==service:state='対象外（専用サービス例外・原文保持検査済み）';kind='GX Works2オンライン相談・受付フォーム';strategy='専用構成を保持。記事部品は適用しない'
 elif not article:
  state='対象外'
  if page.startswith('admin/'):kind='管理画面・認証';strategy='記事ではなく管理/ログイン用の専用UIを保持'
  elif page.startswith('ai-editorial-dashboard/'):kind='停止中のAI編集部ダッシュボード';strategy='記事部品を適用せず停止中システムの状態を維持'
  elif '/categories/' in '/'+page:kind='カテゴリ一覧';strategy='一覧のナビゲーション/カードは記事本文用の統合対象外'
  elif 'privacy-policy/' in page:kind='プライバシーポリシー';strategy='法務ページの構造と本文を保持'
  elif page=='profile/index.html':kind='運営者プロフィール・編集方針';strategy='独立した信頼主体ページとして本文と構造化データを保持'
  elif 'contact/' in page:kind='お問い合わせ';strategy='専用フォーム/連絡導線を保持'
  elif page in ['index.html','en/index.html']:kind='トップページ';strategy='記事とは異なるトップの情報構成を保持'
  elif page.startswith('preview/'):kind='既存の別Preview';strategy='公開記事でない別案を今回の統合対象にしない'
  else:kind='共通ヘッダー参照用HTML';strategy='独立した記事ではなく参照断片のため変換しない'
 elif page not in targets:state='未確認（統合・画面未検証）';kind='構造監査のみ・タイプ別適用未確定';strategy='部品を自動適用しない'
 else:
  kind=config.get('typeOverrides',{}).get(page,spec['kind']);exception=any(x in kind for x in ['工具','キャリア','ハブ','設計','右欄なし','トラブル'])
  state='例外として別実装（レビュー適用・画面検査待ち）' if exception else '適用済み（レビューのみ・画面検査待ち）'
  strategy='元の専用構成を保持して部品を適用' if exception else '採用済み共通部品を適用'
 page_nodes=Parser(source_bytes.decode('utf-8')).nodes;heading=next((n for n in page_nodes if n.tag=='h1'),None)
 title=text(inner(source_bytes.decode('utf-8'),heading)) if heading else page
 entry={'path':page,'title':title,'article':article,'state':state,'kind':kind,'strategy':strategy,'productionApplied':False,'gitBlob':item['gitBlob']}
 if article:entry.update(asideCount=coverage[page]['asideCount'],endAdapter=coverage[page]['endAdapter'],knownSelfLinks=coverage[page].get('knownSelfLinks',[]))
 ledger.append(entry)
counts=dict(collections.Counter(r['state'] for r in ledger))
if len(ledger)!=315 or sum(r['article'] for r in ledger)!=292 or sum(counts.values())!=315:raise ValueError('Inventory reconciliation failed')
(build/'coverage-ledger.json').write_text(json.dumps({'sourceCommit':config['mainCommit'],'totalHtml':315,'articles':292,'nonArticles':23,'representatives':len(config['representatives']),'integratedTargets':len(targets),'counts':counts,'pages':ledger},ensure_ascii=False,indent=2),encoding='utf-8')
with (build/'coverage-ledger.csv').open('w',encoding='utf-8-sig',newline='') as f:
 fields=['path','article','state','kind','strategy','productionApplied'];writer=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');writer.writeheader();writer.writerows(ledger)
print(json.dumps({'preservedArticles':len(rows),'serviceByteIdentical':True,'ledgerCounts':counts},ensure_ascii=False))
