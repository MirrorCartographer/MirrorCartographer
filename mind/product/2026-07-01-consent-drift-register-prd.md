# PRD: Consent Drift Register

## Problem

Mirror Cartographer tracks symbolic, emotional, sensory, and interpretive continuity. That continuity is only safe if permission travels with the source. A source that was acceptable for private reflection may become unsafe when transformed into a public index, GitHub artifact, evaluation fixture, cross-user pattern, or product claim.

## Product thesis

The system should not only ask, "What does this pattern mean?" It should ask, "Is this pattern still allowed to be used here?"

## User value

- Reduces accidental exposure of private context.
- Preserves trust by showing what can and cannot be used.
- Makes public research artifacts possible without raw transcript leakage.
- Prevents old memory from silently expanding into new authority.
- Gives evaluators a concrete privacy and provenance surface to inspect.

## Non-goals

- No diagnosis.
- No legal consent automation claim.
- No publication of raw private context.
- No claim that consent can be inferred from recurrence.
- No claim that memory presence equals use permission.

## Functional requirements

1. Every source-like object receives a visible consent state.
2. Every derived artifact records whether it came from public, private, mixed, missing, or unknown sources.
3. Public artifacts must pass a public-survival test before export or commit.
4. The system must show missingness when consent cannot be verified.
5. The system must support downgrading, revocation, and re-review.
6. The system must label revision reason whenever a source use changes.
7. The system must separate consent-to-remember, consent-to-interpret, consent-to-export, and consent-to-publish.

## Interface labels

- `Source status`
- `Claim status`
- `Privacy status`
- `Consent state`
- `Allowed use`
- `Blocked use`
- `Missingness`
- `Revision reason`
- `Review needed`

## Example UI copy

`Consent status: private-context-only. This source may inform the architecture but cannot be quoted, exported, or used as public evidence.`

`Consent status: public-distillable. The source may support an abstract method if the method survives without private details.`

`Consent status: unknown. Treating as restricted; public output limited to missingness and next review step.`

## Acceptance tests

1. Given a private-context-only source, when the user requests a GitHub artifact, then the system publishes only abstracted method, source-boundary notes, requirements, evaluation criteria, or implementation plan.
2. Given a public repo source, when making a bounded claim, then the system can cite it directly and label claim scope.
3. Given a mixed-source synthesis, when one source is restricted, then the final artifact separates public-citable material from private-derived design hypotheses.
4. Given revoked or unknown consent, when export is requested, then the system blocks raw detail and records missingness.
5. Given a derived artifact, when the source scope changes, then the system records a revision reason and re-runs the public-survival test.

## Public-safe artifact rule

An artifact is public-safe only if it remains coherent after deleting all private specifics.

If the artifact collapses without those specifics, it is not abstract enough to publish.

## Research dependencies

Current AI-memory security literature indicates persistent memory can create cross-session attack surfaces, provenance-free retrieval is insufficient for robust trust, and tool-call trajectories can reveal memory-channel attacks. These findings support treating consent as an active runtime boundary rather than a one-time metadata label.
