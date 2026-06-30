# Interpretive Quarantine Record v0

Status: public-safe schema
Source status: derived from Mirror Cartographer public-boundary architecture and mixed-source privacy requirements
Claim status: implementation schema
Privacy status: public-safe abstraction
Missingness: no source examples included; schema needs validation against synthetic and reviewer-authored cases
Revision reason: formalizes the quarantine step before memory, index, claim, or release admission

## Purpose

This schema records whether a private-context-inspired pattern is allowed to become a public-safe artifact.

## Fields

### record_id

Stable unique identifier.

### created_at

ISO date or datetime.

### artifact_path

Target public artifact path, if admitted.

### source_status

Allowed values:

- public_repo
- public_web
- file_library_architecture
- private_context_derived_abstraction
- synthetic_fixture
- mixed_source_synthesis

### claim_status

Allowed values:

- observation
- design_hypothesis
- product_requirement
- evaluation_criterion
- implementation_plan
- externally_supported_claim
- blocked_claim

### privacy_status

Allowed values:

- public_safe
- private_derived_abstraction
- needs_review
- blocked_non_publishable

### quarantine_state

Allowed values:

- Q0_observed_privately
- Q1_abstracted
- Q2_boundary_labeled
- Q3_externally_strengthened
- Q4_public_admissible
- blocked

### private_residue_removed

Boolean. True only when personal, household, health, animal-care, financial, relationship, location, credential, and raw transcript details have been removed.

### public_understandability

Boolean. True only when the artifact can stand without reconstructing the private context.

### support_level

Allowed values:

- unsupported_inspiration
- internally_consistent_method
- public_repo_aligned
- externally_researched
- fixture_tested
- empirically_validated

### missingness

Short statement of unavailable, intentionally excluded, unvalidated, or blocked material.

### revision_reason

Short statement explaining why this record or artifact was added.

### allowed_downstream_use

Examples:

- schema
- scorecard
- fixture
- PRD
- implementation_plan
- research_question
- public_index_entry

### prohibited_downstream_use

Examples:

- personal inference
- diagnosis
- identity reconstruction
- source quotation
- marketing proof
- unsupported generalization

### reviewer_notes

Optional public-safe review note.

## Minimal JSON shape

{
  "record_id": "iq-000",
  "created_at": "2026-06-30",
  "artifact_path": "mind/research/example.md",
  "source_status": "mixed_source_synthesis",
  "claim_status": "product_requirement",
  "privacy_status": "public_safe",
  "quarantine_state": "Q4_public_admissible",
  "private_residue_removed": true,
  "public_understandability": true,
  "support_level": "externally_researched",
  "missingness": "No private examples included; no live user study completed.",
  "revision_reason": "Adds quarantine before public indexing.",
  "allowed_downstream_use": ["schema", "scorecard", "implementation_plan"],
  "prohibited_downstream_use": ["source quotation", "identity reconstruction", "marketing proof"],
  "reviewer_notes": "Admitted as a public-safe method artifact."
}
