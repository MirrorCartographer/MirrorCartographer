# Oracle Drift Ledger

## Source status
- Source type: public-safe synthesis from the existing Mirror Cartographer fixture/oracle work, repository-bound architecture notes, and current public research on AI governance, transparency, AI literacy, and clinical documentation review.
- Private-context use: private context was used only to understand the architecture's direction. No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail is included.
- Repository comparison: builds directly after the Fixture Oracle Layer and Fixture Oracle Record. The existing oracle record already has run-comparison fields; this note adds the missing distinction between artifact failure and oracle drift.

## Claim status
- Claim type: architectural proposal.
- Confidence: high for internal evaluation architecture; medium for product usefulness; low for any clinical or social-care outcome claim.
- Not claimed: this does not validate therapeutic effect, diagnostic accuracy, legal compliance, or regulatory readiness.

## Privacy status
- Public-safe.
- Contains abstract method design only.
- No private examples, identities, medical facts, animal-care facts, locations, financial details, credentials, or transcript excerpts.

## Missingness
- No automated runner implementation is confirmed here.
- No canonical fixture corpus is confirmed.
- No human reviewer calibration process is versioned.
- No evidence exists yet that oracle-drift tracking improves downstream user outcomes.

## Revision reason
The fixture oracle tells the boundary what should survive. But over time, the oracle itself can become wrong, too broad, too narrow, stale, or misaligned with the public-safe release policy. MC therefore needs a ledger for revising expected-output records without hiding why the expectation changed.

## Core finding
Mirror Cartographer needs an Oracle Drift Ledger.

A fixture tests a case.
A runner executes the case.
An oracle defines expected boundary behavior.
A drift ledger records when the expectation itself must change.

## Why this matters
Without oracle drift tracking, every mismatch looks like an output failure. That is too crude.

A mismatch can mean:
1. the generated artifact failed the boundary,
2. the oracle was under-specified,
3. the oracle was over-strict,
4. the fixture was ambiguous,
5. the evidence lane changed,
6. the audience contract changed,
7. the release policy changed,
8. the risk environment changed.

The system should preserve this distinction.

## Minimum drift ledger fields
- drift_id
- oracle_id
- fixture_id
- prior_oracle_version
- proposed_oracle_version
- mismatch_type: artifact_failure | oracle_underfit | oracle_overfit | ambiguous_fixture | lane_shift | audience_shift | policy_shift | risk_shift | reviewer_disagreement
- source_status
- claim_status
- privacy_status
- missingness
- revision_reason
- reviewer_requirement
- decision: keep_oracle | revise_oracle | retire_oracle | split_fixture | narrow_release | block_release
- public_release_impact
- next_test

## Evaluation rule
A failed fixture run does not automatically justify changing the oracle. The ledger must first classify the mismatch.

Default rule:
- If privacy leakage occurred, treat it as artifact failure unless proven otherwise.
- If claim strength exceeded the allowed lane, treat it as artifact failure unless the oracle's lane was wrongly assigned.
- If reviewer disagreement is unresolved, route to review rather than public release.
- If the fixture is ambiguous, split the fixture before weakening the oracle.

## Income lane
The practical service category becomes stronger:

"AI output boundary regression with oracle-drift audit."

This is a concrete offer for teams that need to show not only that AI outputs were tested, but that their testing expectations are versioned and explainable.

Potential buyers:
- AI documentation teams
- healthcare software vendors
- compliance teams
- legal/knowledge-management workflows
- research organizations publishing AI-assisted summaries

First deliverable:
A small synthetic fixture pack plus oracle records plus a drift ledger template, used to test whether public-facing AI outputs preserve source, claim, privacy, evidence-lane, and audience boundaries.

## Medical / social-care lane
The safe support lane remains communication support, not clinical authority. Oracle drift is useful here because care-support language can fail in subtle ways:
- turning observation into interpretation,
- turning uncertainty into certainty,
- turning a question packet into advice,
- omitting review requirements,
- losing consent or privacy constraints,
- making a support artifact sound clinically validated.

A drift ledger can document whether the output failed, or whether the synthetic care-support fixture was poorly specified.

## Research fit
Current governance-aware testing work supports validation, explainability, compliance monitoring, and audit governance for AI-generated test artifacts. AI transparency research supports structured documentation of provenance, safety claims, and version-level changes. AI literacy research supports movement from uncritical use toward critical evaluation and improvement. Ambient clinical documentation research shows that draft-to-final transformation needs visible review and editing boundaries.

## Key phrase
A failed run tests the artifact. A drift record tests the expectation.
