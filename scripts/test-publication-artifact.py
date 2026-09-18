"""Exercise the publication boundary with small isolated filesystem fixtures."""
import json,shutil,subprocess,sys,tempfile
from pathlib import Path
script=Path(__file__).with_name('verify-publication-artifact.py')
with tempfile.TemporaryDirectory(prefix='publication-contract-') as tmp:
 root=Path(tmp);site=root/'site';build=root/'build';build.mkdir();(site/'assets/images').mkdir(parents=True);(site/'assets/js').mkdir(parents=True)
 (site/'index.html').write_text('<html><head><link rel="icon" href="assets/images/a.png"></head><body><img src="assets/images/collision.png"><img src="assets/images/collision.jpg"></body></html>',encoding='utf-8')
 for name in ['a.png','collision.png','collision.jpg']:(site/'assets/images'/name).write_bytes(name.encode())
 (site/'assets/js/article-feedback.js').write_text('original feedback',encoding='utf-8');(site/'site-build-manifest.json').write_text('{}',encoding='utf-8')
 def run(mode):return subprocess.run([sys.executable,str(script),mode,str(site),str(build)],capture_output=True,text=True)
 assert run('snapshot').returncode==0
 plan=json.loads((build/'image-collision-plan.json').read_text());assert len(plan['keepOriginals'])==2
 mapping={'assets/images/a.png':'assets/images/a.webp'};(build/'published-image-mapping.json').write_text(json.dumps(mapping));(site/'assets/images/a.webp').write_bytes(b'fixture-webp');(site/'assets/images/a.png').unlink()
 p=site/'index.html';p.write_text(p.read_text().replace('assets/images/a.png','assets/images/a.webp'))
 assert run('verify').returncode==0
 # Reset the final manifest: the successful verification deliberately adds its report.
 (site/'site-build-manifest.json').write_text('{}')
 good=p.read_text();p.write_text(good.replace('<body>','<body>unexpected text'));assert run('verify').returncode!=0;p.write_text(good)
 image=site/'assets/images/a.webp';image.unlink();assert run('verify').returncode!=0;image.write_bytes(b'fixture-webp')
 vote=site/'assets/js/article-feedback.js';vote.write_text('changed');assert run('verify').returncode!=0;vote.write_text('original feedback')
 (site/'assets/images/collision.png').write_bytes(b'changed');assert run('verify').returncode!=0
print('Publication artifact contracts: 6 passed (mapping, collision preservation, content mutation, missing optimized image, vote mutation, collision mutation)')
