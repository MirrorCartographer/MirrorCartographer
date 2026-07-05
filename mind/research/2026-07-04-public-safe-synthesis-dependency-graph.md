# Public-Safe Synthesis Dependency Graph

## Core finding

Mirror Cartographer needs a public-safe synthesis dependency graph: a lightweight map that records which sanitized research notes, product requirements, evaluation criteria, and implementation plans depend on one another without exposing the private material that originally motivated them.

Operating line: **A public-safe knowledge base should not only label each artifact in isolation; it should show how safe abstractions depend on other safe abstractions, so later revisions can update the system without re-opening private context.**

## Source status

- Private-context material: used only as architectural orientation.
- GitHub material: recent public-safe research commits indicate an expanding set of boundary, claim, traceability, fixture, inference, and evaluation notes.
- Public web material: not required for this pass because the finding concerns internal repository architecture and publication hygiene rather than external factual claims.
- Raw transcript status: excluded.

## Claim status

- Type: product architecture requirement.
- Strength: design recommendation, not empirical claim.
- Evidence class: repository-pattern observation plus repeated need for source-boundary, claim-boundary, privacy-boundary, and evaluation-boundary notes.
- Testability: high. The system can be tested by asking whether every public-safe note declares upstream dependencies, downstream dependents, invalidation triggers, and privacy-safe revision pathways.

## Privacy status

- Public-safe: yes.
- Personal details: none included.
- Household, health, animal-care, financial, location, relationship, credential, or raw transcript details: excluded.
- Rehydration risk: low if dependency edges point only to sanitized artifact names, claim classes, requirement classes, and evaluation classes rather than private examples.

## Missingness

- No automated dependency extraction exists yet.
- No manifest currently guarantees that a later public-safe artifact can identify which prior assumptions it inherits.
- No explicit invalidation cascade exists for when a public-safe assumption expires, is demoted, or is contradicted.
- No maintainer-facing view exists for distinguishing conceptual dependency, implementation dependency, evidence dependency, and privacy dependency.

## Product requirement

Each public-safe note should contain a dependency block with four fields:

1. **Upstream safe artifacts**: sanitized notes or requirements this artifact depends on.
2. **Downstream affected artifacts**: sanitized notes, tests, interface contracts, or implementation plans likely affected if this artifact changes.
3. **Dependency type**: conceptual, evidence, implementation, evaluation, privacy, or governance.
4. **Invalidation trigger**: what would force review, demotion, replacement, or archival.

## Evaluation criteria

A dependency graph entry passes if:

- It contains no private source content.
- It does not encode private chronology, household structure, medical specifics, animal-care specifics, financial data, location data, relationship data, credentials, or raw transcript shape.
- It lets maintainers identify which safe artifacts need review after a claim changes.
- It distinguishes a privacy revision from a product revision.
- It makes missing dependencies visible rather than silently implying completeness.

## Implementation plan

1. Add a `dependency_status` section to future public-safe notes.
2. Add a repository-level `mind/indexes/public-safe-dependency-graph.md` file.
3. Represent dependencies as rows: artifact, source status, claim class, privacy class, dependency type, invalidation trigger, last revision reason.
4. Add a review checklist that rejects new notes without at least one of: explicit upstream dependency, explicit independent-origin statement, or explicit missingness statement.
5. Later convert the markdown index into a machine-readable JSON manifest for automated review.

## Research questions

- How much dependency detail is enough to preserve architecture without leaking private source topology?
- Should dependency edges be manually curated, automatically inferred, or both?
- What degree of abstraction prevents private rehydration while still preserving useful system lineage?
- When a public-safe note is superseded, should downstream artifacts be marked stale, review-needed, or invalid?

## Revision reason

Added after observing that the public-safe research set is becoming large enough that isolated notes are no longer sufficient. The next structural need is not another single boundary rule; it is a safe way to understand relationships among boundary rules without returning to private material.
