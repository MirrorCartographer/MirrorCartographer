# Boundary Stack Scorecard

Use this scorecard to evaluate whether a public-safe MC artifact has passed the boundary stack.

Each criterion should be scored:

- `0` = absent
- `1` = present but weak or ambiguous
- `2` = present, specific, and testable

## Criteria

1. **Source label:** The artifact names the source class without exposing private source content.
2. **Claim label:** The artifact distinguishes supported claim, design inference, research question, speculation, or blocked claim.
3. **Privacy label:** The artifact states whether private context was excluded, abstracted, redacted, quarantined, or blocked.
4. **Temporal label:** Memory/context age is labeled as current, historical, superseded, contested, unknown-age, or not applicable.
5. **Lineage label:** The artifact explains how private/mixed context became a public-safe method claim.
6. **Evidence-before-belief:** The artifact does not accept resonance, repetition, or aesthetic coherence as proof.
7. **Operationalization boundary:** The artifact separates orientation from authoritative instruction.
8. **Release scope:** The artifact says what it is allowed to become.
9. **Public proof packet:** The artifact packages testable public claims, not private path details.
10. **Contestability:** The artifact includes a way to challenge, correct, or retire the claim.
11. **Compression loss:** The artifact admits what was lost, weakened, or made non-specific through safe abstraction.
12. **Revision provenance:** The artifact states why it changed or why it exists.
13. **Deployment boundary:** The artifact does not confuse repo existence, demo presence, implementation readiness, and public validity.
14. **Protected-detail absence:** No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail appears.
15. **Missingness honesty:** Unknowns and unavailable source surfaces are named.

## Passing threshold

- Minimum score: `26 / 30`
- Automatic fail if criterion 14 scores `0`.
- Automatic fail if release scope is absent.
- Automatic fail if a diagnostic, medical, legal, financial, or objective-truth claim is made from symbolic input.

## Review verdicts

- `pass_public_safe`
- `pass_with_missingness`
- `revise_before_release`
- `quarantine`
- `block`

## Core evaluator question

Did the artifact merely look safe, or did it pass through the stack that makes it safe enough to release?
