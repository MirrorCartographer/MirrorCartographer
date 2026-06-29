# AttentionCustodyRecord v0

Status: public-safe schema

## Purpose

Records how context was permitted to steer attention before an output was produced, without exposing the underlying private source material.

## Fields

- record_id: stable identifier
- artifact_id: output or artifact being reviewed
- source_status: public_repo | uploaded_file | saved_context | private_conversation | external_research | generated_synthesis | mixed
- claim_status: confirmed | inferred | speculative | design_proposal | research_question
- privacy_status: public_safe | private_derived_abstracted | needs_redaction | blocked | do_not_release
- attention_operation: prioritize | suppress | route | escalate_boundary | soften_tone | preserve_contradiction | request_missingness | downgrade_claim | block_release
- admitted_context_class: high-level class only; no private source content
- rejected_context_class: high-level class only; no private source content
- affected_layer: intake | mode_selection | reflection | safety_boundary | product_requirement | evaluation | release_review | documentation
- boundary_invoked: evidence_gate | authority_boundary | privacy_boundary | resonance_proof_boundary | release_readiness | context_admission | source_boundary | redaction_fidelity | other
- public_safe_summary: abstracted reason the attention route mattered
- missingness_note: absent evidence, unavailable source, untested implementation, missing user confirmation, or unresolved contradiction
- revision_reason: why the attention route changed or why the record was created
- release_verdict: allow | allow_with_labels | hold | block
- reviewer_note: public-safe reviewer comment

## Forbidden contents

Do not include:

- personal names beyond already-public authorship context
- household details
- health or animal-care details
- financial details
- precise location details
- relationship details
- credentials not already intentionally public in the repository
- raw transcript text
- private source quotations

## Minimal example

record_id: acl-0001
artifact_id: symbolic-boundary-note
source_status: mixed
claim_status: design_proposal
privacy_status: private_derived_abstracted
attention_operation: escalate_boundary
admitted_context_class: repeated architecture-level concern about hidden context influence
rejected_context_class: personal details and raw transcript material
affected_layer: product_requirement
boundary_invoked: context_admission
public_safe_summary: The system should show when protected context shaped attention without revealing that context.
missingness_note: No implemented UI component yet.
revision_reason: Existing source-boundary work did not fully capture pre-claim attention steering.
release_verdict: allow_with_labels
reviewer_note: Safe to publish as a governance schema.