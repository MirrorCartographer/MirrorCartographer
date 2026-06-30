# Evidence Half-Life Record v0

Public-safe schema for deciding whether a Mirror Cartographer claim remains reusable.

## Record fields

| Field | Required | Allowed values / format | Purpose |
|---|---:|---|---|
| `record_id` | yes | slug | Unique entry identifier |
| `claim_text` | yes | public-safe text | The reusable claim or requirement |
| `source_status` | yes | public_repo / file_library_public_safe / private_context_abstracted / public_research / mixed / missing | Where the claim came from |
| `claim_status` | yes | verified / bounded / hypothesis / requirement / stale_context / blocked / do_not_publish | Current claim authority |
| `privacy_status` | yes | public_safe / abstracted_private / sensitive_excluded / needs_redaction / do_not_publish | Publication safety |
| `evidence_half_life` | yes | ISO 8601 duration or policy label | How long before refresh is required |
| `last_checked` | yes | YYYY-MM-DD | Last review date |
| `refresh_trigger` | yes | text | What forces re-checking |
| `downgrade_rule` | yes | text | How authority changes after expiry |
| `revision_reason` | yes | text | Why this record changed or exists |
| `missingness` | yes | text | What was unavailable or unverified |
| `allowed_reuse` | yes | text | Where the claim may appear |
| `forbidden_reuse` | yes | text | Where the claim must not appear |

## Default half-life policy

| Claim type | Half-life |
|---|---|
| Public doctrine / safety boundary | 12 months |
| Product requirement | 90 days |
| GitHub implementation status | verify per use |
| Fresh research summary | 30-90 days depending on field volatility |
| Evaluation result | verify per use |
| Private-derived abstraction | re-check privacy every reuse |
| User consent / sharing boundary | re-check every reuse |

## Minimal valid record

```yaml
record_id: evidence-half-life-example
claim_text: "MC should separate symbolic resonance from evidentiary proof."
source_status: mixed
claim_status: bounded
privacy_status: public_safe
evidence_half_life: P12M
last_checked: 2026-07-01
refresh_trigger: "public artifact, product claim, evaluation packet, or safety audit update"
downgrade_rule: "If not refreshed after expiry, keep as historical doctrine but do not present as current evaluated behavior."
revision_reason: "Adds temporal validity to existing source and claim boundary system."
missingness: "No live telemetry or external validation attached."
allowed_reuse: "README, PRD, evaluation rubric, public-safe architecture notes."
forbidden_reuse: "Proof of diagnosis, proof of therapeutic outcome, proof of deployed production capability."
```

## Validator notes

A record fails validation if it lacks privacy status, lacks downgrade logic, exposes private raw material, or converts a private-derived abstraction into a public factual claim about a person.
