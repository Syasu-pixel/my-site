# 現場知識｜技術ブログ更新チェック対象リスト

作成日：2026-11-07 ／ 管理先：Syasu-pixel/my-site

## 役割と適用範囲

このリストは、記事刷新に有用な技術ブログ・経験談の更新を継続的に把握するための**更新チェック対象の正本**。調査成果と証拠の詳細は [現場知識調査台帳](field-knowledge-research-2026-11-07.md)、記事への採否基準は [記事編集手順](../article-editing-playbook.md) に従う。

**登録は監視の設定ではない。** 定期確認の実行は、別途作成するChatGPTタスクまたはGitHub Actions等の稼働確認が必要。毎回のチェックは公開RSS/Atomまたは通常の公開ページ・検索結果を使い、利用規約、robots、API制限を遵守する。ログイン・制限回避・大量スクレイピングは行わない。

## チェック対象

「重点」は週次確認の初期対象、「通常」は週次または隔週、「候補」は情報源として保持するが初回の通知対象にはしない。投稿の存在を確認できない場合は「取得不可」と記録し、更新なしと断定しない。

| ID | 優先 | サイト・著者 | 主な分野 | 更新確認先 | 過去の調査 | 留保 |
|---|---|---|---|---|---|---|
| BW-001 | 重点 | [ある電機屋のメモ帳](https://elec-tech.info/) | PLC・インバータ・故障日記 | https://elec-tech.info/category/nakaden-dairy/ | PB-001, PB-026, FK10 | 個人の修理談は普遍的手順ではない |
| BW-002 | 重点 | [mono-tec / Zenn](https://zenn.dev/mono_tec) | PLC保守・ラダー・変更管理 | https://zenn.dev/mono_tec | PB-022〜025 | メーカー固有の操作・保持データ条件は公式照合 |
| BW-003 | 重点 | [電工君](https://denkoukun.hatenablog.com/) | 電気工事・工具・圧着 | https://denkoukun.hatenablog.com/ | FK10-001/002 | 端子・工具の適合と個人の好みを区別 |
| BW-004 | 重点 | [Ele-Lab](https://ele-lab.blog/) | 制御盤・センサ・計装 | https://ele-lab.blog/ | FK10-010〜012 | 型式・規格・数値の一律断定を警戒 |
| BW-005 | 重点 | [一歩ログ](https://www.ippolog.com/) | PLC・設備立上げ・故障解析 | https://www.ippolog.com/ | PB-011〜013 | 実務事例・教材上の例と実測を区別 |
| BW-006 | 通常 | [保全マンログ](https://hozen-log.com/) | 空圧・センサ・モータ | https://hozen-log.com/ | PB-017〜019 | 未検証の原因割合・操作は採用しない |
| BW-007 | 通常 | [メカトロラボ](https://mechatro-labo.com/) | PLC教育・設備現場 | https://mechatro-labo.com/ | PB-006 | 個人経験談をメーカー標準へ一般化しない |
| BW-008 | 通常 | [電気の仕事](https://denki-shigoto.com/) | 電気工事・工具・現場呼称 | https://denki-shigoto.com/ | PB-008 | 公式仕様・法令は一次資料で別確認 |
| BW-009 | 通常 | [ヒライ商事](https://www.hirai-machine.com/) | コンベヤ・包装機械の修理 | https://www.hirai-machine.com/ | FK11-001/005 | 企業による施工事例。結果の再現性は未確認 |
| BW-010 | 通常 | [ムラタ社長ブログ](https://murata5011.hatenablog.com/) | 搬送・ロール・機械整備 | https://murata5011.hatenablog.com/ | FK11-003/011/012 | 製品・機種固有条件と宣伝を分離 |
| BW-011 | 通常 | [OKゆういち](https://60you1.com/) | 軸受・潤滑・搬送 | https://60you1.com/ | FK11-002 | 体験風の記載と未検証数値に注意 |
| BW-012 | 通常 | [Brendan Casey / HydraulicSupermarket](https://www.hydraulicsupermarket.com/blog/) | 油圧保全・故障原因 | https://www.hydraulicsupermarket.com/blog/ | FK10-013/014 | 著者の診断と第三者実証を区別 |
| BW-013 | 通常 | [ACC Automation](https://accautomation.ca/) | PLC入出力・制御教育 | https://accautomation.ca/ | FK10-007/008 | 製品ごとの定格は公式仕様表で確認 |
| BW-014 | 候補 | [Machinery Lubrication](https://www.machinerylubrication.com/) | 軸受・潤滑の署名記事 | https://www.machinerylubrication.com/ | FK11-007/008 | 専門媒体であり個人ブログとは別。取得制約に注意 |
| BW-015 | 候補 | [note｜設備保全の蟻](https://note.com/factory_everyday) | 設備保全・断続故障 | https://note.com/factory_everyday | PB-003/009 | 記事ごとに公開範囲・再取得可否を確認 |
| BW-016 | 候補 | [PLCtalk](https://www.plctalk.net/forums/) | PLC技術者フォーラム | https://www.plctalk.net/forums/ | FK11-009 | フォーラム全体の新着は広範。個別話題のみ |
 
## 更新検知・記録の仕様

1. サイト名、URL、監視対象のページ/フィード、最終チェック日、取得方法、直近既知の記事IDまたはURLを保持する。**現時点で未確認のRSS/Atom URLは作らない。** フィード有無を別途検証し、見つからなければ公開サイトのアーカイブを使う。
2. 新しい記事の公開または既存の技術記事の意味のある更新を確認する。記事に表示される日付、取得時刻、同じ記事の再掲・URL変更を区別する。古い記事が検索上位に再表示されただけなら新規扱いにしない。
3. 既存の [現場知識調査台帳](field-knowledge-research-2026-11-07.md) のURL・IDと重複照合する。新規技術知識に該当しない更新、広告、販売告知は通知しない。
4. 意味のある更新を確認した場合のみ、**記事タイトル・URL・投稿日/更新日・変更点の独自要約・分野・証拠属性・一次資料照合要否・対象slug案**を報告する。原典未取得ならそれを明示。記事本文の長文・画像は転載しない。
5. 確認した新記事に自動でAを付けず、まずB（追加検証）に置く。公式資料照合と記事内容確認の後にA/B/Cを記録。ユーザーの明示した許可なしに記事本文や本番サイトを変更しない。
6. 初回は**既知の最終確認基準日2026-11-07**をベースラインとして保存し、継続実行時に取得できた記事URLと既存台帳を比較する。ベースライン以前の古い記事を新着として通知しない。
7. チェック失敗・robots制限・404・RSS不在などは「未確認」とし、更新なしと誤報しない。サイトが閉鎖・名称変更した際はURLの移行先を検証してから更新する。
8. 自動監視タスクは発見の通知を行うものとし、GitHubへの書き込みと記事への採用は別の明示依頼・検証を要する。通知の有無や実行頻度はタスク自体の状態で確認する。

## ステータス記録

- 初期登録日：2026-11-07
- 初期登録数：重点5、通常8、候補3。既存調査済みから選定したもので、すべてのブログでRSSや直近更新を実査したことを意味しない。
- 自動監視の稼働：未設定（GitHubでの保存だけでは監視は動かない）
- 初回クロール・フィード検証：未実施
- 最終確認基準日：2026-11-07（過去調査の実施日であり各サイトの最新記事確認日とは限らない）
- 将来の更新ログは記事ID/URLで重複除外し、確認日と結果を日付別に追記する。
