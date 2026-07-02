# Accessible Continuity Surface Contract

## Core finding

Mirror Cartographer needs an Accessible Continuity Surface Contract.

## Operating line

**A map that cannot be read aloud is not continuous.**

## Public-safe source status

- Source class: public repository README plus privacy-bounded architecture memory and available MC file-library artifacts.
- Public source anchor: the public README defines MC as a system for preserving and improving understanding across fragmented experience, and it names exports, evidence boundaries, source status, claim status, user correction, outcome feedback, and public/private boundaries as tracked objects.
- File-library architecture anchor: available MC specification and implementation artifacts describe exportable artifacts, reflection cards, session memory, mode rules, uncertainty boundaries, and accessibility requirements.
- Private-context use: used only to identify recurring product constraints around readability, export, and interface continuity; no private facts are used as publishable evidence.
- Raw transcript status: not included, not quoted, not summarized.

## Claim status

- Claim type: product requirement and evaluation contract.
- Claim strength: architecture recommendation, not empirical validation.
- Evidence status: supported by existing MC architecture patterns that treat continuity, exportability, uncertainty labels, and interface accessibility as first-class requirements.
- Validation required: needs implementation tests across public docs, app UI, exports, read-aloud surfaces, and mobile views.

## Privacy status

Public-safe. This protocol contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail.

## Missingness

- No full accessibility audit of the public repository or deployed UI was completed in this run.
- No assistive-technology test log is attached here.
- No confirmed WCAG conformance score is claimed.
- No public user-testing evidence is available here.
- Existing artifacts imply the requirement, but implementation coverage is not confirmed.

## Requirement

Every MC public artifact, export, reflection surface, protocol file, and demo page should have a readable primary surface that does not require code-block parsing, visual-only layout interpretation, private context, or hidden transcript knowledge.

MC may still include schemas, diagrams, tables, symbolic layouts, and code examples, but the essential meaning must also exist in a plain-language continuity layer.

## Surface classes

1. `plain_readable` — normal prose that can be read aloud cleanly.
2. `structured_readable` — headings, short lists, labeled fields, and tables with textual context.
3. `visual_symbolic` — diagrams, glyphs, maps, images, or atmosphere boards that require alt text or companion prose.
4. `technical_schema` — JSON, code, implementation details, or machine-readable structures.
5. `export_packet` — PDF, markdown, HTML, or other artifact intended to leave the system.
6. `private_substrate` — material used only for internal continuity and not exported.

## Contract rules

- Essential claims must appear outside code fences.
- Every visual or symbolic artifact needs a text companion describing function, not only mood.
- Every technical schema needs a non-technical explanation of what changes in the user/system workflow.
- Every export packet needs a public/private boundary note.
- Every reflection surface needs claim-status and uncertainty language when interpretation is present.
- Every demo needs a readable pass/fail explanation, not only screenshots or aesthetic proof.
- Every public page should remain usable on mobile and assistive reading surfaces.

## Required fields

For each public-facing MC artifact:

- `artifact_id`
- `artifact_type`
- `primary_surface_class`
- `essential_content_outside_code_blocks`
- `alt_text_required`
- `plain_language_summary_present`
- `claim_status_present`
- `privacy_boundary_present`
- `source_status_present`
- `missingness_present`
- `mobile_readability_checked`
- `read_aloud_checked`
- `revision_reason`
- `export_allowed`

## Evaluation criteria

An artifact passes if:

- a reader can understand the purpose without private context;
- a read-aloud tool can convey the essential meaning;
- code blocks, diagrams, or screenshots are not the only carrier of important content;
- interpretive claims carry uncertainty or claim-status labels;
- privacy boundaries are visible before export;
- mobile display does not destroy the main path;
- the artifact can be indexed without exposing private substrate.

## Implementation plan

1. Add an `accessibility_surface` section to MC artifact templates.
2. Add a public-safe summary block to each protocol and demo page.
3. Add alt-text requirements for diagrams, glyphs, and symbolic maps.
4. Add a markdown lint/checklist rule: essential meaning cannot appear only inside code blocks.
5. Add a mobile/read-aloud review step before public export.
6. Add failed checks to the Revision Reason Ledger using `public_surface_clearance` or `implementation_feedback`.
7. Connect this contract to future demo acceptance so aesthetic artifacts must also be readable artifacts.

## Research questions

- What is the minimum readable layer needed for symbolic artifacts without flattening the symbolic experience?
- How should MC test read-aloud quality automatically versus manually?
- Which artifact types need alt text, captions, transcript summaries, or simplified mode variants?
- Can accessibility checks become part of the public proof layer instead of a separate compliance afterthought?
- How should MC preserve poetic density while still maintaining navigable structure?

## Meaningful revision reason for this file

Initial addition. Derived from repeated MC requirements around continuity, exportability, public/private boundaries, mode clarity, uncertainty labeling, and accessibility/readability as system infrastructure.