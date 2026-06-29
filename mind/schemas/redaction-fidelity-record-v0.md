# RedactionFidelityRecord v0

Status: schema draft
Privacy status: public-safe; contains no private source details
Claim status: implementation planning artifact

## Purpose

A RedactionFidelityRecord documents the transformation from private-context understanding to a public-safe MC artifact.

It is not a transcript record. It is not a source dump. It is a boundary-and-fidelity record.

## Required fields

- `record_id`: stable identifier.
- `artifact_path`: public artifact path or planned path.
- `source_status`: one of `public_source`, `private_context_oriented`, `mixed`, `synthetic_fixture`, `unknown`.
- `privacy_status`: one of `public_safe`, `private_required`, `blocked`, `needs_review`.
- `claim_status`: one of `fact`, `source_bound_summary`, `inference`, `hypothesis`, `speculation`, `design_requirement`, `evaluation_criterion`.
- `removed_detail_classes`: list of removed private classes.
- `preserved_invariant`: abstract structure that survives redaction.
- `transformation_route`: short description of how private material became public-safe abstraction.
- `missingness`: known gaps, unavailable checks, and uncertainty.
- `revision_reason`: why the artifact exists or changed.
- `release_status`: one of `draft`, `public_safe_candidate`, `released`, `blocked`, `retired`.
- `contestability_route`: how a reviewer can dispute, revise, or downgrade the claim.

## Removed detail class vocabulary

Use broad classes rather than private specifics:

- `personal_identity_detail`
- `household_detail`
- `health_or_body_detail`
- `animal_care_detail`
- `financial_detail`
- `location_detail`
- `relationship_detail`
- `credential_detail`
- `raw_transcript_detail`
- `private_repo_detail`
- `none`

## Pass/fail logic

Pass only when:

- removed detail classes are explicit;
- preserved invariant is intelligible;
- claim status is not inflated;
- missingness is stated;
- no private specifics are inferable;
- release status matches actual review state.

Fail when:

- the record hides source uncertainty;
- abstraction becomes so vague that no method remains;
- redaction keeps unique private fingerprints;
- symbolic resonance is treated as proof;
- a public artifact implies authority it does not have.
