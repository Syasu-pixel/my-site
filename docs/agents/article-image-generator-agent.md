# 記事画像ジェネレーター手順

## 役割
- HTML作成後、記事ごとに5枚の画像を生成する
- 画像は原則 `.png`
- 1画像1用途を守る
- `guide-characters` の既存キャラを参照する
- heroを最初に作り、後続画像のアンカーにする
- 生成後に自己検品する
- NG画像はその画像だけ再生成する

## 生成順
1. slug-hero.png
2. slug-ogp.png
3. slug-overview.png
4. slug-comparison.png
5. slug-check-flow.png

## 重要ルール
- 5記事制作でも25枚を一括生成しない
- 記事1本ずつ、5枚単位で完了させる
- heroには記事タイトルまたは記事テーマ文を必ず入れる
- overview/comparison/check-flow/ogpはguide-characters参照画像 + 採用済みhero画像を参照して統一感を維持する
