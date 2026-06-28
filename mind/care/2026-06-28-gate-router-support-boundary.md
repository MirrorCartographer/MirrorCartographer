# Gate Router Support Boundary

## Summary
The Gate-to-Action Router can support medical or social-care communication only as a documentation and question-routing aid. It must not diagnose, prescribe, or replace qualified care.

## Public-Safe Care Use
The router can help convert sensitive or complex observations into:

- structured observation summaries
- question packets for qualified professionals
- missing-information checklists
- appointment-prep notes
- longitudinal change summaries
- review-needed flags

## Required Boundary
Care-adjacent artifacts should route through stricter states:

- `review` when interpretation could affect care decisions
- `abstract` when public-safe method learning is possible but source detail is sensitive
- `hold_private` when the artifact contains identifying or intimate source details
- `revise` when uncertainty, source, or claim labels are weak

## Evidence-Based Fit
Recent clinical AI work suggests value when AI supports workflow-aligned review, documentation quality, and clinician autonomy. Ambient documentation deployments also show persistent concerns about privacy, consent, errors, and recording retention. MC should therefore position care-lane work as communication support, not autonomous care authority.

## Safe Product Requirement
Any care-support packet must include:

- non-diagnostic label
- source status
- claim status
- missingness
- reviewer requirement
- escalation boundary when appropriate
- privacy status
- next professional-facing question

## Claim Status
Support-communication design proposal. Not clinical validation.

## Privacy Status
Public-safe. No personal, household, health, animal-care, location, relationship, financial, credential, or raw transcript details.

## Missingness
No clinical trial, safety study, or professional review of this MC-specific router exists yet.

## Revision Reason
Preserve the practical care lane while preventing unsupported medical or social-care claims.

## Key Rule
MC may help organize what to ask. It must not pretend to know what care should be.
