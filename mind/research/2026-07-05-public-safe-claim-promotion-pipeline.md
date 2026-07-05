# Public-Safe Claim Promotion Pipeline

Date: 2026-07-05
Status: Research note / implementation requirement
Repository scope: MirrorCartographer/MirrorCartographer
Privacy posture: Public-safe abstraction only

## Core finding

Mirror Cartographer needs a **Public-Safe Claim Promotion Pipeline**.

A claim should not move from private-context understanding into public-facing documentation, demos, requirements, or research framing unless it passes through explicit promotion stages that preserve source boundaries, claim strength, privacy class, missingness, and revision rationale.

## Operating line

> A public claim is not safe merely because its private details were removed; it is safe when the path from private signal to public abstraction is staged, labeled, reversible, and auditable.

## Source status

- Source class: mixed internal architecture context, uploaded project specifications, prior public-safe research-note pattern, and repository-facing implementation intent.
- Source access: partial. Available context was sufficient for architectural synthesis but not sufficient to assert full repository completeness.
- Source boundary: private-context material was used only to understand system architecture and risk patterns. No personal, household, health, animal-care, financial, location, relationship, credential, or transcript-specific details are included.
- Repository status: target repository was available for write through the GitHub connector at the time of this run.

## Claim status

- Claim type: product/governance requirement.
- Claim strength: bounded architectural inference.
- Evidence basis: recurring MC architecture themes around symbolic-state mapping, consent-bounded memory, mode separation, provenance, contradiction preservation, evaluability, and public-safe publication readiness.
- Not claimed: that this pipeline is already implemented in runtime code; that it has passed external audit; that all prior public artifacts already comply.

## Privacy status

- Public-safe: yes.
- Private-context dependency: indirect only.
- Rehydration risk: moderate if future implementers populate examples using raw memories, chats, screenshots, or user-specific scenarios.
- Required mitigation: use fictional or independently generated fixtures and label any source-derived examples as non-public unless they pass composition review.

## Missingness

- Missing complete raw source inventory.
- Missing verified repository-wide index of all MC research notes and requirements.
- Missing automated classifier for claim stage, privacy class, and promotion eligibility.
- Missing regression tests that compare public artifacts against private-source rehydration risk.
- Missing external reviewer protocol for publication-readiness decisions.

## Revision reason

Prior research notes focused on separate gates: ingestion, traceability, assumption expiry, mode boundaries, fixture safety, inference quarantine, composition risk, and demo-state separation. This note adds the missing orchestration layer: a promotion pipeline that determines when a statement may advance from private signal to public abstraction, public requirement, public demo, or external-facing claim.

## Proposed pipeline

### Stage 0 — Private signal

Input may include memory, conversation context, uploaded project files, repository contents, or implementation history.

Allowed output: no publication. Internal understanding only.

Required labels:
- source class
- privacy class
- sensitivity flags
- allowed transformation level
- prohibited detail classes

Exit condition: the signal can be transformed without retaining identifying or source-topology-specific structure.

### Stage 1 — Abstracted pattern

The system converts private signal into a general pattern.

Example form:
- "The system needs a boundary between personal symbolic state and public symbolic examples."

Allowed output: internal research note draft.

Required labels:
- abstraction method
- removed detail classes
- remaining inference risk
- missing verification

Exit condition: the pattern is useful without requiring the original private scenario.

### Stage 2 — Product requirement

The abstracted pattern becomes a requirement.

Example form:
- "All public demos must use independently generated fixture states."

Allowed output: public-safe product requirement, issue, implementation plan, or evaluation criterion.

Required labels:
- claim type
- implementation surface
- acceptance criteria
- failure mode
- privacy test

Exit condition: a developer can implement or test the requirement without accessing private context.

### Stage 3 — Public artifact claim

The requirement becomes a public-facing explanation, demo label, research statement, or governance note.

Allowed output: public documentation, README language, demo copy, grant/research framing.

Required labels:
- source-boundary note
- claim strength
- public audience risk
- non-claim disclaimer where needed
- revision history

Exit condition: the public artifact remains understandable, useful, and non-identifying after removing all private source access.

### Stage 4 — Publication readiness

The assembled artifact is reviewed as a whole.

Allowed output: publish / hold / revise / retire.

Required labels:
- composition risk
- inference risk
- evidence adequacy
- missingness
- expiry condition

Exit condition: the artifact can survive external reading without leaking private context or overstating implementation maturity.

## Implementation requirements

1. Add a `claim_stage` field to MC research notes and public documentation drafts.
2. Add a `source_boundary` field that distinguishes private-context-derived, public-source-derived, generated, and externally verified material.
3. Add a `promotion_reason` field explaining why the claim is allowed to move forward.
4. Add a `blocked_reason` field for claims that cannot be public yet.
5. Add an `expiry_condition` field for claims dependent on current implementation state, repository state, law/policy, external platform behavior, or product direction.
6. Add a `fixture_independence_check` before public demos, examples, screenshots, or sample sessions.
7. Add a `composition_review` step before publication.

## Evaluation criteria

A public MC claim passes only if:

- it can be understood without access to private source material;
- it does not encode identifying topology from private context;
- it states whether it is implemented, proposed, inferred, speculative, or externally verified;
- it includes enough missingness for a future maintainer to avoid overclaiming;
- it can be revised or retired when source status changes;
- it does not collapse symbolic meaning into evidence unless evidence is actually present;
- it does not collapse personal resonance into general product proof.

## Research questions

1. What is the minimum metadata required for every public-safe MC claim?
2. Can claim promotion be automated with a lint-style checker for documentation and demos?
3. How should the system score source-topology leakage when examples are abstracted but still structurally similar to private context?
4. What public fixture library can demonstrate MC behavior without borrowing from private histories?
5. What claims should be permanently non-promotable, even in abstracted form?

## Public-safe index entry

- Name: Public-Safe Claim Promotion Pipeline
- Category: governance / publication safety / product requirements
- Depends on: source-boundary labeling, privacy classification, fixture independence, composition review, traceability manifest
- Supports: public documentation, demo readiness, external collaboration packets, research framing, implementation audits
- Current maturity: requirement-level concept
- Next action: create a reusable metadata template for MC public-safe claims and add it to repository documentation.
