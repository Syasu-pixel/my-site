from pathlib import Path
p=Path('articles/sensor-2wire-3wire-basic.html')
s=p.read_text(encoding='utf-8')
marker='      <section class="mini-toc-card" aria-label="目次">'
box='''      <section class="mini-toc-card" aria-label="メーカー公式資料">
        <h2>メーカー公式資料を確認して作成しています</h2>
        <p>この記事は、センサーの2線式・3線式の違いを一般化しすぎないよう、メーカー公式の技術解説と現行製品情報を確認して整理しています。実機では、対象形式の配線図・出力方式・漏れ電流・負荷条件を対象製品の公式資料で確認してください。</p>
        <ul>
          <li><a href="https://www.fa.omron.co.jp/guide/technicalguide/5.html" target="_blank" rel="noopener noreferrer">オムロン｜センサ 技術解説</a></li>
          <li><a href="https://www.fa.omron.co.jp/products/family/3790/lineup/" target="_blank" rel="noopener noreferrer">オムロン｜E2E NEXT 形式/種類（直流2線式・直流3線式）</a></li>
        </ul>
        <p><strong>公式資料確認日：</strong>2026年9月16日</p>
      </section>\n\n'''
if 'メーカー公式資料を確認して作成しています' not in s:
    if marker not in s:
        raise SystemExit('toc marker not found')
    s=s.replace(marker,box+marker,1)
p.write_text(s,encoding='utf-8')
