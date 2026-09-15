# 01 Drilling Line — GX Works2 Batch E 移行差分

Status: Draft / FX3U + GX Works2 教材・シミュレーション移行用

## 1. 対象

Batch E = Section 12 TIMEOUT_FAULT + Section 13 WARNING_BUZZER。

既存のGX Works3設計を論理正本として保持し、FX3U / GX Works2で再確認が必要な差分だけを整理する。

## 2. そのまま流用する論理

以下はGX Works2版でも基本方針を変更しない。

- タイマは工程を進めるためではなく、指令に対する期待FB未成立を監視するために使う。
- 搬送T1～T4 timeout：M701～M704。
- ST01～ST05 timeout / 端矛盾：M711～M715。
- CY01～CY05 timeout / 端矛盾：M721～M726。
- 加工位置異常：M730。
- 低エア圧：M731。
- INV01～INV04異常：M741～M744。
- 主軸異常：M750。
- 上記FaultのみをM324へ集約し、M770～M775 WarningはM324へ含めない。
- 原因未復旧の異常はRESET要求だけでは解除しない。
- RESETでM305/M321を自動SETしない。
- Warning単独では原則M305を停止しない。
- ブザー停止は音だけを止め、Fault/Warning/履歴を消さない。

## 3. GX Works2 / FX3Uで再確認する差分

### 3.1 タイマ時間基準

既存設計ではD110/D111/D112等を設定値として使用するが、GX Works2 + FX3Uでは使用するTデバイスの時間基準と設定値の単位を実プロジェクトで統一する。

未確認のまま「D110=5なら5秒」などと固定しない。

### 3.2 タイマ番号

監視タイマ自体は対象ごとに分離する方針を維持するが、T番号はGX Works2プロジェクト作成後に正式割付する。

- T1～T4搬送：個別
- ST01～ST05：機構単位または方向単位
- CY01～CY05：機構単位または方向単位
- 主軸立上り：専用

未登録Tを設計資料側で先に固定しない。

### 3.3 主軸立上り監視

主軸RUN要求 M884 成立後、M166 RUN FBが時間内に成立しない場合M750とする考え方は維持する。

ただし主軸立上り時間用設定Dは未割付のままとする。D111共用か専用D追加かは別TBD。

M166 OFFをゼロ速度確認には使わない。

### 3.4 M515搬出timeout

M515搬出の正式駆動方式と専用timeoutコードは未確定。

GX Works2移行を理由に空きM700帯を勝手に追加しない。

### 3.5 新規異常エッジ

M324 OFF→ONを新規異常イベント源としてM326/M965へつなぐ方針は維持する。

GX Works2で採用する立上り検出命令または補助M方式はBatch Aのエッジ方針と統一してから実装する。

### 3.6 D210 > D120 比較

M774タクト超過はD210とD120を同一時間単位にした後で比較する。

GX Works2版でも単位未確定のまま比較結果を正式判定にしない。

## 4. Section 12移行チェック

| 項目 | GX Works2判定 |
|---|---|
| M701～M704 transfer timeout | LOGIC REUSE |
| M711～M715 stopper fault | LOGIC REUSE |
| M721～M726 cylinder fault | LOGIC REUSE |
| M730 process position | LOGIC REUSE |
| M731 low air | LOGIC REUSE |
| M741～M744 inverter fault | LOGIC REUSE |
| M750 spindle fault | LOGIC REUSE / TIMER TBD |
| M324 fault summary | LOGIC REUSE |
| cause-restored reset | LOGIC REUSE |
| actual T device allocation | GXW2 PROJECT TBD |
| timer unit/scaling | GXW2 PROJECT TBD |

## 5. Section 13移行チェック

- M770 = discharge full / M154
- M771 = load waiting
- M772 = downstream vacancy waiting
- M773 = station waiting
- M774 = takt exceeded
- M775 = auto waiting
- M325 = warning summary
- M326 = buzzer request / new-fault event
- M327 = silence state
- M893 → Y34 = buzzer actual request

上記デバイス体系は維持する。

M770～M775をM324へ含めない。

## 6. RESET / ACK / BUZZER境界

GX Works2版でも以下を混同しない。

```text
RESET
= 復旧済み個別Fault latchの解除

BUZZER SILENCE
= Y34の鳴動停止のみ

ACK
= 表示確認/履歴側イベント
```

- M187/M962でM700帯をRESETしない。
- M183 RESETでM327消音状態を無条件に兼用しない。
- 新規異常発生時に再鳴動可能な構造にする。

## 7. GX Simulator2試験候補

### E-SIM-W2-01～04 搬送timeout

各T1～T4でRUN中に完了条件を成立させず、設定時間後にM701～M704が個別成立すること。

### E-SIM-W2-05～09 stopper

ST01～ST05で要求に対し期待端FBを成立させず、対応M711～M715が成立すること。

端センサ両方ON時も正常遷移しないこと。

### E-SIM-W2-10～14 cylinder

CY01～CY05で期待FB未成立と端矛盾を確認し、M721～M726が意図どおり成立すること。

### E-SIM-W2-15 process position

工程上M141が必要な場面で未成立とし、M730が成立すること。

### E-SIM-W2-16 low air

M321またはM305成立中にM111をOFFし、M731→M324→M305解除となること。復旧後も途中位置を自動正常扱いしないこと。

### E-SIM-W2-17～20 inverter

M162～M165を個別ONし、M741～M744が対応して成立すること。

### E-SIM-W2-21 spindle fault input

M167 ONでM750が成立すること。

### E-SIM-W2-22 spindle start timeout

M884 ON、M166 OFFを維持し、専用監視時間経過後にM750が成立すること。専用D/T確定後に実施。

### E-SIM-W2-23 warning separation

M154 ONでM770/M325が成立し、M324は成立しないこと。

### E-SIM-W2-24 warning does not stop auto

Warningのみ成立させ、M305がFault扱いで自動解除されないこと。

### E-SIM-W2-25 buzzer silence

新規FaultでM326→M893→Y34が成立し、M187またはM962でM327成立後はY34のみOFFとなること。

### E-SIM-W2-26 fault remains after silence

ブザー停止後もM324および個別M700帯が残ること。

### E-SIM-W2-27 new fault re-annunciation

消音後に別の新規Faultを発生させ、再鳴動条件が成立すること。

### E-SIM-W2-28 cause-restored reset

原因未復旧のFaultはRESETしても保持し、原因復旧済みFaultのみ解除されること。

## 8. BLOCKED-TBD

- FX3Uでの正式Tデバイス割付
- D110/D111/D112/D120/D210の時間単位統一
- 主軸立上り監視専用D
- M515搬出専用timeout
- ST/CY監視時間を共通Dにするか個別Dにするか
- M326の正式SET/RST方式
- Warningをブザー対象に含めるか
- M327の新規Fault時解除方法

## 9. 完了条件

Batch EをGX Works2移行完了とするには以下を満たす。

- [ ] GX Works2プロジェクト上でTデバイスを正式割付
- [ ] タイマ単位確認
- [ ] Fault/Warning分離確認
- [ ] cause-restored reset確認
- [ ] buzzer silenceが音だけ停止することを確認
- [ ] E-SIM-W2-01～28をGX Simulator2で実施

実GX Works2 / GX Simulator2で確認していない項目はPASS扱いにしない。

## 10. 現在判定

**BATCH E LOGIC MIGRATION READY / TIMER ALLOCATION PENDING / GX WORKS2 INPUT PENDING / SIM PENDING**
