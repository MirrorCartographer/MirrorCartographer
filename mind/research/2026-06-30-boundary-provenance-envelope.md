# Boundary Provenance Envelope

## One-line finding
A reflective AI system should not export a pattern until it can show the boundary envelope that made the pattern safe to carry.

## Source status
- Public repo source: README in `MirrorCartographer/MirrorCartographer`, current public proof language.
- File-library source: public-safe architecture fragments only; private context was used only to infer boundary requirements, not to publish content.
- Web source: recent AI-memory and RAG security research about provenance, memory poisoning, temporal validity, and memory governance.

## Claim status
- Supported: Mirror Cartographer already frames itself as bounded symbolic reflection, not diagnosis, oracle, objective truth, or source database.
- Supported: The current demo/product language already includes source status, claim status, evidence boundary, update hook, and user feedback loop.
- Supported as design inference: these labels should become a single export wrapper attached to every reflection, index row, evaluation case, and public artifact.
- Not claimed: that MC can verify external truth, diagnose users, infer hidden facts, or safely publish raw private transcripts.

## Privacy status
Public-safe. This note contains no raw transcript material, personal facts, household facts, health/animal-care/financial/location/relationship details, credentials, or private examples.

## Missingness
- No full raw archive was inspected in this run.
- GitHub code search is not indexed for the visible repos, so repository inspection relied on known public files and direct fetches.
- No production telemetry, user-study data, or reviewer-tested evidence was available.

## Revision reason
Previous mind runs separately described claim routing, index admissibility, source survivability, citation load, and interpretive quarantine. This revision compresses those into an implementation object: the Boundary Provenance Envelope.

## Method
The envelope is a metadata wrapper that travels with any MC reflection, evaluation record, index entry, or public proof artifact. It prevents the system from treating a meaningful pattern as publishable evidence without a visible permission/proof boundary.

## Required envelope fields
1. `source_status`: public repo, private-context-derived, user-provided-current-session, generated, external source, unknown.
2. `claim_status`: symbolic, reflective hypothesis, product requirement, implementation fact, evaluation result, external factual claim, unsupported.
3. `privacy_status`: public-safe, abstracted-private, private-do-not-export, sensitive-domain-adjacent, redacted.
4. `evidence_boundary`: what the source can and cannot prove.
5. `domain_boundary`: meaning, product, safety, health-adjacent, legal/financial-adjacent, implementation, research.
6. `admission_decision`: admit, admit-with-warning, quarantine, refuse-export, request-more-proof.
7. `revision_reason`: why this version exists or supersedes a prior version.
8. `missingness`: what is absent, stale, inferred, unverified, or inaccessible.
9. `next_verification_step`: test, cite, inspect repo, run fixture, user review, external expert review, or keep private.

## Product requirement
Every public MC output should be exportable only after passing the envelope check. The check should be displayed in plain language, not hidden as backend-only metadata.

## Evaluation criterion
A passing output must keep the emotional/symbolic value of the reflection while refusing to let it prove more than its source can carry.

## Research question
Can visible boundary metadata reduce over-trust in long-context reflective AI while preserving the feeling of continuity and usefulness?

## Public index rule
Do not index private content. Index only the permission structure, proof lane, claim lane, and next verification action.

## Key phrase
The pattern is not the artifact. The envelope is what decides whether the pattern may travel.
