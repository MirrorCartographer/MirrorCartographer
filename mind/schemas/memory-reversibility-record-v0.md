# Memory Reversibility Record v0

## Purpose

A public-safe schema for deciding whether a remembered source, symbolic echo, prior interpretation, or context fragment may remain active, be downgraded, be quarantined, or be revoked.

## Required fields

- record_id: stable public-safe identifier
- record_type: source | symbol | echo | reflection | correction | requirement | evaluation_result
- source_status: public_repo | private_context_abstracted | user_provided_public | external_research | unknown
- claim_status: supported | design_hypothesis | speculative | blocked | needs_verification
- privacy_status: public_safe | private_context_only | sensitive_blocked | redacted | unknown
- admission_status: active | limited | downgraded | quarantined | revoked | expired
- admission_reason: short plain-language reason the record was allowed to influence the system
- allowed_lanes: symbolic | product | evaluation | research_question | implementation_plan | public_claim | private_session_only
- disallowed_lanes: diagnosis | therapy_replacement | medical_claim | legal_claim | veterinary_claim | financial_claim | identity_claim | raw_transcript_publication
- review_trigger: user_correction | time_elapsed | conflicting_source | provenance_weak | claim_overload | privacy_change | mode_mismatch | safety_boundary
- revision_reason: public-safe reason for the latest status change
- missingness: what is unknown, unverified, unavailable, or intentionally excluded
- last_reviewed: ISO date

## Status rules

### Active
The record may influence current output only inside its allowed lanes.

### Limited
The record may be used for orientation but not as evidence.

### Downgraded
The record may remain in history but must not carry the claim it previously carried.

### Quarantined
The record may be inspected for audit or architecture design but must not influence user-facing output unless re-admitted.

### Revoked
The record must not be used except to explain, in abstract form, why a previous inference or design assumption was changed.

### Expired
The record may be historically true but no longer safe to treat as current.

## Privacy rule

A revision reason must explain the boundary change without exposing the private source that caused it.

## Non-goals

- This schema does not store raw private transcripts.
- This schema does not prove factual truth.
- This schema does not diagnose, treat, or authorize any high-stakes decision.
- This schema does not collapse symbolic resonance into evidence.
