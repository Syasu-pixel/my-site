"""Structural catalog checks only; never certifies reading or understanding."""
import argparse,collections,json,posixpath,re,subprocess,sys
from pathlib import Path
from urllib.parse import unquote,urlsplit

CATALOG='docs/rules/catalog.json'
INDEX='docs/rules/index.md'
LABELS={'mandatory':'開始時必須','conditional':'条件付き','reference':'履歴・参考'}

def tracked(root, tree_list=None):
    if tree_list:
        data=json.loads(Path(tree_list).read_text(encoding='utf-8'))
        return {x['path'] if isinstance(x,dict) else x for x in data}
    return set(subprocess.check_output(['git','ls-files','-z'],cwd=root).decode().split('\0'))-{''}

def references(text):
    """Markdown links/reference definitions and standalone code file paths.
    Complex prose paths/globs/templates are emitted separately for human review.
    """
    refs=[]
    # Fenced code is examples, not navigable Markdown links.
    prose=re.sub(r'^```[^\n]*\n.*?^```\s*$', '', text, flags=re.M|re.S)
    for m in re.finditer(r'\]\(<?([^\s)>]+)>?(?:\s+["\'][^\n]*?["\'])?\)',prose):
        refs.append((m.group(1),'link'))
    for m in re.finditer(r'^\s*\[[^\]]+\]:\s*<?([^\s>]+)',prose,re.M):
        refs.append((m.group(1),'link'))
    for m in re.finditer(r'`([^`\n]+)`',text):
        s=m.group(1)
        if re.match(r'^[./\w-]+\.(?:md|mdx|json|ya?ml|toml|mjs|js|py|html|png|webp|svg|jpg|sql|ts)(?:#[^\s]+)?$',s):
            refs.append((s,'code'))
        elif re.match(r'^(?:docs|assets|scripts|supabase|\.github)/',s) and ('*' in s or '{' in s or s.endswith('/')):
            refs.append((s,'manual'))
    return sorted(set(refs))

def resolve(source,raw,kind,files):
    u=urlsplit(raw)
    if u.scheme or u.netloc:return None,'external'
    path=unquote(u.path)
    if not path:return source,'local'
    relative=posixpath.normpath(posixpath.join(posixpath.dirname(source),path))
    if path.startswith('/'):return path.lstrip('/'),'local'
    if kind=='link':return relative,'local'
    if path in files:return path,'local'
    if path.startswith(('docs/','assets/','scripts/','supabase/','.github/','articles/','en/','categories/')):return path,'local'
    if relative in files:return relative,'local'
    # Bare code filenames are shorthand, never reinterpret Markdown links.
    if '/' not in path:
        matches=[p for p in files if posixpath.basename(p)==path]
        if len(matches)==1:return matches[0],'shorthand'
        if len(matches)>1:return None,'ambiguous'
    return relative,'local'

def render_index(catalog):
    lines=['# ルール・参照対象の正式一覧','','この一覧は catalog.json から生成する。読む順序と完了条件は [確認の入口](README.md)。登録は読了・理解・採用・稼働の証明ではない。','']
    for category,label in LABELS.items():
        lines+=['## '+label,'','| 文書 | 適用条件・扱い |','|---|---|']
        for e in catalog['documents']:
            if e['category']==category:
                url=posixpath.relpath(e['path'],'docs/rules')
                lines.append(f"| [{e['path']}]({url}) — {e['title'].replace('|',' / ')} | {e['when'].replace('|',' / ')} |")
        lines.append('')
    lines+=['## 実装・設定の参照先','','本文内の具体的なローカル参照は検査レポートにも列挙する。この表は主要な制御・検査・公開設定の入口。','', '| ファイル | 適用条件・扱い |','|---|---|']
    for e in catalog['supporting']:
        lines.append(f"| [{e['path']}]({posixpath.relpath(e['path'],'docs/rules')}) | {e['when']} {e['role']} |")
    lines+=['','## 省略表記の参照先','','catalog.json の reference_aliases に、文脈を確認した省略表記と実在パスを個別記録する。Markdownリンクのリンク先を書き換える機能ではない。','']
    for e in catalog.get('reference_aliases',[]):
        lines.append(f"- `{e['source']}` の `{e['raw']}` → `{e['target']}`：{e['reason']}")
    lines+=['','## 解決していない参照・例示の記録','','catalog.json の reference_exceptions に参照元・元表記・理由を個別登録する。例外は参照先が実在することを意味しない。作業に必要なら未取得として扱う。','']
    for e in catalog['reference_exceptions']:
        lines.append(f"- `{e['source']}` → `{e['raw']}`：{e['reason']}")
    return '\n'.join(lines)+'\n'

def check(root,files,catalog):
    errors=[]; refs=[]; manual=[]; external=[]; exceptions=[]
    entries=catalog.get('documents',[]); docs=[x['path'] for x in entries]
    actual={p for p in files if p.lower().endswith(('.md','.mdx'))}
    errors += ['unregistered document: '+p for p in sorted(actual-set(docs))]
    errors += ['missing document: '+p for p in sorted(set(docs)-actual)]
    for p,n in collections.Counter(docs).items():
        if n!=1:errors.append('duplicate document: '+p)
    for e in entries:
        if e.get('category') not in LABELS or not e.get('when','').strip() or not e.get('title','').strip():errors.append('invalid classification: '+e['path'])
    supports=catalog.get('supporting',[])
    for e in supports:
        if e['path'] not in files:errors.append('missing supporting file: '+e['path'])
        if not e.get('when') or not e.get('role'):errors.append('missing supporting condition: '+e['path'])
    if len({e['path'] for e in supports})!=len(supports):errors.append('duplicate supporting file')
    required_controls={p for p in files if p.startswith('.github/workflows/') or p in ('netlify.toml','package.json') or (p.startswith(('scripts/','supabase/','.github/')) and re.search(r'(rule|guard|check|audit|gate|policy|prompt|validat)',p,re.I) and not p.lower().endswith(('.md','.mdx')))}
    errors+=['unregistered control file: '+p for p in sorted(required_controls-{e['path'] for e in supports})]
    known={(e['source'],e['raw']):e for e in catalog.get('reference_exceptions',[])}
    if len(known)!=len(catalog.get('reference_exceptions',[])):errors.append('duplicate reference exception')
    aliases={(e['source'],e['raw']):e for e in catalog.get('reference_aliases',[])}
    if len(aliases)!=len(catalog.get('reference_aliases',[])):errors.append('duplicate reference alias')
    used=set();used_aliases=set()
    for source in sorted(actual):
        p=root/source
        if not p.is_file():errors.append('unavailable content: '+source);continue
        if source==INDEX:continue # Generated mirror: original documents are checked below.
        for raw,kind in references(p.read_text(encoding='utf-8')):
            item={'source':source,'raw':raw,'kind':kind}
            if kind=='manual':manual.append(item);continue
            target,status=resolve(source,raw,kind,files)
            if kind=='code' and (source,raw) in aliases:
                e=aliases[(source,raw)];used_aliases.add((source,raw));target=e['target'];status='registered-shorthand'
                if not e.get('reason') or target not in files:errors.append('invalid reference alias: '+source+' -> '+raw)
            item.update(target=target,status=status)
            if status=='external':external.append(item);continue
            # Anchors deliberately remain human checks: generated/custom IDs differ by renderer.
            if '#' in raw:manual.append(dict(item,reason='fragment/anchor needs rendered-target confirmation'))
            if target not in files:
                key=(source,raw)
                if key in known:
                    used.add(key);e=known[key]
                    if not e.get('reason') or e.get('type') not in ('example','historical','unavailable','ambiguous'):errors.append('invalid exception: '+str(key))
                    exceptions.append(dict(item,reason=e.get('reason'),exceptionType=e.get('type')))
                else:errors.append('broken/ambiguous reference: '+source+' -> '+raw)
            refs.append(item)
    errors+=['stale reference exception: '+s+' -> '+r for s,r in sorted(set(known)-used)]
    errors+=['stale reference alias: '+s+' -> '+r for s,r in sorted(set(aliases)-used_aliases)]
    return dict(structuralPass=not errors,semanticReadingVerified=False,documents=len(docs),categories=dict(collections.Counter(e['category'] for e in entries)),supporting=len(supports),errors=errors,localReferences=refs,manualReferences=manual,externalReferences=external,knownExceptions=exceptions)

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',default='.');ap.add_argument('--tree-list');ap.add_argument('--write-index',action='store_true');ap.add_argument('--report');a=ap.parse_args()
    root=Path(a.root).resolve();catalog=json.loads((root/CATALOG).read_text(encoding='utf-8'));files=tracked(root,a.tree_list)
    result=check(root,files,catalog);generated=render_index(catalog)
    if a.write_index:(root/INDEX).write_text(generated,encoding='utf-8')
    elif not (root/INDEX).exists() or (root/INDEX).read_text(encoding='utf-8')!=generated:result['errors'].append('generated index is stale; run with --write-index')
    result['structuralPass']=not result['errors']
    if a.report:
        out=Path(a.report);out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k not in ('localReferences','manualReferences','externalReferences','knownExceptions')},ensure_ascii=False))
    print('Structural checks only. Reading, applicability, external access, anchors and semantic conflicts need recorded review.')
    return 0 if result['structuralPass'] else 1

if __name__=='__main__':sys.exit(main())
