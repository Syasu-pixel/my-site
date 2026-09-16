from pathlib import Path

path = Path('articles/dc24v-common-basic.html')
text = path.read_text(encoding='utf-8')
marker = 'official-source-box'
if marker not in text:
    css = '''\n    .official-source-box{margin:18px 0 22px;padding:18px 20px;border:1px solid #bfdbfe;border-radius:20px;background:linear-gradient(180deg,#eff6ff 0%,#f8fbff 100%);box-shadow:0 8px 20px rgba(15,23,42,.04)}\n    .official-source-box h2{margin:0 0 8px;font-size:17px;line-height:1.5;color:#1d4ed8}\n    .official-source-box p{margin:0 0 8px;font-size:13px;line-height:1.75;color:#334155}\n    .official-source-box ul{margin:8px 0 0;padding-left:20px}\n    .official-source-box li{margin:6px 0;font-size:13px;line-height:1.7}\n    .official-source-box small{display:block;margin-top:8px;color:#64748b;font-size:12px}\n'''
    text = text.replace('</style>', css + '</style>', 1)
    box = '''\n    <section class="official-source-box" aria-label="メーカー公式資料">
      <h2>メーカー公式資料を確認して作成しています</h2>
      <p>この記事のDC24V入力・COM・シンク／ソースの説明は、三菱電機MELSEC iQ-Fの現行ハードウェア資料を参照して整理しています。実機ではCPU・I/Oユニットの形式ごとに端子仕様が異なるため、対象機種の公式資料を優先してください。</p>
      <ul>
        <li><a href="https://www.mitsubishielectric.co.jp/fa/download/search.page?kisyu=%2Fplcf&lang=9&mode=manual" target="_blank" rel="noopener noreferrer">三菱電機 MELSEC iQ-F マニュアル一覧</a> — FX5S/FX5UJ/FX5U/FX5UCユーザーズマニュアル（ハードウェア編）</li>
        <li><a href="https://www.mitsubishielectric.co.jp/fa/products/faspec/download.page?category=ex&formNm=FX5-_M-E-_FX5U-64MR%2FES_30&id=spec&kisyu=%2Fplcf" target="_blank" rel="noopener noreferrer">三菱電機 FX5U-64MR/ES 公式マニュアルページ</a> — CPUユニットのハードウェア資料</li>
      </ul>
      <small>公式資料確認日：2026年9月16日。ハードウェア編の現行一覧では2026年4月改訂版が公開されています。</small>
    </section>\n'''
    anchor = '<section class="top-summary"'
    i = text.find(anchor)
    if i == -1:
        raise SystemExit('top-summary anchor not found')
    text = text[:i] + box + text[i:]
    path.write_text(text, encoding='utf-8')
