from pathlib import Path

path = Path('articles/no-nc-basic.html')
text = path.read_text(encoding='utf-8')
if 'official-source-box' not in text:
    css='''\n    .official-source-box{margin:18px 0 22px;padding:18px 20px;border:1px solid #bfdbfe;border-radius:20px;background:linear-gradient(180deg,#eff6ff 0%,#f8fbff 100%);box-shadow:0 8px 20px rgba(15,23,42,.04)}\n    .official-source-box h2{margin:0 0 8px;font-size:17px;line-height:1.5;color:#1d4ed8}.official-source-box p{margin:0 0 8px;font-size:13px;line-height:1.75;color:#334155}.official-source-box ul{margin:8px 0 0;padding-left:20px}.official-source-box li{margin:6px 0;font-size:13px;line-height:1.7}.official-source-box small{display:block;margin-top:8px;color:#64748b;font-size:12px}\n'''
    text=text.replace('</style>',css+'</style>',1)
    box='''\n    <section class="official-source-box" aria-label="メーカー公式資料">
      <h2>メーカー公式資料を確認して作成しています</h2>
      <p>NO／NCは「通常状態」を基準に接点が開いているか閉じているかを表す考え方です。この記事ではオムロンのスイッチ技術解説を参照し、接点の呼び方と動作状態を整理しています。</p>
      <ul>
        <li><a href="https://www.fa.omron.co.jp/guide/technicalguide/29/38/index.html" target="_blank" rel="noopener noreferrer">オムロン マイクロスイッチ 技術解説</a> — NC側からNO側へ接点が切り替わる基本動作を確認</li>
        <li><a href="https://www.fa.omron.co.jp/guide/technicalguide/30/41/" target="_blank" rel="noopener noreferrer">オムロン リミットスイッチ 概要</a> — 接点を使う代表的な位置検出スイッチの構造・原理</li>
      </ul>
      <small>公式資料確認日：2026年9月16日。端子番号・接点構成は製品ごとに異なるため、実機では対象形式の取扱説明書・仕様書を優先してください。</small>
    </section>\n'''
    anchor='<section class="top-summary"'
    i=text.find(anchor)
    if i==-1: raise SystemExit('top-summary anchor not found')
    text=text[:i]+box+text[i:]
    path.write_text(text,encoding='utf-8')
