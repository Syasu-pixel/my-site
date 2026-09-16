from pathlib import Path
p=Path('articles/relay-basic.html')
s=p.read_text(encoding='utf-8')
marker='<section class="mini-toc-card"'
box='''    <section class="mini-toc-card" aria-label="メーカー公式資料">\n      <h2>メーカー公式資料を確認して作成しています</h2>\n      <p>この記事は、一般リレーの構造・接点・コイル仕様を一般化しすぎないよう、メーカー公式の技術解説と仕様一覧を確認して整理しています。実機では、コイル定格、接点構成、接点容量、適用負荷、ソケット仕様を対象形式の公式資料で確認してください。</p>\n      <ul>\n        <li><a href="https://www.fa.omron.co.jp/guide/technicalguide/36/65/" target="_blank" rel="noopener noreferrer">オムロン｜一般リレー 概要・技術解説</a></li>\n        <li><a href="https://www.fa.omron.co.jp/product/selection/36/func_spec.html" target="_blank" rel="noopener noreferrer">オムロン｜一般リレー 機能/仕様一覧</a></li>\n      </ul>\n      <p><strong>公式資料確認日：</strong>2026年9月16日</p>\n    </section>\n\n'''
if 'メーカー公式資料を確認して作成しています' not in s:
    i=s.find(marker)
    if i<0: raise SystemExit('toc marker not found')
    s=s[:i]+box+s[i:]
p.write_text(s,encoding='utf-8')
