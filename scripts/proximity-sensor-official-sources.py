from pathlib import Path
p=Path('articles/proximity-sensor-basic.html')
s=p.read_text(encoding='utf-8')
box='''      <section class="mini-toc-card" aria-label="メーカー公式資料">
        <h2>メーカー公式資料を確認して作成しています</h2>
        <p>この記事は、近接センサの検出距離・設定距離・検出物体による違いを一般化しすぎないよう、メーカー公式の技術解説を確認して整理しています。実機では、対象形式の定格検出距離、設定距離、検出物体、周囲条件、出力仕様を対象製品の公式資料で確認してください。</p>
        <ul>
          <li><a href="https://www.fa.omron.co.jp/guide/technicalguide/41/318/index.html" target="_blank" rel="noopener noreferrer">オムロン｜近接センサ 用語解説</a></li>
          <li><a href="https://www.fa.omron.co.jp/guide/technicalguide/41/19/" target="_blank" rel="noopener noreferrer">オムロン｜近接センサ 参考資料</a></li>
        </ul>
        <p><strong>公式資料確認日：</strong>2026年9月16日</p>
      </section>\n\n'''
if 'メーカー公式資料を確認して作成しています' not in s:
    i=s.find('<section class="mini-toc-card"')
    if i<0: raise SystemExit('mini toc not found')
    s=s[:i]+box+s[i:]
p.write_text(s,encoding='utf-8')
