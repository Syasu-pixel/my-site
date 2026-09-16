from pathlib import Path
p=Path('articles/solenoid-valve-troubleshooting-basic.html')
s=p.read_text(encoding='utf-8')
marker='<section class="mini-toc-card"'
box='''    <section class="mini-toc-card" aria-label="メーカー公式資料">\n      <h2>メーカー公式資料を確認して作成しています</h2>\n      <p>この記事は、電磁弁トラブルを電気側と空圧側に分けて考えるための一般的な整理として、メーカー公式の製品情報を確認して構成しています。実機では、対象形式のコイル定格、ポート構成、使用圧力範囲、流量特性、配線・表示仕様、取付条件を対象製品の公式資料で確認してください。</p>\n      <ul>\n        <li><a href="https://www.smcworld.com/webcatalog/ja-jp/search3S/?kw=SY" target="_blank" rel="noopener noreferrer">SMC｜SYシリーズ ソレノイドバルブ公式検索</a></li>\n        <li><a href="https://www.smcworld.com/webcatalog/ja-jp/searchSite/?kw=SY7000" target="_blank" rel="noopener noreferrer">SMC｜SYシリーズ WEBカタログ検索</a></li>\n      </ul>\n      <p><strong>公式資料確認日：</strong>2026年9月16日</p>\n      <p><strong>安全上の注意：</strong>手動操作や機能確認は、設備が意図せず動く可能性があるため、設備側の安全手順・メーカー資料・担当者の指示を優先してください。</p>\n    </section>\n\n'''
if 'メーカー公式資料を確認して作成しています' not in s:
    i=s.find(marker)
    if i<0:
        raise SystemExit('toc marker not found')
    s=s[:i]+box+s[i:]
p.write_text(s,encoding='utf-8')
