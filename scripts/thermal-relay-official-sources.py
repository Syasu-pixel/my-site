from pathlib import Path
p=Path('articles/thermal-relay-basic.html')
s=p.read_text(encoding='utf-8')
marker='<section class="mini-toc-card"'
box='''    <section class="mini-toc-card" aria-label="メーカー公式資料">\n      <h2>メーカー公式資料を確認して作成しています</h2>\n      <p>この記事は、サーマルリレーの役割や種類を一般化しすぎないよう、三菱電機の現行製品情報とカタログを確認して整理しています。実機では、ヒータ呼び、過負荷・欠相保護の有無、動作特性、リセット方式、適用する電磁接触器との組合せを対象形式の公式資料で確認してください。</p>\n      <ul>\n        <li><a href="https://www.mitsubishielectric.co.jp/fa/products/lvd/lvsw/pmerit/thr/" target="_blank" rel="noopener noreferrer">三菱電機｜サーマルリレー 製品特長</a></li>\n        <li><a href="https://www.mitsubishielectric.co.jp/fa/products/lvd/lvsw/pmerit/thr/lineup.html" target="_blank" rel="noopener noreferrer">三菱電機｜サーマルリレー 形式一覧</a></li>\n      </ul>\n      <p><strong>公式資料確認日：</strong>2026年9月16日</p>\n    </section>\n\n'''
if 'メーカー公式資料を確認して作成しています' not in s:
    i=s.find(marker)
    if i<0: raise SystemExit('toc marker not found')
    s=s[:i]+box+s[i:]
p.write_text(s,encoding='utf-8')
