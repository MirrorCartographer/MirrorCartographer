# Recall Condition Record v0

## Purpose

A recall condition record prevents Mirror Cartographer from treating retrieved material as automatically admissible. It records why a source may or may not influence a public-safe output.

## Record

```yaml
record_type: recall_condition_record
version: 0
source_id: string
source_title: string
source_type: public_repo | file_library | saved_context | chat_context | external_research | runtime_observation
source_status: current | historical | superseded | partial | unverified | inaccessible | unknown
created_or_observed_date: string | unknown
retrieved_date: string
privacy_status: public_safe | private_understanding_only | confidential | excluded
claim_status: directly_supported | inferred | proposed | contradicted | stale | unverified
mode_context: canonical | reflective | mythopoetic | product | research | evaluation | implementation | mixed | unknown
recall_conditions:
  - string
invalid_conditions:
  - string
allowed_influence:
  - language
  - product_requirement
  - evaluation_criterion
  - research_question
  - implementation_plan
  - public_claim
  - none
disallowed_influence:
  - raw_private_detail
  - personal_fact
  - health_or_care_claim
  - location_or_financial_detail
  - relationship_or_household_detail
  - credential_detail
  - diagnosis_or_authority_claim
  - implementation_status_claim
missingness:
  - string
revision_reason: string | none
review_required: true | false
```

## Minimum viable labels

Every MC public-safe memory use should at minimum label:

- source status
- claim status
- privacy status
- missingness
- allowed influence
- revision reason, if any

## Failure states

- `relevance_without_condition`: source is used because it matches the topic, but no admissibility condition is stated.
- `private_source_laundering`: private context shapes a public claim without abstraction and boundary labels.
- `stale_state_claim`: historical source is described as current implementation.
- `mode_bleed`: mythopoetic/reflective material is used as canonical evidence.
- `source_strength_inflation`: source supports a weaker claim than the output makes.

## Public-safe example

```yaml
record_type: recall_condition_record
version: 0
source_id: repo_readme_2026_06_30
source_title: Mirror Cartographer README
source_type: public_repo
source_status: current_partial
created_or_observed_date: unknown
retrieved_date: 2026-06-30
privacy_status: public_safe
claim_status: directly_supported_for_public_positioning
mode_context: product
recall_conditions:
  - Use for public positioning, declared demo features, safety boundaries, and evaluation direction.
  - Do not use alone as proof of runtime behavior.
invalid_conditions:
  - Claiming all listed architecture is implemented.
  - Claiming clinical, diagnostic, or therapeutic efficacy.
allowed_influence:
  - language
  - product_requirement
  - evaluation_criterion
  - research_question
disallowed_influence:
  - diagnosis_or_authority_claim
  - implementation_status_claim
missingness:
  - Code search unavailable/not indexed in this pass.
revision_reason: Added recall-condition layer to prevent relevance from becoming unauthorized authority.
review_required: true
```
