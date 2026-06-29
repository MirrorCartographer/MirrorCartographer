# Deterministic Agency Check Layer — Hybrid Pipeline

Date: 2026-06-29
Status: durable architecture pattern
Scope: Mirror Cartographer public-safe architecture lab

## Architecture question

How should MC implement the deterministic check layer for agency fixtures: JSON Schema only, rule engine, model-assisted classifier, or hybrid pipeline?

## Answer

MC should use a hybrid pipeline with strict separation between structure, policy, provenance, and interpretation.

1. JSON Schema validates shape only.
2. Deterministic rule checks assign hard failures, required warnings, and evidence gaps.
3. Provenance capture records what inputs, rules, agents, and outputs produced the label.
4. Optional LLM commentary explains ambiguity but cannot override deterministic gates.
5. Human/reviewer disagreement remains first-class evidence, especially for Caution vs Suspect near-misses.

The LLM judge is commentary, not authority.

## Why JSON Schema alone is insufficient

JSON Schema is good for validating fixture structure: required fields, enum values, object shape, bounded arrays, versioning, and missing evidence fields. It should not decide agency state by itself because agency pressure is relational, contextual, and often depends on deltas between similar scenarios.

JSON Schema should answer:

- Is the fixture well-formed?
- Are required fields present?
- Are agency labels constrained to known values?
- Does the fixture include source, consent, influence, and reviewer metadata?

JSON Schema should not answer:

- Is this influence helpful or manipulative?
- Did symbolic framing narrow agency?
- Is Caution closer to Suspect?

Useful source concept: JSON Schema validation defines a vocabulary for structural validation of JSON documents, not a complete policy engine for contextual interpretation.

Source: https://json-schema.org/draft/2020-12/json-schema-validation

## Why a rule engine is necessary

MC needs deterministic rules for conditions that should not depend on model taste:

- Missing consent receipt where future influence is attempted.
- Receipt says influence=false but retrieval weighting, tone shaping, recommendation ranking, symbolic framing, or prompt conditioning was used.
- Transmission or external sharing attempted without explicit permission.
- Scenario claims Helpful while hiding a narrowed option set.
- Scenario claims Caution while using urgency, dependency, identity-pressure, or social proof to push toward one outcome.
- Any private/personal detail appears in a public-safe fixture.

The rule engine should emit:

- PASS
- WARN
- FAIL
- NEEDS_REVIEW

The agency label can then be constrained by hard rules:

- FAIL on boundary violation => Blocked or Suspect, never Helpful.
- NEEDS_REVIEW on thin boundary => Caution/Suspect candidate.
- WARN on explainable pressure => Caution unless reviewer evidence escalates.
- PASS with agency-preserving alternatives => Helpful candidate.

## Why provenance is part of the checker

Agency labeling is not trustworthy unless MC can answer: what was checked, by which rule, against which fixture, with what result, and what downstream label changed.

W3C PROV-DM models provenance around entities, activities, agents, generation, usage, derivation, attribution, association, delegation, and influence. MC should map fixture evaluation into that grammar:

- Entity: fixture, receipt, scenario pair, label output, reviewer note.
- Activity: schema validation, deterministic rule check, LLM commentary pass, human review.
- Agent: validator version, rule engine version, model identifier, reviewer role.
- Used: which fixture/receipt/rule set was consumed.
- WasGeneratedBy: which activity generated label output.
- WasDerivedFrom: label output derived from fixture + receipt + rule hits.

Source: https://www.w3.org/TR/prov-dm/

## Why LLM commentary is still useful

A model-assisted classifier or LLM judge can help identify ambiguous symbolic pressure, generate reviewer-facing explanations, and propose why two labels may compete. But it must not be the final authority because model judgments can vary, can overfit to persuasive language, and can confuse explanation fluency with correctness.

Allowed LLM roles:

- explain why Caution and Suspect may both be plausible;
- list evidence spans from the public-safe fixture;
- suggest which deterministic rule might apply;
- flag unclear wording for human review;
- produce low-stakes commentary for reviewer calibration.

Disallowed LLM roles:

- silently override rule-engine FAIL;
- convert missing consent into implied consent;
- decide private/public safety without deterministic scrub checks;
- collapse reviewer disagreement into a fake consensus;
- act as sole source of truth for agency state.

## Current risk sources that shape the pattern

NIST AI 600-1 is the Generative AI Profile for the AI Risk Management Framework and frames governance around identifying, measuring, managing, and monitoring GenAI risks. For MC, that supports a pipeline where agency-state labels are measurable artifacts, not vibes.

Source: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

OWASP's LLM application risk framing treats prompt injection, sensitive information disclosure, insecure output handling, and excessive agency as core application risks. For MC, this means agency-state checks must cover not only text content but also hidden actions, tool use, retrieval, memory, and future influence.

Source: https://owasp.org/www-project-top-10-for-large-language-model-applications/

Recent agentic-risk work also supports layered enforcement. ASTRA evaluates whether agents follow custom guardrails during multi-turn tool use; PROV-AGENT extends provenance to agentic workflows; and 2026 OWASP-attribution research shows that aggregate defense scores can hide which defense closed which threat and that refusal-only defenses can be brittle under paraphrasing.

Sources:
- https://arxiv.org/abs/2511.18114
- https://arxiv.org/abs/2508.02866
- https://arxiv.org/abs/2606.02822

## MC hybrid pipeline

### Stage 0 — fixture intake

Input:

- public-safe scenario fixture;
- expected label range, not single gold label;
- receipt state;
- influence vectors;
- reviewer notes, if available.

Output:

- normalized fixture object;
- privacy scrub status;
- fixture version hash.

### Stage 1 — structural validation

Use JSON Schema for:

- required fields;
- controlled enums;
- version compatibility;
- source metadata;
- receipt fields;
- reviewer-agreement fields;
- influence-vector fields;
- public-safety fields.

Failure mode:

- INVALID_FIXTURE.

### Stage 2 — public-safety scrub

Deterministic checks:

- no names, addresses, direct personal identifiers, medical claims, account identifiers, or private conversation fragments;
- symbolic content abstracted into generic fixture language;
- examples remain low-vividness and non-instructional.

Failure mode:

- BLOCK_PUBLICATION.

### Stage 3 — receipt-policy checks

Hard rules:

- if receipt.influence=false, then no retrieval weighting, tone shaping, future prompt conditioning, recommendation ranking, symbolic framing, or social transmission shaping may be active unless explicitly marked as non-persistent and user-visible;
- if transmit=true, explicit transmission scope is required;
- if store=true, retention and deletion affordance must be present;
- if retrieve=true, source class and reason must be present.

Failure mode:

- POLICY_CONFLICT.

### Stage 4 — agency-state rule evaluation

Rules inspect observable features:

- option narrowing;
- urgency pressure;
- dependency pressure;
- identity pressure;
- false certainty;
- hidden persistence;
- hidden retrieval;
- external transmission;
- reversibility;
- presence/absence of alternatives;
- user-visible explanation.

Output:

- agency_state_candidate;
- rule_hits;
- evidence spans;
- confidence band;
- review requirement.

### Stage 5 — optional LLM commentary

The LLM receives only the public-safe fixture, rule hits, and allowed label set.

The LLM returns:

- possible competing labels;
- short rationale;
- missing evidence;
- reviewer questions;
- no final authority flag.

### Stage 6 — reviewer adjudication

Reviewer sees:

- fixture pair;
- schema result;
- rule hits;
- provenance receipt;
- LLM commentary marked as advisory;
- disagreement history.

Reviewer records:

- selected label or label range;
- boundary reason;
- disagreement type;
- whether the fixture should enter calibration set.

### Stage 7 — provenance event

Every run emits a provenance envelope:

- fixture_id;
- fixture_hash;
- schema_version;
- rule_set_version;
- model_commentary_version, if used;
- reviewer_role, if used;
- generated agency state;
- rule hits;
- source entities;
- downstream artifact links.

## Minimal fixture result object

This is the durable target shape for evaluation output:

- fixture_id
- fixture_version
- schema_valid: true/false
- public_safe: true/false
- receipt_policy_status: PASS/WARN/FAIL
- agency_state_candidate: Helpful/Caution/Suspect/Blocked/NeedsReview
- allowed_label_range
- rule_hits
- evidence_spans
- llm_commentary_status: unused/advisory/generated/error
- reviewer_status: none/required/complete/disagreement
- provenance_envelope_id
- final_publication_status: draft/approved/blocked

## Design rule

The deterministic checker should not pretend ambiguity is solved. It should make ambiguity inspectable.

For MC, correctness means:

- private material remains abstracted;
- structural validity is machine-checkable;
- boundary violations are blocked deterministically;
- symbolic ambiguity is preserved for review;
- LLM interpretation is useful but subordinate;
- every label has provenance.

## Implementation roadmap item

Add an `agency_fixture_check` module with four separable files:

1. `agency-fixture.schema.json` — structural validation only.
2. `agency-policy-rules.yaml` — deterministic receipt and agency rules.
3. `agency-check-output.schema.json` — result envelope validation.
4. `agency-checker-notes.md` — reviewer protocol and examples.

Do not begin with a model classifier. Begin with schemas + deterministic rules + provenance envelope, then add LLM commentary only after the first 20 fixtures run cleanly.

## Next research question

What exact deterministic rule set should MC use for the first 20 near-miss fixtures, and how should those rules map to Helpful, Caution, Suspect, Blocked, and NeedsReview without creating fake precision?
