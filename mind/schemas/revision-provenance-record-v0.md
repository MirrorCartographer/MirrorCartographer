# Revision Provenance Record v0

Status: public-safe schema
Privacy status: no raw private context allowed
Revision reason: schema extracted from the Revision Provenance Ledger research note.

## Purpose

Record why a public-facing Mirror Cartographer claim changed without exposing private source material.

## Required fields

- `claim_id`: stable public-safe identifier
- `claim_current`: current public-safe wording
- `claim_previous_public`: prior public-safe wording, if safe to retain
- `claim_type`: fact | implementation_status | research_question | product_requirement | evaluation_criterion | design_principle | symbolic_framing | speculation
- `source_status`: public_repo | public_web | file_library_private | saved_context_private | mixed | unknown
- `claim_status`: confirmed | inferred | proposed | speculative | contested | downgraded | superseded | retired
- `privacy_status`: public_safe | abstracted_from_private | redacted | private_influence_withheld | unsafe_to_publish
- `temporal_status`: current | historical | superseded | unknown_age | retired_private
- `revision_reason_class`: public_source_update | private_context_correction | implementation_evidence_change | claim_overreach_downgrade | scope_boundary_change | temporal_validity_change | privacy_redaction_change | evaluation_failure | user_feedback_change | unknown_revision_pressure
- `revision_reason_public`: one-sentence public-safe reason
- `withheld_source_note`: yes | no | not_applicable
- `missingness_note`: what is unknown, uninspected, stale, or not verified
- `next_evidence_needed`: evidence required to raise or stabilize claim status
- `release_verdict`: publish | publish_with_boundary | revise_before_publish | do_not_publish

## Forbidden fields

Do not include:

- raw transcript excerpt
- personal identifiers beyond already-public project ownership language
- household, health, animal-care, financial, location, relationship, credential, or sensitive biographical detail
- exact private source text
- non-public implementation secrets or credentials

## Minimal example

Claim current: `The demo includes claim-status and source-status labels.`

- claim type: implementation_status
- source status: public_repo
- claim status: confirmed for README statement; unverified for runtime behavior unless tested
- privacy status: public_safe
- temporal status: current as of inspected README modified date
- revision reason class: public_source_update
- missingness note: live runtime not tested in this record
- release verdict: publish_with_boundary

## Validation rule

A record is invalid if it lets a reader reconstruct private context that was supposed to remain protected.
