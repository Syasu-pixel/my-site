# AI編集部・先輩後輩 基本動作カタログ

2026-09-08 / 設計カタログ v1

## 状態と目的

全218項目は制作候補（planned）。この文書の追加によって実サイトの動作は増えない。完成アニメーション数でも、218種類の独立した素材数でもない。同じ動作を対象物・姿勢で共有する項目を含む。小芝居の台本追加は次段階。

目的は細かい動作を接続し、先輩後輩が仕事・雑談・休憩を自然に行うこと。キャラサイズは承認済みの小ささを維持する。

## 制作の共通ルール

- 足元の基準点を全フレームで一致させる。世界座標の移動、体の姿勢、腕、顔を別レイヤーで制御する。
- 口パクは口だけを切り替える。頭・胴体の座標や画像枠を変更しない。手上げも肩の支点を固定し、胴体を左右に動かさない。
- 歩行は足の接地と移動距離を合わせる。画像全体のスライドだけでは歩行完成としない。
- 表情・視線は手作業に重ねられる。両手を占有する動作同士は同時再生しない。停止は急に切らず接地・置き終わりでつなぐ。
- 物は掴む瞬間に手へ追従させ、離した瞬間に設置面へ固定。カップの液面やトレーの姿勢を運搬中も維持する。
- 二人の受け渡しは同じ物を共有し、受け手の把持完了まで渡し手が離さない。家具の所有・配置・折り畳み状態も共有する。
- 動線は入力欄・操作ボタン・読んでいる本文を避ける。ウィンドウ変更時は足場を再計算する。
- 別ウィンドウへフォーカスが移っても、表示されているページの演出を止めない。非表示タブはブラウザ側で描画が抑制され得るため連続描画を保証せず、復帰時に大量の台詞や移動を早送りしない。
- 実際の案件状態を根拠に作業演出を選ぶ。架空の完了・公開・成功を台詞で断定しない。切断や確認待ちは独立状態にする。

## 動作登録時の契約

各IDは下記を実装時に具体化する。開始・終了姿勢は項目ごとに未確定であり、分類だけで実装済みと扱わない。

|フィールド|内容|
|---|---|
|status|planned → asset-ready → implemented → visually-verified|
|startPose / endPose|立位・座位・把持状態など具体的な開始／終了姿勢|
|requires / effects|空いている手、物の位置、椅子の展開状態と実行後の変化|
|channels|移動・胴体・左腕・右腕・視線・口の占有|
|duration / loop|自然な所要時間とループ可能範囲|
|anchors|足元、肩、手、口、座面、物の接点|
|interruptAt / recovery|接地・置き終わりなど中断点と復帰動作|
|parameters|左右、対象物、向き、速さ、視線。差分を独立素材数に水増ししない|

具体例：立位・右手が空→手を伸ばす→カップ把持→持ち上げる→口元へ運ぶ→傾ける→水平へ戻す→机へ下ろす→手を離す。各接点にカップがあることを確認し、途中の割込みでは安定した場所へ仮置きする。

## 基本動作一覧

### 移動（22項目）

|ID|基本動作|状態|
|---|---|---|
|move-001|歩き始める|planned|
|move-002|普通に歩く|planned|
|move-003|小刻みに歩く|planned|
|move-004|急ぎ足|planned|
|move-005|忍び足|planned|
|move-006|減速|planned|
|move-007|足をそろえて停止|planned|
|move-008|横へ一歩|planned|
|move-009|後ろへ一歩|planned|
|move-010|その場で方向転換|planned|
|move-011|振り返る|planned|
|move-012|曲線で曲がる|planned|
|move-013|目的物へ近づく|planned|
|move-014|相手へ近づく|planned|
|move-015|並んで歩く|planned|
|move-016|追い越す|planned|
|move-017|道を譲る|planned|
|move-018|入口から入る|planned|
|move-019|出口へ出る|planned|
|move-020|物を抱えて歩く|planned|
|move-021|トレーを水平に運ぶ|planned|
|move-022|二人で長い物を運ぶ|planned|

### 姿勢（18項目）

|ID|基本動作|状態|
|---|---|---|
|pose-001|重心を移す|planned|
|pose-002|背伸び|planned|
|pose-003|前かがみ|planned|
|pose-004|上体を戻す|planned|
|pose-005|腰を落とす|planned|
|pose-006|しゃがむ|planned|
|pose-007|しゃがみから立つ|planned|
|pose-008|片膝をつく|planned|
|pose-009|片膝から立つ|planned|
|pose-010|椅子へ向きを合わせる|planned|
|pose-011|腰掛ける|planned|
|pose-012|座り直す|planned|
|pose-013|椅子から立つ|planned|
|pose-014|座って相手を向く|planned|
|pose-015|座って足を揺らす|planned|
|pose-016|縁へ座る|planned|
|pose-017|縁から降りる|planned|
|pose-018|机へ手をつく|planned|

### 視線と頭（14項目）

|ID|基本動作|状態|
|---|---|---|
|gaze-001|正面を見る|planned|
|gaze-002|相手を見る|planned|
|gaze-003|手元を見る|planned|
|gaze-004|足元を見る|planned|
|gaze-005|上を見る|planned|
|gaze-006|物を目で追う|planned|
|gaze-007|気配へ顔を向ける|planned|
|gaze-008|ゆっくりうなずく|planned|
|gaze-009|小さく二度うなずく|planned|
|gaze-010|首をかしげる|planned|
|gaze-011|首を戻す|planned|
|gaze-012|首を横に振る|planned|
|gaze-013|顔を近づけて読む|planned|
|gaze-014|顔を戻す|planned|

### 表情（18項目）

|ID|基本動作|状態|
|---|---|---|
|face-001|まばたき|planned|
|face-002|二度まばたき|planned|
|face-003|ゆっくり目を閉じる|planned|
|face-004|目を開く|planned|
|face-005|目を細めて笑う|planned|
|face-006|目を丸くする|planned|
|face-007|眉を上げる|planned|
|face-008|眉を寄せる|planned|
|face-009|困り眉|planned|
|face-010|眉を戻す|planned|
|face-011|小さく口を開く|planned|
|face-012|大きく口を開く|planned|
|face-013|口を閉じる|planned|
|face-014|微笑む|planned|
|face-015|笑いをこらえる|planned|
|face-016|ほっと息をつく|planned|
|face-017|あくびをこらえる|planned|
|face-018|驚きから落ち着く|planned|

### 腕と手（16項目）

|ID|基本動作|状態|
|---|---|---|
|hand-001|片手を上げる|planned|
|hand-002|手を下ろす|planned|
|hand-003|手首で手を振る|planned|
|hand-004|両手を上げる|planned|
|hand-005|指さす|planned|
|hand-006|指さしを戻す|planned|
|hand-007|手のひらで案内|planned|
|hand-008|自分を指す|planned|
|hand-009|指を折って数える|planned|
|hand-010|腕を組む|planned|
|hand-011|腕組みをほどく|planned|
|hand-012|あごへ手を添える|planned|
|hand-013|胸元へ手を添える|planned|
|hand-014|小さく拍手|planned|
|hand-015|肩をすくめる|planned|
|hand-016|両手をそろえて待つ|planned|

### 物の操作（16項目）

|ID|基本動作|状態|
|---|---|---|
|object-001|手を伸ばす|planned|
|object-002|つかむ|planned|
|object-003|持ち上げる|planned|
|object-004|胸元へ寄せる|planned|
|object-005|持ち替える|planned|
|object-006|両手で支える|planned|
|object-007|下ろす|planned|
|object-008|置いて手を離す|planned|
|object-009|差し出す|planned|
|object-010|受け取る|planned|
|object-011|受け渡しを待つ|planned|
|object-012|横へずらす|planned|
|object-013|向きを変える|planned|
|object-014|並べる|planned|
|object-015|拾う|planned|
|object-016|元へ戻す|planned|

### 家具（14項目）

|ID|基本動作|状態|
|---|---|---|
|furniture-001|畳んだテーブルを抱える|planned|
|furniture-002|テーブルを床へ置く|planned|
|furniture-003|テーブルの脚を開く|planned|
|furniture-004|脚を閉じる|planned|
|furniture-005|テーブルを持ち上げる|planned|
|furniture-006|テーブル位置を調整|planned|
|furniture-007|椅子をつかむ|planned|
|furniture-008|椅子を運ぶ|planned|
|furniture-009|椅子を置く|planned|
|furniture-010|椅子を開く|planned|
|furniture-011|椅子を畳む|planned|
|furniture-012|椅子を引く|planned|
|furniture-013|椅子を押し戻す|planned|
|furniture-014|椅子の向きを直す|planned|

### お茶と配膳（20項目）

|ID|基本動作|状態|
|---|---|---|
|tea-001|空のカップを取る|planned|
|tea-002|受け皿へ置く|planned|
|tea-003|給湯口へ合わせる|planned|
|tea-004|ボタンへ手を伸ばす|planned|
|tea-005|ボタンを押す|planned|
|tea-006|ボタンから手を離す|planned|
|tea-007|注ぐ間待つ|planned|
|tea-008|注ぎ終わりを見る|planned|
|tea-009|カップをトレーへ置く|planned|
|tea-010|トレーを持つ|planned|
|tea-011|トレーを机へ置く|planned|
|tea-012|相手の前へ配る|planned|
|tea-013|カップを両手で包む|planned|
|tea-014|湯気を見る|planned|
|tea-015|軽く息を吹く|planned|
|tea-016|口元へ運ぶ|planned|
|tea-017|傾けてひと口飲む|planned|
|tea-018|口元から戻す|planned|
|tea-019|カップを机へ置く|planned|
|tea-020|空のカップを集める|planned|

### 資料と仕事（20項目）

|ID|基本動作|状態|
|---|---|---|
|work-001|本を取る|planned|
|work-002|本を開く|planned|
|work-003|ページをめくる|planned|
|work-004|行を指で追う|planned|
|work-005|しおりを挟む|planned|
|work-006|本を閉じる|planned|
|work-007|本を棚へ戻す|planned|
|work-008|紙を広げる|planned|
|work-009|紙をそろえる|planned|
|work-010|資料を見比べる|planned|
|work-011|メモを書く|planned|
|work-012|ペンを置く|planned|
|work-013|付箋をはがす|planned|
|work-014|付箋を貼る|planned|
|work-015|キーボードを打つ|planned|
|work-016|マウスを操作|planned|
|work-017|画面を指す|planned|
|work-018|チェック欄を見る|planned|
|work-019|チェックを書く|planned|
|work-020|原稿を相手へ見せる|planned|

### 整理と休息（14項目）

|ID|基本動作|状態|
|---|---|---|
|rest-001|布を取る|planned|
|rest-002|机を拭く|planned|
|rest-003|布を畳む|planned|
|rest-004|布を戻す|planned|
|rest-005|引き出しを開ける|planned|
|rest-006|引き出しを閉める|planned|
|rest-007|小物を箱へしまう|planned|
|rest-008|箱を閉める|planned|
|rest-009|ペンをそろえる|planned|
|rest-010|紙をまとめる|planned|
|rest-011|手を伸ばす|planned|
|rest-012|肩を回す|planned|
|rest-013|座り姿勢を整える|planned|
|rest-014|静かに待つ|planned|

### 二人の連携（14項目）

|ID|基本動作|状態|
|---|---|---|
|pair-001|手振りで呼ぶ|planned|
|pair-002|呼ばれて振り向く|planned|
|pair-003|相手の到着を待つ|planned|
|pair-004|二人でのぞき込む|planned|
|pair-005|指された場所を見る|planned|
|pair-006|相手の話を聞く|planned|
|pair-007|返事でうなずく|planned|
|pair-008|同時に持ち上げる|planned|
|pair-009|相手が置くまで支える|planned|
|pair-010|受け取りを確認して離す|planned|
|pair-011|並ぶ位置を合わせる|planned|
|pair-012|すれ違いを待つ|planned|
|pair-013|ハイタッチ|planned|
|pair-014|ハイタッチから戻す|planned|

### 画面の縁（10項目）

|ID|基本動作|状態|
|---|---|---|
|edge-001|端から顔を出す|planned|
|edge-002|顔を引っ込める|planned|
|edge-003|縁へ手をかける|planned|
|edge-004|縁へ足をかける|planned|
|edge-005|縁をよじ登る|planned|
|edge-006|縁へ体を移す|planned|
|edge-007|縁でバランスを取る|planned|
|edge-008|縁からのぞく|planned|
|edge-009|足場へ降りる|planned|
|edge-010|角を回り込む|planned|

### 小さな生活動作（12項目）

|ID|基本動作|状態|
|---|---|---|
|life-001|ヘルメットを直す|planned|
|life-002|袖を整える|planned|
|life-003|ポケットを探す|planned|
|life-004|ポケットからメモを出す|planned|
|life-005|メモをしまう|planned|
|life-006|時計を見る|planned|
|life-007|眼前のほこりを払う|planned|
|life-008|床の紙片を拾う|planned|
|life-009|鉢植えを見る|planned|
|life-010|じょうろを傾ける|planned|
|life-011|じょうろを戻す|planned|
|life-012|葉をそっと拭く|planned|

### 中断と復帰（10項目）

|ID|基本動作|状態|
|---|---|---|
|control-001|通知へ顔を向ける|planned|
|control-002|作業の手を止める|planned|
|control-003|持ち物を仮置きする|planned|
|control-004|確認待ち姿勢へ戻る|planned|
|control-005|作業位置へ戻る|planned|
|control-006|中断した手作業を再開|planned|
|control-007|相手の通路を空ける|planned|
|control-008|家具の片付けを始める|planned|
|control-009|見切れ位置から戻る|planned|
|control-010|静止姿勢へなじませる|planned|

## 実装順と確認基準

1. 固定支点・まばたき・口・視線・片手上げ下げ。立位で連続再生して足元と胴体のぶれを確認する。
2. 歩行開始・歩行・減速・停止・方向転換。接地、足滑り、端での引っ掛かりを確認する。
3. 伸ばす・掴む・持つ・置く・離すと椅子への着座／起立。手や物の瞬間移動を確認する。
4. カップ、給湯器、テーブル、資料へ展開し、二人の受け渡し・運搬を追加する。
5. 縁の移動、休息、生活動作、中断復帰まで拡張する。

先輩は動作前のためを少し長め、後輩は反応を少し早めにするなど、同じ基本動作のタイミングで個性を付ける。大きな揺れや左右反転の連打で代用しない。

## 小芝居へ進む条件

基本動作を単体で選んで再生できる検証画面で、連続・左右・持ち物あり・割込みを確認してから台本を増やす。二時間の非重複は基本動作の数では保証されない。同じ歩行や瞬きを再利用しつつ、後続の台本ID・台詞ID・組み合わせ履歴で二時間以内の同じ小芝居を除外する。候補が尽きたら静かな仕事・休息動作に戻る。二時間の実時間観察とスケジューラの履歴検証は別々に行い、未検証の持続時間を保証しない。
