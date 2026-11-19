#!/usr/bin/env python3
from pathlib import Path
import json,re,html
root=Path(__file__).resolve().parents[1]
site=(root/'sitemap.xml').read_text(encoding='utf-8')
urls=re.findall(r'<loc>https://denkicontrol\.com/(articles/[^<]+\.html)</loc>',site)
items=[]
for rel in urls:
 p=root/rel
 if not p.exists(): continue
 text=p.read_text(encoding='utf-8',errors='replace')
 title_m=re.search(r'<title>(.*?)</title>',text,re.I|re.S)
 title=html.unescape(re.sub(r'<[^>]+>','',title_m.group(1)).strip()) if title_m else p.stem
 desc_m=re.search(r'<meta\s+content="([^"]*)"\s+name="description"',text,re.I)
 canonical_m=re.search(r'<link\s+href="([^"]+)"\s+rel="canonical"',text,re.I)
 items.append({"slug":p.stem,"title":title,"url":canonical_m.group(1) if canonical_m else "https://denkicontrol.com/"+rel,"description":html.unescape(desc_m.group(1)) if desc_m else ""})
out=root/'assets/data/admin-articles.json';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps({"generated_from":"sitemap.xml","count":len(items),"articles":items},ensure_ascii=False,indent=2)+"\n",encoding='utf-8')
print(f"wrote {len(items)} articles")
