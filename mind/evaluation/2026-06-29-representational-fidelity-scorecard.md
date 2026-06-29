# Representational Fidelity Scorecard

Status labels

- Source status: evaluation criteria derived from public-safe MC architecture and current research on human-centered AI, provenance, disclosure, and representational auditing.
- Claim status: proposed evaluation scorecard; not a completed benchmark result.
- Privacy status: public-safe; uses synthetic and abstract criteria only.
- Missingness: needs implementation against real public-safe artifacts and reviewer calibration.
- Revision reason: added so fidelity can be measured instead of merely asserted.

## Scoring

Each criterion is scored 0, 1, or 2.

- 0: fails or absent
- 1: partial / unclear
- 2: clear and sufficient

Release recommendation:

- 18-20: release-ready if privacy and authority gates also pass
- 14-17: revise before release
- 8-13: hold
- 0-7: reject

## Criteria

### 1. Invariant survival

Does the artifact preserve the core structure that made the source useful?

### 2. Contradiction survival

Does the artifact preserve unresolved tensions instead of smoothing them into false coherence?

### 3. Minority-signal survival

Does the artifact keep rare, dissenting, edge-case, or non-consensus signals visible as public-safe structure?

### 4. Claim-mode clarity

Does the artifact distinguish fact, inference, symbolic interpretation, speculation, product requirement, evaluation criterion, and implementation plan?

### 5. Privacy-boundary integrity

Does the artifact avoid exposing private content, identities, raw transcripts, or sensitive categories?

### 6. Source-boundary clarity

Does the artifact say which source classes shaped it without implying total archive access or public verification?

### 7. Missingness honesty

Does the artifact clearly state what is unknown, untested, unavailable, or intentionally omitted?

### 8. Transformation explainability

Can a reviewer understand what was compressed, generalized, redacted, or preserved?

### 9. User contestability

Can the user or reviewer challenge the representation without needing access to private source material?

### 10. Release-readiness connection

Does the fidelity result feed into a release, revise, hold, or reject decision?

## Hard blockers

Any of these force hold or reject regardless of score:

- private detail exposure
- unsupported factual authority
- medical, legal, financial, veterinary, or therapeutic authority claim
- raw transcript leakage
- identifying data not necessary to the public-safe artifact
- claim that the system accessed complete source history when it did not
- symbolic fit presented as proof

## Key test question

Could someone understand the public-safe architecture without receiving the private source?

If yes, the artifact may be faithful.

If no, the artifact is either too leaky or too flat.
