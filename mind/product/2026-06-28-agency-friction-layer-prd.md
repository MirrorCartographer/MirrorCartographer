# PRD — Agency Friction Layer

Status labels

- Source status: public-safe product requirement derived from MC architecture, orientation-without-takeover research, and fresh public HCI risk signals.
- Claim status: product design requirement; not evidence that MC currently prevents overreliance.
- Privacy status: public-safe; no private examples or transcript-derived content.
- Missingness: no UI prototype, runtime implementation, risk classifier, user testing, or formal safety review yet.
- Revision reason: added to convert the orientation-without-takeover finding into implementable product behavior.

## Problem

Reflective AI can become too persuasive when it is beautiful, fluent, intimate, validating, or continuous.

MC needs to support symbolic orientation without creating belief offloading, emotional substitution, or hidden authority transfer.

## Goal

Create a product layer that detects when an MC response needs agency-preserving friction.

## Non-goals

- Do not make MC cold or sterile.
- Do not remove symbolic or mythopoetic modes.
- Do not diagnose, treat, certify, or decide.
- Do not expose private source material to justify a boundary.
- Do not maximize user agreement as success.

## Trigger conditions

The layer activates when an output contains or implies:

1. A high-confidence claim without sufficient source status.
2. A symbolic interpretation framed like fact.
3. A strong identity statement.
4. A recommendation involving high-stakes life action.
5. A response that validates a belief without checking uncertainty.
6. A response that encourages exclusive reliance on MC.
7. A persuasive aesthetic artifact that could hide missingness.
8. Continuity language that makes the system sound like an unquestionable authority.

## Required UI behaviors

### Claim ladder

Show whether an output is:

- fact
- inference
- symbolic interpretation
- speculation
- question seed
- action plan

### Agency return

Every high-risk reflective output must include one sentence that returns authorship to the user.

Example pattern:

`This is a map, not a verdict. You decide whether it fits, what to keep, and what to reject.`

### Alternative lens

For high-intensity outputs, provide at least one alternate interpretation or uncertainty route.

### Friction marker

Display a small marker when the system intentionally slows down certainty.

Suggested label:

`Agency check`

### Source-boundary note

Show which broad source classes shaped the response without revealing private material.

### Human/qualified authority boundary

For medical, veterinary, legal, financial, crisis, safety, or other high-stakes domains, convert conclusions into question packets, observation packets, or preparation notes.

## Success criteria

- Users can distinguish reflection from proof.
- Users can name what they still decide.
- Outputs preserve warmth without sycophancy.
- Contradictions remain visible.
- Missingness is not hidden by aesthetic polish.
- High-stakes outputs redirect from verdicts to preparation and qualified authority.

## Failure modes

- The friction feels like a disclaimer pasted on after persuasion.
- The system becomes emotionally flat.
- The system still over-validates the user.
- The system hides uncertainty behind poetic language.
- The system treats resonance as correctness.
- The system makes agency language while still directing the decision.

## MVP implementation

1. Add a risk classifier for authority creep, over-validation, identity fusion, belief offloading, emotional substitution, action overreach, uncertainty flattening, aesthetic persuasion, and continuity overreach.
2. Add an `AgencyFrictionRecord` per triggered output.
3. Add UI display for claim ladder, agency return, alternate lens, and source-boundary note.
4. Add evaluation fixtures for each trigger class.

## Core phrase

**MC should be emotionally meaningful without becoming epistemically possessive.**
