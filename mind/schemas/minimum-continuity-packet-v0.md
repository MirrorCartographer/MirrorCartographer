# MinimumContinuityPacket v0

Date: 2026-06-28
Status: draft schema
Privacy status: public-safe; no real user records

## Purpose
A smallest safe record shape for moving meaning across private, professional, public, and research-safe views.

## Required fields

```yaml
packet_id: fictional_or_anonymous_string
created_at: ISO-8601 timestamp
record_kind: symbol | sensation | narrative | observation | question | correction | outcome_update
source_status: user_stated | ai_inferred | externally_sourced | professional_reviewed | unknown
claim_status: expression | observation | hypothesis | question | decision_support | verified_fact | disallowed_claim
privacy_status: private_only | shareable_summary | professional_handoff | public_safe_method | aggregate_only
view_target: self | coach | clinician | veterinarian | social_care | researcher | product_team | public
original_view_available: boolean
published_view_contains_private_detail: false
transformation_note:
  removed: string[]
  compressed: string[]
  translated: string[]
  preserved: string[]
missingness_note:
  unknown: string[]
  unverified: string[]
  out_of_scope: string[]
revision:
  revision_reason: safety_boundary | evidence_update | user_correction | professional_review | source_update | clarity_update
  prior_packet_id: string | null
next_test: string
boundary_flags:
  medical_or_health_adjacent: boolean
  animal_care_adjacent: boolean
  financial_adjacent: boolean
  legal_adjacent: boolean
  identity_or_household_risk: boolean
  requires_professional_review: boolean
```

## Validation rules
1. A public artifact must not contain raw private records.
2. `published_view_contains_private_detail` must be false for public-safe method artifacts.
3. Any health-adjacent or animal-care-adjacent packet must carry `requires_professional_review: true` unless it is purely a general safety disclaimer.
4. `claim_status` cannot be upgraded from expression/hypothesis to verified fact without an external source or professional review.
5. Every transformation must say what changed.
6. Every missingness note must distinguish unknown from unverified.
7. Every revision must preserve a reason.

## Claim status
Product schema hypothesis. Not a security guarantee, clinical validation, legal compliance mechanism, or medical-device specification.

## Missingness
Needs implementation tests, adversarial privacy review, consent UX review, and examples using fictional data only.
