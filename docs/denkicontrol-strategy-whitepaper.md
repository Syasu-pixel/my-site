# Denkicontrol Strategy Whitepaper

## 1. Executive Summary
Denkicontrol.com is currently in the transition phase from “article accumulation” to “knowledge asset structuring.” With approximately 270 specialized articles, the immediate priority is no longer unplanned volume expansion. The priority is to convert existing content into durable assets through hub-page design, internal link architecture, and consistent JA/EN technical SEO operations.

Denkicontrol does not replace manufacturer documentation. Its role is to function as a practical field guide that assumes manufacturer manuals, wiring drawings, and on-site safety rules as the primary sources, then clarifies what the reader should check next in real work. The site’s value is positioned between official manufacturer documentation and general blogs: less rigid than official references, but deeper and more operational than general explainers.

## 2. Mission & Core Principles
### 2.1 Experience-first
- Avoid simple catalog-spec restatement.
- Describe field-observed behavior, decision sequence, and likely troubleshooting factors from a practitioner viewpoint.
- Prioritize practical interpretability (what to check next) over abstract completeness.

### 2.2 Safety and manufacturer-first
- Manufacturer specifications, official drawings, and site safety regulations always take precedence.
- Articles are decision-support materials, not final authority.
- Readers must be guided to verify final judgments against official documentation and local safety rules.
- Avoid absolute wording, universal claims, and risky conclusions in topics such as grounding, CT, leakage, pressure, and pneumatic control.

### 2.3 Navigation as value
- Navigation quality is part of product value.
- Every key article should guide readers to adjacent knowledge needed for next-step verification.
- Hub-and-spoke pathways should reduce dead-end reading and improve practical task completion.

## 3. Target Persona & Search Intent
### 3.1 Primary personas
- Licensed electricians.
- Equipment maintenance technicians.
- Beginner-to-intermediate practitioners in control panels and FA environments.
- Operators who handle PLC, pneumatics, sensors, and control components on site.
- English-speaking local engineers and maintenance practitioners.

### 3.2 Dominant search intents
- “What is ○○” type definitions.
- “○○ basic” foundational queries.
- “○○ difference” and “○○ vs ○○” comparison queries.
- “○○ troubleshooting” and “○○ not moving” symptom-led queries.
- “○○ wiring” implementation queries.
- “○○ PLC input / output” signal-context queries.
- “○○ solenoid valve” and “○○ pressure switch” component-action queries.
- Component name + symptom.
- Component name + caution points.
- Wiring + noise.
- Signal + field check sequence.

## 4. Market Positioning & Competitor Analysis
### 4.1 Manufacturer official websites
- High accuracy and authority.
- Often optimized for their own product line, model-specific documentation, and formal specification context.
- Cross-manufacturer, field-level troubleshooting sequence is often fragmented for practitioners.

### 4.2 Learning/education portals
- Broad and accessible for foundational learning.
- May not consistently address dirty, symptom-specific troubleshooting paths in real facilities.

### 4.3 Personal blogs
- Often easy to read and practical in tone.
- Frequently weaker in systematization, multilingual expansion, safety framing, manufacturer-first context, and internal link architecture.

### 4.4 Denkicontrol’s distinct role
- Neutral, cross-manufacturer orientation.
- Bridges terms between manuals and field language.
- Adds safety cautions and practical check order.
- Functions as a practical guide between official manufacturer resources and general blogs.

## 5. JA/EN Language Strategy
### 5.1 Japanese content role
- Provide high-trust practical references for domestic maintenance, control panel engineering, and electrical work.
- Use field vocabulary that beginner-to-intermediate practitioners can immediately apply.

### 5.2 English content role
- Capture global niche long-tail technical queries.
- Treat English as a separate market-facing content stream, not a direct Japanese translation output.
- Align terminology with actual English search behavior and field phrasing, such as:
  - air valve / pneumatic valve / directional control valve
  - flicker circuit / blinking lamp circuit
  - pressure switch / digital pressure switch
  - pneumatic silencer / pneumatic muffler
  - shielded cable / shield termination

### 5.3 Directory and multilingual SEO policy
- Keep language roles clearly separated under root Japanese paths and `/en/` paths.
- Audit hreflang, canonical, language-menu, and sitemap consistency on a recurring basis.
- Ensure equivalent-topic JA/EN pages are linked intentionally without forcing one-to-one translation requirements.

## 6. Topic Cluster & Internal Link Policy
### 6.1 Hub-and-spoke structure
- Do not leave strategic pages as isolated single articles.
- Parent hubs should target broad intent classes.
- Child pages should focus tightly on component, symptom, and verification point.

### 6.2 Core clusters to strengthen
- Pneumatics.
- Noise reduction and wiring practices.
- PLC input/output diagnostics.
- Sensor signal basics.
- Control circuit and panel wiring.

### 6.3 Internal path examples
- pneumatic silencer → air cylinder troubleshooting → air valve → air regulator
- noise filter → shielded cable → grounding → power/signal wiring separation
- pressure switch → PLC input → sensor basics → NPN/PNP

### 6.4 Initial priority hubs
1. **Air Pneumatic Troubleshooting Guide**
   - Existing spoke coverage is already strong (air cylinder, air valve, regulator, speed controller, pneumatic silencer, air tube fitting, pressure switch).
   - Easy to structure symptom → cause candidates → check order → spoke links.
   - Expandable in both JA and EN.
2. **Control Panel Noise Reduction Basics**
   - Strong alignment with emerging English queries (shielded cable, noise filter, grounding, wiring separation).
   - Can unify noise, grounding, shield, wiring, and EMI filter discussions into one practical navigation center.

### 6.5 Secondary hub candidates
- PLC Input and Output Troubleshooting Guide.
- Sensor Signal Basics.
- Control Panel Wiring Basics.
- Relay and Circuit Troubleshooting Guide.

## 7. Search Console Based Improvement Rule
### 7.1 Operating principle
- Prioritize pages already showing traction in Search Console.
- Prefer queries around average position 4–20, or impressions with low click-through.
- Use minimal, high-precision updates (typically 1–2 body insertions).
- Do not use keyword stuffing.

### 7.2 What to add in micro-improvements
- Reader next action.
- Field uncertainty resolution cues.
- Terminology variants and practical synonyms.
- Safety caution framing.
- Manufacturer-document-first context.

### 7.3 Cutoff criteria for prioritization
- Increasing impressions in the last 28 days, or recurring visibility peaks.
- Topic alignment with page core intent.
- Feasibility of answering user doubt with one to two additions.
- Compatibility with hub design and internal linking.
- Low cannibalization risk.

### 7.4 Queries to avoid reinforcing
- Misaligned with the page’s core subject.
- Model/vendor-specific issues where official documents must dominate.
- Regulatory/safety-standard assertions requiring authoritative legal wording.
- One-off noise queries with no repeat signal.
- Intent better handled by a separate page or hub node.

### 7.5 Cannibalization prevention rules
- One primary URL per search intent.
- Do not reinforce the same query across multiple pages simultaneously.
- Separate roles among definition, comparison, troubleshooting, and hub pages.
- If multiple URLs alternate for the same query, evaluate consolidation, hierarchy, internal links, and when appropriate canonical/redirect actions.
- Hub covers broad intent; spokes handle component/symptom/check specificity.

### 7.6 Improvement log operations
All Search Console-based edits must be recorded in `docs/search-console-content-improvement-log.md`.

Template:

### YYYY-MM-DD: en/articles/example.html
- Target query:
- Improvement:
- Safety / documentation note:
- Related PR:

## 8. Resource Allocation & Guardrails
### 8.1 Next 3 months
- New article creation: **5–10%**
  - Only gap-filler pages required to complete hub navigation.
  - Suspend unplanned quota-driven article creation.
- Hub page creation: **30–35%**
  - Build 1–2 highest-priority hubs first.
- Existing article improvements: **30–35%**
  - Search Console-linked 1–2 point reinforcement.
- Technical SEO audit and internal link restructuring: **25–30%**
  - JA/EN integrity, indexability, canonical/hreflang/sitemap/language-menu consistency, and hub-focused link concentration.

### 8.2 Mid-term 6–12 months
- New article creation: **20–25%**
- Existing article improvements: **30%**
- Internal link restructuring: **20%**
- Technical SEO audits: **10%**
- Hub page creation: **15–20%**

### 8.3 Explicit guardrails (do-not rules)
- Do not drift into broad non-core general-interest content for short-term PV gain.
- Do not overload one article with mixed and conflicting search intents.
- Do not make risky definitive claims in shielding, grounding, CT, leakage, pneumatics, or pressure contexts.
- Do not phrase content as if article text supersedes manufacturer docs or site rules.
- Do not trigger cannibalization by competing multiple pages for one core intent.
- Do not repeatedly run large design or structural HTML changes without clear strategic necessity.
- Do not prioritize article count over hub and internal-link architecture.

## 9. Technical SEO Priorities
Priority audit checklist:
- JA/EN counterpart mapping quality.
- Self-referencing canonical correctness.
- hreflang consistency across `ja`, `en`, and `x-default`.
- language-menu destination accuracy.
- Inclusion coverage of JA/EN content in sitemap.
- noindex / robots misconfiguration checks.
- Search Console status review for “Discovered - currently not indexed” and “Crawled - currently not indexed.”
- Orphan pages and weak internal-link coverage.
- Pages difficult to reach from category pathways.
- Cannibalization candidates.

## 10. KPI & Growth Roadmap
### Phase 1 (approximately 6–12 months)
- Target: **10,000 PV/month**.
- Focus: existing content enhancement, indexing quality improvements, and uplift on pages already reacting in Search Console.

### Phase 2 (approximately 12–18 months)
- Target: **30,000 PV/month**.
- Focus: hub expansion, stronger internal links, and English long-tail inflow growth.

### Phase 3 (18 months and beyond, upside scenario)
- Target: **50,000+ PV/month**.
- Focus: compound growth from English inflow, troubleshooting-intent query combinations, and stronger recognition as a specialized practical reference.

### KPI interpretation rule
- PV targets are directional operating benchmarks, not guaranteed outcomes.
- In short-term decision making, prioritize expertise depth, trust, and intent matching over vanity traffic.

## 11. Repository Documentation Policy
Role definitions under `docs/`:
- `docs/denkicontrol-strategy-whitepaper.md`
  - Primary governance document for operations, SEO policy, and content strategy.
- `docs/search-console-content-improvement-log.md`
  - Log of Search Console-based content improvements.
- `docs/article-backlog.md`
  - Backlog for Japanese article creation and revision candidates.
- `docs/en-article-backlog.md`
  - Backlog for English article creation and revision candidates.

## 12. Next Actions
Execution order after this whitepaper:
1. JA/EN Technical SEO Audit.
2. Design of **Air Pneumatic Troubleshooting Guide**.
3. Design of **Control Panel Noise Reduction Basics**.
4. Second-pass improvements on Search Console-responsive pages.
5. Create only necessary gap-filler articles required by hub architecture.
