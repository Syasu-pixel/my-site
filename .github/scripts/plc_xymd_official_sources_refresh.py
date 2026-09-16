from pathlib import Path

path = Path('articles/plc-xymd-device-basic.html')
text = path.read_text(encoding='utf-8')

marker = '''    </section>\n\n    <section class="top-summary"'''
box = '''    </section>\n\n    <section class="mini-toc-card" aria-label="メーカー公式資料">\n      <h2>メーカー公式資料を確認して作成しています</h2>\n      <p>\n        本記事は、三菱電機MELSEC iQ-Fの公式マニュアルを確認し、X・Y・M・Dの役割を初心者向けに整理しています。\n        X/Y/M/DはPLC全メーカー共通の呼び方ではなく、デバイス名・範囲・進数表記はシリーズや機種で異なるため、実機では対象CPUの公式マニュアルを優先してください。\n      </p>\n      <ul>\n        <li><a href="https://www.mitsubishielectric.co.jp/fa/download/search.page?kisyu=%2Fplcf&amp;lang=1&amp;listView=1&amp;mode=manual&amp;sort=2" target="_blank" rel="noopener noreferrer">三菱電機 MELSEC iQ-F マニュアル一覧</a> — 「FX5ユーザーズマニュアル（応用編）」JY997D54301、2026年4月改訂</li>\n        <li><a href="https://www.mitsubishielectric.co.jp/fa/products/faspec/download.page?category=ex&amp;formNm=FX5_OPC_FX5-OPC_2&amp;id=spec&amp;kisyu=%2Fplcf" target="_blank" rel="noopener noreferrer">三菱電機 MELSEC iQ-F 公式マニュアルページ</a> — 「FX5プログラミングマニュアル（命令/汎用FUN/汎用FB編）」JY997D54701-AB、2025年10月改訂</li>\n      </ul>\n      <p><small>公式資料確認日：2026年9月16日</small></p>\n    </section>\n\n    <section class="top-summary"'''

if 'メーカー公式資料を確認して作成しています' not in text:
    if marker not in text:
        raise SystemExit('hero/top-summary marker not found')
    text = text.replace(marker, box, 1)

path.write_text(text, encoding='utf-8')
