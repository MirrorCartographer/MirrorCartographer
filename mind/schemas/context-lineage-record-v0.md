# ContextLineageRecord v0

## Status
Draft schema. Public-safe. No private source content belongs in this record.

## Purpose
Track how context influenced a Mirror Cartographer artifact without exposing the underlying protected context.

## Record fields

| Field | Type | Required | Description |
|---|---:|---:|---|
| `lineage_id` | string | yes | Stable ID for this lineage record. |
| `artifact_path` | string | yes | Public artifact path or planned path. |
| `artifact_type` | enum | yes | `research_note`, `schema`, `prd`, `scorecard`, `fixture_suite`, `index`, `implementation_plan`, `attractor_note`. |
| `source_status` | enum[] | yes | `public_web`, `public_repo`, `file_library_structural`, `private_context_orientation`, `synthetic_fixture`, `unknown`, `not_used`. |
| `claim_status` | enum | yes | `confirmed_source_fact`, `bounded_inference`, `design_principle`, `product_requirement`, `evaluation_criterion`, `research_question`, `speculative_extension`. |
| `privacy_status` | enum | yes | `public_safe`, `restricted_summary`, `private_only`, `blocked`, `synthetic_only`. |
| `admission_status` | enum | yes | `admitted`, `partially_admitted`, `excluded`, `retired`, `contested`, `unknown`. |
| `temporal_status` | enum | yes | `current`, `historical`, `superseded`, `contested`, `unknown_age`, `not_time_sensitive`. |
| `transformation_steps` | string[] | yes | Public-safe verbs such as `abstracted`, `generalized`, `redacted`, `synthesized`, `split`, `renamed`, `scored`, `retired`. |
| `claim_transport` | string | yes | The public-safe claim that crossed into the artifact. |
| `source_non_transport` | string | yes | Description of source categories intentionally not transported. Do not include protected detail. |
| `missingness` | string[] | yes | Known gaps, unavailable material, unverified claims, or untested behavior. |
| `revision_reason` | string | yes | Why this artifact or revision exists. |
| `release_verdict` | enum | yes | `publish`, `publish_with_labels`, `revise_before_release`, `private_only`, `block`. |
| `review_notes` | string | no | Public-safe reviewer comments only. |

## JSON skeleton

{
  "lineage_id": "ctxlin_YYYYMMDD_slug_v0",
  "artifact_path": "mind/...",
  "artifact_type": "research_note",
  "source_status": ["file_library_structural", "private_context_orientation", "public_web"],
  "claim_status": "product_requirement",
  "privacy_status": "public_safe",
  "admission_status": "partially_admitted",
  "temporal_status": "current",
  "transformation_steps": ["abstracted", "generalized", "redacted", "synthesized"],
  "claim_transport": "A public artifact should expose the transformation path of a claim without exposing protected source material.",
  "source_non_transport": "No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details transported.",
  "missingness": ["No empirical validation yet", "No automated ledger enforcement yet"],
  "revision_reason": "Adds ordered lineage to existing source-boundary and claim-transport layers.",
  "release_verdict": "publish_with_labels",
  "review_notes": ""
}

## Validation rules
1. `source_non_transport` must never contain raw protected details.
2. `claim_transport` must be independently understandable without private context.
3. `privacy_status=public_safe` requires an explicit protected-detail exclusion statement.
4. `release_verdict=publish` or `publish_with_labels` requires non-empty `missingness` and `revision_reason`.
5. Any `private_context_orientation` source must use `partially_admitted`, `excluded`, or `retired`; never unqualified `admitted`.
