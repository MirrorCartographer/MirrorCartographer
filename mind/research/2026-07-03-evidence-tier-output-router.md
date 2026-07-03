# Evidence-Tier Output Router

## Core finding

Mirror Cartographer needs an **Evidence-Tier Output Router**: a runtime layer that decides what kind of output an input is allowed to become based on evidence tier, source boundary, audience, consent layer, and risk context.

Operating line:

> A signal should not be routed into advice, publication, memory, or action until the system knows what kind of evidence it is.

---

## Source status

- **Available source class:** prior Mirror Cartographer architecture chats, uploaded project exports, public-safe project documents, and connected GitHub repository context.
- **Private-context use:** private material was used only to understand recurring architecture needs and failure modes.
- **Public-safe source material used:** abstracted project architecture only: symbolic-state mapping, consent-bounded persistence, provenance-aware memory, meaning integrity evaluation, runtime modes, and governance/observability framing.
- **Excluded source material:** personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details.

---

## Claim status

- **Claim type:** product architecture requirement.
- **Claim strength:** design hypothesis, not validated implementation.
- **Evidence basis:** repeated architectural convergence across MC materials around truth separation, provenance, consent, memory boundaries, and evaluation criteria.
- **Not claimed:** no claim that this router currently exists in production; no claim of clinical, therapeutic, diagnostic, or safety-critical validation.

---

## Privacy status

- **Privacy classification:** public-safe method note.
- **Redaction posture:** no private examples, no raw user text, no household facts, no identifying experiential details.
- **Allowed public use:** can be used as a GitHub architecture note, product requirement, implementation prompt, or evaluation scaffold.
- **Disallowed public use:** must not be backfilled with raw transcripts or examples that reveal private origin material.

---

## Missingness

- No full repository audit was possible from code search alone; repository search did not surface the prior research-note files by title.
- No automated static implementation scan was completed in this run.
- No live UI behavior was tested.
- No claim is made that existing MC code already enforces the routing contract.

---

## Meaningful revision reason

Prior notes established boundaries around provenance, claim lifecycle, consent gradients, audience partitions, publication linting, runtime mode integrity, and external verification. This note adds the missing **routing layer** between those controls and actual outputs.

Without a router, MC may know that a signal is symbolic, inferred, observed, externally verified, or speculative, but still fail to decide what that signal is allowed to become.

---

## Problem

Reflection systems often collapse multiple epistemic states into one surface form. A symbolic resonance, remembered pattern, private inference, user report, external source, and verified fact may all become a similarly confident paragraph.

For MC, that collapse is dangerous because the system intentionally works with high-meaning material. High meaning is not the same as high evidence.

The system therefore needs a routing decision before output generation:

1. What is the source type?
2. What is the evidence tier?
3. What is the risk level?
4. What audience will see it?
5. What consent layer permits it?
6. What output class is allowed?
7. What uncertainty label must remain attached?

---

## Proposed evidence tiers

### Tier 0 — Private symbolic signal

- Origin: user-owned or session-owned meaning, image, metaphor, emotion, or felt sense.
- Allowed outputs: reflection, journaling prompt, symbolic map, private state graph.
- Disallowed outputs: factual claim, diagnosis, public proof, external recommendation.

### Tier 1 — User-reported observation

- Origin: user describes an event, sensation, preference, constraint, or pattern.
- Allowed outputs: structured summary, question map, preparation checklist, decision support.
- Disallowed outputs: verification claim unless externally checked.

### Tier 2 — System inference

- Origin: AI derives a pattern from context.
- Allowed outputs: hypothesis, candidate interpretation, product insight, research question.
- Disallowed outputs: certainty, instruction, externalized public claim without review.

### Tier 3 — Internal artifact pattern

- Origin: repeated project materials or prior structured notes.
- Allowed outputs: architecture requirement, design principle, evaluation criterion.
- Disallowed outputs: claim that the pattern is universal, validated, or externally accepted.

### Tier 4 — External source-bound claim

- Origin: cited public source, paper, standard, documentation, or public artifact.
- Allowed outputs: source-bound factual statement, literature note, comparison, implementation dependency.
- Disallowed outputs: uncited generalization beyond source scope.

### Tier 5 — Verified implementation behavior

- Origin: tested code, passing evaluation, reproducible log, or deployment check.
- Allowed outputs: implementation status, regression result, benchmark result.
- Disallowed outputs: broader product claim beyond the tested condition.

---

## Output routing table

| Evidence tier | Reflection | Memory | Product requirement | Public note | Action guidance | External claim |
|---|---:|---:|---:|---:|---:|---:|
| Tier 0 private symbolic signal | yes | consent-gated | abstract only | no raw detail | no | no |
| Tier 1 user-reported observation | yes | consent-gated | abstract only | no private detail | limited | no |
| Tier 2 system inference | labeled | provisional | yes | yes, if abstracted | limited | no |
| Tier 3 internal artifact pattern | yes | yes | yes | yes | limited | no universal claim |
| Tier 4 external source-bound claim | yes | yes | yes | yes with citation | yes within scope | yes with citation |
| Tier 5 verified implementation behavior | yes | yes | yes | yes with test scope | yes within test scope | yes with logs/tests |

---

## Product requirements

1. Every generated output must carry an internal `evidence_tier` field.
2. Every durable memory update must store `source_status`, `claim_status`, `privacy_status`, and `allowed_use`.
3. Public exports must reject Tier 0 and Tier 1 content unless transformed into an abstract method note.
4. Action guidance must require either low-risk context or external verification routing.
5. High-risk domains must downgrade unsupported interpretation into questions, preparation notes, or external handoff.
6. A publication lint must fail if output confidence exceeds evidence tier.
7. User-facing mode labels must not change the evidence tier; tone cannot upgrade truth status.
8. The router must preserve symbolic usefulness while preventing symbolic material from impersonating proof.

---

## Evaluation criteria

A test case passes only if the system can:

- separate felt meaning from factual status;
- preserve uncertainty without flattening the reflection;
- route private symbolic material into private reflection rather than public proof;
- convert private-derived patterns into public-safe architecture without leaking origin payload;
- prevent resonance, repetition, or emotional force from upgrading a claim;
- attach external handoff when a claim requires professional, empirical, legal, financial, medical, or technical verification;
- show the revision reason when an output is downgraded, blocked, abstracted, or routed elsewhere.

---

## Implementation sketch

Add a lightweight routing object before final response/render/export:

- `source_status`: private_signal, user_report, system_inference, internal_artifact_pattern, external_source_bound, verified_behavior.
- `claim_status`: symbolic, observed, inferred, source_bound, tested, unverified, deprecated.
- `privacy_status`: private, consent_gated, abstracted_public_safe, public.
- `risk_status`: low, medium, high, safety_critical.
- `audience`: self, collaborator, evaluator, public, institution.
- `allowed_outputs`: reflection, memory, requirement, question, checklist, public_note, action_guidance, external_claim.
- `required_labels`: uncertainty, missingness, citation, scope, revision_reason.

The response generator should receive only the permitted output class, not the raw unconstrained source material.

---

## Research questions

1. What is the minimum evidence metadata needed to keep MC useful without making every reflection feel bureaucratic?
2. Can the router be represented visually so users understand why a signal became a reflection, question, requirement, or external handoff?
3. How should MC handle mixed-tier outputs where a single response contains symbolic, inferred, and externally sourced material?
4. What tests catch confidence inflation when a symbolic signal is emotionally strong but evidentially weak?
5. How should consent changes retroactively affect memory, exports, and public-safe indexes?

---

## Public-safe index entry

- **Index name:** Evidence-Tier Output Router
- **Need:** prevent source-boundary collapse at the moment of output generation.
- **Primary control:** evidence tier decides allowed output class.
- **Secondary controls:** privacy status, audience, risk level, missingness, revision reason.
- **Failure prevented:** symbolic resonance or internal inference becoming public proof, action guidance, or durable knowledge without sufficient evidence.
