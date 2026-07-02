# MC Research Note — Missingness Compass

## Core finding

Mirror Cartographer needs a **Missingness Compass**: a public-safe protocol for labeling what is absent, unavailable, unknown, withheld, not-yet-checked, or structurally impossible to know from the current source set.

Operating line:

> Absence is not evidence until the map can say what kind of absence it is.

## Source status

- **Private-context source:** Used only as architecture background. Not quoted, copied, or exposed.
- **File-library source:** Public-facing MC materials indicate that MC is a human-centered AI reflection system focused on symbolic-emotional mapping, reflective dialogue, pattern tracking, uncertainty boundaries, accessibility, and source-aware reflection.
- **GitHub source:** Public repository README already defines MC as a continuity atlas that tracks evidence boundaries, source status, claim status, user correction, outcome feedback, and public/private boundaries.
- **External web source:** Not required for this note; this is an internal architecture requirement distilled from existing MC materials.

## Claim status

- **Claim type:** Product architecture requirement.
- **Claim strength:** Design recommendation, not empirical validation.
- **Allowed claim:** MC should explicitly model missingness because continuity systems can distort meaning when absent information is silently treated as irrelevant, false, private, or unknown.
- **Not allowed claim:** This protocol proves that missing information has a specific hidden meaning.

## Privacy status

- **Public-safe:** Yes.
- **Contains personal data:** No.
- **Contains household, health, animal-care, financial, location, relationship, credential, or raw transcript detail:** No.
- **Uses private material:** Only as abstracted architectural signal.
- **Export risk:** Low, if kept at the level of method, labels, requirements, and evaluation criteria.

## Missingness classes

MC should distinguish at least these states:

1. **Not collected** — the system never asked for or received the information.
2. **Unavailable** — the information may exist, but the current tool/source cannot access it.
3. **Withheld** — the information exists in a private or restricted boundary and must not be surfaced.
4. **Unverified** — the information is present but not source-checked.
5. **Contradicted** — multiple sources conflict and no resolution rule has been applied.
6. **Stale** — the information may have changed since capture.
7. **Out-of-scope** — the information would exceed MC's authority lane, such as diagnostic, legal, financial, or emergency determination.
8. **Structurally unknowable** — the system cannot determine the answer from the available evidence, even in principle.
9. **Deferred** — the system has a known next check but has not performed it yet.
10. **Intentionally abstracted** — the system has transformed sensitive material into public-safe requirements or research questions.

## Product requirement

Every MC-generated map, summary, research note, export, or public artifact should include a missingness pass before publication.

Minimum fields:

- `missing_item`
- `missingness_class`
- `source_boundary`
- `claim_impact`
- `privacy_impact`
- `next_check`
- `allowed_public_statement`
- `revision_trigger`

## Evaluation criteria

A Missingness Compass passes if a reviewer can answer:

1. What information was not available?
2. Why was it not available?
3. Whether absence weakens, blocks, or merely qualifies the claim?
4. Whether the missing information is private, stale, inaccessible, contradicted, or out-of-scope?
5. What would change the map later?
6. What can be said publicly without implying access to private evidence?

## Implementation plan

1. Add a `missingness` object to reflection cards, research notes, evidence maps, and export templates.
2. Require missingness labels before claim promotion.
3. Connect missingness labels to the Claim Promotion Ladder, Source Boundary Matrix, Withheld Evidence State Protocol, and Revision Reason Ledger.
4. Use missingness labels in public GitHub notes whenever private context informs architecture but cannot be disclosed.
5. Add a public-safe index entry for each abstracted private-source signal.

## Research questions

- How should MC distinguish privacy-withheld evidence from nonexistent evidence without leaking the private evidence?
- How should missingness affect confidence scoring?
- Can missingness labels reduce overclaiming in symbolic, reflective, health-adjacent, animal-care-adjacent, and governance-adjacent maps?
- What visual grammar best shows missingness without making the map feel broken?

## Revision reason

Added after reviewing MC's repeated need to publish public-safe architecture from mixed private/public sources. Existing notes cover source boundaries, claim promotion, withheld evidence, accessibility, and revision reasons; this note isolates the separate problem of absence-handling.
