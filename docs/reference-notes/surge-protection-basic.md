# surge-protection-basic 公式参照メモ（作業履歴から復元、同一ハッシュには未照合）

| メーカー | 公式資料 | 本文の根拠 |
|---|---|---|
| 音羽電機工業 | [総合カタログ2024–2025 P.13：JISに基づく免雷設計](https://www.otowadenki.co.jp/cms/wp-content/uploads/catalog/seo/0015.html) | 電源と通信・信号は別経路。耐電圧、系統、想定サージと保護範囲の関係。 |
| 音羽電機工業 | [同 P.49：電源用SPD クラスⅡ LSシリーズ](https://www.otowadenki.co.jp/cms/wp-content/uploads/catalog/seo/0051.html) | 試験条件（In印加時）付きUpと製品の保護箇所。定格値・設置図の転記なし。 |
| 音羽電機工業 | [低圧設備の耐雷対策](https://www.otowadenki.co.jp/equipment2/) | 接地条件が設備側への影響を変える補足。機器端の電圧保証ではない。 |
| オムロン | [リレー共通の使用上の注意事項](https://www.fa.omron.co.jp/product/cautions/36/68/) | 吸収方式と復帰への影響、直流ダイオード適用と極性。 |
| パナソニック インダストリー | [ダイオード内蔵やCR内蔵リレーはどういう目的で使われますか？](https://ac-faq.industrial.panasonic.com/ja/knowledge/control/relay/mechanical/general/diod-cr-relay-purpose) | コイル遮断の逆起電圧、内蔵部品が守る側、直流ダイオード。CRの扱いを一般化しない。 |
| オムロン | [LYシリーズのカタログ p.11](https://www.fa.omron.co.jp/data_pdf/cat/ly_ds_j_5_20.pdf?id=949#page=11) | 同じDCコイル両端を通電時が正となる向きで見ると、OFF直後の過渡電圧は逆極性になる例。V4図は一つの概念波形のみ。実測値、ダイオードの有無の定量差、接点が戻る時刻を示さない。 |

公式資料確認日：2026-11-21。初回復元では本文の一致を確認した。その後は図を差し替え、V4では符号付きの過渡電圧の概念図を追加した。公開日は本番確認と別。型式固有の選定値、現場での配線・測定・変更、直撃雷・停止性能の保証なし。現場説明は旧候補と同じ仮例で、作者の経験談・実測とは扱わない。
