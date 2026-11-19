# タイマー回路：技術参照メモ

- 対象：電気コントロールのタイマー回路の日本語記事。確認日：2026-11-19（日本時間）。
- 範囲：三菱電機 MELSEC iQ-F FX5 の通常オンディレイタイマー（表示ランプを使う概念例）。図はオリジナル。実機の配線・運転・安全機能にそのまま使う設計図ではない。
- [MELSEC iQ-F FX5 User's Manual (Application), JY997D55401AH](https://dl.mitsubishielectric.com/dl/fa/document/manual/plcf/jy997d55401/jy997d55401ah.pdf)：Device の Timer (T)/Retentive Timer (ST)。通常タイマーと積算タイマー、命令ごとの時間単位の確認。
- [MELSEC iQ-F FX5 Programming Manual (Instructions, Standard Functions/Function Blocks), JY997D55801AC](https://dl.mitsubishielectric.com/dl/fa/document/manual/plcf/jy997d55801/jy997d55801ac.pdf)：第6章6.3「Timer」p.136–137。設定値到達時に通常タイマーのa接点が導通。段の成立がなくなると通常タイマーの現在値は0でa接点は非導通。OUT T/OUTH T/OUTHS Tの時間単位は100/10/1 ms。この図は毎スキャンに両段を通常実行する概念例で、ジャンプ等による命令スキップ、積算、命令の多重実行は範囲外。
- 従来図では図だけに停止／RST段があり、本文の通常タイマーの2段と説明が一致しなかったため、図と本文を通常オンディレイのみに統一。K50はOUT Tの時間単位とセットで説明し、別機種へ一般化しない。
- 型式固有の配線・設定値・運転精度や未確認の事例は採用しない。時間が経過したことと停止・安全が確認できたことを区別する。
