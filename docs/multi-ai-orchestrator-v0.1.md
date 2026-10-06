# Multi-AI Orchestrator v0.1

## Purpose

Move denkicontrol.com operations from chat-driven step-by-step execution to a persistent, auditable workflow that can continue across asynchronous jobs without requiring the owner to repeatedly say "すすめて".

The owner remains the authority at explicit human gates. The orchestrator coordinates work; it does not silently expand its own authority.

## v0.1 scope

The first implementation is intentionally small and provider-agnostic. It coordinates an editorial job through these states:

`QUEUED -> EDITING -> BUILDING -> CHALLENGING -> REVIEWING -> REVISING -> PREVIEWING -> HUMAN_GATE -> APPROVED -> PUBLISHING -> VERIFYING -> DONE`

Terminal exceptional states:

- `ESCALATED`: material disagreement, policy conflict, or unresolved risk requires human judgment.
- `FAILED`: infrastructure failure exceeded retry policy.
- `CANCELLED`: explicitly stopped.

## Core rules

1. `main` is never modified before the human publication gate for article/content work.
2. AI roles remain separate logical actors: EDITOR, BUILDER, CHALLENGER, REVIEWER. Provider assignments are replaceable.
3. CHALLENGER output is evidence, not an automatic command. REVIEWER adjudicates it.
4. A blocker/high finding cannot be silently ignored. It must be resolved, rejected with recorded evidence, or escalated.
5. Revision loops are bounded. v0.1 allows at most 3 BUILD/CHALLENGE/REVIEW revision cycles before escalation.
6. Infrastructure/API failures retry with bounded backoff; content disagreement is not treated as an infrastructure retry.
7. Every state transition is recorded with timestamp, actor/role, input artifact references, output artifact references, decision, and reason.
8. External model input is bounded and must not include repository secrets or private credentials.
9. Image generation/review remains a separate quality gate; final image adoption remains human-controlled under current policy.
10. Publication approval is resumable: the job can wait at HUMAN_GATE and continue after approval without reconstructing the workflow from chat history.

## Job record

Each job uses a durable JSON record. Minimum fields:

```json
{
  "schema_version": "0.1",
  "job_id": "...",
  "kind": "new_article|article_refresh|infrastructure",
  "state": "QUEUED",
  "topic": "...",
  "target_branch": "preview-...",
  "revision": 0,
  "max_revisions": 3,
  "human_gate": {
    "required": true,
    "status": "pending|approved|rejected"
  },
  "roles": {
    "editor": "...",
    "builder": "...",
    "challenger": "...",
    "reviewer": "..."
  },
  "artifacts": [],
  "events": []
}
```

The durable store must support atomic state transitions or equivalent concurrency protection. Git commits/state files may be used for the first prototype, but the design must not depend on Git as the permanent queue database.

## Transition policy

- EDITOR establishes scope, intent, duplicate/cannibalization check, evidence requirements, and acceptance criteria.
- BUILDER produces the requested artifact on a non-production branch.
- CHALLENGER independently attacks the result using bounded untrusted input.
- REVIEWER checks both the build and challenger claims.
- If REVIEWER says revise, return to BUILDING with explicit accepted findings and increment `revision`.
- If REVIEWER says adopt, continue to PREVIEWING.
- If material disagreement remains or revision limit is exceeded, enter ESCALATED.
- PREVIEWING runs automated HTML/link/layout checks and produces a preview URL.
- HUMAN_GATE waits durably for owner approval. No polling chat turn is required.
- APPROVED resumes publication to main, then VERIFYING checks deployment, discovery paths, and configured search-engine notification workflows.

## Retry policy

Infrastructure operations use bounded retries. Suggested v0.1 default: 3 attempts with increasing delay. Never retry indefinitely. Authentication/permission failures fail closed and should be surfaced as FAILED unless a known transient condition is demonstrated.

Model output validation failures are infrastructure/contract failures, not editorial disagreement. They may retry with the same bounded policy and then fail closed.

## Auditability

Do not store hidden chain-of-thought. Store concise auditable records instead:

- proposal/decision
- evidence references
- challenger findings
- reviewer disposition per material finding
- rejected alternatives
- confidence where available
- revision trigger
- human decision when applicable

This provides visible AI-to-AI governance without exposing private reasoning traces.

## Human gates in v0.1

Human input is required for:

- final article/content publication to `main`
- final image adoption
- unresolved material AI disagreement
- new external account/credential/payment authorization
- relaxation of safety/evidence principles

Normal AI role transitions, retries, revisions, preview creation, and infrastructure maintenance do not require repeated confirmation.

## Implementation phases

### Phase A — GitHub-native controller

Use GitHub Actions plus durable job-state artifacts/files to prove state transitions, bounded revision loops, external challenger invocation, preview handoff, and resumable human gate. This minimizes new infrastructure while validating the operating model.

### Phase B — persistent orchestration service

Move queue/state/waits to a persistent orchestration runtime. LangGraph is the preferred current candidate because the desired workflow is a state graph with human-in-the-loop and resumability. The provider binding must remain replaceable. Observability/evaluation can be added with LangSmith or an equivalent system after the controller behavior is proven.

Phase B requires a separate human gate before creating paid external infrastructure or credentials.

## v0.1 success criteria

A single non-production pilot job can:

1. start once;
2. move through multiple AI roles;
3. wait for asynchronous model/workflow results;
4. retry transient failures without user prompting;
5. perform at least one revision loop when required;
6. create a preview;
7. stop at a durable human gate;
8. resume after approval;
9. record an auditable event history;
10. never publish content to main before approval.
