# RepresentationalFidelityRecord v0

Status labels

- Source status: schema derived from public-safe MC architecture requirements and current research direction.
- Claim status: proposed schema; not implemented runtime storage.
- Privacy status: public-safe; stores source classes and transform decisions, not private content.
- Missingness: no validator, database migration, UI component, or fixture-backed test runner yet.
- Revision reason: created to prevent public-safe compilation from becoming representational flattening.

## Purpose

RepresentationalFidelityRecord tracks whether a public-safe artifact preserved the important structure of its source material after abstraction.

It is not a transcript record.

It is a transform audit record.

## Fields

### identity

- record_id
- artifact_id
- created_at
- compiler_version
- reviewer
- release_state: draft | hold | released | rejected

### source boundary

- source_classes_used
- source_classes_excluded
- private_classes_removed
- public_sources_used
- repository_materials_used
- file_library_materials_used
- saved_context_used
- raw_transcript_used: must be false for public release unless separately consented and redacted

### claim mode

- primary_claim_mode: fact | inference | symbolic_interpretation | speculation | product_requirement | evaluation_criterion | implementation_plan
- secondary_claim_modes
- authority_boundary
- unsupported_claims_removed

### topology preservation

- preserved_invariants
- preserved_contradictions
- preserved_minority_signals
- preserved_uncertainties
- preserved_questions
- preserved_emotional_symbolic_register
- lost_structure
- acceptable_loss
- unacceptable_loss

### privacy transform

- abstraction_method
- redaction_method
- aggregation_method
- deidentification_notes
- leakage_risk
- leakage_risk_reason
- release_blockers

### fidelity score

Each field is scored 0-2.

- invariant_survival
- contradiction_survival
- minority_signal_survival
- missingness_visibility
- claim_mode_clarity
- privacy_boundary_integrity
- source_boundary_clarity
- user_contestability
- non_coercion
- release_readiness

### decision

- decision: release | revise | hold | reject
- revision_reason
- next_action

## Required rule

An artifact can be private-safe and still fail representational fidelity.

A release-ready artifact must pass both.
