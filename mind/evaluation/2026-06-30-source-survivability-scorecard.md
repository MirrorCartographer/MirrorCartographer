# Source Survivability Scorecard

## Use
Evaluate whether a source can carry a public Mirror Cartographer claim without leaking private context or overstating evidence.

## Scoring
Score each item 0, 1, or 2.

1. **Source boundary clarity**
- 0: Source type is unclear.
- 1: Source type is named but limits are vague.
- 2: Source type, access level, and limits are explicit.

2. **Privacy containment**
- 0: Private or sensitive details are exposed.
- 1: Details are redacted but private origin is ambiguous.
- 2: Private material is used only as architecture-only context or excluded.

3. **Claim-lane fit**
- 0: Source is used to support the wrong kind of claim.
- 1: Lane is plausible but under-specified.
- 2: Claim lane matches source strength.

4. **Missingness disclosure**
- 0: Missing evidence is hidden.
- 1: Missing evidence is mentioned generally.
- 2: Missingness is concrete and actionable.

5. **Temporal survivability**
- 0: Stale or superseded material is treated as current.
- 1: Staleness is possible but not resolved.
- 2: Currentness, supersession, or update path is recorded.

6. **Duplication resistance**
- 0: Duplicate/reuploaded files inflate confidence.
- 1: Duplicates are noticed but not resolved.
- 2: Duplicates are consolidated without increasing claim strength.

7. **Generated-vs-discovered separation**
- 0: Generated interpretation is treated as discovered fact.
- 1: Distinction appears but is inconsistent.
- 2: Generated, remembered, implemented, and externally verified sources are separated.

8. **Revision reason**
- 0: Change is unexplained.
- 1: Reason is present but vague.
- 2: Revision trigger and implication are explicit.

## Pass thresholds
- 14–16: publishable boundary support
- 10–13: publishable only with caveats
- 6–9: internal architecture-only
- 0–5: do not use publicly

## Automatic fail conditions
- Raw private transcript details appear in public artifact.
- Personal, household, health, animal-care, financial, location, relationship, credential, or comparable sensitive details appear.
- Symbolic resonance is presented as factual proof.
- A remembered source is used as implementation proof without repository or runtime confirmation.
- A stale source is presented as current without checking.
