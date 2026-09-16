from pathlib import Path
p=Path('articles/encoder-basic.html')
s=p.read_text(encoding='utf-8')
box='''      <section class="mini-toc-card" aria-label="メーカー公式資料">
        <h2>メーカー公式資料を確認して作成しています</h2>
        <p>この記事は、インクリメンタル形・アブソリュート形、出力方式、パルス数などを一般化しすぎないよう、メーカー公式の技術解説を確認して整理しています。実機では、対象形式の電源、分解能、出力回路、最大応答周波数、配線条件を対象製品の公式資料で確認してください。</p>
        <ul>
          <li><a href="https://www.fa.omron.co.jp/product/special/knowledge/re/principle_structure.html" target="_blank" rel="noopener noreferrer">オムロン｜ロータリエンコーダ 原理と構造</a></li>
          <li><a href="https://www.fa.omron.co.jp/product/special/knowledge/re/ratings_characteristic.html" target="_blank" rel="noopener noreferrer">オムロン｜ロータリエンコーダ 定格と特性</a></li>
        </ul>
        <p><strong>公式資料確認日：</strong>2026年9月16日</p>
      </section>\n\n'''
if 'メーカー公式資料を確認して作成しています' not in s:
    i=s.find('<section class="mini-toc-card"')
    if i<0: raise SystemExit('mini toc not found')
    s=s[:i]+box+s[i:]
p.write_text(s,encoding='utf-8')
