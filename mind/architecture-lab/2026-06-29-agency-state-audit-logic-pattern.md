# Agency State Audit Logic Pattern

Public-safe architecture note for Mirror Cartographer.

## Question

How can MC assign the response ribbon states `Helpful`, `Caution`, `Suspect`, and `Blocked` without exposing private reasoning or creating a heavy compliance dashboard?

## Finding

The agency marker should not be guessed from hidden reasoning. It should be assigned from a small audit envelope made of observable events around a response.

Useful concepts from current sources:

- NIST AI RMF treats risk management as lifecycle work across design, development, use, and evaluation.
- OWASP GenAI 2025 usefully separates risks such as prompt injection, sensitive information disclosure, excessive agency, vector weakness, and misinformation.
- W3C PROV gives a simple model for trust records: entities, activities, agents, usage, generation, derivation, and attribution.
- Recent agent-governance work points toward continuous checks, explainable policy decisions, behavioral monitoring, and accountability hooks.
- Recent defense-evaluation work shows that one aggregate safety score is not enough; each control should be mapped to the risk it handles.

## Design decision

Attach a response-level audit envelope before assigning the ribbon state.

The envelope records:

1. Active memory state: now-only, session memory, future lens, or exportable.
2. Influence actions: retrieve, store, tone-shape, rank, frame, guardrail, or transmit.
3. Risk signals: sensitivity, uncertainty, external action, persuasion pressure, option narrowing, and provenance quality.
4. Controls applied: blocked, downgraded, explained, confirmation required, or none.
5. Public explanation: one short phrase safe to show in the ribbon.

## Classifier

### Helpful

Use when the response supports the stated task and preserves options.

Conditions:

- Action is allowed by the active receipt.
- No storage or export occurs without permission.
- The response clarifies choices instead of narrowing them.
- Uncertainty is disclosed when it matters.

Example ribbon: `Helpful: used session context; no storage or export.`

### Caution

Use when the response is allowed but has meaningful agency impact.

Conditions:

- Topic is sensitive or uncertain.
- Future lens affects wording.
- A recommendation is made, but alternatives remain visible.
- Strong interpretation is present.

Example ribbon: `Caution: strong interpretation shaped this response.`

### Suspect

Use when influence may be steering too hard even if it is not clearly forbidden.

Conditions:

- Personalization shapes identity, preference, or action.
- Ranking pushes one path without enough evidence.
- Provenance for a strong claim is weak.
- A memory signal conflicts with the current session boundary.

Example ribbon: `Suspect: personalization may be steering the answer.`

### Blocked

Use when an attempted influence action conflicts with the active boundary.

Conditions:

- Store, retrieve, influence, or transmit conflicts with the receipt.
- External sharing lacks explicit permission.
- A source tries to shape the system outside its allowed role.

Example ribbon: `Blocked: active boundary disallowed this influence.`

## Minimal schema

- response_id
- receipt_id
- memory_state
- influence_actions[]
- risk_signals
- controls_applied[]
- agency_state
- visible_ribbon
- private_reasoning_exposed: false

## Deterministic order

1. If a boundary conflict exists, assign Blocked.
2. Else if provenance is weak and framing is strong, assign Suspect.
3. Else if sensitivity, uncertainty, future influence, or recommendation pressure is material, assign Caution.
4. Else assign Helpful.

## Requirements

- R-AGENCY-01: Every agency marker must be derived from an audit envelope, not private reasoning text.
- R-AGENCY-02: Every marker must expose a short public-safe explanation.
- R-AGENCY-03: Every store, retrieve, influence, or transmit attempt must be logged as an influence action.
- R-AGENCY-04: Blocked must win over smoothness when a boundary conflict exists.
- R-AGENCY-05: Suspect must remain a protective liminal state, not an accusation.

## Prototype plan

1. Generate response candidate.
2. Build audit envelope from observable events.
3. Assign agency state using deterministic rules.
4. Attach ribbon label.
5. If Blocked, suppress or rewrite the response and show the blocked reason.

## Falsification tests

The pattern fails if users cannot predict why a label appeared, if Helpful becomes the default for all personalization, if Suspect feels punitive, or if the envelope records labels without recording actual influence actions.

## Next research question

Can deterministic agency-state rules remain accurate when symbolic interpretation is ambiguous, or does MC need a small evaluation set of labeled influence scenarios?
