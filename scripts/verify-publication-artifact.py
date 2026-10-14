"""Verify the standalone Pages copy before/after its existing image optimization."""
import argparse,collections,hashlib,json,re,sys
from pathlib import Path
from urllib.parse import urljoin,urlsplit,unquote
from lxml import html

ap=argparse.ArgumentParser();ap.add_argument('mode',choices=['snapshot','verify']);ap.add_argument('site',type=Path);ap.add_argument('build',type=Path);args=ap.parse_args()
site=args.site.resolve();build=args.build.resolve();state=build/'publication-before-optimization.json'
extensions={'.html','.css','.js','.json','.xml'}
def sha(b):return hashlib.sha256(b).hexdigest()
def refs(path,text):
 base='https://denkicontrol.com/'+path;values=[]
 if path.endswith('.html'):
  doc=html.fromstring(text);bases=doc.xpath('//base/@href')
  if bases:base=urljoin(base,bases[0])
  for e in doc.iter():
   if e.tag in ('img','script','source','iframe') and e.get('src'):values.append(e.get('src'))
   if e.tag=='link' and e.get('rel') in ('stylesheet','icon','preload','apple-touch-icon') and e.get('href'):values.append(e.get('href'))
   if e.tag=='meta' and e.get('property') in ('og:image','og:image:secure_url') and e.get('content'):values.append(e.get('content'))
   if e.tag in ('img','source') and e.get('srcset') and not e.get('srcset').startswith('data:'):values.extend(v.strip().split()[0] for v in e.get('srcset').split(',') if v.strip())
 if path.endswith(('.html','.css')):values.extend(re.findall(r'url\(["\']?([^\)"\']+)',text))
 for value in values:
  u=urlsplit(urljoin(base,value.strip()))
  if u.scheme in ('http','https') and u.netloc in ('denkicontrol.com','www.denkicontrol.com'):
   target=unquote(u.path).lstrip('/')
   if not target or target.endswith('/'):target+='index.html'
   yield target
def missing(files):
 return sorted({(path,target) for path,text in files.items() if path.endswith(('.html','.css')) for target in refs(path,text) if not (site/target).is_file()})
if args.mode=='snapshot':
 files={}
 for p in site.rglob('*'):
  if p.is_file() and p.suffix.lower() in extensions:
   try:files[p.relative_to(site).as_posix()]=p.read_bytes().decode('utf-8')
   except UnicodeDecodeError:pass
 groups=collections.defaultdict(list)
 for p in (site/'assets/images').rglob('*'):
  if p.is_file() and p.suffix.lower() in ('.png','.jpg','.jpeg'):groups[p.with_suffix('.webp').relative_to(site).as_posix()].append(p.relative_to(site).as_posix())
 collisions={k:sorted(v) for k,v in groups.items() if len(v)>1};keep=sorted(p for v in collisions.values() for p in v)
 data={'files':files,'existingMissingResources':missing(files),'preservedCollisionSources':{p:sha((site/p).read_bytes()) for p in keep},'collisions':collisions,'feedbackSha256':sha((site/'assets/js/article-feedback.js').read_bytes())}
 state.write_text(json.dumps(data,ensure_ascii=False),encoding='utf-8')
 (build/'image-collision-plan.json').write_text(json.dumps({'keepOriginals':keep,'collisions':collisions},indent=2),encoding='utf-8')
 # find uses the relative _site prefix in the production workflow.
 (build/'image-collision-skip.txt').write_text(''.join((args.site/ p).as_posix()+'\n' for p in keep),encoding='utf-8')
 print(json.dumps({'snapshotFiles':len(files),'existingMissingResources':len(data['existingMissingResources']),'preservedImageCollisions':collisions}));sys.exit(0)
before=json.loads(state.read_text(encoding='utf-8'));mapping=json.loads((build/'published-image-mapping.json').read_text(encoding='utf-8'));errors=[]
current_paths={p.relative_to(site).as_posix() for p in site.rglob('*') if p.is_file() and p.suffix.lower() in extensions}
if current_paths!=set(before['files']):errors.append('Published text inventory changed: '+str(sorted(current_paths^set(before['files']))))
def rewrite(text):
 for old,new in mapping.items():text=text.replace('/'+old,'/'+new).replace(old,new)
 return text
for old,new in mapping.items():
 if not old.startswith('assets/images/') or not new.startswith('assets/images/') or '..' in Path(new).parts:errors.append('Unsafe image mapping: '+old)
 if not (site/new).is_file() or not (site/new).stat().st_size:errors.append('Missing optimized image: '+new)
for path,expected in before['preservedCollisionSources'].items():
 if path in mapping or not (site/path).is_file() or sha((site/path).read_bytes())!=expected:errors.append('Image collision source changed: '+path)
after={}
for path,original in before['files'].items():
 p=site/path
 if not p.is_file():errors.append('Published text file missing: '+path);continue
 normal=original.replace('\r\n','\n').replace('\r','\n');converted=rewrite(normal);expected=converted if converted!=normal else original
 actual=p.read_bytes().decode('utf-8');after[path]=actual
 if actual!=expected:errors.append('Change beyond permitted image mapping: '+path)
old_missing={(p,rewrite(t)) for p,t in before['existingMissingResources']};new_missing=set(missing(after))-old_missing
errors += ['Missing standalone resource: '+p+' -> '+t for p,t in sorted(new_missing)]
feedback_unchanged=sha((site/'assets/js/article-feedback.js').read_bytes())==before['feedbackSha256']
if not feedback_unchanged:errors.append('Published feedback script changed')
for folder in ['.github','candidate','review','headers','regeneration-fixture-v2','publication-fixture']:
 if (site/folder).exists():errors.append('Internal build directory published: '+folder)
manifest_path=site/'site-build-manifest.json';manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
service_preservation='approved header/footer applied; all other source bytes preserved before optimization; image URL mapping only after optimization' if 'services/gxworks2-online-support.html' in manifest.get('additionalShellPages',[]) else 'byte-identical before optimization; image URL mapping only after optimization'
report={'status':'failed' if errors else 'passed','textFilesCompared':len(before['files']),'allowedChanges':'existing image URL mapping only','mappedImages':len(mapping),'preservedImageCollisions':before['collisions'],'newMissingResources':len(new_missing),'existingMissingResources':before['existingMissingResources'],'servicePreservation':service_preservation,'feedbackScriptUnchanged':feedback_unchanged,'errors':errors,'sourceFallbackUsed':False}
(build/'publication-final-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False));
if errors:sys.exit(1)
manifest['finalArtifactChecks']={k:v for k,v in report.items() if k not in ('existingMissingResources','errors')};manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
