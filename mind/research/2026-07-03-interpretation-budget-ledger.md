# Interpretation Budget Ledger

**Status:** public-safe research note  
**System:** Mirror Cartographer  
**Artifact class:** method / source-boundary note / evaluation requirement  
**Privacy status:** public-safe abstraction; no raw transcript, personal, household, health, animal-care, financial, location, relationship, credential, or private-identifying details included  
**Revision reason:** extends prior boundary, claim, release, and style gates by adding a measurable limit on how far an output may travel from source material before it requires explicit re-grounding.

## Core finding

Mirror Cartographer needs an **Interpretation Budget Ledger**.

> A system may translate meaning, but every translation spends evidence.

## Why this exists

Mirror Cartographer works across symbolic input, operational requirements, continuity state, reflection modes, and public artifacts. That makes it powerful, but it also creates a specific governance risk: a public artifact can become many steps removed from the material that shaped it while still sounding source-grounded.

The Interpretation Budget Ledger prevents that drift by recording how much transformation occurred between input and output.

It does not expose the private source. It records the *distance class* from source to claim.

## Source status

- **Private-context-informed:** yes, used only to understand recurring architectural pressure.
- **File-backed:** yes, reviewed as project architecture patterns and boundary language, not quoted as private content.
- **GitHub-reviewed:** yes, this artifact is intended for the public `MirrorCartographer/MirrorCartographer` repository.
- **Public-source-backed:** not yet; this is an internal product-governance method awaiting external standards mapping.
- **Raw-transcript-backed:** no raw transcript content is included or required.

## Claim status

- **Claim type:** product governance requirement.
- **Truth level:** design recommendation, not empirical validation.
- **Evidence level:** derived from repeated architecture patterns: proof lanes, evidence gates, consent boundaries, mode separation, missingness, release gating, and source-boundary requirements.
- **Blocked upgrade:** this note must not be presented as proof that MC is safe, clinically effective, scientifically validated, or market-proven.

## Privacy status

This artifact is safe for public repository publication because it contains only:

- abstract method language,
- source-boundary rules,
- product requirements,
- evaluation criteria,
- missingness labels,
- implementation guidance.

It intentionally excludes:

- private examples,
- personal history,
- household facts,
- health or animal-care details,
- financial details,
- location data,
- relationship details,
- credentials,
- raw chat excerpts.

## The interpretation budget scale

Each generated MC artifact should carry one of these budget labels.

| Budget | Meaning | Public use |
|---|---|---|
| B0 — Direct source preservation | Output preserves a source-bound statement with minimal transformation. | Allowed if source is public or consent-cleared. |
| B1 — Structured restatement | Output converts source into a table, list, label, or requirement without adding new claims. | Allowed with source-boundary note. |
| B2 — Bounded synthesis | Output combines multiple source patterns into an abstract design rule. | Allowed if no private details survive and missingness is labeled. |
| B3 — Interpretive architecture | Output derives a system component from recurring private/public patterns. | Allowed only as design hypothesis, not as validated fact. |
| B4 — Speculative extension | Output extends beyond source into research questions, future product ideas, or theory. | Allowed only if clearly labeled speculative. |
| B5 — Public claim candidate | Output is framed for external persuasion, market use, scientific language, safety claim, or institutional audience. | Requires release gate, evidence gate, privacy review, and claim-surface review before publication. |

## Required ledger fields

Every public-facing MC artifact should include:

1. **Source class:** public, private-context-informed, file-backed, GitHub-backed, synthetic, external-source-backed, or mixed.
2. **Budget level:** B0 through B5.
3. **Claim status:** observation, design requirement, hypothesis, evaluation result, public claim, or blocked claim.
4. **Privacy status:** public-safe, consent-required, private-only, redacted, or blocked.
5. **Missingness:** what is not known, not verified, not accessible, or not yet tested.
6. **Revision reason:** why this artifact exists or changed.
7. **Re-grounding trigger:** what condition forces the artifact back through evidence review.

## Re-grounding triggers

An artifact must be re-grounded when:

- it moves from private reflection to public release,
- it moves from symbolic language to scientific or governance language,
- it moves from internal prototype to product promise,
- it changes audience from user-only to investor, employer, collaborator, customer, or public reader,
- it introduces safety, health, therapeutic, legal, financial, or efficacy implications,
- it uses emotionally intense language that may make weak evidence feel stronger than it is,
- it combines three or more source layers into one claim,
- it is reused after major context loss, account migration, model change, repo migration, or file-library incompleteness.

## Evaluation criteria

A compliant artifact should pass these checks:

- Can the artifact state its source class without naming private sources?
- Can the claim survive if all personal examples are removed?
- Is the budget level visible to the reader or maintainer?
- Does the artifact distinguish design requirement from proof?
- Does it name what is missing rather than filling the gap rhetorically?
- Does the artifact avoid making symbolic coherence sound like empirical validation?
- Does the artifact explain why it was revised?
- Does the artifact identify when it must be re-grounded?

## Implementation plan

1. Add `interpretation_budget` metadata to MC research notes, release notes, public pages, and generated artifacts.
2. Add a pre-publication check: any B3 or higher artifact must pass privacy, evidence, claim-surface, and missingness review.
3. Add a UI/export label showing whether the output is a direct source restatement, bounded synthesis, interpretive architecture, or speculative extension.
4. Add a repo index grouping artifacts by budget level so public readers can separate validated product requirements from exploratory theory.
5. Add test fixtures using synthetic examples only; private examples may shape the test design but must not appear in the fixture.

## Missingness

- No external standards mapping has been completed in this note.
- No automated metadata enforcement exists yet.
- No repo-wide audit has confirmed which existing files already satisfy this ledger.
- No public user study has tested whether budget labels improve trust calibration.
- No release workflow currently blocks B4/B5 artifacts automatically.

## Public-safe summary

Mirror Cartographer should not only ask whether an artifact is true or private. It should ask how far the artifact traveled from its source. The farther it travels, the more visible its boundaries must become.