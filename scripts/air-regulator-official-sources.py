from pathlib import Path
p=Path('articles/air-regulator-basic.html')
s=p.read_text(encoding='utf-8')
marker='<section class="mini-toc-card"'
box='''    <section class="mini-toc-card" aria-label="メーカー公式資料">\n      <h2>メーカー公式資料を確認して作成しています</h2>\n      <p>この記事は、エアレギュレータの役割や設定圧力を一般化しすぎないよう、SMCの現行WEBカタログを確認して整理しています。実機では、設定圧力範囲、使用流体、流量特性、リリーフ方式、取付方向、圧力計・オプション仕様を対象形式の公式資料で確認してください。</p>\n      <ul>\n        <li><a href="https://www.smcworld.com/webcatalog/ja-jp/series/AR-D" target="_blank" rel="noopener noreferrer">SMC｜レギュレータ AR-D WEBカタログ</a></li>\n        <li><a href="https://www.smcworld.com/webcatalog/ja-jp/pressure-control-equipment/regulators/?view=list" target="_blank" rel="noopener noreferrer">SMC｜レギュレータ 製品一覧・取扱説明書</a></li>\n      </ul>\n      <p><strong>公式資料確認日：</strong>2026年9月16日</p>\n    </section>\n\n'''
if 'メーカー公式資料を確認して作成しています' not in s:
    i=s.find(marker)
    if i<0: raise SystemExit('toc marker not found')
    s=s[:i]+box+s[i:]
p.write_text(s,encoding='utf-8')
