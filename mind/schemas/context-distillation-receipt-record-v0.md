# Context Distillation Receipt Record v0

Status: public-safe schema
Date: 2026-06-29

## Purpose

A Context Distillation Receipt records how private, mixed, or sensitive context was converted into a public-safe Mirror Cartographer artifact without exposing the underlying source material.

## Required fields

- `receipt_id`: stable identifier.
- `created_at`: ISO date or datetime.
- `artifact_path`: public artifact path or intended destination.
- `source_status`: one of `public_repo`, `file_library_private`, `saved_context_private`, `mixed_context`, `external_research`, `unknown`.
- `source_boundary`: short boundary note explaining what source class was used and what was not exposed.
- `claim_status`: one of `directly_supported`, `bounded_inference`, `design_hypothesis`, `research_question`, `speculative`, `not_claimed`.
- `privacy_status`: one of `public_safe`, `public_safe_after_abstraction`, `internal_only`, `blocked`, `needs_review`.
- `sensitivity_classes_excluded`: list of categories excluded from output.
- `abstract_signal_retained`: public-safe method, requirement, question, criterion, or implementation plan retained.
- `artifact_type`: one of `method`, `source_boundary_note`, `product_requirement`, `research_question`, `evaluation_criterion`, `privacy_safe_index`, `implementation_plan`, `fixture`, `schema`, `attractor_note`.
- `missingness`: explicit unknowns, unavailable sources, unverified claims, or blocked checks.
- `revision_reason`: why this artifact exists or differs from prior artifacts.
- `release_verdict`: one of `release`, `release_with_labels`, `quarantine`, `internal_only`, `blocked`.

## Optional fields

- `fresh_research_anchors`: public research references used for framing.
- `repo_anchors`: public repository files used for grounding.
- `evaluation_hooks`: tests that should verify the receipt.
- `contestability_route`: how a reviewer or user can challenge the abstraction.

## Example

- `source_status`: mixed_context
- `claim_status`: bounded_inference
- `privacy_status`: public_safe_after_abstraction
- `sensitivity_classes_excluded`: personal, health, animal-care, household, financial, location, relationship, credentials, raw transcript
- `abstract_signal_retained`: product requirement for visible boundary labels and missingness labels
- `release_verdict`: release_with_labels

## Validation rule

If `source_status` includes private or mixed context, then `sensitivity_classes_excluded`, `abstract_signal_retained`, `missingness`, and `release_verdict` are mandatory.

## Boundary rule

A receipt must never contain raw private source text. It may describe source class, transformation class, claim class, and release class.