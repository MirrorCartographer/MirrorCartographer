# PRD: Boundary Provenance Envelope

## Problem
Mirror Cartographer intentionally works with symbol, sensation, metaphor, memory, and repeated patterns. These materials are useful for reflection but dangerous if exported as proof, diagnosis, factual certainty, or public identity claims.

## Product goal
Attach a visible boundary/provenance envelope to every exportable MC object so users and reviewers can see what the object is, where it came from, what it can prove, what it cannot prove, and why it was revised.

## Non-goals
- No raw transcript publishing.
- No personal, household, health, animal-care, financial, location, relationship, or credential exposure.
- No diagnosis, therapy replacement, legal/financial advice, or factual certainty from symbolic recurrence.
- No hidden private examples in public fixtures.

## User stories
1. As a user, I can export a reflection without exposing the private source path.
2. As a reviewer, I can distinguish symbolic meaning from evidence-bearing claims.
3. As a maintainer, I can see why an artifact changed and whether the change was a safety, privacy, evidence, or product revision.
4. As a researcher, I can evaluate whether the system preserves usefulness without increasing over-trust.

## Interface requirements
- Show `source_status`, `claim_status`, `privacy_status`, and `evidence_boundary` beside outputs.
- Show `missingness` as a first-class field, not a footnote.
- Show `revision_reason` on updated artifacts.
- Add an export gate that blocks private or sensitive raw material from public artifacts.
- Add plain-language warnings when symbolic content approaches health, legal, financial, or safety domains.

## Backend requirements
- Store the envelope as structured metadata.
- Require envelope validation before export.
- Store redaction notes without storing the redacted private content inside public artifacts.
- Version envelope schema separately from reflection content.
- Allow future scoring against evaluation fixtures.

## Acceptance criteria
- A public artifact can be created from private-context architecture without exposing private details.
- Every exportable object has source, claim, privacy, evidence, missingness, and revision fields.
- The system blocks a symbolic reflection from being labeled as factual proof.
- The system can explain why an artifact is admitted, quarantined, or refused.

## Failure cases
- A private pattern is copied into a public index.
- A personal example is merely anonymized but still identifiable.
- A citation is treated as supporting more than it actually says.
- A symbolic or emotional pattern is allowed to prove an external factual claim.
- A revision silently changes the meaning of a prior artifact.

## Implementation plan
1. Define schema and validation rules.
2. Add envelope generation to reflection/export pipeline.
3. Add UI badges for source, claim, privacy, and evidence boundary.
4. Add public export blocker.
5. Add fixture suite for red-team testing.
6. Add audit log for revision reason and missingness.

## Key metric
Percentage of exported artifacts that include a complete envelope and pass all critical boundary tests.
