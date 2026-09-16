from pathlib import Path

path = Path('articles/air-cylinder-troubleshooting-basic.html')
text = path.read_text(encoding='utf-8')
marker = '    <section class="mini-toc-card"'
if 'メーカー公式資料を確認して作成しています' not in text:
    block = '''    <section class="summary-card" aria-label="メーカー公式資料">
      <h2>メーカー公式資料を確認して作成しています</h2>
      <p>この記事では、SMCの現行エアシリンダ製品情報・技術資料を参照し、初心者向けに要点を整理しています。シリンダはシリーズや口径、ストローク、クッション、オートスイッチ仕様などで条件が変わるため、実機では対象形式の公式資料を優先してください。</p>
      <ul>
        <li><a href="https://www.smcworld.com/webcatalog/ja-jp/air-cylinders/iso-cylinders/C96-C96SD-2" target="_blank" rel="noopener noreferrer">SMC ISOシリンダ C96/C96SD 公式WEBカタログ</a></li>
        <li><a href="https://www.smcworld.com/webcatalog/ja-jp/searchSite/?kw=cq2" target="_blank" rel="noopener noreferrer">SMC エアシリンダ関連製品・CQ2系 公式検索</a></li>
      </ul>
      <p><strong>確認ポイント：</strong>使用圧力範囲、作動方式、許容速度、クッション方式、オートスイッチ適合、取付条件は形式ごとに異なります。安全確認では、設備の停止・残圧・可動部の危険を考慮し、手動操作や可動部への接近は設備手順・メーカー資料・担当者の指示を優先してください。</p>
      <p class="section-intro-line">公式資料確認日：2026年9月16日</p>
    </section>\n\n'''
    if marker not in text:
        raise SystemExit('mini toc marker not found')
    text = text.replace(marker, block + marker, 1)
    path.write_text(text, encoding='utf-8')
