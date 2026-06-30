# Interpretation Admissibility Gate

## Public-safe finding

**Core finding:** Interpretation should not enter the answer just because it is resonant, available, or aesthetically coherent. It should pass an admissibility gate first.

**Key phrase:** *Meaning may be invited. It is not automatically admitted.*

## Why this matters

Mirror Cartographer is designed to map body sensation, metaphor, color, symbol, and repeated emotional patterns while preserving boundaries between symbol and evidence. The public README already states that the system is not a therapy product, diagnostic authority, oracle, source database, or objective truth engine, and that it should preserve the boundary between symbol and evidence.

This research pass identifies a missing operational layer: a rule for deciding when symbolic interpretation is allowed to shape a user-facing output, and when it must remain quarantined as private/background orientation.

## Source status

- Public repository source: available. Canonical README inspected.
- File-library source: available as abstract architecture/context only.
- Saved/private context: used only to understand repeated architecture pressures; not quoted, exposed, or published.
- Fresh external research: available from 2026 AI-memory and memory-agent safety literature.
- Raw transcript source: unavailable in this run.
- Full repository code search: unavailable/not indexed through the connector.

## Claim status

- Directly supported: MC requires source status, claim status, evidence boundary, overreach checks, and user feedback loops.
- Directly supported: current AI-memory research treats memory retrieval/admission as a trust boundary, not a passive utility layer.
- Inference: MC needs an interpretation-specific admission gate because symbolic content can be relevant while still inappropriate, overclaiming, stale, or too private to use.
- Speculative: the exact UI placement of this gate has not yet been user-tested.

## Privacy status

- Public-safe: method, schema, product requirements, evaluation criteria, and abstract boundary rules.
- Not public-safe: personal examples, household examples, health examples, animal-care examples, financial examples, location examples, relationship examples, credentials beyond already-public repo author materials, or raw transcript fragments.
- Release rule: publish the gate; do not publish the private material that motivated it.

## Missingness

- No full raw conversation export was available.
- No comprehensive repository tree was available because code search was not indexed.
- No user-study evidence exists yet for whether users understand the admissibility labels.
- No automated CI check currently verifies that outputs obey this gate.

## Revision reason

Previous boundary layers covered privacy, evidence, temporal validity, release scope, context quarantine, public proof, and boundary stacking. This revision adds the narrower question: *even after privacy and evidence checks, may an interpretation enter the output?*

## Proposed admissibility classes

1. `admitted_reflection` — symbolic interpretation may appear, clearly labeled as reflection.
2. `admitted_question` — interpretation may appear only as a question or possible frame.
3. `admitted_summary` — interpretation may be compressed into a neutral summary without symbolic expansion.
4. `quarantined_private` — interpretation may inform architecture only; not shown publicly.
5. `quarantined_domain_boundary` — interpretation touches medical, psychological, legal, financial, veterinary, or emergency territory and cannot be presented as authority.
6. `rejected_overclaim` — interpretation converts resonance into proof, causality, diagnosis, certainty, or instruction.
7. `rejected_coercion` — interpretation narrows agency, demands belief, or makes disagreement feel like failure.
8. `needs_evidence` — interpretation can remain a hypothesis only until external evidence, user confirmation, or outcome feedback exists.

## Gate question

Before an interpretation shapes output, ask:

1. What is the source status?
2. What is the claim status?
3. What is the privacy status?
4. What domain boundary does it touch?
5. What would make the interpretation wrong?
6. What is missing?
7. Can the user safely disagree?
8. Does the wording separate symbol, inference, evidence, and action?

## Evaluation direction

A passing MC output should:

- label interpretation type;
- avoid presenting resonance as proof;
- preserve user agency;
- make uncertainty visible;
- avoid protected/private details;
- prevent cross-domain proof transfer;
- downgrade or quarantine interpretations that need evidence;
- expose missingness rather than hiding it;
- include a grounded next step when appropriate.

## Implementation plan

Add an `interpretation_admissibility` object to MC output records and use it before rendering any reflective or mythopoetic answer. The renderer should not show symbolic interpretation unless the object resolves to an admitted state.

## Public-safe index tags

- interpretation-admission
- symbolic-boundary
- evidence-boundary
- privacy-safe-method
- human-ai-reflection
- overreach-prevention
- agency-preservation
- memory-trust-boundary
