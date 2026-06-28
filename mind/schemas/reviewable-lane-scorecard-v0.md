# Reviewable Lane Scorecard Schema v0

Date: 2026-06-28
Status: public-safe schema draft
Attractor: Discovery

## Source status
- Derived from public-safe Mirror Cartographer architecture work.
- Uses no raw private transcript material.

## Claim status
- Schema proposal only.
- Not validated as a clinical, educational, legal, or financial instrument.

## Privacy status
- Public-safe.
- Designed for fictional fixtures, product prototypes, and sanitized review records.

## Missingness
- Needs UI implementation.
- Needs external reviewer calibration.
- Needs pass/fail thresholds tested against real user comprehension without using private records publicly.

## Record shape

```json
{
  "packet_id": "string",
  "created_at": "YYYY-MM-DD",
  "declared_audience": "private | public_method | professional_handoff | care_support | business | education | research",
  "evidence_lane": "product_design | software_implementation | user_research | ai_governance | education_or_literacy | social_care_support | medical_or_clinical_support | creative_artifact | business_or_income | personal_reflection_private_only",
  "source_status": {
    "source_type": "public_repo | public_research | fictional_fixture | private_context_abstracted | mixed",
    "source_summary": "string",
    "private_source_used": false,
    "private_source_boundary": "none | abstracted_only | blocked_from_export"
  },
  "claim_status": {
    "claim_text": "string",
    "claim_type": "observation | hypothesis | product_requirement | research_question | implementation_plan | evaluation_criterion | support_question | outcome_claim",
    "confidence": "low | medium | high",
    "prohibited_claim_check": "passed | revise | blocked"
  },
  "privacy_status": {
    "publication_class": "public_safe | restricted | private_only | blocked",
    "identifying_detail_present": false,
    "sensitive_domain_present": false,
    "redaction_or_compilation_state": "abstracted | transformed | redacted | blocked"
  },
  "transformation_status": {
    "viewdiff_summary": "string",
    "meaning_preserved": "string",
    "details_removed": ["string"],
    "claim_changed": false,
    "revision_reason": "string"
  },
  "missingness_status": {
    "unknowns": ["string"],
    "untested_assumptions": ["string"],
    "next_evidence_action": "string"
  },
  "review_status": {
    "review_authority": "user | domain_professional | external_reviewer | maintainer | not_yet_assigned",
    "review_required_before_export": true,
    "user_correction_path": "string"
  },
  "scorecard": {
    "source_clarity": 0,
    "claim_narrowness": 0,
    "privacy_safety": 0,
    "transformation_honesty": 0,
    "missingness_visibility": 0,
    "review_authority": 0,
    "next_evidence_action": 0,
    "user_correction_path": 0,
    "total": 0,
    "gate_result": "block | revise | limited_share | export_ready"
  }
}
```

## Gate rules
- privacy_safety = 0 -> block
- claim_narrowness = 0 -> block
- source_clarity = 0 -> private_only or revise
- total < 14 -> revise
- total 14-20 -> limited_share
- total 21-24 -> export_ready for the declared audience only

## Revision reason
This schema makes the previous Evidence Lane Splitter operational by giving each lane a visible review score before export.
