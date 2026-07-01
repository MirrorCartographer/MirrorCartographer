# Mirror Cartographer Research Note — Provenance Gate

Date: 2026-07-01

## Boundary labels

Source status: synthesized from private MC continuity context, private file-library architecture packets, existing GitHub-mind direction, and public provenance / AI-governance references.

Claim status: product architecture hypothesis, not clinical guidance, not diagnostic authority, not a factual claim about any private person, household, animal, finances, credential, relationship, or raw conversation.

Privacy status: public-safe abstraction only. Private context was used only to understand recurring architecture needs. No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail is included.

Missingness: no full raw archive audit, no verified longitudinal user-study data, no complete repository-state reconciliation, no independent evaluation dataset, no production telemetry, no formal safety review.

Revision reason: added after repeated MC research runs identified the same structural failure mode: meaning, proof, source lineage, and publication permission need to be separated before reflections become durable artifacts.

---

## Finding

Mirror Cartographer needs a **Provenance Gate** between reflection generation and durable memory/publication.

A reflection should not become a durable node merely because it feels coherent, aesthetically strong, or emotionally resonant. Before storage, export, reuse, or publication, the system should require a provenance check that answers:

1. What kind of source produced this artifact?
2. What kind of claim is this artifact making?
3. What evidence standard would be required for that claim type?
4. What may safely be stored?
5. What may safely be published?
6. What is still missing?
7. What revision reason explains the current version?

This converts MC from a reflection engine into a governable cognition system.

---

## External alignment

Public provenance standards treat provenance as information about entities, activities, and agents involved in producing a thing, so that downstream users can assess quality, reliability, or trustworthiness. MC should adapt that idea to meaning artifacts: every symbolic reflection needs traceable source category, transformation history, and claim boundary.

AI governance frameworks increasingly emphasize documentation, evaluation, transparency, limitations, and risk management. MC should not imitate model cards exactly, because MC is not only a model release. Instead, MC should use a **reflection card**: a smaller artifact-level disclosure label that travels with each generated reflection, symbolic map, evaluation note, or product requirement.

Useful public anchors:

- W3C PROV Overview: https://www.w3.org/TR/prov-overview/
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- Model Cards for Model Reporting: https://arxiv.org/abs/1810.03993

---

## Product requirement

Add a `provenance_gate` object to every durable MC artifact.

Suggested fields:

- `artifact_id`
- `artifact_type`
- `source_status`
- `source_categories`
- `claim_status`
- `claim_type`
- `privacy_status`
- `publishability`
- `evidence_standard`
- `missingness`
- `revision_reason`
- `mode_used`
- `confidence_label`
- `user_validation_state`
- `contradiction_state`
- `reuse_allowed`
- `public_abstraction_required`

---

## Claim classes

MC should route claims into strict classes:

1. **Symbolic interpretation** — meaning hypothesis, may be resonant without being factual.
2. **User-confirmed reflection** — grounded in user feedback, still not proof beyond that context.
3. **Source-backed factual claim** — requires public or cited source support.
4. **System capability claim** — requires working artifact, reproducible test, repository evidence, or execution log.
5. **Health / safety / legal / financial claim** — high-risk boundary; should be educational, cautious, and source-bound, never private-detail public.
6. **Creative artifact** — may be aesthetic/speculative, but must not be represented as evidence.
7. **Research question** — allowed when the evidence is incomplete and labeled incomplete.

---

## Evaluation criteria

A durable MC artifact passes the Provenance Gate only if:

- meaning and proof are visibly separated;
- source category is named;
- unsupported claims are downgraded to hypotheses or questions;
- private context is abstracted before publication;
- missing evidence is named instead of hidden;
- the artifact states why it exists now;
- future reuse cannot accidentally inflate symbolic coherence into factual authority.

Failure examples:

- A mythopoetic reflection becomes a factual product claim.
- A private chat pattern becomes a public anecdote.
- A resonant phrase becomes proof of system effectiveness.
- A generated architecture file is treated as evidence that the architecture is implemented.
- A missing source is concealed by confident language.

---

## Implementation plan

1. Add provenance fields to the reflection artifact schema.
2. Add a pre-export gate that blocks unlabeled artifacts from being saved or published.
3. Add a public-safe abstraction step before GitHub writes.
4. Add evidence-standard routing by claim class.
5. Add a missingness ledger to each research note.
6. Add tests that deliberately try to force metaphor into evidence and verify the gate prevents it.
7. Add a repository index of public-safe research notes with their claim status and revision reason.

---

## Research questions

- What is the smallest provenance label that remains useful without making the interface heavy?
- How should MC visually show the difference between resonance, recurrence, and evidence?
- Can reflection cards become the MC equivalent of model cards at the artifact level?
- What user feedback should count as validation, and what should remain only preference or resonance?
- How should contradiction be preserved without implying unresolved contradiction is hidden truth?

---

## Operating line

**Before MC remembers or publishes a reflection, it must know what kind of thing it is.**
