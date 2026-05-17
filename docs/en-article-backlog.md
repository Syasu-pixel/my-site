# English Article Backlog

このファイルは、日本語記事は存在するが英語版 `en/articles/*.html` が未作成の記事を管理するバックログです。

## 運用ルール

- 日本語 `articles/{slug}.html` は存在するが、英語 `en/articles/{slug}.html` が未作成のものを掲載する。
- 英語記事HTMLを作成しただけでは削除しない。
- 英語記事作成後、必要な導線追加まで完了したら削除する。
  - 日本語記事側の言語メニュー
  - 英語トップまたは英語カテゴリで必要なリンク
  - `assets/data/search-index.json`
  - `sitemap.xml`
- `/seo/sitemap.xml` は非運用なので対象外。
- 次の英語化候補を選ぶときは、このリストと英語トップ・英語カテゴリ内の日本語リンク残りを合わせて確認する。
- 英語サイトでは当面、工具系記事と一般的な比較系記事は英語化対象外とし、Control Basics / Circuit Basics / PLC / Sensor 系を優先する。
- Ladder/work-platform and general tool-introduction articles are currently out of scope for English translation, except selected tool categories.


## 現在の英語化優先対象

### Control Basics
- `temperature-sensor-basic`

### Circuit Basics
- `lamp-indicator-circuit-basic`
- `ladder-reading`

### PLC / GX Works3
- `gxw3-comparison-instruction-basic`
- `gxw3-counter-up-down-reset`
- `gxw3-mov-instruction-basic`
- `gxw3-mul-div-instruction-basic`
- `gxw3-one-shot-rise-fall-detection`
- `gxw3-out-set-rst-coil-usage`
- `gxw3-timer-ton-toff-retentive`

### HMI / GOT

## Backlog

- [x] air-filter-regulator-lubricator-basic
- [x] air-regulator-basic
- [x] air-tube-fitting-basic
- [x] current-transformer-basic
- [x] delayed-start-circuit-basic
- [x] earth-leakage-breaker-basic
- [x] electromagnetic-contactor-vs-switch
- [x] float-switch-basic
- [x] got-touch-panel-basic
- [x] gxw3-add-sub-instruction-basic
- [x] gxw3-comparison-instruction-basic
- [x] gxw3-counter-up-down-reset
- [x] gxw3-mov-instruction-basic
- [x] gxw3-mul-div-instruction-basic
- [x] gxw3-one-shot-rise-fall-detection
- [x] gxw3-out-set-rst-coil-usage
- [ ] gxw3-timer-ton-toff-retentive
- [x] ladder-reading
- [x] lamp-indicator-circuit-basic
- [x] light-curtain-basic
- [x] limit-switch-troubleshooting-basic
- [x] manual-auto-selector-circuit-basic
- [x] no-fuse-breaker-basic
- [x] noise-filter-basic
- [x] pilot-lamp-basic
- [x] pneumatic-silencer-basic
- [x] power-signal-wiring-separation-basic
- [x] push-button-switch-basic
- [x] relay-socket-basic
- [x] reset-circuit-basic
- [x] safety-door-switch-interlock-basic
- [x] selector-switch-basic
- [x] shielded-cable-basic
- [x] signal-tower-light-basic
- [x] solenoid-valve-manual-override-basic
- [x] ssr-basic
- [x] star-delta-start-basic
- [x] temperature-sensor-basic
- [x] thermal-relay-basic
- [x] timer-relay-basic
- [x] wiring-duct-basic
