# SourceBoundaryBOMRecord v0

Status: Public-safe schema
Date: 2026-06-29

## Purpose

A SourceBoundaryBOMRecord documents the source classes, transformations, claim limits, privacy exclusions, and release decision for a public Mirror Cartographer artifact.

It records the crossing, not the private source.

## Required fields

### artifact

- artifact_id
- title
- artifact_type
- created_at
- release_state: draft | internal_only | public_safe_candidate | public_released | blocked
- revision_reason

### source_status

- public_sources_used: none | sampled | cited | primary
- file_library_sources_used: none | sampled | cited | primary
- saved_context_used: none | architectural_orientation_only | evidence_disallowed
- chat_context_used: none | current_turn_only | abstracted_prior_patterns
- github_sources_used: none | repo_metadata | existing_docs | code
- external_research_used: none | sampled | cited | primary

### privacy_status

- contains_personal_detail: yes | no
- contains_household_detail: yes | no
- contains_health_detail: yes | no
- contains_animal_care_detail: yes | no
- contains_financial_detail: yes | no
- contains_location_detail: yes | no
- contains_relationship_detail: yes | no
- contains_credential_detail: yes | no
- contains_raw_transcript: yes | no
- privacy_decision: pass | revise | block

### transformation_chain

- extracted_structure
- generalized_categories
- removed_categories
- retained_signal
- compression_risk
- fidelity_risk
- mitigation

### claim_status

- fact_claims
- inference_claims
- design_claims
- speculative_claims
- prohibited_claims
- authority_boundary

### missingness

- unavailable_sources
- unverified_assumptions
- stale_risk
- incomplete_audit_scope
- next_verification_step

### release_decision

- release_allowed: yes | no | conditional
- blocker_if_any
- reviewer_notes
- public_summary

## Evaluation rule

A public artifact fails this schema if it removes private details but leaves the reader unable to understand what kind of evidence, inference, or transformation produced the claim.

## Key phrase

**A boundary is only useful if the crossing can be audited.**
