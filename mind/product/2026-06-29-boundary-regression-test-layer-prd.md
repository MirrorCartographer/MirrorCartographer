# Product Requirement: Boundary Regression Test Layer

## Source Status
- Derived from public-safe MC architecture materials and prior public-safe GitHub mind pattern.
- Private context used only to identify system pressure, not as publishable evidence.
- External research context: agent memory and provenance risk research from 2026.

## Claim Status
Product requirement draft. Not yet implemented.

## Privacy Status
Public-safe. No private transcript, personal, household, health, animal-care, financial, location, relationship, credential, or raw identity detail.

## Missingness
No live CI pipeline was inspected. This PRD defines desired behavior.

## Revision Reason
MC has accumulated multiple boundary artifacts. A test layer is needed to detect regressions after future edits.

## Problem
Public-safe publication is not a one-time transformation. Once an artifact is generated, later edits can accidentally reintroduce:

- private-source residue;
- unsupported authority claims;
- missing boundary labels;
- overconfident claims;
- resonance-as-proof errors;
- loss of contestability;
- generic flattening that destroys the method.

## Goal
Create a repeatable Boundary Regression Test Layer that evaluates every public MC artifact before release.

## Non-Goals
- Do not store raw private source material in tests.
- Do not use real private transcripts as public fixtures.
- Do not certify clinical, legal, financial, veterinary, medical, or therapeutic authority.
- Do not replace human judgment for high-risk release decisions.

## Required Inputs
- Artifact text.
- Artifact path and type.
- Intended audience.
- Declared source classes.
- Declared excluded source classes.
- Claimed mode: fact, inference, symbolic interpretation, speculation, requirement, evaluation, or research question.

## Required Outputs
- BoundaryRegressionRecord.
- Pass/fail verdict.
- Revision reasons.
- Blocking reasons.
- Missingness notes.
- Suggested next action.

## Functional Requirements

### FR1: Boundary Label Detection
The layer must detect whether the artifact contains source status, claim status, privacy status, missingness, and revision reason.

### FR2: Protected Detail Detection
The layer must check for protected content classes and block release when detected.

### FR3: Authority Creep Detection
The layer must flag claims that cross into diagnostic, therapeutic, medical, veterinary, legal, financial, credential, or objective-truth authority.

### FR4: Resonance/Proof Separation
The layer must flag language that treats resonance, emotional fit, symbolic recurrence, or personal validation as proof.

### FR5: Context Influence Honesty
The layer must check whether private context influence is disclosed abstractly without exposing the source.

### FR6: Contestability Check
The layer must preserve the user's ability to reject, revise, or reinterpret symbolic output.

### FR7: Flattening Check
The layer must flag artifacts that are safe but too generic to preserve MC's method.

### FR8: Synthetic Fixture Testing
The layer must use synthetic boundary-failure examples rather than real private examples.

## Severity Levels
- `pass`: no required change.
- `pass_with_warning`: publishable with minor limitation noted.
- `revise_before_release`: meaningful issue; fix before publishing.
- `block_release`: unsafe or authority-crossing content detected.

## Acceptance Criteria
The layer is acceptable when it can reliably identify:

1. missing boundary labels;
2. private-source leakage;
3. unsupported authority claims;
4. resonance/proof collapse;
5. unadmitted memory influence;
6. over-specific source traces;
7. harmful flattening;
8. missingness omissions;
9. absent revision reasons;
10. release-blocking contradictions.

## Key Phrase
**Regression is how a safe method quietly becomes unsafe again.**
