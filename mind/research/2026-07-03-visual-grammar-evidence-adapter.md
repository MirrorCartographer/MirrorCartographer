# Visual Grammar Evidence Adapter

Date: 2026-07-03
Status: public-safe research note
Repository zone: `mind/research`

## Core finding

Mirror Cartographer needs a **Visual Grammar Evidence Adapter**: a public-safe method for translating visual, symbolic, diagrammatic, and aesthetic project material into explicit engineering objects without treating the aesthetic artifact itself as empirical proof.

Operating line:

> A diagram may preserve signal, but it must be decompressed into evidence units before it enters the build.

## Source status

- Source classes reviewed: saved architectural context, File Library search results for MC public-facing packets/atlases/specs, and prior GitHub research-note patterns.
- GitHub status: public repository target confirmed as `MirrorCartographer/MirrorCartographer`; private UI repository exists but is not the target for this note.
- File-backed architectural signals: MC materials repeatedly describe symbolic-emotional mapping, recursive/stateful reflection, explicit epistemic labeling, visual atlas translation, mode separation, and privacy/evidence boundaries.
- Private-context use: used only to understand repeated architecture pressure; no private event, transcript, household, health, animal-care, financial, location, relationship, credential, or identity payload is included.
- External source status: no external empirical source is asserted here; this is a product-method and evaluation requirement.

## Claim status

This note makes a design-governance claim:

- MC should treat visual and symbolic artifacts as **signal carriers** that require translation into typed product objects before they become requirements, claims, tests, or release material.

It does not claim:

- That any specific image proves a psychological, clinical, scientific, or product-performance fact.
- That visual recurrence alone validates a system architecture.
- That the adapter has already been implemented in the application.
- That private image origins or private conversations are publishable.

Confidence: medium-high as a systems requirement; untested as a formal implementation.

## Privacy status

Privacy class: public-safe abstraction.

Excluded content classes:

- Personal biography
- Household details
- Health or animal-care details
- Financial information
- Location data
- Relationship details
- Credentials or access details
- Raw transcript fragments
- Identifying anecdotes
- Private image contents when not explicitly released

Allowed content classes:

- Visual-to-system translation methods
- Source-boundary notes
- Product requirements
- Research questions
- Evaluation criteria
- Privacy-safe indexes
- Implementation plans

## Missingness

- No exhaustive repository file tree scan was completed in this run.
- No automated corpus-level image clustering was performed.
- No formal image-schema, annotation UI, or vector index has been implemented here.
- No external HCI, semiotics, visual analytics, or information-architecture literature has been mapped yet.
- No claim is made that current visual materials are complete, canonical, or publication-ready.

## Revision reason

Prior MC research notes define claim lifecycle, evidence routing, public release gates, source-boundary classes, mode/claim separation, derivation distance, and redaction. The remaining gap is the visual-symbolic layer: MC generated a strong visual grammar before it fully stabilized an engineering language. Without an adapter, visually compressed meaning can be either underused as decoration or overused as proof. The adapter preserves its design value while preventing false proof-transfer.

## Product requirement

Every visual/symbolic artifact considered for MC product, research, demo, or public release should be passed through a translation record with at least:

1. `artifact_id` — stable identifier for the visual/symbolic object.
2. `artifact_class` — diagram, generated image, interface sketch, metaphor map, atlas plate, workflow map, or mixed.
3. `source_boundary` — public-born, user-approved-public, private-context-derived, implementation-derived, imported, or unknown.
4. `privacy_status` — public-safe, internal-only, consent-required, redacted, unsafe-to-publish.
5. `visual_motifs` — recurring visible structures without private interpretation.
6. `semantic_hypotheses` — possible meanings stated as hypotheses, not facts.
7. `engineering_translation` — product requirement, schema field, UX state, evaluation criterion, workflow step, or documentation need.
8. `claim_status` — aesthetic signal, design hypothesis, confirmed requirement, test-backed finding, deprecated, or blocked.
9. `evidence_status` — visual recurrence, explicit requirement, implementation evidence, user-tested, externally supported, or none.
10. `release_allowed` — yes/no/conditional, with reason.
11. `missingness_status` — unknown origin, unreviewed privacy, untested interpretation, stale, duplicated, or not-applicable.
12. `revision_reason` — why translation changed.

## Adapter workflow

### 1. Identify the visual unit

Separate a single plate, sketch, diagram, screenshot, or symbolic element from the surrounding narrative.

### 2. Strip private payload

Remove names, locations, personal situations, health/animal/financial/relationship/credential details, raw chat wording, or any identifying context.

### 3. Describe only observable form

Record neutral features: layout, recurrence, layers, directionality, density, contrast, node/edge structure, timeline structure, body-map structure, field-map structure, or interface structure.

### 4. Propose bounded interpretation

Translate form into a hypothesis such as:

- layered memory model
- state-transition map
- signal-routing diagram
- mode switcher
- consent boundary
- contradiction tracker
- export artifact structure
- evaluation dashboard

Interpretation must remain labeled as hypothesis unless backed by explicit project requirement or implemented behavior.

### 5. Convert to typed build object

A visual hypothesis may become only one of the following until tested:

- product requirement
- schema candidate
- interface state
- evaluation criterion
- documentation section
- research question
- prototype task

### 6. Route through existing gates

Before publication or durable memory, the converted object must pass through the Claim Lifecycle Ledger, Evidence-Tier Output Router, Public Artifact Release Gate, and relevant privacy/source-boundary checks.

## Evaluation criteria

The Visual Grammar Evidence Adapter passes if:

- A reviewer can see which visual artifact influenced a requirement without seeing private source material.
- No image is treated as proof merely because it is aesthetically coherent or emotionally resonant.
- Every interpretation is labeled as visual signal, design hypothesis, explicit requirement, or tested finding.
- A visual motif can become a product requirement only after its source boundary, claim status, evidence status, and privacy status are labeled.
- Public artifacts can preserve the value of MC's visual grammar without exposing private biography or transcript detail.

## Research questions

1. What recurring visual motifs in MC materials correspond to stable product primitives rather than one-off aesthetic choices?
2. Which visual structures are best translated into schemas, which into UX states, and which should remain only as presentation language?
3. How should MC distinguish symbolic resonance from empirical evidence in public demos?
4. What annotation interface would let a user mark visual meaning while preserving privacy boundaries?
5. Can synthetic visual examples test the adapter without using private source material?

## Implementation plan

1. Create a `visual_artifact_index.json` schema with the fields listed above.
2. Add a small set of synthetic public-born visual examples.
3. Build an annotation template for visual motif, semantic hypothesis, engineering translation, and release status.
4. Connect the adapter output to existing claim/evidence/privacy gates.
5. Add a lint rule: no visual artifact may be cited as product proof unless it has an adapter record and evidence status beyond `visual recurrence`.

## Public-safe index tags

- `visual-grammar`
- `symbolic-to-operational-translation`
- `evidence-boundary`
- `privacy-safe-abstraction`
- `product-requirements`
- `evaluation-criteria`
- `public-artifact-governance`

## Current disposition

Accepted as a public-safe MC research note. Not yet implemented in product code.