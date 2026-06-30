# Instruction Source Collision Record v0

Status: public-safe schema
Source status: architecture derived from public MC boundary materials, private-context-safe abstraction, and current AI memory/security research
Claim status: proposed schema
Privacy status: safe for public repository
Revision reason: adds source-authority separation to the existing MC boundary stack

## Purpose

This schema records when a retrieved source contains instruction-like content, authority-like content, or claim-like content that could be mistaken for live task control.

## Record

- `record_id`: stable identifier
- `created_at`: ISO date
- `reviewed_by`: human, model, evaluator, or mixed
- `source_title`: public-safe source label only
- `source_type`: user_current_instruction | private_context_reference | uploaded_file_content | public_repo_material | external_research | generated_artifact | symbolic_material | unknown_source
- `source_status`: current | historical | superseded | contested | unknown_age | unavailable | blocked
- `claim_status`: observed_in_source | public_repo_claim | private_context_inference | research_supported_general_risk | implementation_requirement | unverified_product_claim | symbolic_interpretation | blocked_or_not_admissible
- `privacy_status`: public | public_safe_abstract | private_do_not_publish | sensitive_do_not_use | redacted | unknown
- `instruction_like_text_present`: true | false | unknown
- `authority_requested_by_source`: none | interpretive | factual | operational | policy | tool_use | publication | identity | safety_relevant
- `authority_allowed`: none | cite_only | summarize_only | architecture_inform | answer_inform | action_inform | publish_as_public_claim
- `authority_denied`: none | tool_use | publication | factual_claim | diagnosis_or_advice | credential_claim | current_user_intent | system_instruction
- `collision_type`: quoted_command | stale_instruction | private_to_public_leak | external_prompt_injection | symbolic_overreach | authority_transfer | missing_source_boundary | none
- `admission_decision`: admit | admit_with_label | summarize_only | abstract_only | quarantine | reject
- `transformation_required`: none | redact | abstract | downgrade_claim | add_missingness | add_revision_reason | add_citation | request_human_review
- `public_safe_output_form`: method_note | product_requirement | evaluation_case | schema_entry | research_question | implementation_plan | no_public_output
- `missingness`: what is unknown or unavailable
- `revision_reason`: why this record was created or changed
- `notes`: public-safe notes only

## Admission rule

Instruction-like content is not authority by default. Authority must come from source role, recency, privacy clearance, and claim boundary.

## Public-safe failure labels

- `source_spoke_as_command`
- `memory_treated_as_current_intent`
- `symbol_treated_as_evidence`
- `artifact_treated_as_capability`
- `private_pattern_treated_as_public_claim`
- `external_text_treated_as_assistant_instruction`
- `missingness_hidden`

## Pass condition

A record passes when a reviewer can tell what the source was allowed to do, what it was not allowed to do, and why the final output did not leak or overclaim.
