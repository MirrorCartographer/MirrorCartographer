# Pattern Custody Record v0

Status: public-safe schema
Date: 2026-06-30

## Purpose

This schema records how a repeated pattern moves from private or mixed-context material into a public-safe Mirror Cartographer artifact.

## Required fields

- record_id: stable identifier.
- pattern_name: short public-safe name.
- source_class: public_repo | file_library | saved_context | current_chat | external_research | generated_synthesis | mixed.
- source_status: directly_observed | snippet_observed | remembered | inferred | externally_cited | missing | blocked.
- claim_status: design_requirement | implementation_plan | evaluation_criterion | research_question | hypothesis | unsupported_association | do_not_claim.
- privacy_status: public_safe | private_derived_abstract | restricted | do_not_publish.
- transformation_chain: one-line path from raw signal to public-safe abstraction.
- allowed_artifact_types: README | PRD | schema | scorecard | fixture | roadmap | research_note | internal_only | none.
- exclusions: list of private or unsafe material not carried forward.
- missingness: known gaps or uncertainty.
- revision_reason: why this record exists or changed.
- downgrade_rule: how the claim must be softened if evidence is insufficient.
- verification_next_step: concrete next check.

## Validation rules

1. A record with privacy_status = restricted or do_not_publish cannot have public artifact types except internal_only or none.
2. A record with source_status = remembered or inferred cannot be upgraded above hypothesis unless another source class supports it.
3. A record with claim_status = do_not_claim must include exclusions and downgrade_rule.
4. A record with source_class = mixed must list at least one public-safe abstraction step in transformation_chain.
5. No record may include raw private transcript detail, personal household detail, medical/animal-care detail, financial data, private location, relationship detail, or credentials not already public.

## Minimal example

record_id: pcm-001
pattern_name: Evidence Boundary
source_class: mixed
source_status: directly_observed public repo plus private-derived abstract
claim_status: design_requirement
privacy_status: public_safe
transformation_chain: repeated project constraint -> generalized boundary rule -> evaluation criterion
allowed_artifact_types: README, PRD, schema, scorecard, fixture
exclusions: raw examples, personal cases, health and household specifics
missingness: implementation coverage not fully audited
revision_reason: prevent symbolic coherence from being treated as proof
downgrade_rule: if no implementation evidence, call it intended architecture rather than shipped behavior
verification_next_step: inspect UI behavior and demo fixtures
