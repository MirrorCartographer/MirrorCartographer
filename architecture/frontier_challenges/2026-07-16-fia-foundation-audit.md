# Frontier Challenge Record — FIA Foundation Audit

**Date:** 2026-07-16  
**Scope:** `architecture/FOUNDATION_INTELLIGENCE_ARCHITECTURE.md`, the integrated gate registry, and its validator  
**Method:** Attempt to falsify foundational claims without altering deployments, data, schedules, or shared infrastructure.

## Executive finding

The FIA specification is coherent as a conceptual constitution, but it currently overstates how much continuity, privacy, replaceability, and evidence discipline are operationally guaranteed. The strongest immediate risk is a gap between **named architecture** and **executable semantics**: several distinct gates exist only as aliases to one generic schema, so a passing test currently proves packet-shape compliance rather than domain-specific safety or epistemic validity.

This audit does not reject the architecture. It narrows claims, identifies missing invariants, and proposes reversible implementation steps.

---

## Challenge 1 — Continuous identity is asserted but not testable

**Claim challenged**  
Identity survives replacement of models, interfaces, databases, tools, and products through continuity of governing relationships, history, purpose, and translation.

**Falsification attempt**  
Replace two or more components simultaneously—for example, model provider and memory store—while preserving only exported content. Ask whether an independent evaluator can determine that the resulting system is the same system rather than a compatible reconstruction.

**Counterexample**  
Two implementations can contain identical records but apply different conflict-resolution rules, deletion semantics, symbol precedence, or routing policies. They may produce materially different behavior while both claiming continuity.

**Outcome**  
The identity claim is **under-specified**, not falsified. Content continuity is insufficient; behavioral and governance invariants are required.

**Refined design**

Define a versioned **Identity Invariant Set** containing at least:

1. provenance preservation rules;
2. observation/inference separation rules;
3. consent and deletion semantics;
4. contradiction resolution policy;
5. symbol ownership and override precedence;
6. model-router non-delegable constraints;
7. public/private boundary rules;
8. migration acceptance tests.

A migration should not be called identity-preserving until it passes invariant tests against a frozen evaluation corpus.

**Status:** design refinement required.

---

## Challenge 2 — “Models are replaceable” hides representation lock-in

**Claim challenged**  
Applications need not depend on a single model identity because the router can substitute cognitive engines.

**Falsification attempt**  
Route the same task through models with different context limits, tool protocols, safety policies, embedding spaces, structured-output reliability, and multimodal capabilities.

**Counterexample**  
A memory retrieval system built around one embedding model may silently change recall after an embedding migration. A prompt contract that works with one provider may lose uncertainty labels or tool-call fidelity with another. The model name is replaceable while the surrounding representation remains provider-shaped.

**Outcome**  
The claim is valid only at the orchestration layer. Full replaceability requires compatibility contracts and migration tests.

**Safer reversible alternative**

Introduce a **Model Capability Contract** with explicit fields for context size, modalities, tool syntax, structured-output guarantees, calibration profile, data handling, latency, cost, and known failure classes. Add shadow evaluation before traffic migration and retain rollback to the previous route.

**Unresolved question**  
Which outputs are allowed to vary by model, and which are architecture-level invariants?

**Status:** narrowed claim; contract missing.

---

## Challenge 3 — The Reader creates a surveillance hazard

**Claim challenged**  
Drafts, deleted revisions, pauses, cursor behavior, silence, and abandoned concepts can improve perception when permission is explicit.

**Falsification attempt**  
Assume consent is technically valid but psychologically non-salient, stale, bundled, or granted under pressure. Then test whether deleted or abandoned material can influence later outputs after the user believes it is gone.

**Counterexample**  
A user deletes a draft precisely because it is not endorsed. The Reader interprets deletion as meaningful and stores a derived hypothesis. The raw draft is erased, but its semantic residue persists in memory, violating the user’s practical expectation of deletion.

**Outcome**  
“Explicit permission” is insufficient. Derived data and downstream influence must be governed with the source.

**Refined design**

Use purpose-specific, time-bounded consent with separate controls for capture, interpretation, storage, training, and later retrieval. Implement **derived-data lineage deletion** so erasing a draft either erases dependent inferences or marks them unusable unless independently supported.

Default mode should process draft telemetry locally and ephemerally, with no longitudinal promotion.

**Status:** high-priority privacy invariant missing.

---

## Challenge 4 — Bidirectional translation can create false confidence

**Claim challenged**  
Important transformations should be testable in both directions.

**Falsification attempt**  
Round-trip ambiguous, culturally situated, lossy, or many-to-one representations.

**Counterexample**  
Several human meanings can compile to the same operation, while reverse translation returns only one plausible explanation. Round-trip consistency can pass syntactically while erasing ambiguity. Symbol-to-operation translation is especially non-bijective.

**Outcome**  
Bidirectionality is useful but does not prove semantic fidelity.

**Refined design**

Replace “round-trip test” as the implied criterion with a **transformation evidence packet** containing:

- source representation;
- candidate target representations;
- preserved invariants;
- known losses;
- ambiguity set;
- contextual assumptions;
- irreversible decisions;
- human verification requirement.

**Status:** test interpretation refined.

---

## Challenge 5 — Smallest-sufficient context may erase weak but decisive signals

**Claim challenged**  
Figure–ground selection reduces cost by constructing the smallest sufficient context.

**Falsification attempt**  
Construct cases where a low-frequency historical detail changes the correct interpretation of an active request, but relevance scoring suppresses it.

**Counterexample**  
A single past correction—such as “do not treat recurrence as causality”—may be less semantically similar than many repeated symbolic descriptions, yet it should override them. Compression optimized for topical relevance can erase governance-relevant exceptions.

**Outcome**  
“Sufficient” cannot be defined solely by semantic similarity or recency.

**Safer reversible alternative**

Use dual retrieval:

1. task-relevant context;
2. mandatory invariant and exception context.

Log excluded high-risk items and support replay with expanded context when confidence is low or consequences are high.

**Status:** routing refinement required.

---

## Challenge 6 — Evidence states are labels without calibration rules

**Claim challenged**  
Explicit states such as observed, measured, reported, derived, inferred, contradicted, and unresolved preserve epistemic boundaries.

**Falsification attempt**  
Assign the same claim different states depending on source granularity and aggregation. Ask whether two operators would classify it consistently.

**Counterexample**  
A user-reported measurement can simultaneously be “reported” and “measured.” A derived claim may also be contradicted by later evidence. The current list appears mutually exclusive but the underlying dimensions are orthogonal.

**Outcome**  
A single `claim_status` field risks collapsing source mode, derivation mode, conflict state, and lifecycle state.

**Refined design**

Separate at least four dimensions:

- **source mode:** direct observation, instrument, testimony, document, model output;
- **derivation mode:** raw, normalized, calculated, inferred, hypothesized;
- **support state:** supported, mixed, contradicted, unsupported, unknown;
- **lifecycle state:** active, superseded, retracted, unresolved.

Confidence and consequence should remain separate fields.

**Status:** schema decomposition recommended.

---

## Challenge 7 — Eighteen named gates currently implement one generic gate

**Claim challenged**  
The integrated suite prevents packets from entering memory or research routes when provenance, privacy, missingness, actionability, temporality, controls, or operational variables are collapsed.

**Evidence**  
The registry defines one full `longitudinal_missingness_gate`; every other named gate is a `$ref` to it. The validator resolves each alias to the same required fields, blocked flags, and allowed decisions. It verifies field presence, missingness labels, some boundary flags, and minimum observation structure.

**Falsification attempt**  
Create a packet that is structurally valid but temporally incoherent, culturally invalid, causally unsupported, poorly controlled, or semantically mistranslated while avoiding the enumerated blocked flags.

**Counterexample**  
A `temporal_coherence_gate` packet can pass without timestamps, temporal ordering, interval semantics, clock source, or contradiction checks because the shared schema requires none of them. A `control_condition_gate` packet can pass without a control group or comparator.

**Outcome**  
The executable suite currently proves **generic packet hygiene**, not the distinct semantics implied by each gate name. The public claim should be narrowed until gate-specific validators exist.

**Refined design**

Keep the shared base schema, but add per-gate requirements and validators. Initial minimums:

- temporal coherence: event time, observation time, timezone, ordering constraints;
- provenance chain: source identifiers, transformation lineage, integrity checks;
- consent scope: actor, purpose, data classes, expiration, revocation state;
- control condition: comparator definition, assignment logic, contamination risks;
- variable drift: versioned variable definitions and compatibility rules;
- symbolic translation: user-owned meaning, operational candidate, loss statement;
- literature strength: study type, population, effect uncertainty, external validity.

**Status:** concrete implementation gap; highest engineering priority.

---

## Challenge 8 — Validator success can be mistaken for real-world safety

**Claim challenged**  
Synthetic fixtures and smoke tests provide an executable evidence gate.

**Falsification attempt**  
Pass all synthetic fixtures, then evaluate adversarial packets, malformed nested values, contradictory flags, duplicate evidence, prompt-injected fields, and domain-specific edge cases.

**Counterexample**  
The validator checks whether fields exist and whether listed flags block `pass`; it does not verify the truth of provenance, consent, measurements, or interpretations. A malicious or mistaken producer can self-label unsafe content as safe.

**Outcome**  
The validator is useful as a schema gate but cannot be treated as a trust oracle.

**Safer reversible alternative**

Layer controls:

1. JSON/schema validation;
2. deterministic semantic checks;
3. provenance verification;
4. adversarial fixture suite;
5. independent policy evaluator;
6. human review for high-consequence routes;
7. post-deployment audit and rollback.

Rename test output from “gate integration passed” to “packet conformance checks passed” until semantic validators exist.

**Status:** claim correction and test expansion recommended.

---

## Challenge 9 — Learning loop risks training on system-generated interpretations

**Claim challenged**  
Interactions can flow through evaluation, failure taxonomy, dataset curation, training, and verification.

**Falsification attempt**  
Allow model-generated summaries, inferred symbols, or evaluator judgments to enter the curated dataset without durable lineage and independent confirmation.

**Counterexample**  
The system repeatedly trains on its own earlier interpretations, increasing consistency while decreasing contact with external reality. Evaluation may reward agreement with prior system outputs rather than truth or user-corrected meaning.

**Outcome**  
The learning loop needs anti-recursion controls.

**Refined design**

Every training example should identify origin, human contribution, model contribution, correction history, consent scope, and whether the target is externally verified. Maintain an untouched holdout set sourced independently of the production model family. Prohibit inferred private history from weight training by default.

**Status:** dataset governance invariant missing.

---

## Challenge 10 — “User control” conflicts with distributed copies and public artifacts

**Claim challenged**  
Memory is portable and deletable, and users control memory, privacy, permissions, and deletion.

**Falsification attempt**  
Trace one record through logs, caches, embeddings, backups, analytics, exported files, derived graphs, model-provider retention, public research maps, and Git history.

**Counterexample**  
Deletion from the primary graph does not delete an embedding, backup, published artifact, or immutable Git commit. Absolute deletion may be technically or legally impossible after publication.

**Outcome**  
The architecture should promise **bounded deletion semantics**, not universal erasure.

**Refined design**

Create a data-location registry and deletion contract that states:

- deletable stores;
- retention windows;
- immutable or externally controlled copies;
- tombstone behavior;
- derived-data handling;
- verification method;
- user-visible exceptions before publication.

**Status:** claim must be bounded and operationalized.

---

## Priority order

### P0 — before sensitive longitudinal operation

1. Derived-data lineage and deletion semantics.
2. Consent scope object with revocation behavior.
3. Gate-specific semantic validators.
4. Identity invariant set and migration acceptance tests.

### P1 — before model or storage migration

1. Model capability contracts and shadow evaluation.
2. Representation and embedding migration tests.
3. Dual retrieval for task context plus mandatory invariants.
4. Four-dimensional evidence-state schema.

### P2 — before owned-model training

1. Dataset lineage and anti-recursion policy.
2. Independent holdout evaluations.
3. Explicit prohibition on default training from inferred private history.

---

## Immediate reversible engineering packet

The next implementation should avoid broad rewrites. Add:

1. `architecture/invariants/identity_invariants.v0.1.json`;
2. `schemas/consent_scope.schema.json`;
3. `schemas/evidence_state.schema.json` with orthogonal dimensions;
4. gate-specific schema overlays under `tools/mc_gate_integration/gates/`;
5. adversarial fixtures for structurally valid but semantically invalid packets;
6. CI language that distinguishes conformance from safety.

All additions can coexist with the current architecture and be removed or revised without migrating existing data.

## Final disposition

The foundational direction survives the audit. The strongest claims should be treated as **design objectives** until backed by invariants, migration tests, lineage-aware deletion, and gate-specific semantics. The present executable suite is a useful base conformance layer, but it does not yet justify claims that all named epistemic and safety boundaries are enforced.