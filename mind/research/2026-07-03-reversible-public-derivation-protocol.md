# Reversible Public Derivation Protocol

## Core finding

Mirror Cartographer needs a **Reversible Public Derivation Protocol**: a method for turning private-context-informed architecture into public-safe knowledge while preserving an inspectable path back to the type of source boundary, without exposing the private source itself.

## Operating line

> A public method should be reversible to its boundary class, not to its private source.

## Source status

- **Primary source class:** private-context-informed architecture pattern.
- **GitHub source class:** repository target and prior public-safe research-note pattern.
- **External source class:** not used in this run.
- **Transcript exposure:** none.
- **Private details retained:** none.

## Claim status

- **Claim type:** product requirement and governance method.
- **Evidence tier:** design inference from repeated MC publication-boundary needs.
- **Confidence:** medium.
- **Not a claim of:** user identity, personal history, clinical status, financial status, location, household facts, or raw conversation content.

## Privacy status

- **Public-safe:** yes.
- **Reason:** the note describes an abstract derivation rule and does not preserve source text, source events, names, household details, health facts, financial facts, relationship facts, credentials, or locations.
- **Publication risk:** low if implemented as metadata categories rather than raw-source links.
- **Redaction required before reuse:** any example derived from private context must be rewritten as a synthetic example or omitted.

## Missingness

- No full repository tree was available in this run.
- No external standards comparison was performed in this run.
- No live implementation code was inspected.
- The protocol has not yet been tested against a public export pipeline.

## Revision reason

Prior MC notes establish boundaries for consent, provenance, evidence tiering, missingness, origin classification, and publication linting. The remaining gap is **reversibility without exposure**: public readers, maintainers, or auditors need to understand what kind of private-to-public transformation occurred without being able to reconstruct the private material.

## Product requirement

Every public-safe MC research note, exported method, product requirement, or evaluation criterion should include a derivation record with four fields:

1. **Boundary class** — where the source came from at the category level.
2. **Transformation class** — how the private signal was converted into public knowledge.
3. **Exposure class** — what, if anything, remains visible in the public artifact.
4. **Reversal limit** — the furthest an auditor may trace the claim without entering private material.

## Proposed derivation classes

### Boundary class

- `private_context_pattern`
- `uploaded_file_pattern`
- `github_material`
- `public_web_source`
- `synthetic_test_case`
- `operator_design_inference`
- `unknown_or_unverified`

### Transformation class

- `abstraction`
- `generalization`
- `taxonomy_extraction`
- `requirement_derivation`
- `evaluation_design`
- `implementation_plan`
- `risk_register_entry`
- `synthetic_example_generation`

### Exposure class

- `no_private_content`
- `category_only`
- `synthetic_example_only`
- `quoted_public_source_only`
- `mixed_public_and_abstracted_private`
- `blocked_not_publishable`

### Reversal limit

- `reversible_to_note_metadata_only`
- `reversible_to_boundary_class`
- `reversible_to_public_source_link`
- `reversible_to_synthetic_test_case`
- `not_reversible_without_private_access`
- `must_not_reverse`

## Evaluation criteria

A public MC artifact passes this protocol only if:

- The artifact can explain why it exists without revealing private facts.
- The artifact can name its source boundary class without linking to raw private material.
- The artifact can be audited for overreach using metadata alone.
- The artifact prevents readers from reconstructing a private person, household, event, medical detail, animal-care detail, financial detail, location, relationship, credential, or raw transcript.
- The artifact labels missingness rather than filling gaps with invented continuity.
- Any example is public, synthetic, or removed.

## Implementation plan

1. Add a required `derivation_record` block to each future MC public research note.
2. Add a publication lint check that fails when `exposure_class` is missing.
3. Add a review rule: if `reversal_limit` is broader than `boundary_class`, downgrade the artifact or block publication.
4. Add a synthetic-example generator for public demonstrations.
5. Add a public index field that lists only abstract protocol names, not source-derived personal facts.

## Research questions

- What is the minimum metadata needed for meaningful auditability without increasing privacy leakage?
- How should MC distinguish a method inspired by private context from a method validated by public evidence?
- When should a private-context-derived requirement be treated as non-exportable even after abstraction?
- Can public readers understand the derivation boundary without needing access to the private substrate?

## Public-safe index entry

- **Name:** Reversible Public Derivation Protocol
- **Type:** governance method / publication safety requirement
- **Use:** preserve auditability while preventing source reconstruction
- **Status:** proposed
- **Privacy:** public-safe abstract method
- **Next action:** convert to a reusable note template and lint rule
