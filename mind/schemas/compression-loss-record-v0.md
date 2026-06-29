# Compression Loss Record v0

## Purpose

A structured record for documenting what is preserved, removed, generalized, downgraded, or distorted when Mirror Cartographer converts private or mixed context into public-safe artifacts.

## Record fields

| Field | Required | Description |
|---|---:|---|
| `record_id` | yes | Stable identifier for the compression-loss record. |
| `artifact_path` | yes | Public artifact path or planned artifact path. |
| `artifact_type` | yes | Research note, PRD, schema, scorecard, fixture, index, implementation plan, or other public-safe artifact type. |
| `source_status` | yes | Public repo, private repo, file-library, saved context, web source, mixed, unknown, or unavailable. |
| `privacy_status` | yes | Public-safe, private-derived abstract, blocked-private, needs review, or unsafe. |
| `claim_status` | yes | Confirmed, source-backed, inference, speculative, design proposal, missing, or blocked. |
| `compression_status` | yes | `lossless_public`, `abstracted_private`, `high_loss`, `claim_downgraded`, `structure_preserved`, or `insufficient_context`. |
| `preserved_structure` | yes | What relational, procedural, or evaluative structure survived compression. |
| `removed_structure` | yes | Type of omitted content, described categorically only. |
| `generalized_structure` | yes | What was converted into category-level language. |
| `downgraded_claim` | no | Stronger claim that was weakened for public safety or evidence limits. |
| `missingness` | yes | What was not inspected, unavailable, stale, or unverified. |
| `revision_reason` | yes | Why this record or artifact was created or changed. |
| `distortion_risk` | yes | How compression could mislead a reader. |
| `review_required` | yes | None, privacy review, evidence review, product review, safety review, or human-subjects review. |
| `release_verdict` | yes | Publish, publish with labels, hold, revise, or block. |

## Allowed compression statuses

### `lossless_public`
The source was already public-safe and the public artifact preserves the relevant meaning with minimal loss.

### `abstracted_private`
Private context informed the architecture but no private details appear in the artifact.

### `high_loss`
Only a small structural trace survives. The artifact must not imply completeness.

### `claim_downgraded`
A claim was intentionally weakened because the source is private, incomplete, contested, or not externally verified.

### `structure_preserved`
Raw details were removed, but the relational pattern, boundary condition, or method survived.

### `insufficient_context`
The artifact is too thin to support its intended claim without more evidence.

## Minimum release rule

A public-safe artifact passes this schema only if it makes the loss visible without making the protected source visible.
