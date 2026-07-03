# Resonance Feedback Calibration Loop

Date: 2026-07-02
Status: public-safe architecture note

## Core finding

Mirror Cartographer needs a **Resonance Feedback Calibration Loop**: a method for converting user feedback on a reflection into bounded system updates without treating resonance as proof, rejection as failure, or intensity as truth.

## Operating line

**A reflection should learn from resonance without mistaking resonance for evidence.**

## Source status

- Source type: derived from available Mirror Cartographer project materials, uploaded specification files, repository README, and prior public-safe research notes.
- Source boundary: private-context materials were used only to infer architectural needs. No raw private transcript, household, health, animal-care, financial, location, relationship, credential, or identifying detail is included here.
- Repository anchor: the public README describes MC as a reflective and research-oriented interface that tracks source status, claim status, user correction, outcome feedback, and public/private boundaries.
- File anchor: the implementation specification describes a resonance step where the user can mark a reflection as resonant, partial, false, unclear, or too intense, and the system updates weights and contradiction logs.
- External source status: not required for this note; this is an internal product and evaluation requirement, not a claim about the external world.

## Claim status

- Claim type: product requirement / evaluation method.
- Claim strength: strong architectural recommendation.
- Evidence basis: repeated MC design need for user correction, contradiction preservation, uncertainty labels, and non-authoritative reflection.
- Not claimed: resonance does not prove factual truth; disagreement does not prove user error; emotional intensity does not prove symbolic accuracy; calibration does not make MC therapeutic, clinical, diagnostic, or objectively authoritative.

## Privacy status

- Public-safe: yes.
- Private details included: none.
- Redaction posture: abstracted interaction method only.
- Export risk: low, assuming future examples are synthetic, composite, or explicitly user-approved for public use.

## Missingness

The current missing layer is a clear rule for what the system should do after feedback is received.

Without this layer, MC can collect user reactions but may fail to distinguish between:

- emotional resonance;
- factual correction;
- partial fit;
- ambiguity;
- discomfort or overload;
- contradiction with prior state;
- insufficient evidence;
- mode mismatch;
- private context that should not be generalized.

## Calibration model

### 1. Feedback classes

Each reflection response should allow at least these feedback labels:

- `resonant`
- `partially_resonant`
- `false`
- `unclear`
- `too_intense`
- `too_flat`
- `wrong_mode`
- `privacy_risk`
- `needs_source`
- `needs_next_step`

### 2. Update rules

Feedback should update different layers depending on its class:

| Feedback | System update | Prohibited interpretation |
|---|---|---|
| resonant | Increase local confidence for phrasing, symbol fit, or interaction style | Treating resonance as objective proof |
| partially_resonant | Preserve useful part and mark remainder unresolved | Collapsing partial fit into full truth |
| false | Record correction and lower confidence for the claim or mapping | Treating rejection as user resistance |
| unclear | Add missingness note and simplify next output | Treating confusion as depth |
| too_intense | Lower intensity, add grounding, reduce symbolic pressure | Treating intensity as accuracy |
| too_flat | Increase texture, specificity, or aesthetic fidelity | Treating simplicity as safety by default |
| wrong_mode | Re-route through Canonical, Reflective, Mythopoetic, Builder, Evaluator, or Publisher mode | Mixing modes silently |
| privacy_risk | Strip payload, retain method only, require boundary review | Publishing because the insight is useful |
| needs_source | Mark source gap and avoid claim escalation | Inventing authority |
| needs_next_step | Convert reflection into action map or research question | Leaving insight unimplemented |

### 3. Persistence boundaries

Feedback should be stored at the narrowest useful level:

- phrase-level: wording worked or failed;
- symbol-level: mapping worked or failed;
- mode-level: wrong interpretive mode;
- claim-level: factual or evidential correction;
- intensity-level: output was too strong, too vague, or too emotionally loaded;
- privacy-level: output crossed a boundary;
- trajectory-level: feedback changed the direction of the map.

The system should not store more private context than necessary to preserve the correction.

### 4. Contradiction handling

When feedback conflicts with earlier feedback, MC should not overwrite the old state silently.

It should create a contradiction record:

- previous feedback;
- new feedback;
- affected claim, symbol, mode, or output type;
- possible reason for change;
- confidence impact;
- missing information;
- revision reason.

This preserves continuity without forcing premature resolution.

## Evaluation criteria

A Resonance Feedback Calibration Loop succeeds when:

- the user can correct the system without being argued with;
- positive resonance increases local usefulness but not unsupported truth claims;
- negative feedback becomes a design signal rather than a failure state;
- intensity is treated as a safety and usability variable, not evidence;
- feedback updates are narrow, inspectable, and reversible;
- contradictions are preserved with timestamps and revision reasons;
- public artifacts can describe the calibration method without exposing private examples.

## Implementation plan

1. Add feedback controls to reflection cards.
2. Store feedback as structured metadata rather than raw emotional transcript whenever possible.
3. Attach feedback to the smallest affected unit: phrase, claim, symbol, mode, intensity, privacy boundary, or next-step structure.
4. Add a contradiction record when feedback changes or conflicts.
5. Add a `revision_reason` field whenever feedback changes future behavior.
6. Add a public-safe calibration demo using synthetic examples only.
7. Add a lint check that prevents feedback-derived claims from being published as evidence-backed unless independently supported.

## Research questions

- What feedback labels are expressive enough without making the interface heavy?
- How can the system distinguish “this feels true” from “this is useful language”?
- When should feedback alter a single output versus future defaults?
- How should MC preserve contradiction without making the map feel broken?
- What public demo can show calibration without exposing private source material?

## Revision reason

Created after reviewing existing public-safe MC boundary notes and identifying that source, claim, privacy, mode, and publication rules still need a user-feedback calibration layer. This note converts the resonance step from a vague interaction idea into an inspectable update protocol.