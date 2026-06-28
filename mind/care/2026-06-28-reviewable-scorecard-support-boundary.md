# Reviewable Scorecard Support Boundary

Date: 2026-06-28
Attractor: Discovery
Status: public-safe care/support boundary

## Source status
- Source material: public-safe MC architecture, prior evidence-lane work, and fresh public reporting/research on AI use in health and support contexts.
- Private-source use: abstracted only. No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details are included.

## Claim status
- Support claim: a scorecard can help separate observations, questions, evidence limits, and review authority.
- Confidence: medium as communication support; unvalidated as outcome-improving intervention.
- Not a diagnosis, treatment, triage, or clinical decision tool.

## Privacy status
- Public-safe.
- No real case details.
- Suitable for general product requirements and safety framing.

## Missingness
- No clinical validation.
- No social-care deployment test.
- No professional review protocol.
- No risk analysis for vulnerable-user contexts beyond architecture labels.

## Revision reason
Evidence-lane work named care/support as a lane. This note defines the narrow allowed support use so the lane does not become an authority claim.

## Allowed use
The scorecard may help convert messy experience reports into:
- observation lists
- question packets
- timeline summaries
- support-needs summaries
- appointment-prep drafts
- follow-up tracking prompts

## Blocked use
The scorecard must not:
- diagnose
- treat
- triage emergencies
- infer hidden causes as fact
- replace professional review
- turn symbolic resonance into medical, psychological, or social-care proof
- expose sensitive private material in public examples

## Review authority
- For general support communication: user plus trusted human reviewer.
- For healthcare/clinical interpretation: licensed professional.
- For social-care eligibility or services: relevant agency, advocate, or professional reviewer.
- For emergency risk: emergency services or qualified crisis support, not MC.

## Scorecard-specific export rule
Any support packet with sensitive domain content must score:
- privacy_safety = 3
- claim_narrowness >= 2
- review_authority >= 2
- missingness_visibility >= 2

Otherwise: revise or keep private.

## Evidence-based direction
The practical intervention is not automated judgment. The intervention is better preparation for human review: clearer observations, narrower claims, visible unknowns, and explicit next questions.

## Next build target
Create a fictional support packet that demonstrates safe transformation from raw-feeling language into observation/question format without medical or social-care overclaiming.
