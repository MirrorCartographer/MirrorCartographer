# Interpretive Debt Scorecard

## Public-safe status

- Source status: Evaluation proposal derived from public-safe MC architecture synthesis and public AI audit/provenance research.
- Claim status: Evaluation criteria proposal.
- Privacy status: Public-safe. No private examples.
- Missingness: Needs calibration on real artifacts and external reviewers.
- Revision reason: Adds a testable standard for whether an interpretation can safely influence product, research, or public artifacts.

## Scoring scale

0 = absent or unsafe  
1 = partial / unclear  
2 = present and usable  
3 = strong, accessible, and release-ready

## Criteria

| Criterion | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Claim-mode clarity | No distinction between fact, inference, symbol, and speculation. | Labels exist but are vague. | Claim modes are clear. | Claim modes are clear, consistent, and machine-readable. |
| Source-boundary clarity | Source influence hidden. | Source class hinted. | Source class visible. | Source class visible without exposing private source material. |
| Missingness honesty | Missing evidence absent. | Missingness generic. | Specific missing evidence named. | Missingness includes what would change the claim. |
| Reliance boundary | Output implies broad authority. | Boundary exists but weak. | Allowed/disallowed uses named. | Boundary is prominent, accessible, and linked to risk. |
| Authority risk control | Could be mistaken for diagnosis, proof, instruction, or objective truth. | Some warnings present. | Risky authority lanes are blocked. | Risk lanes are blocked and alternatives are provided. |
| Revision path | No path to update the interpretation. | Vague future review. | Concrete repayment action. | Repayment action is assigned to a clear review lane. |
| Redaction fidelity | Privacy removed by flattening meaning. | Some structure preserved. | Structural signal preserved. | Structural signal and loss are both documented. |
| Contestability | User cannot challenge the interpretation. | User can reject but not revise. | User can revise or mark wrong. | User can revise, demote, fork, or retire the interpretation. |
| Release readiness linkage | Debt ignored at release. | Debt noted but not gating. | High-risk debt blocks release. | Debt is part of a formal release gate. |
| Accessibility | Essential debt info hidden in inaccessible format. | Partially accessible. | Accessible plain-language summary. | Accessible summary plus structured export. |

## Pass threshold

- Internal exploration: average 1.5 minimum, no forbidden authority risk.
- Persistent user profile influence: average 2.0 minimum, claim mode and privacy status required.
- Public artifact release: average 2.5 minimum, no high-risk unpaid debt.
- Research/fundraising use: average 2.7 minimum, external-source claims cited and private-source influence abstracted.

## Automatic fail conditions

Fail release if the artifact:

- Exposes raw private source material.
- Presents private-context-derived material as public fact.
- Converts resonance into proof.
- Presents symbolic interpretation as diagnosis, treatment, legal guidance, financial guidance, veterinary advice, identity assignment, or credential claim.
- Omits missingness for a claim with meaningful uncertainty.
- Uses aesthetic force to hide weak evidence.

## Review output

Each artifact should receive:

- release decision: pass, pass with visible debt, internal-only, revise, or block;
- highest-risk debt;
- most important missing evidence;
- revision reason;
- next repayment action.
