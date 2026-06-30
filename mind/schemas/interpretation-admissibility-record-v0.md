# Interpretation Admissibility Record v0

## Purpose

A public-safe record format for deciding whether a symbolic interpretation may appear in a Mirror Cartographer output.

## Record fields

- `record_id`: stable id for this admission decision.
- `created_at`: ISO datetime.
- `source_status`: one of `public_repo`, `file_library_abstracted`, `saved_context_abstracted`, `external_research`, `user_current_input`, `unknown`, `mixed`.
- `claim_status`: one of `fact`, `user_stated`, `inference`, `symbolic_reflection`, `hypothesis`, `speculation`, `implementation_plan`, `evaluation_criterion`.
- `privacy_status`: one of `public_safe`, `abstracted_private_context`, `private_sensitive_excluded`, `protected_domain_excluded`, `not_for_release`.
- `domain_boundary`: one or more of `general_reflection`, `health_adjacent`, `mental_health_adjacent`, `animal_care_adjacent`, `financial_adjacent`, `legal_adjacent`, `relationship_adjacent`, `location_adjacent`, `credential_adjacent`, `product_design`, `research_design`.
- `admissibility_status`: one of `admitted_reflection`, `admitted_question`, `admitted_summary`, `quarantined_private`, `quarantined_domain_boundary`, `rejected_overclaim`, `rejected_coercion`, `needs_evidence`.
- `interpretation_type`: one of `body_symbol`, `color_symbol`, `metaphor`, `narrative_pattern`, `recurrence_pattern`, `contradiction_pattern`, `tone_pattern`, `action_pattern`, `unknown`.
- `allowed_rendering`: one of `direct_label`, `question_only`, `neutral_summary`, `method_only`, `do_not_render`.
- `evidence_boundary`: plain-language note separating symbol, inference, evidence, and action.
- `missingness`: what is not known or not available.
- `revision_reason`: why this interpretation was admitted, downgraded, quarantined, or rejected.
- `contestability_prompt`: a prompt that lets the user disagree, correct, or decline the interpretation.
- `next_safe_action`: grounded non-coercive next step, if any.

## Minimum valid record

A valid public output requires:

1. `source_status` present.
2. `claim_status` present.
3. `privacy_status` present.
4. `admissibility_status` present.
5. `evidence_boundary` present.
6. `missingness` present.
7. `revision_reason` present.

## Rendering rule

- If `admissibility_status` is `admitted_reflection`, render with labels.
- If `admissibility_status` is `admitted_question`, render only as a question or tentative frame.
- If `admissibility_status` is `admitted_summary`, render only as neutral summary.
- If `admissibility_status` begins with `quarantined`, do not render the private interpretation; render only a method note if needed.
- If `admissibility_status` begins with `rejected`, do not render the interpretation.
- If `admissibility_status` is `needs_evidence`, render as hypothesis only and state what evidence would change it.

## Non-release rule

This schema must never require publication of raw private context. It records the admission decision, not the protected source content.
