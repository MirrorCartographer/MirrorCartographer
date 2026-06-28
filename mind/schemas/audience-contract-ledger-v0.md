# Audience Contract Ledger Schema v0

## Purpose

Define the minimum record required before a Mirror Cartographer artifact is transformed for a new audience.

## Record

- ledger_id: stable identifier.
- created_at: ISO date or datetime.
- artifact_id: source artifact identifier.
- source_status: raw, summarized, abstracted, synthetic, public citation, mixed.
- source_boundary: private, internal, public, synthetic, unknown.
- audience_type: private_self, trusted_collaborator, qualified_support, public_reader, evaluator, customer, funder, builder, archive.
- allowed_purpose: reflection, orientation, question_building, product_demo, research_question, evaluation_fixture, audit_trail, income_offer, educational_explanation.
- forbidden_purpose: diagnosis, treatment_directive, causality_proof, sensitive_disclosure, identity_claim, coercive_advice, inflated_capability_claim, legal_or_financial_instruction.
- claim_ceiling: symbol, observation, hypothesis, supported_claim, tested_claim, external_authority_claim.
- privacy_ceiling: private, internal, shared_with_consent, publishable, public_safe_synthetic.
- evidence_lane: symbolic, experiential, product, human_ai_interaction, medical_support_communication, social_care_support, governance, commercial.
- review_burden: self_review, human_review, domain_review, clinical_or_legal_review_required, not_releasable.
- transformation_actions: removed, abstracted, generalized, fictionalized, downgraded, source_bound, citation_added, warning_added.
- viewdiff_required: true or false.
- scorecard_required: true or false.
- release_state: hold, revise, internal_only, publish, publish_with_warning, publish_synthetic_only.
- missingness: known unknowns.
- revision_reason: why this version exists.
- privacy_status: public_safe, public_safe_with_caution, internal_only, blocked.
- claim_status: architectural, product_requirement, research_question, evaluation_criterion, implementation_plan, supported_by_public_source, unsupported.

## Pass rule

A record cannot pass public release unless audience_type, allowed_purpose, forbidden_purpose, source_status, claim_ceiling, privacy_ceiling, evidence_lane, review_burden, missingness, revision_reason, and release_state are non-empty.

## Hard fail conditions

- Reveals private raw source material.
- Converts symbolic meaning into factual proof.
- Presents a health-adjacent observation as diagnosis or treatment.
- Omits the audience.
- Omits missingness.
- Omits what changed during transformation.
- Makes the artifact look more certain than the source allows.

## Source status

Public-safe schema derived from repository README architecture and current public research synthesis.

## Claim status

Product requirement and implementation plan.

## Privacy status

Public-safe; contains no private source detail.

## Missingness

No runtime validation has been implemented in this schema file.

## Revision reason

Adds an upstream audience contract before ViewDiff, scorecard, or release readiness checks.
