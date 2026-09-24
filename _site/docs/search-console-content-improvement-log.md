# Search Console Content Improvement Log

## Purpose
This log tracks lightweight content reinforcements added to existing articles in response to search intents that showed traction in Search Console.

## Policy
- Prioritize articles that show clear Search Console query response.
- Use small, targeted reinforcements (typically one to two spots in article body).
- Do not generally change HTML structure, CSS, images, or canonical/hreflang/OGP settings.
- Reinforce reader understanding, on-site verification flow, and safety cautions instead of keyword stuffing.
- Add context that prioritizes manufacturer documentation, drawings/spec sheets, and local site rules.
- Avoid absolute wording, unsafe assumptions, and one-size-fits-all claims.

## 2026-05-20 English article improvements

| PR | Target article | Main search intent | Main reinforcement | Safety note |
|---|---|---|---|---|
| [#1171](https://github.com/Syasu-pixel/my-site/pull/1171) | `en/articles/earth-leakage-breaker-basic.html` | earth leakage circuit breaker / ELCB | Clarified ELCB naming and test button limitation. | Do not always treat ELCB/RCD/RCCB/RCBO as identical. |
| [#1172](https://github.com/Syasu-pixel/my-site/pull/1172) | `en/articles/noise-filter-basic.html` | noise filter / EMI filter / power-line noise filter | Added EMI filter wording and wiring/grounding checks. | Do not make absolute claims on manufacturer-specific wiring distance, ratings, leakage current, or grounding method. |
| [#1173](https://github.com/Syasu-pixel/my-site/pull/1173) | `en/articles/shielded-cable-basic.html` | shielded cable / shield wire / drain wire / shield termination | Reinforced shield construction and termination checks. | Do not uniformly prescribe single-end or both-end grounding. |
| [#1174](https://github.com/Syasu-pixel/my-site/pull/1174) | `en/articles/no-fuse-breaker-basic.html` | no fuse breaker / NFB / MCCB | Added naming caution and breaker rating warning. | Do not always equate NFB and MCCB; avoid “just increase the rating” wording. |
| [#1175](https://github.com/Syasu-pixel/my-site/pull/1175) | `en/articles/current-transformer-basic.html` | current transformer / CT / CT ratio | Strengthened CT ratio explanation and CT secondary safety note. | Avoid implying all CTs are 5A output or that secondary can be safely opened under load. |
| [#1176](https://github.com/Syasu-pixel/my-site/pull/1176) | `en/articles/power-signal-wiring-separation-basic.html` | power wiring vs signal wiring / wiring separation / right-angle crossing | Reinforced that judgment should not rely only on voltage and right-angle crossing is not a guarantee. | Do not make absolute claims on separation distance or routing rules. |
| [#1177](https://github.com/Syasu-pixel/my-site/pull/1177) | `en/articles/pneumatic-silencer-basic.html` | pneumatic silencer / air silencer / exhaust silencer / pneumatic muffler | Added alternate names and clogged silencer caution. | Avoid wording that removing a silencer is always a safe fix. |
| [#1178](https://github.com/Syasu-pixel/my-site/pull/1178) | `en/articles/air-regulator-basic.html` | air regulator / pneumatic regulator / air pressure regulator | Added alternate names and operation-time gauge check. | Avoid wording that “increase pressure solves it” or “gauge value alone proves system normal.” |
| [#1179](https://github.com/Syasu-pixel/my-site/pull/1179) | `en/articles/speed-controller-basic.html` | pneumatic speed controller / flow control valve / meter-out / meter-in | Clarified flow-control wording and adjustment safety. | Do not universally assert screw direction or mounting orientation; avoid adjustment without confirming operating range. |
| [#1180](https://github.com/Syasu-pixel/my-site/pull/1180) | `en/articles/air-tube-fitting-basic.html` | pneumatic tubing / push-in fitting / one-touch fitting / air leak | Added fitting terminology and tube-end checks. | Do not uniformly assert compatibility; avoid “push harder” or “raise pressure” as leak fixes. |
| [#1181](https://github.com/Syasu-pixel/my-site/pull/1181) | `en/articles/air-cylinder-basic.html` | air cylinder / pneumatic cylinder / pneumatic actuator / troubleshooting | Added actuator naming and safer no-move checks. | Avoid wording that “increase pressure solves it” and avoid universal assumptions on cylinder/reed-switch specs. |
| [#1182](https://github.com/Syasu-pixel/my-site/pull/1182) | `en/articles/air-valve-basic.html` | air valve / pneumatic valve / directional control valve / solenoid valve | Reinforced directional control valve wording and click-sound caution. | Do not judge valve normality by click sound alone; avoid implying manual override is always safe. |
| [#1183](https://github.com/Syasu-pixel/my-site/pull/1183) | `en/articles/pressure-switch-basic.html` | pressure switch / pressure sensor / digital pressure switch / PLC input / set pressure / hysteresis | Clarified separate checks for display value, switch output indicator, and PLC input status; added set-pressure change impact context. | Do not infer PLC input normality from display only; avoid implying set-pressure changes are always safe. |
