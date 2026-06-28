# Evidence Lane Support Boundary

Date: 2026-06-28
Status: public-safe care/social-support lane

## Source status
- Based on abstracted MC architecture and public health-data privacy concerns.
- No private health, household, animal-care, financial, location, relationship, credential, or transcript details included.

## Claim status
- Support-design hypothesis.
- Not a clinical claim.

## Privacy status
- Public-safe.

## Missingness
- Needs review by qualified health/social-care professionals before use in care-adjacent settings.
- Needs testing with fictional records only before any sensitive deployment.

## Revision reason
Prior MC artifacts built professional handoff boundaries. This note adds evidence-lane separation so support packets do not turn meaning into diagnosis.

## Boundary rule
Mirror Cartographer may help organize observations and questions. It must not diagnose, prescribe, triage emergencies, or assert causal medical conclusions.

## Support lane purpose
Convert complex private noticing into:
- observation summaries
- question lists
- timeline prompts
- support needs
- consent-bounded handoff packets

## Required labels for support packets
- Source status: who/what generated the note
- Claim status: observation, interpretation, question, or unsupported
- Privacy status: private, restricted, transformed public-safe, or shareable
- Missingness: what is not known
- Review authority: clinician, social worker, caregiver, trusted human, or user
- Revision reason: why the packet changed

## Blocked transformations
- Symbolic pattern -> diagnosis
- Repeated observation -> causation
- Private reflection -> public artifact
- AI summary -> reviewed fact
- Anxiety reduction -> evidence of safety

## Valid transformations
- Private concern -> question for a professional
- Repeated observation -> timeline item
- Confusing pattern -> list of possibilities to discuss
- Unsupported claim -> missingness label
- Raw sensitive story -> abstracted need statement

## Evidence-based advance to watch
The relevant direction is not "AI replaces care." The safer direction is patient-generated data and AI summaries that are reviewable, consent-aware, privacy-bounded, and transparent about uncertainty.

## Next test
Create a fictional support-packet fixture with three observations, three questions, two missingness labels, one blocked claim, and one ViewDiff from private note to professional handoff.