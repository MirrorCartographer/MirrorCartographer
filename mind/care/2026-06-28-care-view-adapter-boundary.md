# Care View Adapter Boundary

Source status: public-safe synthesis from MC architecture and fresh public health-data / AI documentation signals.
Claim status: care-communication boundary note and evaluation criteria; not medical or veterinary guidance.
Privacy status: public-safe; no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.
Missingness: no clinician, veterinarian, lawyer, ethicist, or patient-advocate review has been performed for this artifact.
Revision reason: adds a stricter care-facing boundary after the Living ViewDiff and ClaimBoundaryCompiler lines of work.

## Boundary principle

A care-facing MC output must be an observation-and-question packet, not a conclusion engine.

## Allowed functions

- organize user-provided observations
- separate observation from interpretation
- preserve timeline and recurrence
- mark missing information
- turn concern into questions for a professional
- show what was removed or transformed
- identify when professional review is needed, without ranking urgency unless an external rule explicitly requires emergency escalation

## Prohibited functions

- diagnosis
- triage authority
- treatment recommendation
- prognosis
- medication instruction
- veterinary instruction
- emergency decision-making
- claiming symbolic meaning proves biological fact
- replacing professional documentation
- exposing raw private notes to public or unnecessary audiences

## Public-safe care view fields

A professional-facing packet may include:

- timeline
- direct observations
- user-reported context
- recurrence or change pattern
- actions already taken
- questions for review
- missing data
- evidence boundary
- privacy omissions by category

It should not include raw intimate narrative, identity-specific details, financial context, household context, relationship context, location context, credentials, or private transcript excerpts unless explicitly necessary and permissioned in a real product setting.

## Evidence-based caution

The relevant evidence direction is not that MC improves medical outcomes. The defensible claim is narrower:

Better-structured, reviewable communication may reduce confusion and make professional conversations more efficient, but must preserve consent, privacy, uncertainty, and professional authority.

## Evaluation checklist

Before any care-facing output is shared, it should pass:

1. Source label present.
2. Claim label present.
3. Privacy label present.
4. Missingness label present.
5. Revision reason present.
6. No diagnosis or treatment claim.
7. Symbolic material downgraded or quarantined.
8. Professional questions are explicit.
9. Removed categories are named without revealing sensitive content.
10. User can review before sharing.

## Meaningful revision reason

The prior mind already had a broad private-to-professional handoff concept. This file tightens the allowed / prohibited functions so the product can explore care support without drifting into clinical authority.