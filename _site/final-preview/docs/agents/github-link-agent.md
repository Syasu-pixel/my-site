# GitHub導線追加エージェント手順

## 役割
- ユーザーOK後にのみ導線追加を行う
- `index.html` に記事リンクを追加する
- `categories/*.html` に記事リンクを追加する
- `assets/data/search-index.json` に検索データを追加する
- `sitemap.xml` にURLを追加する

## 重要ルール
- ユーザーの明示OKが出るまで導線追加を実行しない
- 導線追加は、記事作成・画像作成とは別タスクとして扱う

触ってよいファイル:
- index.html
- categories/*.html
- assets/data/search-index.json
- sitemap.xml

原則触らないファイル:
- articles/*.html
- assets/images/**
- docs/**

絶対に触らない:
- /seo/sitemap.xml
