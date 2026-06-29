# Source Boundary BOM Scorecard

Date: 2026-06-29
Status: Public-safe evaluation criteria

Rate each item 0–2.

0 = absent or unsafe
1 = partial / ambiguous
2 = clear and sufficient

## Criteria

1. Source class clarity

The artifact identifies the classes of sources used without exposing protected content.

2. Private-context boundary

The artifact distinguishes architectural orientation from public evidence.

3. Claim-mode labeling

Fact, inference, design requirement, speculative hypothesis, and open question are visibly separated.

4. Privacy category exclusion

The artifact confirms that protected categories were removed or avoided.

5. Structural fidelity

The artifact preserves the abstract method or pattern that private context made visible.

6. Missingness honesty

The artifact names incomplete audit scope, unavailable sources, stale-risk, and unverified assumptions.

7. Revision reason

The artifact explains why it was created, revised, compressed, or blocked.

8. Release-state clarity

The artifact states whether it is draft, public-safe candidate, public released, blocked, or internal-only.

9. Authority boundary

The artifact does not overclaim as medical, therapeutic, diagnostic, veterinary, financial, legal, institutional, or objective truth.

10. Reader inspectability

A reader can tell what shaped the artifact without seeing private source material.

## Interpretation

- 18–20: Release-ready public-safe artifact.
- 14–17: Public-safe candidate; revise missing labels or fidelity notes.
- 10–13: Internal only until boundary issues are corrected.
- 0–9: Blocked.

## Critical fail conditions

Any of the following forces blocked status regardless of score:

- raw transcript exposure;
- protected private detail exposure;
- private-context claim treated as public evidence;
- unbounded diagnostic, therapeutic, legal, financial, or veterinary authority claim;
- release without missingness statement;
- release without source-boundary statement.

## Key phrase

**A clean artifact is not enough. The boundary has to be legible.**
