# PLC設備設計シリーズ 第4回 参照メモ

- 対象記事: `articles/plc-drilling-line-design-project-04.html`
- テーマ: 加工ステーションのシーケンス
- 作成日: 2026-09-19

## シリーズ内の前提

- 仮想ライン: CV01〜CV04 → 加工エリア → 排出
- ワーク: MCナイロン W100×D60×H20 mm
- 加工: 上面中央へφ8・深さ15 mmの止まり穴
- PLC: MELSEC-F FX3U系を教材上の基準にする
- 第3回まででCV04到着までの搬送条件を整理済み
- 第4回では加工部I/Oと通常シーケンスを整理し、完成ラダー・実機加工条件・復旧操作は扱わない

## 公式一次資料

### 三菱電機
- FX3Uシリーズ ユーザーズマニュアル［ハードウェア編］
  - Ver.AA
  - 文書番号: JY997D16101-AA
  - 改訂: 2024年6月
  - 使用範囲: FX3Uの入出力・ハードウェア仕様、X/Y番地の前提確認
  - 公式検索: https://www.mitsubishielectric.co.jp/fa/download/search.page?kisyu=%2Fplc_fx&mode=manual
- FX3S・FX3G・FX3GC・FX3U・FX3UCシリーズ プログラミングマニュアル［基本・応用命令解説編］
  - Ver.V
  - 文書番号: JY997D11701-V
  - 改訂: 2021年4月
  - 使用範囲: 後工程で内部リレーM、タイマT、命令へ落とす際の一次資料
  - 公式検索: https://www.mitsubishielectric.co.jp/fa/download/search.page?kisyu=%2Fplc_fx&mode=manual

## 設計上の注意

- 本記事のX11〜X17、Y15〜Y20は仮想ラインを説明するための仮割付。
- 実機のCPU点数、増設I/O、電磁弁方式、主軸制御、加工条件を断定しない。
- 非常停止、ガード、危険源の除去等の安全機能は通常PLCシーケンスと分離し、実機では別途適切な安全設計・リスクアセスメントが必要。
- 第4回では安全回路の具体配線や実機調整手順は扱わない。
