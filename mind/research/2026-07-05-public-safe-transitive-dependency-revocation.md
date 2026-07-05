# Public-Safe Transitive Dependency Revocation Protocol

## Source status

- **Repository source status:** Connected GitHub repository available: `MirrorCartographer/MirrorCartographer`.
- **Context source status:** Derived from the active MC public-safety research sequence and the immediately prior note, `2026-07-05-revoked-abstraction-reuse-prevention.md`.
- **Private-context source status:** Private material was used only to understand architectural risk shape. No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details are included.
- **External source status:** No fresh external web source was required; this is an internal product-governance and implementation-planning note.

## Claim status

- **Claim type:** Product architecture requirement, dependency governance protocol, and evaluation design.
- **Claim strength:** Design hypothesis ready for implementation as metadata, review workflow, and build-time validation.
- **Claim boundary:** This does not claim that any current MC artifact is unsafe. It defines how revocation should propagate when an upstream artifact loses reuse authority.

## Privacy status

- **Privacy classification:** Public-safe abstraction.
- **Allowed contents:** Methods, source-boundary notes, product requirements, research questions, evaluation criteria, privacy-safe indexes, implementation plans.
- **Disallowed contents:** Raw transcripts, biographical facts, household details, health details, animal-care details, financial details, location traces, relationship details, credential traces, private examples, or recognizable symbolic sequences.
- **Residual risk:** Medium if dependency relationships remain implicit. Lower when every artifact declares dependencies and revocation propagation is validated mechanically.

## Missingness

- No complete machine-readable dependency graph was confirmed.
- No revocation ledger was confirmed.
- No CI or local validator was confirmed for public-safe artifact metadata.
- No review queue was confirmed for descendant artifacts affected by upstream status changes.

## Revision reason

The previous note established that revoked abstractions must not be reused as synthesis substrate. The next unresolved question is whether revocation should automatically cascade through every descendant artifact, or whether some descendants can survive after review, dependency severance, or claim demotion.

## Core finding

MC needs a **Public-Safe Transitive Dependency Revocation Protocol**.

Operating line:

> Revocation is not complete when the revoked artifact is blocked; it is complete only when every descendant artifact is traced, classified, and either invalidated, quarantined, repaired, or explicitly re-cleared within a public-safe boundary.

## Problem

A public-safe artifact may depend on earlier public-safe artifacts. If an upstream artifact is later revoked, quarantined, superseded, expired, or demoted, the downstream artifacts may inherit the same defect even if their text contains no private facts.

The risk is transitive inheritance:

1. an upstream abstraction is treated as safe,
2. later artifacts inherit its framing, evaluation criteria, labels, schema, or claim boundary,
3. the upstream abstraction is later demoted or revoked,
4. descendants remain visible and reusable because their own text looks clean,
5. future synthesis uses the descendant and indirectly reintroduces the revoked substrate.

This creates a silent leak path: not exposure through facts, but exposure through dependency topology.

## Product requirement

Every public-safe artifact should declare dependency metadata sufficient for transitive revocation review.

Minimum metadata:

- `artifact_id`
- `path`
- `created_at`
- `depends_on`
- `dependency_type`
- `dependency_strength`
- `source_status`
- `claim_status`
- `privacy_status`
- `reuse_status`
- `revocation_status`
- `revocation_scope`
- `affected_by_revocation`
- `repair_status`
- `review_status`
- `review_reason`
- `survival_basis`
- `superseded_by`

## Dependency types

MC should distinguish at least six dependency types:

1. **Conceptual dependency** — uses a prior artifact's idea, frame, or operating line.
2. **Schema dependency** — uses a prior artifact's metadata model, state model, or validation structure.
3. **Evaluation dependency** — uses a prior artifact's criteria, tests, failure modes, or pass/fail gates.
4. **Implementation dependency** — uses a prior artifact's planned file structure, tool path, script, interface, or workflow.
5. **Claim dependency** — inherits a prior artifact's asserted status, priority, or product requirement.
6. **Example dependency** — uses a prior artifact's demo scenario, fixture shape, labels, sequence, or illustrative pattern.

## Dependency strength

Each dependency should be graded:

- **Hard dependency:** The descendant is invalid without the upstream artifact.
- **Soft dependency:** The descendant can survive if the upstream reference is removed or revised.
- **Historical dependency:** The descendant only cites the upstream artifact as prior work or revision history.
- **Unknown dependency:** The relationship is not clear enough to allow reuse without review.

## Revocation scopes

A revocation event should identify its scope:

1. **Local revocation** — only the named artifact loses reuse authority.
2. **Field revocation** — all artifacts using a specific schema, label, claim pattern, or evaluation pattern require review.
3. **Lineage revocation** — all descendants of the artifact require review.
4. **Global revocation** — the artifact and all descendants must be blocked until re-cleared.
5. **Partial revocation** — only a specific claim, dependency, example, or output section is revoked.

## Descendant outcomes

When an upstream artifact is revoked, each descendant should be assigned one of these outcomes:

1. **Unaffected** — no meaningful dependency exists.
2. **Review required** — dependency exists, but survival is plausible.
3. **Quarantined** — may be audited but cannot be reused.
4. **Repairable** — can survive if the dependency is removed, rewritten, or replaced.
5. **Superseded** — replaced by a new artifact that no longer depends on revoked substrate.
6. **Revoked** — cannot survive because the dependency is structural.

## Survival basis

A descendant may survive upstream revocation only when at least one survival basis is documented:

- The dependency was historical only.
- The dependent section was removed.
- The inherited claim was demoted and no longer supports publication or implementation.
- The artifact was re-derived from public-safe independent sources.
- The evaluation criteria were replaced with criteria not inherited from the revoked artifact.
- The demo or fixture was regenerated independently.
- A reviewer marked the remaining artifact as public-safe with a concrete reason.

## Enforcement points

### 1. Dependency graph build

Before publication, MC should build or update a graph where nodes are artifacts and edges are declared dependencies.

Each edge should include:

- dependency type,
- dependency strength,
- section-level reference if known,
- whether the dependency is allowed for future synthesis.

### 2. Revocation event processing

When an artifact is revoked, expired, quarantined, or demoted, the system should:

1. find direct descendants,
2. find indirect descendants,
3. classify dependency strength,
4. assign descendant outcomes,
5. block reuse for unresolved descendants,
6. write a revocation event to the ledger,
7. update the public-safe index.

### 3. Retrieval blocking

Retrieval should exclude artifacts where:

- `affected_by_revocation` is true and `review_status` is unresolved,
- dependency strength is unknown,
- a hard dependency points to revoked substrate,
- an inherited claim depends on a demoted upstream claim,
- an example dependency points to a revoked fixture or demo pattern.

### 4. Repair workflow

A repair workflow should require:

- affected section identification,
- dependency removal or replacement,
- claim status review,
- privacy status review,
- updated missingness statement,
- revision reason,
- new dependency list,
- reviewer-readable survival basis.

### 5. Publication check

A public-safe publication check should fail when:

- dependency metadata is absent,
- any dependency status is unknown,
- any hard dependency points to revoked or quarantined substrate,
- any partial revocation affects a section still present,
- any descendant outcome is unresolved.

## Evaluation criteria

A correct implementation should pass these tests:

- **Direct descendant detection:** A child artifact of a revoked artifact is found.
- **Indirect descendant detection:** A grandchild artifact is found even when it does not name the revoked artifact directly.
- **Hard dependency blocking:** A structurally dependent descendant cannot be reused.
- **Soft dependency repair:** A descendant can be re-cleared after removing or replacing the affected dependency.
- **Partial revocation handling:** Only the affected claim or section is blocked when the rest of the artifact survives.
- **Unknown dependency fail-closed:** Unclear dependency status causes review, not silent reuse.
- **Index synchronization:** The public-safe index updates descendant status after revocation.
- **Audit readability:** A reviewer can tell why each descendant was revoked, quarantined, repaired, or allowed to survive.

## Implementation plan

1. Add dependency frontmatter to every new MC public-safe research note.
2. Create `mind/indexes/public-safe-artifact-index.json`.
3. Create `mind/indexes/public-safe-dependency-graph.json`.
4. Create `mind/revocations/` for revocation event records.
5. Add a validator that parses frontmatter and dependency graph edges.
6. Add fail-closed retrieval rules for unresolved descendant status.
7. Add a repair template for affected descendants.
8. Add a generated report listing all artifacts affected by each revocation.
9. Add review statuses: `unreviewed`, `review-required`, `repaired`, `survives`, `quarantined`, `revoked`, `superseded`.
10. Add a rule that no artifact can be promoted to implementation work while descendant status is unresolved.

## Public-safe index entry draft

```yaml
artifact_id: public-safe-transitive-dependency-revocation
path: mind/research/2026-07-05-public-safe-transitive-dependency-revocation.md
source_status: repository-connected + prior-public-safe-note-derived
claim_status: design-hypothesis
privacy_status: public-safe
reuse_status: reusable
review_required_before_reuse: true
depends_on:
  - revoked-abstraction-reuse-prevention
dependency_type:
  - conceptual
  - implementation
  - evaluation
dependency_strength: soft
superseded_by: null
revocation_status: active
missingness:
  - dependency graph not confirmed
  - revocation ledger not confirmed
  - validator not confirmed
```

## Research questions

- When should transitive revocation be automatic rather than review-based?
- Can a descendant survive if it only inherits a schema but not the revoked claim?
- What is the minimum evidence required to sever a dependency?
- Should demo fixtures have stricter transitive rules than research notes?
- How should MC represent partial revocation at section level?
- Should public-safe artifacts be allowed to cite revoked ancestors for historical traceability, or should citations route only through supersession notes?

## Next research target

**Public-safe section-level revocation and repair:** define how MC should invalidate, quarantine, or repair only the affected sections of an artifact without unnecessarily revoking the whole artifact.
