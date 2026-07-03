# Publication Boundary Lint Protocol

Date: 2026-07-02
Status: public-safe architecture note

## Core finding

Mirror Cartographer needs a **Publication Boundary Lint Protocol**: a required pre-publication check that scans every public artifact for unsupported claims, private payload leakage, missing source labels, missing consent boundaries, and mode confusion before the artifact is allowed to become public-facing knowledge.

## Operating line

**A public artifact should not ask the reader to trust the map until the map has checked its own borders.**

## Source status

- Source type: derived from available Mirror Cartographer project materials, repository structure, and prior public-safe research notes.
- Source boundary: private-context materials were used only to infer architectural requirements; no raw private transcript, household, health, animal-care, financial, relationship, location, credential, or identifying detail is included here.
- Repository anchor: the public README already defines Mirror Cartographer as a reflective and research-oriented interface with explicit uncertainty, source status, claim status, correction, and public/private boundaries.
- External source status: not required for this note; this is an internal product/governance requirement, not a factual claim about the outside world.

## Claim status

- Claim type: product requirement / governance method.
- Claim strength: strong architectural recommendation.
- Evidence basis: recurring need across MC materials for consent-bounded continuity, mode separation, uncertainty labeling, and public-safe derivation.
- Not claimed: this protocol does not prove MC efficacy, safety, clinical value, therapeutic value, diagnostic accuracy, or objective symbolic truth.

## Privacy status

- Public-safe: yes.
- Private details included: none.
- Redaction posture: abstracted method only.
- Export risk: low, assuming future implementations do not embed raw examples from private chats or personal records.

## Missingness

The current missing piece is not another public-facing explanation of MC. The missing piece is a repeatable **lint checklist** that runs before publishing.

A publishable MC artifact should answer:

1. What source class produced this artifact?
2. What claims does it make?
3. Which claims are evidence-backed, speculative, reflective, interpretive, or unresolved?
4. Does any sentence reveal private payload rather than abstract method?
5. Does the artifact confuse Canonical, Reflective, Mythopoetic, Builder, Evaluator, or Publisher mode?
6. Does it label what is known, unknown, inferred, withheld, or intentionally omitted?
7. Does it include a revision reason when meaning changed?
8. Does it preserve user agency rather than presenting AI interpretation as authority?

## Protocol sketch

### 1. Source lint

Assign every artifact one or more source labels:

- public repository material
- public webpage material
- user-approved public wording
- private context abstraction
- file-derived abstraction
- model-generated synthesis
- external research source
- implementation observation
- unresolved / unknown source

If the source label is missing, the artifact cannot be promoted.

### 2. Claim lint

Assign every claim one status:

- verified
- source-bound
- implementation-observed
- hypothesis
- design recommendation
- interpretive reflection
- speculative / mythopoetic
- withheld evidence
- unsupported / remove

Unsupported claims must be removed, softened, or converted into research questions.

### 3. Privacy lint

Reject or rewrite any artifact containing:

- personal identifiers not already intentionally public
- household facts
- health or animal-care specifics
- financial details
- location details
- relationship details
- credentials beyond already-approved public author context
- raw transcript fragments
- emotionally intense private examples that are not necessary for method explanation

Private material may shape architecture, but it must not appear as payload.

### 4. Mode lint

Check whether the artifact is operating as:

- Canonical: evidence/source-grounded
- Reflective: user-validated or resonance-labeled
- Mythopoetic: explicitly speculative/creative
- Builder: implementation requirement
- Evaluator: test/evidence rule
- Publisher: public-safe summary

If the mode changes inside the artifact, the transition must be labeled.

### 5. Missingness lint

Every artifact should include a brief missingness note:

- missing data
- missing source
- missing implementation
- missing test
- missing consent layer
- missing evaluation result
- missing public example
- intentionally withheld private evidence

Missingness should be treated as map structure, not embarrassment.

### 6. Revision lint

If an artifact updates a prior idea, include a revision reason:

- corrected unsupported claim
- removed private payload
- clarified source status
- narrowed claim scope
- separated modes
- converted assertion into question
- added missingness label
- changed implementation priority

## Evaluation criteria

A Publication Boundary Lint pass succeeds when:

- a reader can tell what is claimed and what is not claimed;
- a reader can tell what kind of source supports the artifact;
- private context is abstracted into method, not exposed;
- speculative, reflective, and evidence-grounded language are not blended;
- missing evidence is labeled instead of hidden;
- any meaningful revision carries a reason;
- the artifact remains useful without leaking the private material that inspired it.

## Implementation plan

1. Add a reusable `PUBLICATION_BOUNDARY_LINT.md` checklist.
2. Add frontmatter fields to public MC research notes:
   - `source_status`
   - `claim_status`
   - `privacy_status`
   - `missingness`
   - `revision_reason`
   - `mode`
3. Add a manual review step before publishing demos, funding packets, essays, README updates, or public indexes.
4. Later, implement a script that scans markdown files for missing labels and flagged terms.
5. Treat failed lint as a design signal: the artifact may still be valuable, but it belongs in private build notes until converted.

## Research questions

- What labels are sufficient without making the system unreadable?
- Can MC preserve emotional force while still enforcing claim boundaries?
- Which public artifacts need strict linting versus lightweight labeling?
- How should withheld evidence be acknowledged without implying proof?
- What kinds of examples can be synthetic, composite, or fictionalized while still honestly demonstrating the method?

## Revision reason

Created after reviewing current MC public-safe patterns and noticing that many separate protocols already define parts of the safety perimeter. This note consolidates those boundaries into a pre-publication gate rather than adding another downstream explanation.
