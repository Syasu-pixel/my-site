"""Lossless hero data extraction from current authored HTML; no generated inputs."""
import argparse, hashlib, json, re, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
PKG=ROOT/'.github/article-components/hero'
sys.path.insert(0,str(ROOT/'.github/article-components/sidebar'))
from html_spans import Parser
def read(p):return p.read_bytes().decode('utf-8')
def sha(s):return hashlib.sha256(s.encode()).hexdigest()
def dump(p,v):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def closing(s,n):return s.rfind('</'+n.tag,n.open_end,n.end)
def whitespace(s):
 if s.strip():raise ValueError('Unclassified content at hero boundary')
 return s
def field(s,n,end):
 close=closing(s,n)
 if close<n.open_end:raise ValueError('Unclosed hero field')
 return {'open':s[n.start:n.open_end],'html':s[n.open_end:close],'close':s[close:n.end],'tail':whitespace(s[n.end:end])}
def extract(s):
 nodes=Parser(s).nodes;heroes=[n for n in nodes if n.has('article-hero')]
 if len(heroes)!=1:raise ValueError('Expected exactly one article hero')
 h=heroes[0]
 if len(h.children)!=1 or not h.children[0].has('article-hero-copy'):raise ValueError('Unsupported hero wrapper')
 c=h.children[0];hclose=closing(s,h);cclose=closing(s,c)
 data={'open':s[h.start:h.open_end],'prefix':whitespace(s[h.open_end:c.start]),'close':s[hclose:h.end],'suffix':whitespace(s[c.end:hclose]),'copyOpen':s[c.start:c.open_end],'copyClose':s[cclose:c.end],'copyPrefix':whitespace(s[c.open_end:c.children[0].start])}
 order=[]
 for i,n in enumerate(c.children):
  key='label' if n.has('hero-label') or n.has('hero-kicker') else 'title' if n.tag=='h1' else 'lead' if n.has('hero-lead') else 'points' if n.has('hero-points') else 'disclosure' if n.has('ad-note') else 'actions' if n.has('hero-actions') else None
  if not key or key in data:raise ValueError('Unknown/duplicate hero field')
  order.append(key);data[key]=field(s,n,c.children[i+1].start if i+1<len(c.children) else cclose)
 if order!=[k for k in ['label','title','lead','points','disclosure','actions'] if k in data] or not all(k in data for k in ['title','lead']):raise ValueError('Unsupported hero field order')
 for k in ['label','points','disclosure','actions']:data.setdefault(k,None)
 return {'raw':s[h.start:h.end],'data':data,'line':s.count('\n',0,h.start)+1}

def rules(s):
 """Return leaf CSS spans without moving surrounding media/cascade context."""
 i=0;start=0
 while i<len(s):
  if s.startswith('/*',i):
   j=s.find('*/',i+2)
   if j<0:raise ValueError('Unclosed CSS comment')
   i=j+2;continue
  if s[i] in ['"',"'"]:
   quote=s[i];i+=1
   while i<len(s):
    if s[i]=='\\':i+=2;continue
    if s[i]==quote:break
    i+=1
  if i<len(s) and s[i]=='{':
   op=i;depth=1;i+=1
   while i<len(s) and depth:
    if s.startswith('/*',i):
     j=s.find('*/',i+2)
     if j<0:raise ValueError('Unclosed CSS comment')
     i=j+2;continue
    if s[i] in ['"',"'"]:
     quote=s[i];i+=1
     while i<len(s):
      if s[i]=='\\':i+=2;continue
      if s[i]==quote:break
      i+=1
    elif s[i]=='{':depth+=1
    elif s[i]=='}':depth-=1
    i+=1
   if depth:raise ValueError('Unbalanced CSS')
   pre=s[start:op];selector=re.sub(r'/\*[\s\S]*?\*/','',pre).strip()
   if selector.startswith('@'):
    for a,b,sel in rules(s[op+1:i-1]):yield op+1+a,op+1+b,sel
   else:yield start,i,selector
   start=i;continue
  i+=1

def css_slots(s,exception=None):
 result=[]
 used_exception=False
 for style in [n for n in Parser(s).nodes if n.tag=='style']:
  raw=s[style.start:style.end];content=s[style.open_end:closing(s,style)];slots=[]
  if exception and sha(raw)==exception['styleSha256']:
   marker=exception['preserveTailFrom']
   if content.count(marker)!=1:raise ValueError('Ambiguous preserved CSS tail')
   content=content[:content.index(marker)];used_exception=True
  for a,b,sel in rules(content):
   # Own only selectors entirely within the hero. Mixed/global declarations stay in place.
   if all('hero' in selector for selector in sel.split(',')):
    slots.append({'start':a+style.open_end-style.start,'end':b+style.open_end-style.start,'raw':content[a:b]})
  if slots:result.append({'raw':raw,'slots':slots})
 if exception and not used_exception:raise ValueError('Preserved CSS exception source changed')
 return result

def plan(initialize=False):
 config=json.loads(read(PKG/'manifest.json'));paths=config['targets']
 if not paths or len(paths)!=len(set(paths)):raise ValueError('Empty or duplicate targets')
 if set(config.get('pageVariants',{}))!=set(paths):raise ValueError('Hero variant coverage differs')
 if not set(config.get('cssExceptions',{})).issubset(paths):raise ValueError('Unregistered CSS exception')
 bindings={} if initialize else json.loads(read(PKG/'css-bindings.json'))
 pages=[]
 for path in paths:
  if not re.fullmatch(r'(en/)?articles/[a-z0-9-]+\.html',path):raise ValueError('Out-of-scope target')
  variant=config.get('pageVariants',{}).get(path)
  if config.get('pageVariants') and variant not in config['variants']:raise ValueError('Unknown hero variant')
  s=read(ROOT/path);hero=extract(s);styles=css_slots(s,config.get('cssExceptions',{}).get(path));expected=[]
  actual='design-series' if 'plc-drilling-line-design-project-' in path else 'en-points' if path.startswith('en/') else 'ja-disclosure' if hero['data']['disclosure'] else 'ja-no-cta' if not hero['data']['actions'] else 'ja-standard'
  if variant!=actual or (variant=='en-points' and not hero['data']['points']):raise ValueError('Hero variant differs from authored structure: '+path)
  for style in styles:
   for slot in style['slots']:
    raw=slot['raw'];urls=[]
    def replace(m):
     urls.append(m.group(0));return '{{ urls['+str(len(urls)-1)+'] | safe }}'
    template=re.sub(r'url\(\s*(?:"[^"]*"|\x27[^\x27]*\x27|[^)]*)\s*\)',replace,raw)
    name='css/'+sha(template)+'.css.njk';item={'sourceSha256':sha(raw),'template':name,'urls':urls}
    expected.append(item)
    if initialize:
     f=PKG/name;f.parent.mkdir(exist_ok=True);f.write_bytes(template.encode())
    slot.update(item);del slot['raw']
  if initialize:bindings[path]=expected
  elif bindings.get(path)!=expected:raise ValueError('Hero CSS source changed; explicitly review/re-import bindings: '+path)
  pages.append({'path':path,'variant':variant,'sourceSha256':sha(s),'hero':hero,'styles':styles})
 if set(bindings)!=set(paths):raise ValueError('CSS binding targets differ')
 if initialize:dump(PKG/'css-bindings.json',bindings)
 return {'version':config['version'],'targets':paths,'pages':pages}
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--initialize-css',action='store_true');ap.add_argument('--out',type=Path,required=True);args=ap.parse_args()
 if args.out.resolve()==ROOT or ROOT in args.out.resolve().parents:raise ValueError('Use separate output tree')
 dump(args.out,plan(args.initialize_css))
