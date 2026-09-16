from pathlib import Path
p=Path('articles/pressure-switch-basic.html')
s=p.read_text(encoding='utf-8')
marker='<section class="mini-toc-card"'
box='''      <section class="mini-toc-card" aria-label="メーカー公式資料">
        <h2>メーカー公式資料を確認して作成しています</h2>
        <p>この記事は、圧力スイッチの設定値や出力動作を一般化しすぎないよう、メーカー公式の製品情報・取扱説明書を確認して整理しています。実機では、対象形式の定格圧力範囲、設定圧力範囲、出力仕様、配線、エラー表示を必ず対象製品の公式資料で確認してください。</p>
        <ul>
          <li><a href="https://www.smcworld.com/webcatalog/ja-jp/series/ZSE30A%28F%29-ISE30A" target="_blank" rel="noopener noreferrer">SMC｜ZSE30A(F)/ISE30A WEBカタログ</a></li>
          <li><a href="https://www.smcworld.com/upfiles/manual/ja-jp/files/PSxx-OML0002.pdf" target="_blank" rel="noopener noreferrer">SMC｜ZSE30A(F)/ISE30A デジタル圧力スイッチ 取扱説明書</a></li>
        </ul>
        <p><strong>公式資料確認日：</strong>2026年9月16日</p>
      </section>\n\n'''
if 'メーカー公式資料を確認して作成しています' not in s:
    pos=s.find(marker)
    if pos < 0:
        raise SystemExit('mini toc marker not found')
    line_start=s.rfind('\n',0,pos)+1
    s=s[:line_start]+box+s[line_start:]
p.write_text(s,encoding='utf-8')
