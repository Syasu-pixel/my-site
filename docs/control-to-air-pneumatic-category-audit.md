# control-basics / air-pneumatic カテゴリ重複 棚卸しレポート

## 1. 調査対象ファイル

- `categories/control-basics.html`
- `categories/air-pneumatic.html`

> 本レポートは **棚卸しのみ** を目的とし、HTML変更は実施していません。

---

## 2. `control-basics.html` 内の空圧・エア機器関連カード一覧（抽出結果）

以下は、制御カテゴリ内に掲載されている記事カードのうち、空圧・エア機器文脈に該当する記事です。

- `air-pneumatic-troubleshooting-guide.html`
- `air-cylinder-troubleshooting-basic.html`
- `solenoid-valve-troubleshooting-basic.html`
- `air-cylinder-basic.html`
- `air-valve-basic.html`
- `air-regulator-basic.html`
- `air-filter-regulator-lubricator-basic.html`
- `speed-controller-basic.html`
- `pneumatic-silencer-basic.html`
- `air-tube-fitting-basic.html`
- `pressure-gauge-basic.html`
- `pressure-switch-basic.html`
- `reed-switch-basic.html`
- `input-output-basic.html`
- `plc-input-troubleshooting-basic.html`
- `plc-output-troubleshooting-basic.html`

---

## 3. `air-pneumatic.html` 内の空圧系カード一覧（抽出結果）

- `air-pneumatic-troubleshooting-guide.html`
- `air-cylinder-troubleshooting-basic.html`
- `solenoid-valve-troubleshooting-basic.html`
- `air-cylinder-basic.html`
- `air-valve-basic.html`
- `air-regulator-basic.html`
- `air-filter-regulator-lubricator-basic.html`
- `speed-controller-basic.html`
- `pneumatic-silencer-basic.html`
- `air-tube-fitting-basic.html`
- `pressure-gauge-basic.html`
- `pressure-switch-basic.html`
- `reed-switch-basic.html`
- `input-output-basic.html`
- `plc-input-troubleshooting-basic.html`
- `plc-output-troubleshooting-basic.html`

---

## 4. 重複している記事一覧（control-basics と air-pneumatic の両方に掲載）

今回抽出した空圧関連カードは、上記16件すべてが両カテゴリに重複掲載されていることを確認しました。

1. `air-pneumatic-troubleshooting-guide.html`
2. `air-cylinder-troubleshooting-basic.html`
3. `solenoid-valve-troubleshooting-basic.html`
4. `air-cylinder-basic.html`
5. `air-valve-basic.html`
6. `air-regulator-basic.html`
7. `air-filter-regulator-lubricator-basic.html`
8. `speed-controller-basic.html`
9. `pneumatic-silencer-basic.html`
10. `air-tube-fitting-basic.html`
11. `pressure-gauge-basic.html`
12. `pressure-switch-basic.html`
13. `reed-switch-basic.html`
14. `input-output-basic.html`
15. `plc-input-troubleshooting-basic.html`
16. `plc-output-troubleshooting-basic.html`

---

## 5. 分類表（残す / 寄せる / 両方OK）

以下は、依頼内容の「想定分類たたき台」をベースに、カテゴリ意図（制御信号中心 / 空圧部品中心 / 橋渡し）へ揃えた整理です。

### 分類A: 制御カテゴリにも残す

| 記事 | 判定理由 |
|---|---|
| `input-output-basic.html` | PLCのI/O方向、信号の流れの理解が主題で、制御カテゴリの中核。 |
| `plc-input-troubleshooting-basic.html` | 入力信号不成立の切り分けは制御診断の基礎。 |
| `plc-output-troubleshooting-basic.html` | 出力信号不成立の切り分けは制御診断の基礎。 |
| `reed-switch-basic.html` | 空圧機器付帯でも「位置検出信号」記事として制御文脈が強い。 |
| `pressure-switch-basic.html` | 圧力の有無を電気信号化するため、制御文脈が強い。 |
| `solenoid-valve-troubleshooting-basic.html` | コイル駆動・PLC出力・手動操作の跨ぎがあり、制御側での導線価値が高い。 |

### 分類B: 空圧カテゴリ中心に寄せる

| 記事 | 判定理由 |
|---|---|
| `air-cylinder-basic.html` | 空圧アクチュエータ単体の基本説明が主。 |
| `air-valve-basic.html` | 空気流路切替部品の基礎が主。 |
| `air-regulator-basic.html` | 圧力調整部品の基礎が主。 |
| `speed-controller-basic.html` | 空圧速度調整部品の基礎が主。 |
| `pneumatic-silencer-basic.html` | 排気・消音部品の基礎が主。 |
| `air-tube-fitting-basic.html` | 空圧配管部品の基礎が主。 |
| `air-filter-regulator-lubricator-basic.html` | 空圧品質管理ユニットの基礎が主。 |
| `pressure-gauge-basic.html` | 圧力の可視化計器として空圧運用文脈が主。 |

### 分類C: 両方に残してもよい橋渡し記事

| 記事 | 判定理由 |
|---|---|
| `air-pneumatic-troubleshooting-guide.html` | 空圧系全体の一次切り分け導線として両カテゴリ入口に適合。 |
| `air-cylinder-troubleshooting-basic.html` | 機械側/空圧側/信号側の切り分けを跨ぐ。 |
| `solenoid-valve-troubleshooting-basic.html` | 電気駆動と空圧作動の境界記事。 |
| `reed-switch-basic.html` | 空圧機器の位置検出とPLC入力の接点。 |
| `pressure-switch-basic.html` | 圧力状態とPLC信号の接点。 |

> 注: `solenoid-valve-troubleshooting-basic.html`、`reed-switch-basic.html`、`pressure-switch-basic.html` は、分類A（制御カテゴリに残す）と分類C（両方OK）の双方に意味があり、実運用では「制御カテゴリに残したうえで空圧カテゴリにも残す」扱いが妥当。

---

## 6. 次に実行する場合の安全なPR分割案

### Step 1
制御カテゴリに「空圧・エア機器へ」導線があることを確認し、空圧単体部品カードの削除候補（分類B）を確定する。

### Step 2
制御カテゴリから、分類Bの空圧単体部品カードを削除する。

### Step 3
分類Cの橋渡し記事は、制御カテゴリ側では数を絞って残す（重複の意図が説明できる最小構成へ）。

### Step 4
空圧カテゴリ側で不足している記事カードがあれば追加し、空圧カテゴリ内で自己完結しやすい導線を補強する。

---

## 7. このレポートの結論（実装前判断）

- 現状、空圧関連16記事が `control-basics` と `air-pneumatic` に重複掲載されている。
- 情報設計上は、**分類Bを制御カテゴリから段階的に整理**し、**分類A/Cを制御カテゴリの主軸として残す**構成が自然。
- ただし今回は棚卸しのみとし、HTML改修・カード削除・検索インデックス更新・サイトマップ更新は行わない。
