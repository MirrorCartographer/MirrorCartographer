# Public-Safe Lineage Digest

Date: 2026-07-03
Status: public-safe architecture note

## Core finding

Mirror Cartographer needs a **Public-Safe Lineage Digest**: a compact derivation record that explains how a public artifact, requirement, index, evaluation criterion, or implementation plan was shaped by source classes without exposing the underlying private material.

Operating line: **A public artifact should show its ancestry without leaking its family.**

## Source status

- Source class: mixed architecture review.
- Inputs used: existing repository governance notes, public-safe file-library summaries, abstracted private-context orientation, and prior MC product/research direction.
- Private-context use: architecture-orientation only.
- Published content: abstracted method only; no raw transcript, personal, household, health, animal-care, financial, location, relationship, credential, or identifying operational details.

## Claim status

- Claim type: product/governance architecture requirement.
- Confidence: medium-high.
- Evidence basis: MC materials repeatedly distinguish symbolic reflection, state continuity, consent boundaries, mode differences, public release limits, evidence routing, and repository documentation. Prior governance notes define gates, surfaces, redaction, privacy status, claim status, source status, dependency status, and missingness. This note adds a lineage layer that lets public outputs document derivation without revealing source content.
- Not claimed: that every current artifact already has a lineage digest, or that lineage labeling alone makes an artifact publishable.

## Privacy status

- Public-safe: yes.
- Contains private details: no.
- Re-identification risk: low when used correctly, because it records source classes and transformation steps rather than source content.
- Publication boundary: suitable for repository documentation, product requirements, evaluation criteria, privacy-safe indexes, and implementation planning.

## Missingness

Current missing items:

1. A canonical lineage vocabulary.
2. A minimum digest schema for public notes.
3. A rule distinguishing source class from source content.
4. A transformation log format for private-to-public abstraction.
5. A release-check rule requiring lineage digest review before publication.
6. Tests proving that a digest does not contain private or reconstructive detail.

## Revision reason

Earlier notes define what a claim is, where it appears, which gates it depends on, and whether it is safe to release. This note adds derivation accountability: a public artifact should be able to say how it was formed without disclosing the private source that oriented it.

## Public-safe lineage vocabulary

Use source classes rather than source details:

- `repo_note`: existing repository documentation or prior governance note.
- `public_safe_file_summary`: extracted project summary with private details removed.
- `abstracted_private_context`: private context used only to understand system shape.
- `implementation_observation`: code, deployment, schema, issue, or product-structure observation.
- `external_public_source`: public web/research source that can be cited directly.
- `model_inference`: bounded synthesis created by the AI from allowed source classes.
- `user_instruction`: current explicit instruction from the user.

## Digest fields

Each public artifact should include a lineage block with:

- artifact_id
- artifact_type
- source_classes_used
- source_classes_excluded
- private_context_role
- transformation_steps
- claim_status
- privacy_status
- missingness_status
- required_gates
- release_destination
- revision_reason
- reviewer_or_process

## Product requirement

MC should generate a lineage digest before a note, index, requirement, evaluation plan, diagram, README section, whitepaper claim, or implementation ticket is published. The digest must prove that private material was converted into architecture-level abstraction, not copied, paraphrased, or made reconstructable.

## Evaluation criteria

A Public-Safe Lineage Digest passes if:

1. It identifies source classes without exposing source content.
2. It distinguishes private-context orientation from public evidence.
3. It marks model synthesis as synthesis rather than source fact.
4. It records excluded source classes when a boundary was intentionally not crossed.
5. It makes missing source coverage visible.
6. It links to required gates before release.
7. It can be reviewed by another evaluator without needing access to private transcripts.
8. It fails release if the digest itself contains identifying or reconstructive detail.

## Implementation plan

1. Create `/mind/indexes/source-lineage-vocabulary.yml` with canonical source classes.
2. Create `/mind/indexes/public-safe-lineage-template.yml` with required digest fields.
3. Add a release-check rule requiring `lineage_digest.status: passed` before publication.
4. Add a validator that flags raw names, locations, medical terms, household references, credentials, transcript fragments, and unnecessary dates inside digest fields.
5. Add tests for safe lineage, private leakage, reconstructive fragments, omitted missingness, and source-class/content confusion.
6. Add a human-readable lineage report view for repository review.

## Example abstract manifest

```yaml
artifact_id: public-note-001
artifact_type: research_note
source_classes_used:
  - repo_note
  - public_safe_file_summary
  - abstracted_private_context
  - model_inference
source_classes_excluded:
  - raw_transcript
  - identifying_personal_detail
private_context_role: architecture_orientation_only
transformation_steps:
  - identify repeated system requirement
  - remove private examples
  - convert observation into product governance rule
  - label claim, privacy, source, and missingness status
claim_status: architecture_requirement
privacy_status: public_safe
missingness_status: partial_source_coverage
required_gates:
  - claim_surface_inventory
  - gate_dependency_ledger
  - public_artifact_release_gate
  - composite_reconstruction_risk_ledger
release_destination: public_repository_note
revision_reason: adds derivation accountability without source exposure
```

## Research question opened

How can MC prove public derivation from private-context-shaped research while preventing the lineage proof itself from becoming a privacy leak?
