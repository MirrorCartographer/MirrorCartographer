# Boundary-Aware Backlog Compiler

Date: 2026-07-04
Status: public-safe research note
Repository zone: `mind/research`

## Core finding

Mirror Cartographer needs a **Boundary-Aware Backlog Compiler**: a method for converting public-safe research notes into buildable issues, schemas, tests, or documentation tasks without importing private-source residue, hidden evidence assumptions, or unsupported claim upgrades.

Operating line:

> A requirement is not safe because its note is safe; it is safe when its implementation path preserves the same boundaries.

## Why this exists

MC now has a growing governance stack for source boundaries, claim surfaces, release gates, interpretation budgets, reconstruction risk, mode transitions, and public compression loss. That stack protects research notes. The next operational risk appears when a note becomes a product task.

A research note can be public-safe while still being unsafe to compile directly into a backlog item if the task:

- depends on private context that was abstracted away,
- lacks a testable input/output shape,
- implies an implementation exists when it does not,
- carries a symbolic or reflective claim into canonical product behavior,
- uses emotionally vivid private-derived examples for acceptance tests,
- hides missing evidence behind polished requirement language,
- creates a feature that can reconstruct the private source class it came from.

The backlog compiler exists to preserve boundary metadata during the transition from idea to work item.

## Source status

- Source classes reviewed: saved MC architecture context, file-library architecture/specification materials, and previously committed GitHub research notes.
- Raw transcript status: not quoted, copied, summarized, or published.
- Personal-context status: used only for architecture-level understanding; not exposed.
- File status: consulted for abstract architecture patterns: connector routing, proof lanes, evidence gates, archive indexing, provenance-native cognition framing, canonical/reflective/mythopoetic modes, recursive flow, session memory, and exportable artifacts.
- GitHub status: this note is written to the public repository as a product-method requirement.

## Claim status

This note makes a product-governance and implementation-planning claim.

Allowed claim:

- MC needs a compilation layer between research notes and executable backlog work so privacy, claim, evidence, mode, and missingness labels survive implementation planning.

Not claimed:

- That any specific private source caused this requirement.
- That the compiler already exists in code.
- That current repository issues or implementation tasks already satisfy this method.
- That symbolic resonance, user fit, or conceptual coherence is empirical validation.
- That backlog compilation can remove the need for external evidence in high-stakes claim areas.

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

Allowed content classes:

- Product requirements
- Source-boundary notes
- Backlog-routing method
- Research questions
- Evaluation criteria
- Implementation planning
- Privacy-safe indexes
- Claim and evidence labels

## Missingness

This note does not audit every existing issue, file, branch, or implementation path. It defines the missing compilation method that should govern future movement from `mind/research` into product work.

No external validation is performed here. Any feature that implies performance, safety, clinical, therapeutic, legal, financial, or empirical value must be routed to a separate evidence process before public claim or user-facing reliance.

## Meaningful revision reason

Earlier notes focused on whether an artifact can be public, what claim surface it occupies, how it moves between modes, and what release class it belongs to. This revision adds the next operational layer: how a public-safe note becomes a buildable task without losing its boundary labels.

## Compiler problem

A public-safe research note usually contains a conceptual requirement, not a ready implementation task. To become executable, it must be decomposed into:

1. a source-safe summary,
2. a specific product object,
3. a claim boundary,
4. a testable behavior,
5. an evidence requirement,
6. a missingness statement,
7. a privacy/reconstruction check,
8. an allowed destination,
9. a revision reason,
10. a non-private acceptance fixture.

Without this compiler, the backlog can silently become a laundering surface where private-derived insight turns into public product behavior with weaker labels.

## Backlog compilation schema

Every research note promoted toward implementation should produce a block like this:

```yaml
backlog_compilation:
  source_note: path-or-id
  source_status: public | synthetic | private_inspired_public_abstracted | mixed | unknown
  release_class: R0 | R1 | R2 | R3 | R4 | R5 | R6
  product_object: schema_field | lint_rule | ui_rule | export_rule | docs_rule | evaluation_case | issue | test_fixture | policy_gate
  claim_status: method_requirement | product_requirement | evaluation_criterion | implementation_plan | hypothesis | evidence_bearing_claim | symbolic_interpretation | speculation
  mode_status: canonical | reflective | mythopoetic | interface | export | research | mixed
  privacy_status: public_safe | public_safe_with_limits | internal_only | private_return_only | blocked
  reconstruction_risk: low | medium | high | blocked
  evidence_status: conceptual_only | synthetic_only | implementation_pending | reproducible_artifact_required | validated | blocked
  missingness: withheld, unknown, untested, unavailable, or abstracted material
  non_private_fixture: public example, synthetic example, empty fixture, or blocked
  acceptance_criteria: testable behavior without private-source dependency
  revision_reason: why the task differs from the source note
  next_action: hold | create_issue | write_schema | write_test | write_docs | build_fixture | attach_evidence | block
```

## Promotion rules

### Rule 1 — Notes do not become issues directly

A note must first be compiled into a task object. The task object must name what is being changed: schema, UI, export, lint rule, docs, evaluation, or policy gate.

### Rule 2 — Private-derived examples cannot become acceptance tests

Acceptance tests should use synthetic, public, empty, or structural fixtures unless a separate release path exists.

### Rule 3 — Mode status must survive implementation

If a requirement originates in reflective or mythopoetic mode, implementation must not make it canonical without an evidence transition.

### Rule 4 — Missingness must be visible inside the task

A build task should say what is unknown, abstracted, untested, or deliberately withheld.

### Rule 5 — Product tasks need failure behavior

A requirement is incomplete unless it names what the system should do when classification is unknown, evidence is missing, privacy status is blocked, or release class is too weak.

### Rule 6 — Release class constrains destination

R1 can remain a research note. R2 may become documentation candidate. R3 may become product requirement. R4 may become synthetic demo. R5 requires evidence. R6 is blocked.

### Rule 7 — Backlog language must not upgrade claims

Words such as validates, proves, detects, treats, diagnoses, prevents, guarantees, or measures must be blocked unless the task carries evidence-bearing status and explicit support.

## Product requirement

Add a backlog compilation step between `mind/research` and implementation work.

Minimum required fields:

- source note
- source status
- release class
- product object
- claim status
- mode status
- privacy status
- reconstruction risk
- evidence status
- missingness
- non-private fixture
- acceptance criteria
- revision reason
- next action

## Evaluation criteria

A compiled backlog item passes if:

1. It can be implemented without reading private source material.
2. It identifies the exact product object to change.
3. It preserves source, claim, privacy, mode, evidence, and release labels.
4. It uses only public, synthetic, empty, or structural fixtures.
5. It includes failure behavior for blocked or unknown states.
6. It distinguishes conceptual, implementation, and evidence-bearing status.
7. It names missingness and revision reason.
8. It blocks high-stakes claims without external evidence.

A compiled backlog item fails if:

1. It depends on private examples.
2. It turns symbolic fit into canonical truth.
3. It hides missing evidence.
4. It lacks acceptance criteria.
5. It cannot be tested without private context.
6. It uses polished product language to imply implementation or validation.
7. It creates reconstruction risk when combined with other public artifacts.

## Research questions

- Can MC automatically compile research notes into safe issue templates?
- Which requirement phrases most often upgrade conceptual notes into unsupported claims?
- What minimum fixture format is needed to test symbolic-mode logic without private examples?
- Should every issue inherit release gate metadata from its source note?
- Can GitHub checks reject issues or pull requests that lack backlog compilation metadata?
- How should missingness be represented in user-facing documentation without making the system unreadable?
- Can a public-safe index track which research notes have become schemas, tests, docs, or UI behavior?

## Implementation plan

1. Create a `backlog_compilation` metadata template.
2. Add the template to new GitHub issues derived from `mind/research` notes.
3. Require a non-private fixture before any research note becomes a test or demo.
4. Add a linter that blocks task files missing source, claim, privacy, mode, evidence, release, missingness, and revision fields.
5. Add a release-class rule: only R3+ items can become product requirements; only R4 items can become synthetic demos; R5 items require evidence; R6 items are blocked.
6. Add a docs rule requiring every user-facing behavior claim to reference its compiled source note.
7. Add a public-safe implementation index mapping research notes to issues, schemas, tests, docs, demos, and blocked items.
8. Add failure-state handling to UI/export/schema work: unknown, blocked, evidence-missing, release-class-too-weak, reconstruction-risk-high.

## Public-safe index entry

- Finding: Boundary-Aware Backlog Compiler
- Source status: mixed private-context-informed, file-backed, GitHub-reviewed
- Claim status: product-governance and implementation-planning requirement
- Privacy status: public-safe abstraction
- Missingness: no full audit of existing implementation backlog; no external validation; no raw transcript review published
- Revision reason: extends public artifact gates into task compilation so implementation inherits boundary labels
- Next action: create issue template or schema block for backlog compilation metadata
