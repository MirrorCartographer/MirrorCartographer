# PRD: Interpretation Admissibility Gate

## Product problem

Mirror Cartographer can generate symbolic reflections that feel coherent. Coherence alone does not mean an interpretation should be rendered, remembered, escalated, or treated as guidance.

## Product goal

Add a gate between symbolic interpretation generation and user-facing rendering.

The gate decides whether an interpretation is:

- safe to show as reflection;
- safe only as a question;
- safe only as neutral summary;
- private-context-only;
- blocked by domain boundary;
- rejected as overclaim;
- rejected as coercion;
- waiting for evidence.

## Non-goals

- Do not diagnose.
- Do not replace therapy, medical care, veterinary care, legal advice, financial advice, or emergency support.
- Do not publish private examples.
- Do not convert symbolic recurrence into factual proof.
- Do not make the user accept an interpretation.

## Users

- People using symbolic, emotional, somatic, visual, or nonlinear language to reflect.
- Researchers evaluating human-AI reflection boundaries.
- Builders testing long-context memory and overreach behavior.
- Reviewers checking whether MC output preserves uncertainty and agency.

## Core requirements

1. Every reflective output must include an internal admissibility decision.
2. Public/demo output must show human-readable labels for source status, claim status, privacy status, and evidence boundary.
3. Health-adjacent, animal-care-adjacent, legal-adjacent, financial-adjacent, relationship-adjacent, location-adjacent, and credential-adjacent content must trigger stricter rendering limits.
4. Mythopoetic mode may change tone, not claim authority.
5. The system must preserve a path for correction and disagreement.
6. The gate must expose missingness.
7. The gate must log revision reasons when interpretation is downgraded or blocked.

## UI requirements

- Display `Interpretation status` near the output.
- Use short labels: `Reflection`, `Question only`, `Summary only`, `Quarantined`, `Needs evidence`, `Rejected overclaim`, `Rejected coercion`.
- Show `Why this label?` expandable text.
- Show `What would change this?` for hypotheses.
- Offer feedback buttons: `Fits`, `Does not fit`, `Too certain`, `Too vague`, `Private / do not use`, `Needs evidence`.

## Data requirements

Persist only public-safe admission metadata by default. Do not persist protected source fragments unless the user explicitly owns and exports them through a private archive path.

## Acceptance criteria

A release candidate passes when:

- 100% of generated reflective outputs contain an admissibility record.
- No high-risk domain fixture renders symbolic interpretation as factual authority.
- No fixture publishes protected personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail.
- User disagreement always downgrades or reopens the interpretation.
- Missingness is visible in every non-factual output.
- Evaluation scorecards can reproduce why the output was admitted, downgraded, quarantined, or rejected.

## Public-safe release note

This feature does not prove MC interpretations are true. It proves the interface can decide what kind of claim an interpretation is allowed to become.
