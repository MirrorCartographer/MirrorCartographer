# Revision Reason Ledger

Status: public-safe abstract research note
Source status: repository README, file-library architecture summaries, fresh public AI-memory/security research
Claim status: design hypothesis; not an empirical product-performance claim
Privacy status: sanitized; no raw transcripts, personal records, household details, health details, animal-care details, financial details, location details, relationship details, credentials, secrets, or private identifiers
Missingness: no full raw archive audit; no complete repository tree audit; no production telemetry; no external reviewer study
Revision reason: added because prior boundary artifacts label source/claim/privacy status, but public readers still need to know why a public artifact changed, what private material was excluded, and whether a change reflects evidence, scope correction, safety correction, product iteration, or language cleanup

## Finding

Mirror Cartographer needs a revision layer that treats every public update as a claim-bearing event.

A public-safe artifact can be private-safe and still be misleading if the reader cannot tell why it changed. Redaction answers what was removed. A revision reason answers why the remaining structure moved.

Core sentence:

**Do not only show the new artifact. Show why the artifact was allowed to change.**

## Architecture role

The Revision Reason Ledger sits between private-context synthesis and public publication.

It does not store private source content. It stores the public-safe reason a change occurred.

Allowed public revision reasons:

- Evidence correction: a public source, repo file, test result, or official document changed the claim boundary.
- Scope correction: a claim was too broad for its proof lane and was narrowed.
- Privacy correction: an artifact was revised because it exposed or implied protected private context.
- Safety correction: an artifact risked diagnostic, therapeutic, oracle, authority, or coercive overreach.
- Product correction: a requirement changed after interface, accessibility, consent, or evaluation review.
- Terminology correction: public-facing language was changed to reduce overclaim, mystification, or category collapse.
- Missingness correction: the artifact now states what is unknown, unavailable, unverified, stale, or incomplete.
- Supersession: a newer artifact replaces an older one while preserving the older artifact's historical status.

Blocked public revision reasons:

- Private emotional intensity as standalone proof.
- Raw transcript recurrence as standalone proof.
- Household, medical, animal-care, relationship, financial, location, credential, or identity details.
- Secret, token, key, account, or connector-specific operational details.
- Any private source phrase that would make a person, animal, home, account, or event identifiable.

## Source-boundary interpretation

Private-context material may influence architecture only as abstract pressure. It may say: this system needs a consent layer, a proof lane, an accessibility requirement, a correction loop, or an overreach detector.

It may not say, in public: here is the private episode, person, animal, diagnosis, bill, location, relationship, transcript line, or account detail that caused the rule.

The public ledger therefore records:

- source_status: private-derived architecture pressure, public repo file, public research, product test, user-facing requirement, or missing source
- claim_status: design hypothesis, implementation requirement, evaluation criterion, research question, measured result, or blocked claim
- privacy_status: public-safe, abstracted from private context, needs redaction review, blocked from publication, or publishable only as synthetic fixture
- missingness_status: complete for current scope, incomplete archive, no telemetry, no external evaluation, no current implementation, stale source, or unknown
- revision_reason: one of the allowed public reason classes above

## Product requirement

Every public-facing MC artifact should contain a short revision metadata block when it is newly created or materially updated.

Minimum fields:

1. artifact_id
2. artifact_type
3. created_or_revised_date
4. source_status
5. claim_status
6. privacy_status
7. missingness_status
8. revision_reason
9. supersedes_or_depends_on
10. blocked_from_publication_notes

## Evaluation questions

- Can a reviewer understand why the artifact exists without seeing private context?
- Does the revision reason explain movement without exposing the source path?
- Is the claim lane narrower than or equal to the proof lane?
- Are missing sources named as missing instead of silently implied?
- Does the artifact avoid turning repetition, resonance, or emotional salience into evidence?
- Does the revision preserve the difference between private-derived design pressure and public proof?

## Research alignment

Current AI-memory and RAG research supports this as a trust-boundary issue. Persistent agent memory can be poisoned across sessions, retrieved out of context, or made privacy-leaky through seemingly relevant material. Privacy-preserving RAG work also supports semantic rewriting as a way to preserve useful structure while removing sensitive identifiers.

For Mirror Cartographer, the equivalent design move is not merely redaction. It is revision custody: the public artifact must disclose the type of reason for change while preventing private source reconstruction.

## Implementation plan

1. Add a schema for revision reason records.
2. Add a scorecard that tests whether revised artifacts expose private source paths or overclaim public proof.
3. Add synthetic fixtures showing safe and unsafe revisions.
4. Add a force/attractor note so future MC mind runs can route repeated findings into revision custody rather than generating duplicate boundary language.

## Public-safe summary

Mirror Cartographer should treat revision as evidence-bearing. A changed public artifact needs custody: what changed, why it changed, what source class justified the movement, what remains missing, and what private material must not be reconstructed from the public result.
