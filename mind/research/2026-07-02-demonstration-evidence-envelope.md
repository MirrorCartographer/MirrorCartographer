# MC Research Note — Demonstration Evidence Envelope

## Core finding

Mirror Cartographer needs a **Demonstration Evidence Envelope**: a public-safe wrapper for every demo, artifact, prototype, research note, or visual proof that says what the demonstration shows, what it does not show, what sources informed it, what privacy boundary applies, and what would be required to promote it into a stronger claim.

Operating line:

> A demo is not proof until it carries its boundary.

## Source status

- **Private-context source:** Used only as architectural background. Not quoted, copied, or exposed.
- **File-library source:** Public-facing MC materials describe Mirror Cartographer as a symbolic-emotional mapping and reflective AI interaction system focused on orientation, coherence, accessibility, source-aware reflection, and emotionally sustainable AI interaction.
- **GitHub source:** The public README describes MC as a continuity atlas and identifies Project 101 as the next public proof layer: one hundred and one demonstrations that show what MC does rather than only explaining it.
- **External web source:** Not required for this note. This is an internal product governance requirement distilled from existing MC materials.

## Claim status

- **Claim type:** Product architecture requirement and public-demonstration governance rule.
- **Claim strength:** Design recommendation, not empirical validation.
- **Allowed claim:** MC demonstrations should include explicit evidence envelopes so viewers can distinguish artifact quality, method demonstration, user-facing value, source boundary, and proof status.
- **Not allowed claim:** A compelling MC demo proves therapeutic, medical, veterinary, legal, financial, psychological, or factual accuracy.

## Privacy status

- **Public-safe:** Yes.
- **Contains personal data:** No.
- **Contains household, health, animal-care, financial, location, relationship, credential, or raw transcript detail:** No.
- **Uses private material:** Only as abstracted architectural signal.
- **Export risk:** Low, if applied as metadata, review criteria, and public-facing boundary language.

## Problem

Project 101 is designed to make MC visible through public demonstrations. Demonstrations are persuasive by design. That creates a specific risk: a viewer may treat an elegant artifact, emotionally coherent map, or technically polished interface as stronger evidence than it actually is.

MC already tracks source status, claim status, user correction, grounded next steps, outcome feedback, and public/private boundaries. The next step is to attach those fields directly to each public demo so the artifact cannot float away from its evidence lane.

## Product requirement

Every public MC demonstration should include an evidence envelope with the following fields:

- `demo_id`
- `demo_title`
- `public_lane`
- `artifact_type`
- `source_status`
- `claim_status`
- `privacy_status`
- `missingness_status`
- `revision_reason`
- `what_this_demonstrates`
- `what_this_does_not_demonstrate`
- `allowed_public_claims`
- `blocked_claims`
- `evidence_required_for_promotion`
- `reviewer_notes`

## Minimum public-facing version

A lightweight public-facing envelope can be shown as:

- **Shows:** the specific capability, pattern, interface behavior, or method being demonstrated.
- **Does not show:** any stronger outcome, diagnostic validity, general population result, or hidden private evidence.
- **Source boundary:** public, synthetic, abstracted, private-informed, external-cited, or mixed-source.
- **Claim level:** concept sketch, prototype, method demo, user-tested, externally reviewed, or validated.
- **Privacy status:** public-safe, abstracted, redacted, synthetic, or blocked.
- **Revision trigger:** what would require correction later.

## Evaluation criteria

A Demonstration Evidence Envelope passes if a reviewer can answer:

1. What exactly is being demonstrated?
2. What is not being claimed?
3. Whether the demo uses public, private-informed, synthetic, or mixed-source material?
4. Whether any sensitive detail was removed, abstracted, or blocked?
5. What evidence would be required before the demo can support a stronger claim?
6. What kind of correction or revision would change the demo record?

## Implementation plan

1. Add a standard `evidence_envelope` block to each Project 101 demonstration entry.
2. Require `what_this_does_not_demonstrate` for every public demo.
3. Connect each demo envelope to the Claim Promotion Ladder, Source Boundary Matrix, Missingness Compass, Revision Reason Ledger, and Public Abstraction Compiler.
4. Use synthetic or abstracted inputs by default unless explicit consent and source clearance exist.
5. Maintain a privacy-safe index of demos by lane, not by private source material.
6. Add a pre-publication check that blocks demos with raw personal, household, health, animal-care, financial, location, relationship, credential, or transcript details.

## Research questions

- What is the smallest evidence envelope that remains readable on a public page?
- How can MC make boundaries visually clear without making every demo feel bureaucratic?
- Which Project 101 demos should be synthetic-first, and which require external citation or user testing?
- Can demo envelopes reduce overclaiming while increasing viewer trust?
- How should comedy, symbolic artifacts, and emotional maps carry proof boundaries without killing their expressive force?

## Revision reason

Added after reviewing the public README's Project 101 proof-layer direction and existing research notes on source boundaries, claim promotion, missingness, accessibility, withheld evidence, and revision reasons. The meaningful revision is a shift from note-level governance to demo-level governance: every public artifact should carry its own proof boundary, not rely only on repository-wide disclaimers.
