# Continuity Gate Map Schema v0

## Object Purpose
A schema for tracking how a Mirror Cartographer artifact moves from private source material into a public-safe output without losing lineage or violating privacy boundaries.

## Required Fields

### artifact_id
Stable identifier for the artifact being evaluated.

### source_status
Allowed values:
- private_context_abstracted
- file_library_abstracted
- github_existing
- web_research
- fictional_fixture
- mixed
- unknown

### claim_status
Allowed values:
- observation
- architectural_synthesis
- product_requirement
- research_question
- evaluation_criterion
- implementation_plan
- unsupported_claim
- rejected_claim

### privacy_status
Allowed values:
- public_safe
- private_only
- needs_review
- blocked
- unknown

### audience_contract
Who the artifact is for and what the artifact is allowed to do for that audience.

### evidence_lane
Allowed values:
- symbolic_reflection
- product_design
- ai_literacy
- governance_documentation
- social_care_support
- clinical_communication_support
- implementation_engineering
- commercial_offer
- unknown

### transformation_summary
Plain-language description of what changed between source material and output artifact.

### viewdiff_required
Boolean. True when the artifact is derived from private or sensitive material, or when multiple audience-specific views exist.

### missingness
Known gaps, uncertainty, unavailable repository context, unavailable source material, or untested assumptions.

### reviewer_state
Allowed values:
- not_reviewed
- self_reviewed
- human_review_needed
- expert_review_needed
- released
- rejected

### release_decision
Allowed values:
- publish
- hold
- revise
- discard
- private_only

### revision_reason
Why the artifact was created or changed.

## Minimum Pass Rule
An artifact is not public-ready unless source_status, claim_status, privacy_status, audience_contract, evidence_lane, transformation_summary, missingness, reviewer_state, release_decision, and revision_reason are all present.

## Safety Rule
The schema may describe the existence of a private source boundary but must not expose private source content.
