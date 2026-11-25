# DCモーター制御：限定改善の資料確認

確認日：2026-11-20。対象：`articles/dc-motor-control-basic.html`。ローカル草稿。本文草稿の内容最終更新日は2026-11-20。公開日は未確定で、実配信確認後に統合更新台帳へ記録する。

| メーカー | 公式資料 | 使った箇所 | 一般化しないこと |
| --- | --- | --- | --- |
| maxon | [Why can the usage of a motor controller be an advantage even for a DC motor?](https://support.maxongroup.com/hc/en-us/articles/360019707620-Why-can-the-usage-of-a-motor-controller-be-an-advantage-even-for-a-DC-motor) | Solution：ブラシ付きとブラシレスで駆動回路の扱いが異なる。ドライバへの速度指令と駆動を区別。電源断なしでの駆動の有効・無効の製品例。 | 裸のモーターへの直結実施、定格や電流限界、すべての型式が同じ操作になるとは説明しない。 |
| Microchip | [AN905 Brushed DC Motor Fundamentals](https://ww1.microchip.com/downloads/en/appnotes/00905a.pdf) | 永久磁石式ブラシ付きモーターの例、Fig. 8・Table 1：Hブリッジがモーター端子への印加方向を切り替える。CoastとBrakeは別。 | Hブリッジ回路を実装する手順や端子結線ではない。他方式、運転中の反転条件、停止後の保持や設備の安全性能を保証しない。 |
| 東芝デバイス＆ストレージ | [TB67H400AFTG 製品概要](https://toshiba.semicon-storage.com/jp/semiconductor/product/motor-driver-ics/brushed-dc-motor-driver-ics/detail.TB67H400AFTG.html) | ブラシ付き向けのブリッジドライバで正転・逆転・ストップ・ショートブレーキを別機能とする機種例。 | PLCへ直接接続可能、電流定格を一般化できるなどの主張はしない。 |
| オリエンタルモーター | [ブラシレスモーター BLVシリーズ B-19 カタログPDF](https://www.orientalmotor.co.jp/system/files/document/products/B-19.pdf?brandCode=BL&senimotoId=1&seriesCode=FJ00&serviceTypeNo=18) | PDF 5ページ：DC入力ブラシレス製品にもドライバが必要な例。外力や急停止などの回生時に電源やドライバの保護が働き得る機種例。 | 全ドライバに回生処理機能がないとは言わない。電源・抵抗等の選定数値や現場レシピは載せない。 |

旧基本構成図はDC電源からPLCを経るように見えたため、動力と運転指令を別経路で描く画面幅に合わせて折り返す、テキストの概念図に差し替え。電源ON/OFFと誤読される比較図は除外し、表で通常停止と保護を整理。残した指令フロー図の記号・配線色・端子は概念例であり、実機の結線図ではないと明示。Hero・OGPはテーマ整合と既存表示維持のため差し替えなし。公開・正式統合CI・PC/スマホのブラウザ検査は未実施。
