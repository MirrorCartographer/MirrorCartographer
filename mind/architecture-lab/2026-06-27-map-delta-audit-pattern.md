# Map Delta Audit Pattern

Date: 2026-06-27
Status: architecture pattern / prototype requirement
Public-safety level: public-safe; no personal/private examples; no medical or veterinary claims

## Architecture question

How can Mirror Cartographer show a change in interpretation as something the user can feel visually, while still preserving a precise audit trail of what changed, why it changed, and how to repair it?

This follows the Memory Terrain / Repair Palette line of work. The weak point is that a living map can become beautiful but vague, while an audit log can become accurate but dead. MC needs a bridge: a visual delta object that is both experiential and accountable.

## Research basis

### High-quality/current sources checked

1. Audit Trails for Accountability in Large Language Models, arXiv, 2026-01-28.
   - Useful concept: an audit trail should be chronological, context-rich, and able to reconstruct what changed, when, and under what authorization.
   - Fact: the paper frames audit trails as lifecycle records connecting provenance, decisions, approvals, and changes.
   - Inference for MC: every symbolic interpretation shift should have a reconstructable event trail, even if the UI presents it as a map motion rather than a compliance ledger.

2. CHI 2026 Workshop on Tools for Thought: Understanding, Protecting, and Augmenting Human Cognition with Generative AI.
   - Useful concept: GenAI tools should not only automate cognition; they should protect and augment critical thinking, learning, and sensemaking.
   - Fact: the workshop explicitly focuses on protecting and augmenting human cognition with GenAI and moving from vision to implementation.
   - Inference for MC: map changes should preserve the user's ability to judge the interpretation, not merely accept the system's revised reading.

3. Intent by Discovery / Epistemic UI writing, 2026.
   - Useful concept: AI interfaces need uncertainty surfaces, visible confidence, weak-provenance flags, and targeted friction.
   - Fact: the source argues that memory becomes a first-class UX surface and that interfaces should visually map uncertainty rather than presenting monolithic answers.
   - Inference for MC: a map delta should show uncertainty as part of the changed object, not as a paragraph of caveats after the answer.

4. Revisiting Systems Principles for the Era of Generative AI, Computer, January 2026.
   - Useful concept: generative AI should be treated through a systems lens, with interaction, agency, feedback, and adaptation considered together.
   - Fact: the authors argue for a systems perspective at the intersection of user-centered and AI-focused research.
   - Inference for MC: memory, symbol interpretation, repair, and visual state should be designed as one interacting system, not separate feature panels.

5. Human-agent interaction and AI repair research, 2025-2026.
   - Useful concept: repair after AI error should involve more than apology; useful repair gives local explanation, counterfactual alternatives, and user-controllable recovery.
   - Fact: recent XAI repair work compares explanation/counterfactual repair strategies with human-like conversational repair.
   - Inference for MC: after a contested reading, MC should show what interpretation would have happened under another memory state or confidence rule.

## Claim update

Old assumption:

A before/after map view is enough to show how MC revised its interpretation.

Updated claim:

A before/after map view is necessary but insufficient. MC needs a Map Delta Object: a bounded, inspectable event that binds visual movement to source, confidence, memory influence, user action, and reversibility.

Confidence: moderate. The general need for provenance, uncertainty, and repair is well-supported. The specific Map Delta Object pattern is an architectural inference for MC and must be tested with users.

## Pattern: Map Delta Object

A Map Delta Object is created whenever MC changes a visible interpretation in response to memory, user correction, uncertainty recalibration, mode change, or new evidence.

### Required fields

- delta_id: stable event identifier
- timestamp: when the change occurred
- object_id: symbol, phrase, memory object, question, or map region changed
- prior_state: compact snapshot before the change
- new_state: compact snapshot after the change
- delta_type: add, remove, narrow, dim, brighten, bridge, split, merge, quarantine, correct, expire, restore
- trigger: user correction, new input, memory recall, memory withholding, confidence change, source conflict, mode switch, safety boundary
- reason_summary: plain-language explanation of why the change happened
- source_refs: source IDs or memory provenance references; may be empty if the change is inference-only
- confidence_before: low, medium, high, or numeric score
- confidence_after: low, medium, high, or numeric score
- uncertainty_flags: missing source, stale source, conflicting source, symbolic ambiguity, personal-context boundary, safety boundary
- user_action_available: undo, inspect, contest, narrow, quarantine, accept, compare alternative
- future_use_rule: allowed, dimmed, context-limited, quarantined, expired, never-use
- public_safe_trace: redacted summary suitable for logs and public artifacts

## Visual metaphor spec

The delta should be visible as motion plus trace:

- Shift: object moves to a new location; used when relation changes.
- Pulse: object becomes brighter/dimmer; used when confidence or relevance changes.
- Split: one object becomes two; used when MC separates user-authored meaning from model inference.
- Bridge: line appears between regions; used when a cross-context connection is allowed.
- Fence: boundary appears around an object; used when memory is context-limited or quarantined.
- Footprint: small trace remains where the object used to be; used for auditability.
- Fog: uncertainty overlay; used when confidence decreases or provenance is weak.
- Strata: layered history view; used when the user asks what changed over time.

Rule: every visual metaphor must bind to a real system state. No decorative-only safety visuals.

## Product requirement

MC must support a Delta Drawer:

1. User sees the living map change.
2. A small trace marker appears on the changed object.
3. Opening the marker shows:
   - what changed
   - why it changed
   - what influenced it
   - what was withheld or uncertain
   - what the user can do next
4. User can compare alternate states:
   - with memory allowed
   - with memory withheld
   - with corrected memory
   - with symbolic mode only
   - with literal mode only
5. User can apply repair actions without managing a database.

## Evaluation criterion

A Map Delta implementation passes only if a test user can answer these questions after one interpretation change:

1. What changed on the map?
2. Why did it change?
3. What source, memory, or inference influenced the change?
4. What was uncertain or withheld?
5. What can the user undo, contest, narrow, or quarantine?
6. What future behavior will this correction affect?

Failure modes:

- The map feels alive but the user cannot reconstruct the change.
- The audit log is accurate but disconnected from the visual experience.
- The system implies certainty without showing confidence and source boundaries.
- The user can delete/correct memory but cannot see how the correction changes interpretation.
- Visual metaphors reassure without binding to real state transitions.

## Prototype plan

Build a small single-screen demo:

Input: one symbolic phrase.

States:

1. Initial reading: one symbol cluster appears.
2. Memory influence allowed: one bridge and one confidence pulse appear.
3. User contests a memory: object splits into user-authored meaning and model-inferred meaning.
4. User narrows memory: bridge becomes thinner and context fence appears.
5. User opens Delta Drawer: sees reason, source, confidence shift, and future-use rule.

No private user data should be used. Use fictional generic examples only.

## Next research question

How can MC test whether users understand map deltas accurately without over-trusting the visual metaphor or feeling forced into database management?
