# Public-Safe Revoked Abstraction Reuse Prevention Protocol

## Source status

- **Repository source status:** Connected GitHub repository available: `MirrorCartographer/MirrorCartographer`.
- **Context source status:** Derived from recurring MC public-safety research direction and prior public-safe research notes named in conversation context.
- **Private-context source status:** Private material was used only to understand architectural risk shape. No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details are included.
- **External source status:** No fresh external web source was required; this is an internal product-governance and implementation-planning note.

## Claim status

- **Claim type:** Product architecture requirement and evaluation protocol.
- **Claim strength:** Design hypothesis ready for implementation as a guardrail and regression test suite.
- **Claim boundary:** This does not prove any specific prior artifact is unsafe. It defines how MC should prevent reuse of an abstraction after its source permission, privacy posture, or claim status changes.

## Privacy status

- **Privacy classification:** Public-safe abstraction.
- **Allowed contents:** Methods, source-boundary notes, product requirements, evaluation criteria, implementation plan.
- **Disallowed contents:** Raw transcripts, biographical facts, health/animal/financial/relationship/location details, credential traces, private examples, recognizable symbolic sequences.
- **Residual risk:** Medium if implemented only as documentation. Lower when enforced in metadata, retrieval filters, build scripts, and publication checks.

## Missingness

- No full repository tree was available through code search indexing at the time of this note.
- No machine-readable inventory of all prior MC abstractions was confirmed in this run.
- No existing consent/revocation ledger was confirmed.
- No automated dependency graph was confirmed for generated public-safe artifacts.

## Revision reason

Prior notes established consent revocation propagation. The next required layer is prevention of downstream reuse: once an abstraction is revoked, expired, demoted, or quarantined, the system must stop treating it as safe substrate for future synthesis.

## Core finding

MC needs a **Revoked Abstraction Reuse Prevention Protocol**.

Operating line:

> A revoked abstraction is not safe merely because it contains no private facts; it must be removed from the synthesis substrate, blocked from retrieval promotion, and marked as non-authoritative wherever future artifacts could inherit from it.

## Problem

Public-safe research systems often treat abstraction as a one-way privacy operation: private material is generalized, then the generalized artifact becomes reusable. That is insufficient for MC because an abstraction can become unsafe later through:

1. changed consent status,
2. changed source boundary,
3. improved understanding of inference leakage,
4. composition with other public-safe artifacts,
5. claim demotion after evaluation,
6. private-context topology becoming recognizable through repeated patterns,
7. stale assumptions that no longer justify implementation priority.

The failure mode is not direct exposure. The failure mode is **reuse after demotion**.

## Product requirement

Every MC public-safe artifact should carry reuse metadata that determines whether it may be used as substrate for future artifacts.

Minimum metadata:

- `artifact_id`
- `created_at`
- `source_status`
- `claim_status`
- `privacy_status`
- `reuse_status`
- `reuse_allowed_contexts`
- `revocation_status`
- `revocation_reason`
- `superseded_by`
- `depends_on`
- `derived_from_private_context_shape` yes/no/unknown
- `review_required_before_reuse` yes/no

## Reuse states

1. **Reusable** — may inform future synthesis within its declared boundary.
2. **Review before reuse** — may be referenced only after source, claim, and privacy status are checked.
3. **Quarantined** — may be inspected for audit but not used as synthesis substrate.
4. **Revoked** — must not be used for future generation, examples, demos, evaluations, or product requirements.
5. **Superseded** — may be cited only to explain revision history; current use must point to successor artifact.
6. **Expired** — assumption window has closed; artifact requires revalidation.

## Enforcement points

### 1. Retrieval filter

Before a research note, demo, fixture, index, or implementation plan is generated, the retrieval layer should exclude artifacts where:

- `reuse_status` is `revoked`, `quarantined`, or `expired`,
- `review_required_before_reuse` is true and no current review exists,
- `privacy_status` is not `public-safe`,
- `claim_status` is `demoted` or `unverified` for a use that requires verified substrate.

### 2. Synthesis header

Every new artifact should include:

- source status,
- claim status,
- privacy status,
- missingness,
- revision reason,
- dependency list or statement that dependencies were unavailable.

### 3. Dependency scan

Before publication, the system should scan whether the artifact depends on any revoked or quarantined abstraction. If yes, publication should fail or require a revision that removes the dependency.

### 4. Public-safe index update

A public-safe index should not merely list artifacts. It should mark whether each artifact is reusable, superseded, expired, quarantined, or revoked.

### 5. Demo and fixture generation

Demo content should be generated only from reusable public-safe protocols or from independently generated synthetic fixtures. Revoked abstractions must not shape scenario sequence, symbolic labels, evaluation criteria, or failure examples.

## Evaluation criteria

A correct implementation should pass these checks:

- **Revocation blocking:** A revoked artifact cannot be selected by retrieval.
- **Quarantine blocking:** A quarantined artifact can be audited but not reused.
- **Supersession routing:** A superseded artifact points synthesis to the current successor.
- **Expiry handling:** An expired assumption cannot silently support a new claim.
- **Dependency detection:** If an artifact depends on revoked substrate, the build fails.
- **Composition check:** Multiple individually safe artifacts are checked for assembled leakage risk.
- **Human-readable audit:** A reviewer can tell why reuse was allowed or blocked.

## Implementation plan

1. Add a frontmatter schema to all MC public-safe research notes.
2. Create `mind/indexes/public-safe-artifact-index.json`.
3. Add a small validator that parses frontmatter and blocks invalid reuse states.
4. Add a dependency field to new notes.
5. Add a `revocations/` ledger for explicit revocation events.
6. Add a CI check or local script that fails publication when revoked substrate is referenced.
7. Add a report generator that lists reusable, expired, quarantined, superseded, and revoked artifacts.

## Research questions

- What degree of abstraction still preserves private-context topology?
- How should MC distinguish revoked-by-consent from revoked-by-safety-analysis?
- Can an abstraction be partially reused if only one dependency is revoked?
- Should revocation propagate transitively through all descendants, or should descendants be re-reviewable?
- What public-safe evidence is sufficient to promote a quarantined artifact back to reusable status?

## Public-safe index entry draft

```yaml
artifact_id: revoked-abstraction-reuse-prevention
path: mind/research/2026-07-05-revoked-abstraction-reuse-prevention.md
source_status: repository-connected + conversation-context-derived
claim_status: design-hypothesis
privacy_status: public-safe
reuse_status: reusable
review_required_before_reuse: true
depends_on:
  - public-safe-consent-revocation-propagation
superseded_by: null
revocation_status: active
missingness:
  - repository tree not fully enumerated
  - consent ledger not confirmed
  - dependency graph not confirmed
```

## Next research target

**Public-safe transitive dependency revocation:** determine when revocation should cascade automatically through descendant artifacts and when a descendant can survive by re-reviewing and severing the unsafe dependency.
