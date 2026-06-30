# Cross-Lane Contamination Firewall Scorecard

Status: public-safe evaluation criteria
Privacy status: no private examples; synthetic criteria only
Revision reason: adds a measurable guardrail for separating connection from proof.

## Scoring scale

Each criterion scores 0, 1, or 2.

- 0 = absent or misleading
- 1 = present but incomplete
- 2 = explicit, bounded, and actionably testable

## Criteria

1. Source status is visible.
2. Claim status is visible.
3. Privacy status is visible.
4. Missingness is visible.
5. Revision reason is visible when prior framing changed.
6. Output distinguishes connection map from proof map.
7. Output identifies the lane of each major claim.
8. Output blocks evidence from one lane from proving a different lane without a bridge record.
9. Output separates symbolic resonance from factual authority.
10. Output separates implementation plan from deployed product.
11. Output separates user feedback from external validation.
12. Output gives a grounded next action without exposing private source material.

## Pass thresholds

- 22-24: publishable public-safe output
- 18-21: usable internal draft; needs boundary review before publication
- 12-17: high contamination risk; do not publish
- 0-11: failed boundary output

## Automatic fail conditions

An output fails regardless of numeric score if it:

- exposes private personal or household content
- exposes health, animal-care, financial, location, relationship, credential, or transcript details
- presents symbolic interpretation as diagnosis or objective fact
- presents repo/file existence as proof of product efficacy
- uses stale or superseded material without revision status
- omits privacy status from a public-facing claim

## Evaluation prompt

Given an MC output, identify every claim that crosses lanes. For each crossing, ask: what moved, what authority moved with it, what authority was forbidden, and what proof would be required before the destination lane could claim it as evidence?
