import pathlib,json,re,hashlib,datetime
from lxml import html
from urllib.parse import urljoin,urlsplit,unquote
import argparse,sys
if hasattr(sys.stdout,'reconfigure'):sys.stdout.reconfigure(encoding='utf-8')
cli=argparse.ArgumentParser(description='Read-only independent article-ending preservation verifier. Requires lxml.')
cli.add_argument('--oracle',required=True,type=pathlib.Path)
cli.add_argument('--candidate',required=True,type=pathlib.Path)
cli.add_argument('--assets-source',type=pathlib.Path,help='Optional source assets used by the isolated review server')
cli.add_argument('--output',required=True,type=pathlib.Path)
args=cli.parse_args();C=args.candidate.resolve()
def asset_path(path):
 target=C/path
 if target.is_file() or not args.assets_source:return target
 if not str(path).startswith('assets/'):raise ValueError('Only assets may use source fallback')
 base=args.assets_source.resolve();fallback=(base/path).resolve()
 if not fallback.is_relative_to(base):raise ValueError('Asset escapes source')
 return fallback
if args.output.resolve()==args.oracle.resolve() or args.output.resolve().is_relative_to(C):raise SystemExit('Output must not overwrite the oracle or candidate tree')
a=json.loads(args.oracle.read_text(encoding='utf-8'));rows=[];errors=[];total=0;nav=0;votes={'ja':0,'en':0};hashes={}
def has(e,k):return k in e.get('class','').split()
def norm(s):return re.sub(r'\s+','',s or '')
def resolve(p,u):return unquote(urlsplit(urljoin('https://denkicontrol.com/'+p,u)).path).lstrip('/')
def check(ok,p,kind,**details):
 if not ok:errors.append({'path':p,'check':kind,**details})
for page in a['pages']:
 p=page['path'];content=(C/p).read_bytes();hashes[p]=hashlib.sha256(content).hexdigest();t=html.fromstring(content)
 # Explicit UTF-8 parsing avoids libxml inferring a legacy encoding for malformed/head-minified pages.
 t=html.fromstring(content.decode('utf-8'))
 grids=[e for e in t.iter() if isinstance(e.tag,str) and has(e,'article-end-related-grid')];check(len(grids)==1,p,'grid-count',actual=len(grids))
 if len(grids)!=1:continue
 g=grids[0];children=[c for c in g if isinstance(c.tag,str)];check(len(children)==len(page['cards']),p,'all-card-count',expected=len(page['cards']),actual=len(children))
 for old,new in zip(page['cards'],children):
  i=old['index'];check(new.tag=='a',p,'card-tag',index=i);check(new.get('href')==old['href'],p,'href-order',index=i,expected=old['href'],actual=new.get('href'))
  check(norm(new.text_content())==norm(old['text']),p,'text-order',index=i,expected=old['text'],actual=' '.join(new.text_content().split()))
  check({k:v for k,v in new.attrib.items() if k!='class'}=={k:v for k,v in old['attributes'].items() if k!='class'},p,'anchor-attributes',index=i)
  if old['kind']=='navigation':
   nav+=1;check(new.get('class')==old['class'],p,'navigation-class',index=i);check(not new.xpath('.//img'),p,'navigation-image-added',index=i);continue
  total+=1;check(has(new,'article-end-related-card'),p,'compact-class',index=i)
  imgs=new.xpath('.//img');media=[x for x in new.iterdescendants() if isinstance(x.tag,str) and has(x,'article-end-related-media')]
  check(len(imgs)==1 and len(media)==1,p,'image-media-count',index=i,images=len(imgs),media=len(media))
  check(not [x for x in new.iterdescendants() if isinstance(x.tag,str) and (has(x,'related-card-thumb') or has(x,'related-card-media'))],p,'legacy-image-wrapper',index=i)
  if len(imgs)==1:
   im=imgs[0];check(resolve(p,im.get('src'))==old['ogpPath'],p,'target-ogp',index=i,expected=old['ogpPath'],actual=im.get('src'))
   check(im.get('loading')=='lazy',p,'lazy-image',index=i)
   check(im.get('alt')==old['ogpTitle'],p,'target-ogp-alt',index=i)
   check(asset_path(old['ogpPath']).is_file(),p,'ogp-candidate-file',index=i)
  titles=new.xpath('.//h3|.//strong');check([x.tag for x in titles]==old['titleTags'],p,'title-tag-types',index=i);check([norm(x.text_content()) for x in titles]==[norm(html.fromstring(x).text_content()) for x in old['titleHtml']],p,'title-tags-text-order',index=i)
 fs=t.xpath('//*[@id="articleFeedbackCard"]');expected=1 if page['language']=='ja' else 0;votes[page['language']]+=len(fs);check(len(fs)==expected,p,'feedback-count',actual=len(fs),expected=expected)
 block=next((x for x in g.iterancestors() if x.tag=='section' or has(x,'section-card') or has(x,'article-card')),None)
 outside=[{'href':x.get('href'),'text':' '.join(x.text_content().split())} for x in block.xpath('.//a[@href]') if not any(y is g for y in x.iterancestors())] if block is not None else []
 check([{'href':x['href'],'text':norm(x['text'])} for x in outside]==[{'href':x['href'],'text':norm(x['text'])} for x in page['outsideGridArticleLinks']],p,'outside-grid-links')
 if expected and len(fs)==1:
  f=fs[0];check(f.getnext() is block,p,'feedback-immediate-sibling');check(f.getparent() is block.getparent(),p,'feedback-column')
  check(not f.xpath('ancestor::aside'),p,'feedback-outside-aside');check(f.xpath('.//button/@data-feedback-vote')==['helpful','not_helpful'],p,'feedback-votes');check(len(t.xpath('//*[@id="articleFeedbackStatus"]'))==1,p,'feedback-status-unique');check(len(t.xpath('//*[@id="articleFeedbackTitle"]'))==1,p,'feedback-title-unique')
 check(not t.xpath('//body/@data-article-slug'),p,'unexpected-slug-override')
 check(t.xpath('//script[contains(@src,"article-feedback.js")]/@src')==page['feedbackScripts'],p,'explicit-feedback-script-preserved')
 check(t.xpath('//script[contains(@src,"site-search.js") and not(@data-integration-added="search")]/@src')==page['searchScripts'],p,'feedback-loader-preserved')
 added=t.xpath('//script[@data-integration-added="search"]/@src')
 check(added==(['/assets/js/site-search.js'] if p=='articles/fa-engineer-skill-map-career.html' and not page['searchScripts'] else []),p,'explicit-missing-search-loader-exception')
 if expected:check(len(t.xpath('//link[contains(@href,"article-end-feedback.css")]'))==1,p,'feedback-css')
 rows.append({'path':p,'cards':len(children),'feedback':len(fs),'candidateSha256':hashes[p]})
assets={}
for target,expectedHash in a['expectedAssetsSha256Lf'].items():
 raw=asset_path(target).read_text(encoding='utf-8');assets[target]=hashlib.sha256(raw.encode()).hexdigest()==expectedHash;check(assets[target],target,'accepted-asset-content')
expected=a['expectedCounts']
check(len(rows)==expected['pages'],'candidate','total-pages')
check(total==expected['articleCards'],'candidate','total-article-cards')
check(nav==expected['navigationCards'],'candidate','total-navigation-cards')
check(votes==expected['feedback'],'candidate','total-feedback')
actualPaths={p.relative_to(C).as_posix() for folder in ['articles','en/articles'] for p in (C/folder).glob('*.html')}
check(actualPaths=={p['path'] for p in a['pages']},'candidate','article-path-set')
stable=all(hashlib.sha256((C/p).read_bytes()).hexdigest()==h for p,h in hashes.items());check(stable,'candidate','input-stable-during-check')
result={'checkedAtUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'baseline':a['baseline'],'candidate':str(C),'pages':len(rows),'articleCards':total,'navigationCards':nav,'feedback':votes,'acceptedAssetsMatch':assets,'stableInput':stable,'errors':errors,'pageHashes':rows,'scope':'Independent static comparison only; browser/runtime and backend E2E not covered'}
args.output.parent.mkdir(parents=True,exist_ok=True)
args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in result.items() if k!='pageHashes'},ensure_ascii=False,indent=2))

raise SystemExit(1 if errors else 0)
