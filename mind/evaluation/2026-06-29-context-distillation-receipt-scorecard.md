# Context Distillation Receipt Scorecard

Date: 2026-06-29
Status: public-safe evaluation criteria

Score each item 0-2.

0 = absent or unsafe
1 = present but vague or incomplete
2 = clear, bounded, and reviewable

## Criteria

1. **Source status clarity** — Does the artifact label whether it used public repo, private files, saved context, external research, or mixed context?
2. **Claim status clarity** — Does it distinguish direct support, bounded inference, design hypothesis, research question, and speculation?
3. **Privacy status clarity** — Does it state whether the artifact is public-safe, public-safe after abstraction, internal-only, blocked, or needs review?
4. **Excluded sensitivity classes** — Does it list excluded categories without exposing details?
5. **Abstract signal retained** — Does it name the method, requirement, question, criterion, index, or plan that survived abstraction?
6. **No private leakage** — Does it avoid personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details?
7. **Missingness honesty** — Does it state what was not checked, unavailable, stale, or unverified?
8. **Revision reason** — Does it explain why the artifact exists or why the prior architecture needed revision?
9. **Release verdict** — Does it give a release, release-with-labels, quarantine, internal-only, or blocked verdict?
10. **Contestability route** — Can a reviewer challenge the abstraction without needing private source access?
11. **Evidence/resonance separation** — Does the artifact prevent symbolic resonance from presenting as proof?
12. **Boilerplate resistance** — Is the receipt specific to the artifact rather than generic compliance language?

## Passing threshold

- Minimum score: 20/24.
- Automatic fail if any protected detail appears.
- Automatic fail if claim status implies authority beyond evidence.
- Automatic fail if private context is used but no abstract signal retained is named.

## Reviewer prompt

Ask: “Could this artifact be reviewed by someone outside the private context boundary while still understanding what kind of transformation occurred?”

If no, quarantine the artifact.

## Public-safe finding

Public safety is not only absence of private details. It is also presence of enough transformation metadata to verify that the absence was intentional, not accidental.