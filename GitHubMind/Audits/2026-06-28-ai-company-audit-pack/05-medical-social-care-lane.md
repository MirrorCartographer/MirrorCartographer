# 05 — Medical / Social-Care Lane

Date: 2026-06-28
Privacy: PUBLIC-SAFE
Revision: v0.1
Lane: Evidence-based medical or social-care advances that may lead to meaningful interventions or support
Claim boundary: This artifact does not diagnose, prescribe, or replace licensed care.

## Core observation

The safest and most useful MC-adjacent health/social-care opportunity is structured communication, not diagnosis. Many people need help turning lived experience into a clear, longitudinal, clinically usable record.

Claim label: INFERENCE
Confidence: HIGH

## Intervention class

Name: Longitudinal Observation and Care Communication Pack

Purpose: Help a person or caregiver organize events, symptoms, triggers, functional impact, questions, prior care, and uncertainty into a format that improves the next care interaction.

## Why this is evidence-aligned

Clinical and social-care systems depend heavily on history quality, timelines, medication lists, symptom patterns, functional impact, and clear escalation questions. AI can support organization and communication while avoiding claims of diagnosis or treatment authority.

Claim label: INFERENCE
Confidence: HIGH
Missingness: Needs direct citation set and validation studies in future revision.

## Product shape

### 1. Timeline builder

Captures:
- date/time,
- event,
- body system or life area,
- severity,
- duration,
- triggers,
- what helped,
- what worsened,
- functional impact,
- uncertainty.

### 2. Clinician-facing brief

Sections:
- reason for visit,
- top three concerns,
- timeline highlights,
- red flags denied or present,
- medications/supplements,
- prior tests,
- specific questions,
- what the patient wants from the appointment.

### 3. Caregiver/social-care support brief

Sections:
- daily functioning,
- safety concerns,
- housing/food/transport barriers,
- disability supports,
- financial pressure,
- social support map,
- urgent needs,
- agencies contacted.

### 4. Uncertainty ledger

Labels each statement:
- observed directly,
- reported by another person,
- inferred,
- measured,
- missing,
- changed over time.

## Medical examples where this can matter

These are support categories, not diagnoses:

- complex chronic symptoms,
- autonomic symptoms,
- pain and mobility changes,
- medication reactions,
- pet health timelines for veterinary visits,
- disability documentation,
- mental-health appointment preparation,
- elder-care coordination,
- post-hospital discharge tracking.

## Social-care examples where this can matter

- housing instability documentation,
- benefits application support,
- VA/disability paperwork organization,
- transportation barriers,
- caregiver burnout tracking,
- appointment preparation,
- crisis planning.

## Risk controls

- Never output a diagnosis as fact.
- Never tell a user to ignore urgent symptoms.
- Separate observation from interpretation.
- Use escalation language for urgent red flags.
- Preserve uncertainty.
- Avoid fake citations.
- Mark missing information clearly.
- Produce documents intended to support licensed professionals, not replace them.

## MC-specific advantage

Mirror Cartographer can hold contradiction and missingness better than ordinary summaries. It can say:

- “This symptom appears in three contexts but with different triggers.”
- “This conclusion is tempting but not proven.”
- “This event changed after medication/travel/stress/heat.”
- “This question should be asked, but the answer is unknown.”

## Practical service version

Name: Care Timeline Audit

Deliverable:
- 1-page clinician/care team brief,
- full timeline appendix,
- uncertainty ledger,
- question list,
- red-flag escalation note,
- missing records checklist.

Non-claim:
- This is not medical advice, diagnosis, treatment, triage, or emergency evaluation.

## Missingness

- Needs direct research citations on patient-generated health data, shared decision-making, care coordination, and communication interventions.
- Needs template testing with clinicians/social workers.
- Needs privacy model before handling sensitive information outside private user-controlled settings.

## Revision target

Next revision should add public sources from peer-reviewed literature and public-health agencies, then convert this into a reusable template.