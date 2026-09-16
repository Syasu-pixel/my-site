from pathlib import Path

path = Path('articles/plc-io-unit-basic.html')
text = path.read_text(encoding='utf-8')

marker = '''    </section>\n\n    <section class="top-summary"'''
box = '''    </section>\n\n    <section class="mini-toc-card" aria-label="メーカー公式資料">\n      <h2>メーカー公式資料を確認して作成しています</h2>\n      <p>\n        本記事は、三菱電機の現行MELSEC iQ-F資料を確認し、PLCの入力・出力・COMの考え方を初心者向けに整理しています。\n        X/Yなどのデバイス表記や端子仕様はメーカー・シリーズ・機種で異なるため、実機では必ず対象機種の公式マニュアルを優先してください。\n      </p>\n      <ul>\n        <li><a href="https://www.mitsubishielectric.co.jp/fa/download/search.page?kisyu=%2Fplcf&amp;lang=1&amp;listView=1&amp;mode=manual&amp;sort=2" target="_blank" rel="noopener noreferrer">三菱電機 MELSEC iQ-F マニュアル一覧</a> — 「FX5S/FX5UJ/FX5U/FX5UCユーザーズマニュアル（ハードウェア編）」SH-082451-P、2026年4月改訂</li>\n        <li><a href="https://www.mitsubishielectric.co.jp/fa/products/faspec/download.page?category=ex&amp;formNm=FX5_INOUT_FX5-16ER%2FES_22&amp;id=spec&amp;kisyu=%2Fplcf" target="_blank" rel="noopener noreferrer">三菱電機 FX5-16ER/ES 公式マニュアルページ</a> — 入出力ユニットの対象機種ページ</li>\n      </ul>\n      <p><small>公式資料確認日：2026年9月16日</small></p>\n    </section>\n\n    <section class="top-summary"'''

if 'メーカー公式資料を確認して作成しています' not in text:
    if marker not in text:
        raise SystemExit('hero/top-summary marker not found')
    text = text.replace(marker, box, 1)

path.write_text(text, encoding='utf-8')
