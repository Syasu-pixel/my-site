from pathlib import Path

path = Path('articles/limit-switch-troubleshooting-basic.html')
text = path.read_text(encoding='utf-8')
if 'official-source-box' not in text:
    css='''\n    .official-source-box{margin:18px 0 22px;padding:18px 20px;border:1px solid #bfdbfe;border-radius:20px;background:linear-gradient(180deg,#eff6ff 0%,#f8fbff 100%);box-shadow:0 8px 20px rgba(15,23,42,.04)}\n    .official-source-box h2{margin:0 0 8px;font-size:17px;line-height:1.5;color:#1d4ed8}.official-source-box p{margin:0 0 8px;font-size:13px;line-height:1.75;color:#334155}.official-source-box ul{margin:8px 0 0;padding-left:20px}.official-source-box li{margin:6px 0;font-size:13px;line-height:1.7}.official-source-box small{display:block;margin-top:8px;color:#64748b;font-size:12px}\n'''
    text=text.replace('</style>',css+'</style>',1)
    box='''\n    <section class="official-source-box" aria-label="メーカー公式資料">
      <h2>メーカー公式資料を確認して作成しています</h2>
      <p>リミットスイッチの位置検出・接点動作・安全用途の説明は、オムロンの技術解説とD4Nセーフティ・リミットスイッチ資料を参照して整理しています。通常の位置検出用スイッチと安全用途のセーフティスイッチは同じ扱いにしないことが重要です。</p>
      <ul>
        <li><a href="https://www.fa.omron.co.jp/guide/technicalguide/30/41/" target="_blank" rel="noopener noreferrer">オムロン リミットスイッチ 概要・技術解説</a></li>
        <li><a href="https://www.fa.omron.co.jp/products/family/1497/download/manuals/" target="_blank" rel="noopener noreferrer">オムロン D4N 小形セーフティ・リミットスイッチ マニュアル一覧</a></li>
        <li><a href="https://www.fa.omron.co.jp/product/selection/31/func_spec.html" target="_blank" rel="noopener noreferrer">オムロン セーフティリミットスイッチ 機能／仕様一覧</a> — D4Nなどの直接開路動作付き機種を確認</li>
      </ul>
      <small>公式資料確認日：2026年9月16日。安全機能に使われるスイッチは、対象形式の安全規格・直接開路動作・取付条件を必ず公式資料で確認してください。</small>
    </section>\n'''
    anchor='<section class="top-summary"'
    i=text.find(anchor)
    if i==-1: raise SystemExit('top-summary anchor not found')
    text=text[:i]+box+text[i:]
    path.write_text(text,encoding='utf-8')
