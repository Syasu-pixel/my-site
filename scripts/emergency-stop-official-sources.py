from pathlib import Path

path = Path('articles/emergency-stop-switch-basic.html')
text = path.read_text(encoding='utf-8')
if 'official-source-box' not in text:
    css='''\n    .official-source-box{margin:18px 0 22px;padding:18px 20px;border:1px solid #bfdbfe;border-radius:20px;background:linear-gradient(180deg,#eff6ff 0%,#f8fbff 100%);box-shadow:0 8px 20px rgba(15,23,42,.04)}\n    .official-source-box h2{margin:0 0 8px;font-size:17px;line-height:1.5;color:#1d4ed8}.official-source-box p{margin:0 0 8px;font-size:13px;line-height:1.75;color:#334155}.official-source-box ul{margin:8px 0 0;padding-left:20px}.official-source-box li{margin:6px 0;font-size:13px;line-height:1.7}.official-source-box small{display:block;margin-top:8px;color:#64748b;font-size:12px}\n'''
    text=text.replace('</style>',css+'</style>',1)
    box='''\n    <section class="official-source-box" aria-label="メーカー公式資料">
      <h2>メーカー公式資料を確認して作成しています</h2>
      <p>非常停止は、押しボタン単体だけでなく安全回路全体として成立させる必要があります。この記事ではオムロンの非常停止用押ボタンスイッチ資料と安全機器解説を参照し、NC接点・直接開路動作・リセットの考え方を整理しています。</p>
      <ul>
        <li><a href="https://www.fa.omron.co.jp/product/selection/60/func_spec.html" target="_blank" rel="noopener noreferrer">オムロン 非常停止用押ボタンスイッチ 機能／仕様一覧</a> — A165E、A22E／A22NE-Pの接点構成・認証規格</li>
        <li><a href="https://www.fa.omron.co.jp/products/family/1111/download/manuals/" target="_blank" rel="noopener noreferrer">オムロン A22NE-PD／A22NE-P／A22E マニュアル一覧</a></li>
        <li><a href="https://www.fa.omron.co.jp/product/special/safetynavi/tips/safety_principle_11/" target="_blank" rel="noopener noreferrer">オムロン 直接開路動作機構と強制ガイド機構の違い</a></li>
      </ul>
      <small>公式資料確認日：2026年9月16日。安全回路の設計・変更では、対象機器の規格適合情報、リスクアセスメント、メーカー資料、設備の安全手順を優先してください。</small>
    </section>\n'''
    anchor='<section class="top-summary"'
    i=text.find(anchor)
    if i==-1: raise SystemExit('top-summary anchor not found')
    text=text[:i]+box+text[i:]
    path.write_text(text,encoding='utf-8')
