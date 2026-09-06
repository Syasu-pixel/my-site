# Auto Discussion Smoke Decision

Purpose: verify that a non-draft governance PR automatically starts a real AI editorial discussion without a manual workflow dispatch.

Proposed decision: keep the initial discussion scope narrow—EDITOR proposal, Gemini CHALLENGER response, and REVIEWER provisional disposition—then extend to EDITOR response and Gemini reassessment only after the first automatic trigger is proven.

Success criteria:
- the pull request event starts the discussion workflow automatically;
- Gemini reads the actual EDITOR turn and returns a structured response;
- the discussion transcript is saved as an artifact;
- no repository write or production publication occurs from the discussion workflow.

Retry note: the first run reached Gemini but exposed a structured-output schema incompatibility. The runtime has been corrected to use the proven `responseJsonSchema` format; this commit intentionally triggers the synchronized PR retry.
