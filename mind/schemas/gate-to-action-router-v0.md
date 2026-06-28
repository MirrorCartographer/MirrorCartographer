# Gate-to-Action Router Schema v0

## Purpose
Define the minimum public-safe record for converting MC gate outputs into concrete next actions.

## Record Fields

| Field | Required | Allowed / Example | Purpose |
|---|---:|---|---|
| `artifact_id` | yes | stable slug | Names the artifact being evaluated. |
| `audience_contract` | yes | public / reviewer / internal / specialist / private | Declares intended audience. |
| `source_status` | yes | direct / derived / inferred / synthetic / unknown | Tracks provenance. |
| `claim_status` | yes | fact / interpretation / hypothesis / design proposal / open question | Prevents claim inflation. |
| `privacy_status` | yes | public-safe / sensitive / restricted / private | Controls exposure. |
| `evidence_lane` | yes | symbolic / product / clinical-support / governance / implementation / research | Keeps proof standards lane-specific. |
| `missingness` | yes | text list | Preserves known unknowns. |
| `transformation_record` | yes | summary | Explains what changed from source to artifact. |
| `viewdiff_status` | yes | complete / partial / absent | States whether transformation diff exists. |
| `reviewer_state` | yes | not-needed / needed / completed / blocked | Records human or domain review status. |
| `blocking_gate` | conditional | privacy / claim / source / audience / evidence / review / release | Required when not publishable. |
| `router_state` | yes | publishable / revise / narrow / abstract / review / hold_private / discard | Final routing state. |
| `next_action` | yes | action sentence | Converts label into execution. |
| `revision_reason` | yes | sentence | Explains why this version exists. |

## Router State Semantics

- `publishable`: release is allowed under declared audience contract.
- `revise`: wording, labels, or structure need correction before release.
- `narrow`: scope is too broad; reduce claims or audience.
- `abstract`: convert sensitive source material into method, requirement, research question, evaluation criterion, or implementation plan.
- `review`: domain or human review is required before release.
- `hold_private`: do not publish; keep only in private workspace.
- `discard`: do not preserve as an artifact because risk or confusion exceeds value.

## Minimum Valid Record
A valid record must contain source, claim, privacy, audience, evidence lane, missingness, router state, next action, and revision reason.

## Public-Safe Boundary
This schema must not store personal, household, health, animal-care, financial, credential, location, relationship, or raw transcript details. Sensitive source facts should be represented only as boundary classes and transformation notes.

## Claim Status
Schema proposal.

## Privacy Status
Public-safe.

## Missingness
No fixture corpus has yet been scored with this schema.

## Revision Reason
Adds action routing to the existing MC gate-map family.
