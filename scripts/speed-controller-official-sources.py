from pathlib import Path
p=Path('articles/speed-controller-basic.html')
s=p.read_text(encoding='utf-8')
marker='    <section class="mini-toc-card" aria-label="記事内メニュー">'
box='''    <section class="mini-toc-card" aria-label="メーカー公式資料">\n      <h2>メーカー公式資料を確認して作成しています</h2>\n      <p>この記事は、スピードコントローラの構造やメータイン・メータアウトの考え方を一般化しすぎないよう、メーカー公式の製品情報を確認して整理しています。実機では、対象形式の流量特性、接続口径、適用チューブ、使用圧力範囲、取付方向などを対象製品の公式資料で確認してください。</p>\n      <ul>\n        <li><a href="https://www.smcworld.com/webcatalog/s3s/ja-jp/list/AS" target="_blank" rel="noopener noreferrer">SMC｜AS Series スピードコントローラ 製品情報</a></li>\n        <li><a href="https://www.smcworld.com/webcatalog/ja-jp/seriesList/?id=AS-T" target="_blank" rel="noopener noreferrer">SMC｜低速制御用スピードコントローラ AS</a></li>\n      </ul>\n      <p><strong>公式資料確認日：</strong>2026年9月16日</p>\n    </section>\n\n'''
if 'メーカー公式資料を確認して作成しています' not in s:
    if marker not in s:
        raise SystemExit('toc marker not found')
    s=s.replace(marker,box+marker,1)
p.write_text(s,encoding='utf-8')
