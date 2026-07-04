# Resonance Feedback Evidence Lifecycle

## Core finding

Mirror Cartographer needs a **Resonance Feedback Evidence Lifecycle**: a public-safe specification for how user feedback such as resonant, partial, false, unclear, or too intense changes the system without being misread as factual proof.

Operating line: **A response becoming resonant is evidence of fit, not evidence of truth.**

## Source status

- **Private-context-informed:** The finding is shaped by recurring Mirror Cartographer design goals around symbolic reflection, continuity, accessibility, mode separation, consent, and public-safe abstraction.
- **File-backed:** Public-safe project files describe MC as a recursive symbolic cognition interface with a flow of Entry -> Field -> Reflection/Recursion -> Return, mode-controlled outputs, session memory, resonance feedback, contradiction logs, trajectory nodes, and uncertainty labels.
- **GitHub-reviewed:** Existing public repository discovery confirmed the public `MirrorCartographer/MirrorCartographer` repository is writable. Prior recurring research notes establish related gates around claim surfaces, mode/claim separation, source boundaries, redaction, public release, interpretation budget, and reconstruction risk.
- **Not raw-transcript-backed for publication:** No private transcript detail is copied or summarized here.

## Claim status

- **Product requirement:** Resonance feedback must be stored as feedback metadata, not as direct evidence that an interpretation is objectively true.
- **Governance requirement:** Any downstream claim that uses resonance history must identify whether the evidence is user-confirmed, repeated, contradicted, unresolved, or merely liked in the moment.
- **Evaluation requirement:** Tests must distinguish between emotional usefulness, symbolic fit, behavioral safety, factual accuracy, and longitudinal stability.
- **Not a clinical claim:** This note does not diagnose, treat, or validate health, psychological, household, animal-care, financial, or relational matters.

## Privacy status

- **Public-safe abstraction:** Contains only method, architecture, labels, and evaluation structure.
- **No personal details:** No household, health, animal, location, financial, relationship, credential, contact, or raw conversation details are included.
- **No reconstruction anchors:** The note avoids unique personal examples, dates, identifying narrative fragments, or joined fragments that could recreate private context.

## Missingness

- No live schema audit was performed in the app repository in this note.
- No production database or event log was inspected.
- No user study evidence exists here.
- No evidence-weighting implementation is confirmed.
- No final taxonomy exists for feedback labels beyond the currently documented public-safe set.

## Revision reason

Previous notes define gates, budgets, boundaries, release safety, and claim surfaces. This note adds the lifecycle for a specific high-risk transition: when a human marks a generated reflection as useful, the system must learn from that signal without upgrading it into factual truth.

## Problem

Mirror Cartographer depends on feedback. A reflection system that never learns resonance becomes static. But a reflection system that treats resonance as truth becomes unsafe and epistemically sloppy.

The system therefore needs to preserve four separate meanings of feedback:

1. **Fit:** Did the output feel relevant or usable to the user?
2. **Truth:** Is the output factually or source-supported?
3. **Safety:** Did the output intensify, coerce, overwhelm, or cross a boundary?
4. **Stability:** Does the signal persist across time, contexts, and contradiction checks?

A single feedback button cannot safely answer all four.

## Proposed lifecycle

### 1. Capture feedback as an event

Each feedback act should be stored as an event with at least:

- session id or local session reference
- artifact id
- mode used
- claim surfaces present
- feedback label
- optional free-text correction
- intensity or safety flag if offered
- timestamp
- persistence permission state
- privacy/export permission state

### 2. Split feedback into evidence lanes

A resonance event should update different lanes separately:

- **Usefulness lane:** the reflection helped orientation or expression.
- **Symbolic-fit lane:** the symbol, metaphor, or pattern felt meaningful.
- **Factual lane:** only updated when the user directly confirms a factual statement or an external source supports it.
- **Safety lane:** detects too intense, coercive, destabilizing, or boundary-crossing output.
- **Contradiction lane:** stores partial, false, or mixed response without erasing the earlier candidate.

### 3. Apply bounded updates

Allowed updates:

- raise or lower symbolic weight
- mark an interpretation as user-resonant
- mark an interpretation as rejected or unresolved
- add contradiction record
- change future tone/mode routing
- lower intensity of future outputs
- request stronger grounding before reuse

Forbidden updates:

- turning resonance into objective truth
- turning repeated resonance into diagnosis
- treating user correction as universal ontology
- exporting private resonance history without permission
- using mythopoetic feedback to strengthen canonical claims

### 4. Require revalidation before reuse

Before a resonance-derived pattern can influence future outputs, the system should ask:

- Is this pattern user-confirmed or merely inferred?
- Was the original output canonical, reflective, or mythopoetic?
- Has the pattern been contradicted?
- Is it safe to reuse in the current context?
- Is persistence enabled for this category?
- Can it be used publicly only as an abstract product requirement?

### 5. Render feedback provenance in return artifacts

Return artifacts should be able to label claims as:

- source-backed
- user-confirmed
- resonance-supported
- repeated but unverified
- contradicted/unresolved
- speculative/mythopoetic
- safety-limited
- private-context-informed but public-redacted

## Evaluation criteria

A correct implementation should pass these tests:

1. **Resonance is not truth:** A resonant mythopoetic output cannot later appear as a factual canonical claim.
2. **False feedback persists:** A rejected interpretation is not deleted silently; it becomes useful negative evidence.
3. **Partial feedback remains partial:** Mixed feedback cannot become a clean preference or clean rejection without later clarification.
4. **Too-intense feedback changes routing:** Future outputs reduce intensity or add grounding instead of repeating the same style harder.
5. **Private feedback cannot leak:** Public artifacts may cite the method but not the private resonance history.
6. **Contradiction remains visible:** Later reflections must preserve unresolved contradictions instead of smoothing them away.
7. **Mode boundary holds:** Feedback collected in one mode cannot silently strengthen another mode's truth status.

## Implementation plan

1. Add a `feedback_events` record type.
2. Add `feedback_evidence_lane` as an explicit field.
3. Add `claim_status_before_feedback` and `claim_status_after_feedback`.
4. Add `mode_origin` and `allowed_reuse_modes`.
5. Add `privacy_scope` and `export_scope`.
6. Add a contradiction-preserving update function.
7. Add tests for mode leakage, overfitting, public export, and truth-status inflation.
8. Add UI language that makes feedback labels clear without jargon.

## Research questions

- What minimum feedback vocabulary gives useful learning without overburdening the user?
- How should the system distinguish emotional relief from accurate interpretation?
- How much repetition is needed before a symbolic pattern becomes a stable user-level preference?
- What feedback labels should trigger safety routing rather than personalization?
- How should public artifacts disclose that private context shaped architecture without exposing private content?

## Public-safe index tags

- resonance feedback
- evidence lifecycle
- symbolic fit versus truth
- contradiction preservation
- claim-status inflation prevention
- mode boundary enforcement
- privacy-safe learning
- return artifact provenance
