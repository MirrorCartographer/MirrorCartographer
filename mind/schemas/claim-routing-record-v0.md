# Claim Routing Record v0

## Purpose
A public-safe schema for routing Mirror Cartographer claims into the correct evidence and release lane.

## Source status
- Derived from public-safe architecture synthesis.
- Does not include private transcript text or personal examples.

## Claim status
- Schema proposal.
- Not a runtime implementation claim.

## Privacy status
- Public-safe.

## Missingness
- Requires implementation binding before it can be treated as an enforced product control.

## Record

```yaml
claim_id: string
claim_text_public_safe: string
source_boundary:
  allowed_values:
    - public_source
    - private_derived_abstraction
    - external_research
    - implementation_observation
    - prompt_contract
    - repository_history
    - unknown
claim_status:
  allowed_values:
    - descriptive
    - interpretive
    - speculative
    - normative
    - empirical
    - operational
    - blocked
privacy_status:
  allowed_values:
    - public_safe
    - private_context_required_but_not_publishable
    - sensitive_do_not_publish
    - unknown_requires_review
proof_lane:
  allowed_values:
    - design_rationale
    - source_boundary_note
    - product_requirement
    - research_question
    - evaluation_criterion
    - implementation_plan
    - public_index
    - blocked_claim
allowed_outputs:
  type: list
  examples:
    - research_note
    - schema
    - prd
    - scorecard
    - fixture
    - public_readme
    - internal_only
blocked_outputs:
  type: list
upgrade_conditions:
  type: list
contestability_receipt:
  required: true
  fields:
    - what_would_change_this_routing
    - what_source_is_missing
    - what_privacy_boundary_blocks_direct_proof
    - what_authority_level_is_not_allowed
revision_reason:
  required: true
```

## Validation rule
A claim may not be published into an output lane unless `allowed_outputs` includes that lane and `privacy_status` is `public_safe`.

## Downgrade rule
When evidence is missing, the claim is downgraded to `research_question`, `implementation_plan`, or `blocked_claim`. It is not upgraded through confident language.
