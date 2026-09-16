from pathlib import Path
p=Path('articles/photoelectric-sensor-basic.html')
s=p.read_text(encoding='utf-8')
box='''      <section class="mini-toc-card" aria-label="メーカー公式資料">
        <h2>メーカー公式資料を確認して作成しています</h2>
        <p>この記事は、透過形・回帰反射形・拡散反射形などの違いや検出距離を一般化しすぎないよう、メーカー公式の技術解説を確認して整理しています。実機では、対象形式の検出方式、検出距離、光源、応答時間、出力仕様、設置条件を対象製品の公式資料で確認してください。</p>
        <ul>
          <li><a href="https://www.fa.omron.co.jp/guide/technicalguide/43/2/" target="_blank" rel="noopener noreferrer">オムロン｜光電センサ 概要</a></li>
          <li><a href="https://www.fa.omron.co.jp/guide/technicalguide/43/5/" target="_blank" rel="noopener noreferrer">オムロン｜光電センサ 参考資料</a></li>
        </ul>
        <p><strong>公式資料確認日：</strong>2026年9月16日</p>
      </section>\n\n'''
if 'メーカー公式資料を確認して作成しています' not in s:
    i=s.find('<section class="mini-toc-card"')
    if i<0: raise SystemExit('mini toc not found')
    s=s[:i]+box+s[i:]
p.write_text(s,encoding='utf-8')
