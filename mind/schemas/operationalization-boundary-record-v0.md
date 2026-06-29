# Operationalization Boundary Record v0

Status: public-safe schema
Date: 2026-06-29

## Purpose

Track when a Mirror Cartographer output moves from symbolic reflection into action guidance, and record what safeguards are required before delivery or publication.

## Record fields

### Identity

- `record_id`
- `created_at`
- `artifact_id`
- `artifact_type`
- `reviewer_or_system`
- `version`

### Source boundary

- `source_status`: `public`, `private_context_abstracted`, `mixed_boundary`, `unknown`, `blocked`
- `source_boundary_note`
- `raw_private_source_included`: boolean
- `protected_detail_classes_removed`: list
- `source_coverage`: `complete_claimed`, `partial`, `narrow`, `unknown`

### Claim mode

- `claim_status`: `confirmed_from_source`, `research_supported`, `inferred_design_requirement`, `speculative_extension`, `unknown`
- `claim_mode`: `fact`, `probabilistic_inference`, `symbolic_interpretation`, `mythopoetic_speculation`, `implementation_plan`, `evaluation_criterion`
- `confidence_level`: `high`, `medium`, `low`, `unknown`
- `confidence_reason`

### Operationalization

- `operationalization_level`: `O0_reflection_only`, `O1_attention_prompt`, `O2_low_risk_option`, `O3_consequential_suggestion`, `O4_domain_authority_risk`, `O5_block_or_rewrite`
- `action_language_detected`: list
- `domain_risk_flags`: list of `medical`, `legal`, `financial`, `safety`, `employment`, `relationship`, `animal_care`, `crisis`, `identity`, `public_release`, `privacy`, `other`
- `irreversibility_risk`: `none`, `low`, `medium`, `high`, `unknown`
- `professional_substitution_risk`: `none`, `low`, `medium`, `high`, `unknown`
- `coercion_or_takeover_risk`: `none`, `low`, `medium`, `high`, `unknown`

### Required safeguards

- `requires_rewrite`: boolean
- `requires_caveat`: boolean
- `requires_options_not_orders`: boolean
- `requires_external_authority_deferral`: boolean
- `requires_user_agency_framing`: boolean
- `requires_missingness_statement`: boolean
- `requires_release_gate_review`: boolean
- `blocked_reason`

### Privacy status

- `privacy_status`: `public_safe`, `public_safe_after_redaction`, `private_only`, `blocked`
- `privacy_review_note`
- `residual_reidentification_risk`: `none`, `low`, `medium`, `high`, `unknown`

### Missingness

- `missing_information`
- `untested_assumptions`
- `needed_next_evidence`

### Revision

- `revision_reason`
- `meaningful_change_from_prior_version`
- `supersedes`
- `superseded_by`

## Minimal valid record

A valid public record must include source status, claim status, privacy status, operationalization level, missingness, and revision reason.

## Public-safe rule

The record may describe what type of context influenced an artifact. It must not expose protected source content or raw transcript material.
