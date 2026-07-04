# Synthetic Fixture Library

Date: 2026-07-04
Status: public-safe research note
Repository zone: `mind/research`

## Core finding

Mirror Cartographer needs a **Synthetic Fixture Library**: a public-safe set of invented, non-identifying, structurally representative examples for testing modes, exports, UI flows, claim labels, evidence gates, hallucination controls, privacy boundaries, and backlog acceptance criteria.

Operating line:

> A system cannot be safely tested on private signal until it can first pass on invented signal.

## Why this exists

MC has accumulated a governance stack for public-safe release, claim surfaces, interpretation budgets, reconstruction risk, mode transitions, lineage, compression loss, and boundary-aware backlog compilation. The next missing layer is a fixture substrate.

A product requirement can be privacy-safe in prose but still fail during implementation if developers, demos, tests, or screenshots require private examples to make the behavior legible. The synthetic fixture library prevents that failure by giving every MC subsystem a non-private test object.

The design source pattern is visible across available public-safe project materials:

- The core flow is defined as `ENTRY -> FIELD -> RECURSION -> RETURN`.
- The system modes are Canonical, Reflective, and Mythopoetic.
- The MVP includes symbol submission, reflection generation, session memory, and exportable artifact.
- The UI specification calls for body-map input, symbolic input, scene/narrative prompt entry, mode toggles, optional memory/echo tracking, output type tags, and hallucination audit indicators.
- The hallucination-control design includes symbol table enforcement, modal framing, audit grids, and reflection type classification.
- Existing adversarial evaluation patterns already distinguish resonance from proof and require mode tagging.
- ARC/proof infrastructure materials establish a broader claim rule: no capability claim is valid without an attached artifact, dataset/source name, commit/file hash, and scoring or reproduction command.

Those patterns can be tested without using real private memory, raw transcript material, personal chronology, health/household/financial/location/relationship data, animal-care details, or identifying symbolic sequences.

## Source status

- Source classes reviewed: saved MC architecture context, File Library project specifications, public-safe continuity/export materials, adversarial validation artifacts, and previously committed GitHub research notes.
- Raw transcript status: not quoted, copied, summarized, or published.
- Personal-context status: used only to understand architecture-level requirements and boundary risks; not exposed.
- File status: consulted for abstract product patterns: core flow, mode design, UI components, hallucination controls, exportable artifacts, claim-proof discipline, and adversarial mode validation.
- GitHub status: this note is written to the repository as a product-method and evaluation-infrastructure requirement.

## Claim status

This note makes a product-governance, testing, and implementation-planning claim.

Allowed claim:

- MC needs a synthetic fixture library so implementation, demos, tests, screenshots, and acceptance criteria can be built without private-source dependency.

Not claimed:

- That the fixture library already exists in code.
- That synthetic examples validate real-world psychological, clinical, therapeutic, cultural, or empirical effectiveness.
- That a synthetic fixture can replace user consent, source citations, or external evidence.
- That passing synthetic fixtures proves MC is safe for all real users or high-stakes contexts.
- That invented symbolic material has canonical authority.

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
- Real user screenshots or session exports

Allowed content classes:

- Synthetic examples
- Empty-state examples
- Generic symbolic tokens
- Structural UI fixtures
- Product requirements
- Source-boundary notes
- Research questions
- Evaluation criteria
- Implementation plans
- Privacy-safe indexes
- Claim and mode labels

## Missingness

This note does not create the full fixture corpus. It defines the requirement, fixture classes, acceptance rules, and implementation plan.

No external validation is performed here. Synthetic fixtures are only implementation scaffolds. Any feature that implies performance, safety, clinical, therapeutic, legal, financial, cultural, diagnostic, or empirical value must be evaluated separately with appropriate evidence, consent, and source boundaries.

## Meaningful revision reason

Earlier notes defined gates for public artifacts, mode movement, claim surfaces, reconstruction risk, and backlog compilation. This revision adds the missing test substrate: how MC can implement and evaluate those gates without using private examples as hidden fixtures.

## Fixture problem

Without a synthetic fixture library, MC risks four failures:

1. **Private test leakage** — real personal or transcript-derived examples enter screenshots, test data, demos, or issue comments.
2. **Untestable abstractions** — governance rules exist as prose but cannot be exercised in code or UI.
3. **Claim drift during demos** — invented examples are presented as evidence rather than as structural tests.
4. **Mode collapse** — canonical, reflective, and mythopoetic outputs are tested with examples that do not force meaningful distinction.

A fixture library converts governance into executable, non-private checks.

## Fixture classes

### 1. Empty-state fixtures

Purpose: verify behavior when no user memory, symbol table, source cluster, or prior session exists.

Required checks:

- Does the system say what is missing?
- Does it avoid inventing continuity?
- Does it block reflective-memory claims?
- Does it provide a safe next input path?

### 2. Symbol-token fixtures

Purpose: test symbolic input without private sequence leakage.

Example structure:

- symbol: `stone`
- color: `blue`
- texture: `rough`
- intensity: `medium`
- mode requested: `canonical`
- source availability: `limited`

Required checks:

- Canonical mode cites or labels source status.
- Reflective mode does not claim personal history unless provided in fixture.
- Mythopoetic mode marks itself as speculative.
- Output carries mode and claim labels.

### 3. Body-map structural fixtures

Purpose: test somatic UI without real health or body-history data.

Example structure:

- body zone: `left shoulder`
- sensation token: `warmth`
- intensity: `2/5`
- temporal tag: `today`
- interpretation allowed: `non-clinical reflection only`

Required checks:

- The system does not diagnose.
- The system separates sensation capture from interpretation.
- Export labels the content as user-entered or synthetic.
- High-stakes medical language is blocked or routed to evidence/safety language.

### 4. Mode-transition fixtures

Purpose: verify that a claim crossing modes preserves its original evidence status.

Example transition:

- canonical source note -> reflective journal prompt -> mythopoetic visual card -> export summary

Required checks:

- The export records each mode transition.
- No transition upgrades evidence status.
- Speculative language remains marked.
- Missing source material remains visible.

### 5. Hallucination-control fixtures

Purpose: test symbol table enforcement, modal framing, audit grid behavior, and reflection classification.

Fixture variants:

- known symbol with source cluster
- unknown symbol
- ambiguous symbol
- user-invented symbol
- conflicting source meanings

Required checks:

- Unknown symbols are not treated as canonically known.
- Conflicting meanings are surfaced rather than averaged into false certainty.
- User-invented symbols remain reflective or mythopoetic unless supported by source.
- Drifted output is flagged.

### 6. Export fixtures

Purpose: test public/private export behavior.

Fixture variants:

- private-only reflection
- public-safe summary
- research-note candidate
- blocked export
- synthetic demo export

Required checks:

- Export class is labeled.
- Private-only content cannot move into public export.
- Public-safe summaries record compression loss.
- Synthetic demo exports are not framed as real user evidence.

### 7. Reconstruction-risk fixtures

Purpose: test whether combined safe fragments become identifying or private when joined.

Fixture variants:

- isolated symbolic token
- token plus chronology
- token plus location-like metadata
- token plus rare phrasing
- token plus repeated cross-document pattern

Required checks:

- Reconstruction risk increases when fragments combine.
- High-risk bundles are blocked or internal-only.
- Public-safe indexes avoid cumulative leakage.

### 8. Claim-proof fixtures

Purpose: test evidence discipline.

Fixture variants:

- unsupported conceptual claim
- implementation claim
- benchmark claim
- source-bound symbolic claim
- empirical claim requiring external validation

Required checks:

- Unsupported claims remain conceptual.
- Implementation claims require file/commit references.
- Benchmark claims require dataset/source, command, and artifact.
- High-stakes claims route to external evidence requirements.

## Fixture metadata schema

```yaml
fixture:
  id: synthetic-fixture-id
  fixture_class: empty_state | symbol_token | body_map | mode_transition | hallucination_control | export | reconstruction_risk | claim_proof
  privacy_status: synthetic_public_safe
  source_status: invented | public_source_bound | empty | structural
  claim_status: conceptual | implementation_test | evaluation_case | demo_only
  mode_status: canonical | reflective | mythopoetic | mixed | none
  evidence_status: synthetic_only | public_source_required | implementation_required | external_validation_required
  missingness: what is absent by design
  prohibited_inference: what the system must not infer
  expected_behavior: what the system should do
  failure_behavior: what the system should do if uncertain, blocked, missing, or unsupported
  acceptance_criteria: testable pass/fail criteria
  release_class: R0 | R1 | R2 | R3 | R4 | R5 | R6
```

## Product requirement

Create a `fixtures/` or `mind/fixtures/` directory containing public-safe synthetic fixtures for MC subsystems.

Minimum fixture families:

- empty state
- symbol token
- body-map structural input
- mode transition
- hallucination control
- export routing
- reconstruction risk
- claim-proof discipline

Each fixture must include:

- privacy status
- source status
- claim status
- mode status
- evidence status
- missingness
- prohibited inference
- expected behavior
- failure behavior
- acceptance criteria
- release class

## Evaluation criteria

A fixture passes if:

1. It contains no private, identifying, transcript-derived, household, health, animal-care, financial, location, relationship, credential, or rare-phrase material.
2. It tests a specific MC subsystem or governance gate.
3. It states what the system must not infer.
4. It names missingness and failure behavior.
5. It distinguishes synthetic-only behavior from external evidence.
6. It can be used in code, screenshots, docs, demos, or issue templates without privacy exposure.
7. It preserves mode and claim labels.
8. It blocks claim upgrades caused by resonant, poetic, polished, or interface-friendly output.

A fixture fails if:

1. It depends on private source material.
2. It is too vague to test.
3. It uses a synthetic example as evidence of real-world effectiveness.
4. It allows reflective or mythopoetic output to become canonical truth.
5. It hides missingness.
6. It cannot be reused across docs, UI, tests, and demos.
7. It creates reconstruction risk when placed beside other public artifacts.

## Research questions

- What is the smallest synthetic fixture set that can exercise every MC governance gate?
- Which fixture classes should become automated tests first?
- Can fixtures be generated from schemas without importing private examples?
- How should MC label screenshots or demos that use synthetic data?
- Should every public demo include a visible `synthetic fixture` label?
- Can a linter detect private-like specificity in fixture files?
- How should source-bound canonical fixtures reference public symbolism without implying universal interpretation?
- What fixture format works across UI, docs, exports, and automated tests?

## Implementation plan

1. Create `mind/fixtures/README.md` defining fixture purpose and safety rules.
2. Add YAML fixtures for the eight fixture classes above.
3. Add a fixture lint rule that blocks personal identifiers, private chronology, health/animal/financial/location/relationship details, credentials, and rare private phrasing.
4. Add UI/demo labeling: every synthetic example must display `synthetic demo data` or equivalent metadata.
5. Add docs guidance: synthetic fixtures prove structural behavior only, not real-world outcome validity.
6. Connect fixture metadata to backlog compilation so every implementation task has a non-private acceptance fixture.
7. Connect fixture metadata to release gates so public demos cannot claim more than the fixture supports.
8. Add regression tests for mode separation, claim labels, missingness visibility, and blocked inference behavior.

## Public-safe index entry

- Finding: Synthetic Fixture Library
- Source status: mixed private-context-informed, file-backed, GitHub-reviewed
- Claim status: product-governance, testing, and implementation-planning requirement
- Privacy status: public-safe abstraction
- Missingness: fixture corpus not yet created; no external validation; no full audit of existing tests or demos
- Revision reason: adds the non-private testing substrate required for backlog compilation, public demos, UI screenshots, export tests, and claim-proof checks
- Next action: create `mind/fixtures/README.md` and initial YAML fixtures for empty state, symbol token, body-map, mode transition, hallucination control, export routing, reconstruction risk, and claim-proof discipline
