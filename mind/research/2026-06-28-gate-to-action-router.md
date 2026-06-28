# Gate-to-Action Router

## Summary
Mirror Cartographer has enough public-safe gate objects to describe whether an artifact is safe, bounded, and reviewable. The next architectural need is routing: what happens after a gate produces a status.

## Strongest Attractor
Emergence.

The current GitHub mind is no longer just accumulating controls. It is becoming an operating system for transforming sensitive or high-context material into public-safe, audience-specific artifacts.

## Core Finding
MC needs a Gate-to-Action Router.

A gate is incomplete unless it emits a next action. A source, claim, privacy, audience, evidence, transformation, review, release, or revision label should not merely decorate an artifact. It should route the artifact into one of a small set of allowed next states.

## Router States
1. `publishable`: the artifact can be released as-is.
2. `revise`: the artifact is public-safe in principle but needs clearer wording, labels, or missingness.
3. `narrow`: the artifact contains too much scope and must be reduced.
4. `abstract`: the artifact contains sensitive origin material and must be transformed into method, requirement, research question, or evaluation criteria.
5. `review`: the artifact requires a qualified human or domain reviewer before release.
6. `hold_private`: the artifact should remain private.
7. `discard`: the artifact creates more risk or noise than value.

## Why This Matters
A continuity gate map shows which boundary changed what. A router shows what the system must do next.

Without routing, MC risks becoming an archive of beautifully labeled artifacts that do not execute. With routing, every label becomes operational.

## Comparison Against Existing Mind
The current continuity gate map already defines the sequence: source boundary, claim boundary, privacy boundary, audience contract, evidence lane, transformation record, ViewDiff, reviewer state, release decision, and revision hook. This router does not replace that map. It attaches action semantics to each gate result.

Prior public-safe MC materials already emphasize traceability, explicit epistemic labeling, runtime contracts, consent boundaries, and evidence separation. The router converts those principles into a deterministic publication-control step.

## Fresh Research Fit
Recent AI governance research on inspectable AI for science argues for structured documentation, controlled disclosure, integrity-preserving provenance, and workflow-level accountability rather than generic disclosure.

Ambient clinical documentation research shows that AI-generated notes are substantially transformed by clinicians before final documentation, especially in assessment and plan sections. This supports MC's need to treat transformation as a visible, reviewable operation rather than an invisible rewrite.

Current transparency research argues that disclosure cannot be reduced to post-hoc labels; transparency has to be treated as an architectural design requirement.

Healthcare deployment reporting continues to show both practical benefit and persistent privacy, consent, and error concerns around AI scribes, reinforcing the need for route states such as `review`, `hold_private`, and `abstract`.

## Public-Safe Method
For any source packet, run:

1. Identify audience.
2. Identify evidence lane.
3. Classify claim type.
4. Classify privacy risk.
5. Record missingness.
6. Record transformation.
7. Produce ViewDiff.
8. Apply reviewer requirement.
9. Emit router state.
10. Record next action.

## Product Requirement
Every MC public artifact should include one machine-readable routing line:

`router_state: publishable | revise | narrow | abstract | review | hold_private | discard`

Every non-publishable artifact must include:

- blocking gate
- reason
- safe next action
- revision reason
- missingness note

## Research Questions
- Can a simple router reduce accidental over-disclosure compared with freeform redaction?
- Can nontechnical users understand why an artifact was routed to `abstract`, `review`, or `hold_private`?
- Which gate most often blocks publication: privacy, claim strength, missing evidence, unclear audience, or missing review?
- Does routing improve trust by making refusal and revision reasons visible?

## Evaluation Criteria
A router pass succeeds when:

- the artifact has one explicit router state
- the state follows from visible labels
- sensitive details are not exposed
- evidence claims stay lane-specific
- the next action is concrete
- missingness is preserved instead of hidden
- revision reasons are understandable to an outside reviewer

## Source Status
- GitHub-derived: current repository contains recent continuity gate-map commits and related control artifacts.
- File-library derived: public-safe abstraction from MC implementation, atlas, governance, and continuity materials.
- Web-derived: 2026 AI provenance, transparency, ambient documentation, and clinical AI reporting.

## Claim Status
Architectural proposal and implementation plan. Not empirical validation.

## Privacy Status
Public-safe. Contains no personal, household, health, animal-care, financial, credential, location, relationship, or raw transcript details.

## Missingness
The router has not yet been implemented in code or tested against a fixture set. Repository search may miss adjacent files with different naming.

## Revision Reason
The prior gate map made the boundary sequence visible. This revision adds action semantics so gates produce executable next steps instead of passive labels.

## Key Phrase
A gate that does not route is only a sign. A gate that routes becomes an instrument.
