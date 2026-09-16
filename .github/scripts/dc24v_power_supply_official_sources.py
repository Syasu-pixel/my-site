from pathlib import Path

path = Path('articles/dc24v-power-supply-basic.html')
text = path.read_text(encoding='utf-8')

marker = '''    </section>\n\n    <section class="top-summary"'''
box = '''    </section>\n\n    <section class="mini-toc-card" aria-label="メーカー公式資料">\n      <h2>メーカー公式資料を確認して作成しています</h2>\n      <p>\n        本記事は、オムロンの産業用スイッチング・パワーサプライ公式仕様・安全上の注意を確認し、DC24V電源の基本を初心者向けに整理しています。\n        入力電圧、出力容量、端子仕様、保護機能、取付条件は製品ごとに異なるため、実機では対象形式の仕様書・取扱説明書を優先してください。\n      </p>\n      <ul>\n        <li><a href="https://www.fa.omron.co.jp/products/family/3178/specification/" target="_blank" rel="noopener noreferrer">オムロン S8VK-G 定格・性能</a> — DC24Vを含む出力電圧、容量、入力条件などの公式仕様</li>\n        <li><a href="https://www.fa.omron.co.jp/products/family/3178/preuse/" target="_blank" rel="noopener noreferrer">オムロン S8VK-G ご使用の前に</a> — 配線・接地・放熱などの安全上の要点</li>\n      </ul>\n      <p><small>公式資料確認日：2026年9月16日</small></p>\n    </section>\n\n    <section class="top-summary"'''

if 'メーカー公式資料を確認して作成しています' not in text:
    if marker not in text:
        raise SystemExit('hero/top-summary marker not found')
    text = text.replace(marker, box, 1)

path.write_text(text, encoding='utf-8')
