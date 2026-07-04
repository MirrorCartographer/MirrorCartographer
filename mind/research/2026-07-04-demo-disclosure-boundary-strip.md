# Demo Disclosure Boundary Strip

Date: 2026-07-04
Status: public-safe research note
Repository zone: `mind/research`

## Core finding

Mirror Cartographer needs a **Demo Disclosure Boundary Strip**: a visible, persistent label layer for demos, screenshots, exports, prototype screens, research notes, and public examples that states whether displayed content is synthetic, user-provided, source-bound, speculative, private-only, or redacted.

Operating line:

> A public demo should never make the viewer guess whether they are seeing evidence, invention, interface behavior, or redacted private signal.

## Why this exists

MC now has a growing governance stack for claim surfaces, mode transitions, public-safe lineage, compression loss, reconstruction risk, boundary-aware backlog compilation, and synthetic fixtures. Those controls protect the architecture internally, but a public viewer normally sees only the surface: a screenshot, artifact, card, export, visual map, prototype screen, or research note.

If the surface does not visibly disclose its source and claim boundary, the interface itself can overclaim even when the underlying document is careful. A polished prototype card can make synthetic data look like real user evidence. A mythopoetic output can look like a canonical finding. A redacted artifact can look complete. A public-safe summary can hide the functional loss caused by privacy removal.

The disclosure strip solves that by making boundary metadata part of the artifact surface, not only part of the hidden implementation record.

## Source status

- Source classes reviewed: saved MC architecture context, File Library project specifications, continuity/export materials, public-safe project packets, proof-governed infrastructure patterns, and prior GitHub research notes.
- Raw transcript status: not quoted, copied, summarized, or published.
- Personal-context status: used only to understand architecture-level continuity and boundary risks; not exposed.
- File status: consulted for abstract patterns: MC as consent-bounded semantic continuity layer; modes; exportable artifacts; evidence/source labels; privacy architecture; hallucination audit indicators; and proof rules requiring artifacts, sources, hashes, and reproduction commands where claims become benchmark or implementation claims.
- GitHub status: this note is written as a public-safe product requirement and interface governance requirement.

## Claim status

This note makes a product-governance and interface-requirement claim.

Allowed claim:

- MC needs visible disclosure metadata on public-facing artifacts so source status, claim status, mode status, privacy status, and missingness do not disappear at the interface layer.

Not claimed:

- That this component already exists in the live UI.
- That disclosure labels alone make an artifact safe.
- That synthetic examples validate real-world effectiveness.
- That redaction removes all reconstruction risk.
- That a viewer will always understand the label without supporting documentation.

## Privacy status

Privacy class: public-safe abstraction.

Excluded content classes:

- Personal biography
- Household details
- Health details
- Animal-care details
- Financial information
- Location data
- Relationship details
- Credentials or access details
- Raw transcript fragments
- Identifying anecdotes
- Session-specific chronology
- Private symbolic sequences
- Rare phrasing traceable to private interaction
- Real screenshots from private sessions

Allowed content classes:

- Interface requirements
- Product method notes
- Public-safe metadata fields
- Evaluation criteria
- Implementation plans
- Synthetic fixture labels
- Source-boundary notes
- Privacy-safe indexes

## Missingness

This note does not implement the UI component, inspect the deployed interface, or audit every existing screenshot/export. It defines the requirement, metadata fields, failure cases, acceptance criteria, and implementation plan.

No external validation is performed here. This is a product governance finding, not an empirical claim about user outcomes.

## Meaningful revision reason

Earlier notes established that fixtures, exports, mode transitions, claim surfaces, and backlog items need source and privacy boundaries. This revision moves that discipline to the visible artifact surface so public demos cannot silently inherit private authority, synthetic realism, or unsupported evidence strength.

## Disclosure problem

A public-facing artifact can fail even when its internal note is safe:

1. **Synthetic realism failure** — invented demo data looks like real user evidence.
2. **Redaction completeness failure** — a redacted artifact looks complete when meaning was removed.
3. **Mode ambiguity failure** — reflective or mythopoetic language looks canonical.
4. **Evidence inflation failure** — visual polish makes a conceptual claim look implemented or validated.
5. **Source disappearance failure** — file-backed, public-source-bound, private-context-informed, and generated content look the same.
6. **Reconstruction failure** — multiple public fragments are safe individually but unsafe in combination.

The boundary strip makes those risks visible at the point of consumption.

## Required strip fields

Minimum fields for every public-facing demo, screenshot, export, prototype screen, artifact card, research note, or visual map:

```yaml
disclosure_strip:
  artifact_id: stable-public-artifact-id
  artifact_type: screenshot | export | prototype_screen | research_note | visual_map | demo_card | fixture | other
  source_status: synthetic | public_source_bound | private_context_informed | user_provided | mixed | unknown
  claim_status: conceptual | implementation_claim | benchmark_claim | evaluation_result | reflective_output | mythopoetic_output | demo_only
  mode_status: canonical | reflective | mythopoetic | mixed | none
  privacy_status: public_safe | redacted_public | internal_only | blocked_public | synthetic_public_safe
  evidence_status: synthetic_only | source_bound | implementation_required | external_validation_required | unsupported
  missingness: visible statement of what is absent, removed, unknown, or not validated
  revision_reason: why this artifact exists or changed
  allowed_use: demo | documentation | test | research | public_index | internal_review
  prohibited_inference: what the viewer must not conclude from the artifact
```

## Label patterns

### Synthetic demo

Visible label:

> Synthetic demo data — tests structure only; not real user evidence.

Required hidden metadata:

- source_status: synthetic
- privacy_status: synthetic_public_safe
- evidence_status: synthetic_only
- prohibited_inference: do not infer real-world effectiveness, user outcome, or private history

### Public-source-bound note

Visible label:

> Public-source-bound — interpretation limited to cited public sources; not a universal claim.

Required hidden metadata:

- source_status: public_source_bound
- evidence_status: source_bound
- missingness: sources not reviewed or excluded

### Private-context-informed abstraction

Visible label:

> Public-safe abstraction — private context informed architecture only; private details excluded.

Required hidden metadata:

- source_status: private_context_informed or mixed
- privacy_status: public_safe
- missingness: private specifics removed; source transcript not published
- prohibited_inference: do not reconstruct person, household, health, animal-care, financial, location, relationship, credential, or raw transcript details

### Redacted public artifact

Visible label:

> Redacted public version — some functional context removed for privacy.

Required hidden metadata:

- privacy_status: redacted_public
- missingness: what class of function was removed, without exposing the removed content
- evidence_status: may be weaker than internal artifact

### Reflective or mythopoetic output

Visible label:

> Reflective/speculative mode — meaning-making output, not factual proof.

Required hidden metadata:

- mode_status: reflective or mythopoetic
- claim_status: reflective_output or mythopoetic_output
- evidence_status: unsupported unless separately source-bound

## Product requirement

Create a reusable disclosure-strip component and metadata schema used across:

- docs
- public research notes
- UI demo cards
- screenshots
- export previews
- fixture examples
- visual maps
- prototype pages
- README sections
- issue templates for public artifacts

The strip must be visible enough that a screenshot copied outside the repo still carries its boundary status.

## Evaluation criteria

A disclosure strip passes if:

1. It visibly states source status, claim status, privacy status, and missingness.
2. It distinguishes synthetic data from real user evidence.
3. It prevents reflective or mythopoetic output from appearing canonical.
4. It states what the viewer must not infer.
5. It survives export, screenshot, and copy/paste contexts.
6. It can be generated from fixture metadata or artifact metadata.
7. It does not expose private details while explaining the boundary class.
8. It marks redaction/compression loss when public-safe transformation removed functional context.
9. It preserves evidence status across mode and interface transitions.

A disclosure strip fails if:

1. It is hidden only in repository metadata.
2. It uses vague language such as `safe`, `AI-generated`, or `example` without claim/source boundaries.
3. It lets synthetic data appear outcome-proven.
4. It lets visual polish upgrade claim status.
5. It omits missingness.
6. It gives enough specificity to reconstruct private context.
7. It disappears in screenshots or exports.

## Research questions

- What is the smallest visible label that still preserves source, claim, privacy, and missingness boundaries?
- Should every public MC artifact carry a compact strip plus expandable metadata?
- Can disclosure strips be generated automatically from fixture YAML or artifact frontmatter?
- How should visual artifacts show redaction without inviting reconstruction?
- What label language works for both technical reviewers and non-technical users?
- Should public demo pages include a global legend for claim and mode labels?
- Can a linter block public artifacts that lack disclosure metadata?

## Implementation plan

1. Define `disclosure_strip` frontmatter for public research notes and fixtures.
2. Add a docs snippet explaining label meanings.
3. Create a UI component for demo cards and export previews.
4. Require every synthetic fixture to render a visible `synthetic demo data` label.
5. Add a public-artifact lint rule: no screenshot/export/research note can ship without source, claim, privacy, evidence, missingness, and prohibited-inference fields.
6. Add redaction labels to public-safe summaries where private context was removed.
7. Connect disclosure metadata to the Mode Transition Audit Trail and Interface Evidence Parity Matrix.
8. Add acceptance tests confirming that labels survive screenshot/export contexts.

## Public-safe index entry

- Finding: Demo Disclosure Boundary Strip
- Source status: mixed private-context-informed, file-backed, GitHub-reviewed
- Claim status: product-governance and interface-requirement claim
- Privacy status: public-safe abstraction
- Missingness: UI component not implemented; deployed interface not audited; existing public artifacts not exhaustively reviewed
- Revision reason: moves source/claim/privacy/missingness boundaries from hidden governance notes onto the visible public artifact surface
- Next action: add disclosure-strip frontmatter to future research notes and create a reusable UI/docs component for synthetic demos, redacted exports, and public-safe abstracts
