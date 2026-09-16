from pathlib import Path
p=Path('articles/electromagnetic-contactor-vs-switch.html')
s=p.read_text(encoding='utf-8')
marker='<section class="mini-toc-card"'
box='''    <section class="mini-toc-card" aria-label="メーカー公式資料">\n      <h2>メーカー公式資料を確認して作成しています</h2>\n      <p>この記事は、電磁接触器と電磁開閉器の違いを一般化しすぎないよう、三菱電機の現行MS-Tシリーズ資料を確認して整理しています。実機では、コイル電圧、主接点定格、補助接点、適用モータ容量、サーマルリレーとの組合せを対象形式の公式資料で確認してください。</p>\n      <ul>\n        <li><a href="https://www.mitsubishielectric.co.jp/fa/products/faspec/download.page?category=ex&formNm=CONTACTOR_S-T10_4389&id=spec&kisyu=%2Flvsw&sub=manual" target="_blank" rel="noopener noreferrer">三菱電機｜S-T10 マニュアル・取扱要項</a></li>\n        <li><a href="https://www.mitsubishielectric.co.jp/fa/download/search.page?category1=&category2=&category3=&kisyu=%2Flvsw&kisyuid=&lang=1&listView=1&mode=manual&preview=&q=&sort=0" target="_blank" rel="noopener noreferrer">三菱電機｜低圧開閉器 マニュアル一覧</a></li>\n      </ul>\n      <p><strong>公式資料確認日：</strong>2026年9月16日</p>\n    </section>\n\n'''
if 'メーカー公式資料を確認して作成しています' not in s:
    i=s.find(marker)
    if i<0: raise SystemExit('toc marker not found')
    s=s[:i]+box+s[i:]
p.write_text(s,encoding='utf-8')
