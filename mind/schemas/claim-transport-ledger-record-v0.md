# ClaimTransportLedgerRecord v0

Status: schema draft
Source status: public-safe synthesis from MC architecture notes and current AI-memory/provenance research
Claim status: proposed schema
Privacy status: stores boundary classes and transformation metadata only; must not store protected raw source content
Missingness: no validator or UI implemented yet
Revision reason: consolidates source-boundary, redaction-fidelity, influence, release-readiness, and authority-boundary records into one transport object.

## Fields

- record_id: stable identifier
- artifact_id: target artifact identifier
- artifact_path: optional public path
- created_at: ISO timestamp
- release_state: draft | held | rewritten | published | deprecated | discarded
- source_status:
  - public_source
  - private_context
  - uploaded_file
  - repo_material
  - fresh_research
  - synthetic_fixture
  - mixed
  - unknown
- source_boundary_class:
  - public
  - private_influence_only
  - confidential_do_not_quote
  - sensitive_do_not_publish
  - synthetic
  - derived_public_safe
- claim_status:
  - fact
  - sourced_summary
  - inference
  - product_requirement
  - method
  - evaluation_criterion
  - research_question
  - hypothesis
  - metaphor
  - speculation
- claim_text_public: public-safe formulation only
- private_source_present: boolean
- private_source_exposed: must always be false for public artifacts
- removed_detail_categories:
  - personal
  - household
  - health
  - animal_care
  - financial
  - location
  - relationship
  - credential
  - raw_transcript
  - none
- transformation_method:
  - abstraction
  - generalization
  - category_labeling
  - synthetic_fixture
  - public_rewrite
  - omission
  - aggregation
- fidelity_preserved:
  - contradiction
  - recurrence
  - structural_pattern
  - user_control_need
  - provenance_gap
  - missingness
  - contestability
  - mode_boundary
  - authority_boundary
  - evaluation_route
- authority_allowed:
  - reflection
  - orientation
  - research_planning
  - product_design
  - evaluation
  - governance
- authority_forbidden:
  - diagnosis
  - treatment
  - legal_advice
  - financial_advice
  - credential_claim
  - identity_claim
  - autonomous_external_action
- evidence_links_public: list of public citations or repo/file references when allowed
- missingness: what is unknown, untested, or unavailable
- revision_reason: why this version exists or changed
- falsification_route: how the claim can be challenged
- release_check_result: pass | fail | needs_rewrite | hold
- reviewer_notes_public: public-safe notes only

## Invariant

A valid public ClaimTransportLedgerRecord must expose the boundary and transformation route, not the protected source.
