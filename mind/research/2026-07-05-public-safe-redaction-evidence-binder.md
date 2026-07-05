# Public-Safe Redaction Evidence Binder

Date: 2026-07-05
Status: research note
Repository area: `mind/research`

## Core finding

Mirror Cartographer needs a **Public-Safe Redaction Evidence Binder**: a lightweight evidence object that travels with any public-safe abstraction and records why the artifact is safe enough to publish without exposing the private material that helped generate it.

## Operating line

A public-safe artifact should not merely say it was redacted; it should carry enough boundary evidence that a future reviewer can verify what was excluded, what was abstracted, what claim level remains, and what would require re-review.

## Source status

- Source class: mixed private-context architecture, File Library architecture packets, and repository memory from prior MC research notes.
- Source handling: private context was used only to infer architecture needs and repeated failure modes.
- Public source exposure: no raw chat text, names, household details, health details, animal-care details, financial details, location details, relationship details, credentials, or transcript-specific chronology are reproduced here.
- GitHub source status: repository write target is private at time of authoring; this note is still written as if it may later become public.

## Claim status

- Claim type: product governance requirement.
- Claim strength: implementation-planning claim, not empirical proof.
- Evidence basis: recurring architecture pattern across MC materials: consentful persistence, mode boundaries, symbolic-state handling, source-boundary labeling, evaluation after abstraction, and publication-readiness checks.
- Not claimed: that the current implementation already enforces this automatically.

## Privacy status

- Privacy class: public-safe abstraction.
- Excluded classes: personal identity details, household/pet specifics, medical or care details, financial information, location information, relationship information, credentials, raw transcript excerpts, and private emotional-state content.
- Residual risk: low-to-moderate if combined with many other internal notes; composition review is still required before public release.
- Release condition: publish only if bundled with composition-risk review and no source-topology leakage.

## Missingness

- No exhaustive scan of all chats or full exported archive was available in this run.
- GitHub search did not surface a complete repository index of existing research notes, so duplication risk is controlled by using a distinct protocol purpose.
- No automated privacy classifier was executed; this is a human-readable protocol specification.
- No live product telemetry, user testing, or red-team result is included.

## Revision reason

Prior public-safe protocols specify ingestion, traceability, assumption expiry, mode boundaries, fixture boundaries, inference quarantine, abstraction drift, coverage, synthesis dependency, publication readiness, composition risk, demo-state separation, claim promotion, and regression monitoring. The missing layer is review evidence: a compact object that shows why a given abstraction passed review without restating the sensitive source.

## Requirement

Every public-safe artifact should have a binder section or adjacent metadata object with the following fields:

1. `artifact_id` — stable file, note, issue, PR, or release reference.
2. `source_classes_used` — broad classes only, never private file names when file names are identifying.
3. `excluded_source_classes` — categories explicitly not allowed in the public artifact.
4. `abstraction_method` — summarize, generalize, synthesize, convert to requirement, convert to evaluation, convert to research question, or discard.
5. `claim_level` — observation, hypothesis, requirement, design decision, implementation task, evaluation criterion, or verified result.
6. `privacy_class` — private, internal-only, public-safe draft, public-safe reviewed, or public release.
7. `review_basis` — what made it safe enough: redaction, generalization, source-boundary labeling, independent fixture generation, no topology reuse, or composition review.
8. `known_missingness` — what was not checked.
9. `reopen_triggers` — conditions that force another review.
10. `revision_reason` — why the artifact changed.

## Minimal binder template

```yaml
artifact_id:
source_status:
  source_classes_used: []
  source_classes_excluded: []
  repository_status:
claim_status:
  claim_level:
  claim_strength:
  not_claimed: []
privacy_status:
  privacy_class:
  excluded_private_categories: []
  residual_risk:
missingness:
  unchecked_sources: []
  unavailable_evidence: []
revision:
  reason:
  changed_from:
  changed_to:
reopen_triggers: []
```

## Evaluation criteria

A binder passes only if:

- A reviewer can identify what class of source informed the artifact without learning private contents.
- The artifact's claim level is narrower than or equal to what the source boundary supports.
- The note names at least one missingness condition.
- The note includes a reopen trigger.
- The privacy status is meaningful after composition with adjacent public artifacts.
- The revision reason explains the conceptual change, not merely the edit operation.

## Research questions

1. Can MC maintain public-safe publication velocity without weakening privacy boundaries?
2. Which artifact classes require binder metadata: research notes, demos, fixtures, UI copy, schemas, or all of them?
3. Can binder fields become CI checks in the repository?
4. What is the minimum binder needed for a public website page versus an internal architecture note?
5. How should binder review interact with user-controlled consent and deletion?

## Implementation plan

1. Add a `public_safe_binder.schema.json` file.
2. Add a markdown template under `mind/templates/public-safe-redaction-evidence-binder.md`.
3. Require binder metadata for new `mind/research` notes.
4. Add a repository script that fails review if required fields are missing.
5. Add a composition check that reviews all public-facing artifacts in one bundle before release.

## Next thing to understand

The next research target should be **public-safe consent revocation propagation**: how a system updates or withdraws already-abstracted public-safe artifacts when the private source that originally informed them is later revoked, corrected, or reclassified.
