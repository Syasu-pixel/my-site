"""Compare navigable links, fragments and resource existence without changing them."""
import json,re,sys,collections
from pathlib import Path
from urllib.parse import urljoin,urlsplit,unquote
ROOT=Path(__file__).resolve().parent.parent;PKG=ROOT/'.github/article-components'
sys.path.insert(0,str(PKG/'sidebar'));from html_spans import Parser
build=Path(sys.argv[1] if len(sys.argv)>1 else '../integration-build').resolve()
config=json.loads((PKG/'integration.json').read_text(encoding='utf-8'));targets=config.get('targets',config['representatives'])
inventory=json.loads((PKG/'site-inventory.json').read_text(encoding='utf-8'))['files'];html_paths={e['path'] for e in inventory}
cache={}
def document(path,after):
 key=(path,after)
 if key not in cache:
  p=build/'candidate'/path if after and (build/'candidate'/path).is_file() else ROOT/path
  s=p.read_bytes().decode('utf-8');nodes=Parser(s).nodes
  ids=[n.attrs['id'] for n in nodes if n.attrs.get('id')];ids += [n.attrs['name'] for n in nodes if n.tag=='a' and n.attrs.get('name')]
  cache[key]=(s,nodes,set(ids),{k:v for k,v in collections.Counter(ids).items() if v>1})
 return cache[key]
def resolve(page,value,base):
 u=urlsplit(urljoin(base,value))
 if u.scheme not in ('http','https') or u.netloc not in ('denkicontrol.com','www.denkicontrol.com'):return None
 path=unquote(u.path).lstrip('/')
 if not path or path.endswith('/'):path+='index.html'
 return path,unquote(u.fragment)
def inspect(page,after):
 s,nodes,ids,duplicates=document(page,after);issues=[];counts=collections.Counter();base='https://denkicontrol.com/'+page
 base_tag=next((n.attrs.get('href') for n in nodes if n.tag=='base' and n.attrs.get('href')),None)
 if base_tag:base=urljoin(base,base_tag)
 references=[]
 for n in nodes:
  if n.tag=='a' and n.attrs.get('href'):references.append(('link',n.attrs['href']))
  if n.tag in ('img','script','iframe','source') and n.attrs.get('src'):references.append(('resource',n.attrs['src']))
  if n.tag=='link' and n.attrs.get('rel') in ('stylesheet','icon','preload','apple-touch-icon') and n.attrs.get('href'):references.append(('resource',n.attrs['href']))
  if n.tag in ('img','source') and n.attrs.get('srcset') and not n.attrs['srcset'].startswith('data:'):
   references += [('resource',v.strip().split()[0]) for v in n.attrs['srcset'].split(',') if v.strip()]
 for value in re.findall(r'url\(["\']?([^\)"\']+)',s):references.append(('resource',value.strip()))
 for kind,value in references:
  resolved=resolve(page,value,base)
  if resolved is None:counts['externalOrNonHttp']+=1;continue
  target,fragment=resolved;counts[kind]+=1
  exists=(after and (build/'candidate'/target).is_file()) or (ROOT/target).is_file()
  if not exists:issues.append({'kind':kind,'raw':value,'target':target,'reason':'missing-file'});continue
  if kind=='link' and fragment and target in html_paths:
   counts['fragment']+=1
   if fragment not in document(target,after)[2]:issues.append({'kind':kind,'raw':value,'target':target+'#'+fragment,'reason':'missing-fragment'})
 return {'path':page,'counts':dict(counts),'issues':issues,'duplicateIds':duplicates}
rows=[];introduced=[];existing=[];resolved=[]
for page in targets:
 before=inspect(page,False);after=inspect(page,True)
 key=lambda e:(e['kind'],e['raw'],e['target'],e['reason'])
 old={key(e) for e in before['issues']};new={key(e) for e in after['issues']}
 added=[dict(path=page,**e) for e in after['issues'] if key(e) not in old]
 introduced+=added;existing += [dict(path=page,**e) for e in after['issues'] if key(e) in old]
 resolved += [dict(path=page,**e) for e in before['issues'] if key(e) not in new]
 new_duplicates={k:v for k,v in after['duplicateIds'].items() if v>before['duplicateIds'].get(k,1)}
 if new_duplicates:introduced.append({'path':page,'kind':'id','reason':'new-duplicate-id','values':new_duplicates})
 rows.append({'path':page,'before':before['counts'],'after':after['counts'],'newIssues':len(added),'existingIssues':len(new&old),'originalDuplicateIds':before['duplicateIds'],'newDuplicateIds':new_duplicates})
report={'checkedArticles':len(rows),'introduced':introduced,'existing':existing,'resolvedByComponentReplacement':resolved,'pages':rows,'externalLinksFetched':False,'notes':'Existing source issues are recorded, not silently repaired. Dynamic JS-created fragment targets need browser confirmation.'}
(build/'link-resource-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'articles':len(rows),'introduced':len(introduced),'existing':len(existing),'resolved':len(resolved)},ensure_ascii=False))
if introduced:sys.exit(1)
