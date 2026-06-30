# Missingness-First Index Record v0

Status: public-safe schema
Privacy status: publishable
Revision reason: Added to make missingness explicit before public indexing or claim reuse.

## Purpose

A Missingness-First Index Record prevents an MC artifact from presenting partial retrieval as complete knowledge.

## Record fields

- record_id: stable identifier.
- artifact_title: public-safe title.
- artifact_type: research_note, product_requirement, evaluation, fixture, source_boundary_note, implementation_plan, or index.
- found_status: present, partial, stale, private_only, generated, external, blocked, or missing.
- source_status: public_repo, private_architecture_context, file_library_snippet, saved_context, external_research, generated_synthesis, or unknown.
- source_boundary: what the source may and may not support.
- claim_status: allowed, not_allowed, conditional, unsupported, stale, or needs_verification.
- privacy_status: public_safe, abstract_only, private_do_not_publish, sensitive_do_not_use, or blocked.
- missingness_status: none_known, incomplete_archive, inaccessible_source, unverified_claim, stale_source, private_origin, overbroad_claim, or insufficient_evidence.
- missing_condition: plain-language statement of what is absent or unsafe.
- revision_reason: why the record was created or changed.
- admissibility_decision: admit, admit_with_boundary, quarantine, redact, verify_first, or reject.
- next_safe_action: cite, verify, split, redact, test, monitor, rebuild, or decline.
- reviewer_note: short human-readable note.

## Minimal example

record_id: mfi-0001
artifact_title: Example Reflection Boundary
artifact_type: source_boundary_note
found_status: partial
source_status: private_architecture_context
source_boundary: may shape abstract requirement; may not expose source content
claim_status: conditional
privacy_status: abstract_only
missingness_status: private_origin
missing_condition: origin context cannot be published or reconstructed
revision_reason: converted private pattern into public-safe rule
admissibility_decision: admit_with_boundary
next_safe_action: publish abstraction only
reviewer_note: usable as method, not as evidence of private facts

## Pass condition

The record passes only if a reviewer can identify both the usable claim and the missing condition without seeing the private source.
