# Origin Classifier

Date: 2026-07-02
Status: public-safe research note

## Core finding
Mirror Cartographer needs an Origin Classifier: a boundary-preserving layer that labels whether a system object came from user input, model interpretation, external source material, interface state, implementation behavior, or evaluation result before that object can be promoted into memory, evidence, export, product requirement, or public claim.

## Operating line
A map must know whether a signal was received, inferred, designed, tested, or imagined before it is allowed to guide action.

## Source status
- Source material reviewed: File Library snippets and accessible parsed files about Mirror Cartographer architecture, implementation, connector logic, solver graph boundaries, and existing public-safe definitions.
- GitHub material reviewed: installed repository discovery confirmed `MirrorCartographer/MirrorCartographer` as the public repository and `MirrorCartographer/mirror-cartographer-ui` as private UI infrastructure.
- Private-context use: used only as architecture orientation; no private facts, personal records, household details, health details, animal-care details, financial facts, location data, relationship details, credentials, or raw transcript content are included here.
- Source limitation: file-library access is partial and chunk-based; this note is a distilled architecture finding, not a complete archive audit.

## Claim status
- Claim type: product architecture requirement.
- Claim strength: design-grounded, not externally validated.
- Evidence class: internal architecture synthesis from existing MC requirements and boundary patterns.
- Not claimed: clinical efficacy, diagnostic validity, user outcome proof, market proof, full implementation, or complete provenance coverage.

## Privacy status
- Public-safe: yes.
- Raw-source exposure: none.
- Personal-data exposure: none.
- Sensitive-domain exposure: none.
- Public export allowed: yes, as an abstract method / requirement note.

## Missingness
- No full raw conversation export was available in this run.
- Code-search indexing was unavailable for the discovered repositories at discovery time, so repository content inspection was limited.
- No live product telemetry, user study data, or deployment logs were used.
- No external literature review was performed for this increment.

## Requirement
Every MC object that can persist, influence routing, appear in an export, support a claim, or enter an evaluation must carry an `origin_class`.

Suggested origin classes:

1. `received_user_signal` — directly provided by a user in-session.
2. `user_confirmed_pattern` — confirmed across feedback or recurrence.
3. `model_interpretation` — generated reflection or inference.
4. `source_bound_reference` — grounded in an external or uploaded source.
5. `interface_state` — produced by UI interaction, mode selection, consent setting, or navigation.
6. `implementation_artifact` — produced by code, schema, repo file, build log, or deployment state.
7. `evaluation_result` — produced by a test, benchmark, review, rubric, or measurement.
8. `speculative_construct` — creative, mythopoetic, hypothetical, or exploratory material.
9. `unknown_or_mixed_origin` — origin unclear, blended, missing, or not safely separable.

## Routing rule
- `received_user_signal` may enter reflection, but not public evidence by itself.
- `user_confirmed_pattern` may enter bounded memory, subject to consent and privacy gates.
- `model_interpretation` may be useful, but must not be treated as evidence without support.
- `source_bound_reference` may support claims only within its stated source boundary.
- `interface_state` may guide UX continuity, but not identity claims.
- `implementation_artifact` may support build status claims, but not user-outcome claims.
- `evaluation_result` may support measured claims only inside its test scope.
- `speculative_construct` must stay labeled as symbolic, creative, or hypothetical.
- `unknown_or_mixed_origin` must be quarantined until reclassified or explicitly marked uncertain.

## Evaluation criteria
A valid MC reflection/export passes the Origin Classifier if:

- Each persisted object has an origin label.
- Each claim cites or names its origin class.
- Mixed-origin objects are not silently promoted.
- Model-generated material is visually and semantically separable from user-provided material.
- Public artifacts expose method and boundary, not private payload.
- Revision records preserve why the origin label changed.

## Revision reason
This note extends the prior source-boundary, evidence-lane, memory-classification, claim-promotion, and public-safe trace work by adding a lower-level primitive: before MC can decide what a signal is allowed to become, it must first know where that signal came from.
