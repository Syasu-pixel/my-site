from pathlib import Path

path = Path('articles/limit-switch-troubleshooting-basic.html')
text = path.read_text(encoding='utf-8')

def swap(old, new):
    global text
    if old not in text:
        raise SystemExit('missing target: ' + old[:140])
    text = text.replace(old, new, 1)

swap('''<h2>まだ不要な人</h2>\n          <ul>\n            <li>リミットスイッチの型式選定だけを詳しく見たい人</li>\n            <li>安全用リミットスイッチの規格設計を知りたい人</li>\n            <li>メーカー別の端子番号一覧だけを探している人</li>\n          </ul>''', '''<h2>この記事だけで決めないこと</h2>\n          <ul>\n            <li>安全インターロック用のスイッチを通常品と同じ前提で扱わない</li>\n            <li>安全回路のバイパスや強制入力をトラブル確認の手段にしない</li>\n            <li>実機では図面・設備仕様・メーカー資料・安全手順を優先する</li>\n          </ul>''')

swap('<li>スイッチ本体の接点変化とPLC入力LEDは別で確認する</li>', '<li>スイッチ側の状態とPLC入力表示を分けて確認する</li>')
swap('<li>位置ズレ、端子ゆるみ、接点不良、入力番号違いがよくある</li>', '<li>位置ズレ、接点・配線系統、入力番号違いなどを順に切り分ける</li>')

swap('''<div class="field-highlight">\n              <h3>接点が切り替わるかを見れば切り分けやすい</h3>\n              <p>\n                スイッチを直接操作して接点が変わるかを見ると、スイッチ本体側か、配線・PLC側かを切り分けやすくなります。\n              </p>\n            </div>''', '''<div class="field-highlight">\n              <h3>スイッチ側とPLC側の状態を分けて見る</h3>\n              <p>\n                図面上の接点種別、機械側の当たり、PLC入力LEDやモニタ表示を分けて確認すると、スイッチ側・配線側・PLC側のどこを優先して調べるか整理しやすくなります。\n              </p>\n            </div>''')

swap('<td>スイッチ本体、テスター導通</td>', '<td>スイッチ本体、接点仕様、状態表示</td>')

swap('''<h3>「押されている」と「入力が入る」は別</h3>\n              <p>\n                スイッチが押されているように見えても、接点が切り替わっていない場合があります。見た目だけで判断せず、接点とPLC入力を分けて確認します。\n              </p>''', '''<h3>「押されている」と「PLC入力が成立する」は別</h3>\n              <p>\n                スイッチが押されているように見えても、接点仕様・配線系統・PLC入力条件のどこかで状態が一致していない場合があります。見た目だけで判断せず、図面と状態表示を分けて確認します。\n              </p>''')

swap('''<div class="check-item check-item--field">\n                <h3>2. スイッチを手で動かしてみる</h3>\n                <p>\n                  安全を確認したうえでスイッチを直接操作し、クリック感や戻り、引っかかりがないかを見ます。\n                </p>\n              </div>''', '''<div class="check-item check-item--field">\n                <h3>2. 機械側の当たりとスイッチ状態を見る</h3>\n                <p>\n                  設備を安全状態にしたうえで、ローラーやアームの位置、破損、戻り不良など目視できる状態を確認します。\n                </p>\n              </div>''')

swap('''<div class="check-item">\n                <h3>3. 接点の導通を確認する</h3>\n                <p>\n                  テスターでNO/NC接点が切り替わるか確認します。図面で使っている端子と合っているかも見ます。\n                </p>\n              </div>''', '''<div class="check-item">\n                <h3>3. 接点仕様と端子番号を照合する</h3>\n                <p>\n                  図面・本体表示・メーカー資料で、NO/NC接点と使用端子が一致しているか確認します。\n                </p>\n              </div>''')

swap('''<div class="check-item check-item--warning">\n                <h3>4. 端子と配線を確認する</h3>\n                <p>\n                  端子のゆるみ、線番違い、断線しかけ、ケーブルのこすれや被覆傷がないか確認します。\n                </p>\n              </div>''', '''<div class="check-item check-item--warning">\n                <h3>4. 端子・配線の外観と線番を見る</h3>\n                <p>\n                  線番、端子表示、明らかな外れ・損傷・ケーブルのこすれなどを、設備の安全手順に従って確認します。\n                </p>\n              </div>''')

swap('''<div class="check-item">\n                <h3>5. PLC入力端子で確認する</h3>\n                <p>\n                  スイッチ操作時にPLC入力端子まで信号が来ているか、入力LEDが点くかを確認します。\n                </p>\n              </div>''', '''<div class="check-item">\n                <h3>5. PLC入力表示を確認する</h3>\n                <p>\n                  PLC入力LEDや保守モニタで、対象入力の状態が設備動作と一致しているか確認します。\n                </p>\n              </div>''')

swap('''<h3>可動部の確認は安全を優先する</h3>\n                <p>\n                  リミットスイッチは機械の可動部近くに付いていることが多いです。手を入れる前に停止状態や安全状態を確認し、急な動作に注意します。\n                </p>''', '''<h3>可動部や安全回路は設備手順を優先する</h3>\n                <p>\n                  リミットスイッチは可動部やインターロックに使われることがあります。点検・測定・調整・配線変更は設備ごとのロックアウト等の安全手順と資格要件に従い、この記事ではバイパスや強制操作の手順は扱いません。\n                </p>''')

swap('''<p>\n              リミットスイッチは、機械側の位置と電気側の信号がつながる場所です。\n              目で見た位置、手で動かした感触、テスターで見た接点、PLC入力LEDを順番に確認すると、原因を絞りやすくなります。\n            </p>''', '''<p>\n              リミットスイッチは、機械側の位置と電気側の信号がつながる場所です。\n              機械位置、図面上の接点仕様、配線・端子表示、PLC入力LEDや保守モニタを順に照合すると、原因を絞りやすくなります。\n            </p>''')

swap('''<div class="check-item">\n                <h3>手動で接点変化を見る</h3>\n                <p>\n                  スイッチを直接押した時に、テスターやPLC入力LEDが変化するかを見ると切り分けしやすくなります。\n                </p>\n              </div>''', '''<div class="check-item">\n                <h3>PLC入力表示と図面を照合する</h3>\n                <p>\n                  対象の入力番号、NO/NCの前提、PLC入力LEDやモニタ表示が一致しているかを見ると切り分けしやすくなります。\n                </p>\n              </div>''')

swap('<li>PLC入力LEDとモニタで最終確認する</li>', '<li>PLC入力LEDと保守モニタを図面と照合する</li>')
swap('<li>テスターで接点変化を確認する</li>', '<li>図面・接点仕様・PLC入力表示を照合する</li>')

path.write_text(text, encoding='utf-8')

backlog = Path('docs/existing-article-improvement-backlog.md')
b = backlog.read_text(encoding='utf-8')
old = '- [ ] `articles/limit-switch-troubleshooting-basic.html` — リミットスイッチトラブルシューティング'
new = '- [ ] `articles/limit-switch-troubleshooting-basic.html` — リミットスイッチトラブルシューティング — 作業中（本文見直し / 安全表現整理 / 関連記事画像カード確認済み / 追加画像は保留）'
if old not in b:
    raise SystemExit('backlog target missing')
b = b.replace(old, new, 1)
backlog.write_text(b, encoding='utf-8')
