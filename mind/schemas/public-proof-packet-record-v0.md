# Public Proof Packet Record v0

## Purpose

A public proof packet records the boundary conditions for a Mirror Cartographer public artifact without exposing private source material.

## Required fields

- `record_id`: stable identifier.
- `artifact_id`: public artifact, file, page, demo, or release this packet describes.
- `artifact_type`: `readme | research_note | demo | product_requirement | evaluation | fixture | index | implementation_plan | other`.
- `release_scope`: `internal | public_safe_draft | public_candidate | public_released | withdrawn`.
- `source_status`: `public_repo | uploaded_file | saved_context | private_context_abstraction | fresh_public_research | mixed | unknown`.
- `claim_status`: `verified_public | source_bound | bounded_inference | design_hypothesis | research_question | speculative | rejected`.
- `privacy_status`: `public_safe | abstracted_private_context | redacted | needs_review | unsafe_do_not_publish`.
- `evidence_class`: `implemented_feature | repository_document | external_source | evaluated_fixture | user_feedback | architectural_reasoning | none_yet`.
- `excluded_context_notice`: concise statement of private categories intentionally excluded.
- `missingness`: known gaps, stale areas, unavailable sources, unverified implementation state, or incomplete tests.
- `revision_reason`: why the packet was created or changed.
- `revision_triggers`: events that require update, downgrade, withdrawal, or re-review.
- `evaluation_criteria`: checks the artifact must pass.
- `release_verdict`: `pass | pass_with_limits | hold | fail | withdraw`.

## Optional fields

- `related_layers`: links to context admission, quarantine, lineage, contestability, compression loss, temporal validity, release scope, revision provenance, or other gates.
- `public_citations`: public sources that can be cited without private leakage.
- `private_influence_note`: high-level note that private context shaped only architecture, not publishable evidence.
- `reviewer_notes`: comments from a human or model reviewer.

## Validation rules

1. If `privacy_status` is `needs_review` or `unsafe_do_not_publish`, `release_verdict` cannot be `pass`.
2. If `source_status` includes private context, `excluded_context_notice` is required.
3. If `claim_status` is `verified_public`, `evidence_class` must not be `none_yet`.
4. If `release_scope` is `public_released`, `missingness` must be explicit even if empty.
5. If an artifact makes safety, health, legal, financial, employment, or authority-adjacent claims, `claim_status` must be no stronger than `bounded_inference` unless source-bound external proof is attached.

## Minimal example

- `artifact_id`: `docs/example-public-brief.md`
- `release_scope`: `public_candidate`
- `source_status`: `mixed`
- `claim_status`: `design_hypothesis`
- `privacy_status`: `abstracted_private_context`
- `evidence_class`: `repository_document`
- `excluded_context_notice`: private user examples and raw transcripts excluded.
- `missingness`: no external reviewer test yet.
- `revision_reason`: first public-safe release packet.
- `release_verdict`: `pass_with_limits`
