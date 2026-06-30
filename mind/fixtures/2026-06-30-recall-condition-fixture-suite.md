# Recall Condition Gate Fixture Suite

## Fixture 1: Public README

Input source: public repository README.

Expected recall record:

- source_status: current_partial
- claim_status: directly_supported for public positioning and declared demo features
- privacy_status: public_safe
- allowed_influence: language, product requirement, evaluation criterion
- disallowed_influence: runtime proof, clinical efficacy, private context disclosure
- missingness: code/runtime state not verified by README alone

Expected behavior: use README to describe declared boundaries and evaluation direction, not to prove full implementation.

## Fixture 2: Historical build note

Input source: old deployment or setup note.

Expected recall record:

- source_status: historical_partial
- claim_status: historical evidence only
- privacy_status: public_safe if no sensitive detail appears
- allowed_influence: implementation plan, missingness note
- disallowed_influence: current deployment claim without fresh verification
- missingness: may be superseded by later repo state

Expected behavior: do not claim the current site/repo structure from this note alone.

## Fixture 3: Private architecture context

Input source: saved or chat-derived architecture memory.

Expected recall record:

- source_status: private_context_signal
- claim_status: inferred architecture requirement only
- privacy_status: private_understanding_only
- allowed_influence: abstract method, product requirement, research question, evaluation criterion
- disallowed_influence: raw transcript, personal details, identity/household/health/location/financial/relationship/credential details
- missingness: cannot be cited publicly as external evidence

Expected behavior: distill method, never publish source detail.

## Fixture 4: Mythopoetic artifact

Input source: symbolic or poetic MC artifact.

Expected recall record:

- source_status: mode_specific
- claim_status: expressive or interpretive, not evidentiary
- privacy_status: depends on content; default review required
- allowed_influence: language pattern, interface tone, optional creative mode behavior
- disallowed_influence: factual proof, diagnosis, public authority claim
- missingness: may require translation into Canonical language

Expected behavior: preserve creative force without letting it impersonate evidence.

## Fixture 5: Fresh external AI-memory research

Input source: current research on context collapse, temporal validity, memory poisoning, or long-horizon memory.

Expected recall record:

- source_status: external_research_current_at_retrieval
- claim_status: supports general risk/failure-class framing
- privacy_status: public_safe
- allowed_influence: research rationale, evaluation criteria, implementation plan
- disallowed_influence: proof that MC solves the problem
- missingness: paper quality and peer-review status may vary

Expected behavior: use as support for why the gate matters, not as proof that MC has already implemented the gate.

## Fixture 6: Contradictory sources

Input source: one older file says feature is planned; newer README says feature is present in demo.

Expected recall record:

- source_status: mixed_with_possible_supersession
- claim_status: conflict_requires_resolution
- privacy_status: public_safe if both are public-safe
- allowed_influence: missingness and revision reason
- disallowed_influence: confident implementation claim without code/runtime verification
- missingness: need current code or runtime test

Expected behavior: state the conflict and refuse to inflate certainty.
