# Consent Drift Record v0

Purpose: provide a privacy-safe record shape for tracking whether a source, memory, pattern, or derived artifact is still permitted to be used for the claim or publication boundary being attempted.

## Record

| Field | Required | Description |
| --- | --- | --- |
| `record_id` | yes | Stable local identifier. |
| `source_status` | yes | `public`, `private_context_only`, `file_library_private`, `github_public`, `github_private`, `missing`, `unknown`, `mixed`. |
| `claim_status` | yes | `source_bound`, `design_hypothesis`, `evaluation_target`, `implementation_plan`, `blocked`, `needs_review`. |
| `privacy_status` | yes | `public_safe`, `abstract_only`, `restricted`, `do_not_publish`. |
| `consent_state` | yes | `not_collected`, `private_context_only`, `session_bound`, `persistent_private`, `public_distillable`, `public_citable`, `revoked`, `unknown`. |
| `consent_scope` | yes | What use is allowed: reflection, continuity, evaluation, export, publication, cross-user sharing, GitHub artifact, research synthesis. |
| `blocked_uses` | yes | Uses that are not allowed. |
| `derived_from_private_context` | yes | Boolean. True means no raw source details may appear in public artifacts. |
| `public_survival_test` | yes | `pass`, `fail`, `not_run`, `not_applicable`. |
| `missingness` | yes | What is unavailable, unverified, or intentionally omitted. |
| `revision_reason` | yes | Why this record was created or changed. |
| `review_trigger` | yes | Event that requires re-checking consent. |
| `evidence_boundary` | yes | What the source can and cannot support. |
| `last_reviewed_at` | recommended | Date of review in ISO format. |

## Allowed source_status values

- `public`: public, externally citable material.
- `private_context_only`: private material used only to understand architecture.
- `file_library_private`: uploaded or saved file not safe to publish raw.
- `github_public`: public repository material.
- `github_private`: private repository material.
- `missing`: expected material not available.
- `unknown`: source boundary cannot be determined.
- `mixed`: multiple source classes require separation.

## Consent drift triggers

Re-check consent when any of these occur:

1. Private reflection becomes public artifact.
2. One-user continuity becomes shared or group use.
3. Symbolic interpretation becomes factual claim.
4. Health-adjacent or safety-adjacent content is summarized.
5. Memory is exported, indexed, or committed.
6. A source is older than its review window.
7. A user correction contradicts stored memory.
8. A source is cited for a stronger claim than it originally supported.
9. A private source is transformed into a product requirement.
10. A derived artifact is reused outside its original scope.

## Minimal JSON shape

{
  "record_id": "cdr-0001",
  "source_status": "private_context_only",
  "claim_status": "design_hypothesis",
  "privacy_status": "abstract_only",
  "consent_state": "public_distillable",
  "consent_scope": ["architecture", "evaluation", "GitHub artifact"],
  "blocked_uses": ["raw transcript publication", "personal detail disclosure"],
  "derived_from_private_context": true,
  "public_survival_test": "pass",
  "missingness": ["raw source intentionally omitted", "user-facing consent UI not implemented"],
  "revision_reason": "Isolate consent drift as a distinct memory-governance failure mode.",
  "review_trigger": "Before publication, export, or cross-user use.",
  "evidence_boundary": "Supports a product requirement; does not prove any private claim.",
  "last_reviewed_at": "2026-07-01"
}

## Validity rule

A Consent Drift Record is invalid if it allows a public artifact to depend on private details that are not themselves publishable or safely abstracted.
