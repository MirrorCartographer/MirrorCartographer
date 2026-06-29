# Context Lineage Ledger

## Source status
- Internal/private context: used only as architectural orientation; not quoted, reproduced, or exposed.
- File-library context: used for public-safe structural confirmation of Mirror Cartographer architecture, including symbolic cognition interface, mode separation, uncertainty boundaries, contradiction preservation, and public-safe reflection constraints.
- Public research context: used for current external alignment around memory trust boundaries, privacy-preserving memory, temporal validity, and content provenance.
- GitHub repository context: this repository is the publication target for public-safe abstractions only.

## Claim status
Research hypothesis / product architecture proposal. This is not a claim of clinical validity, diagnostic power, therapeutic efficacy, or objective symbolic truth.

## Privacy status
Public-safe. This note intentionally excludes personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details.

## Missingness
- Full raw conversation archive is not treated as available source-of-truth.
- Private UI implementation state was not required for this note.
- No user-specific examples are included.
- No empirical user study has validated this ledger yet.

## Core finding
Mirror Cartographer needs a Context Lineage Ledger: a public-safe record of how influence moved from context into an artifact.

Redaction removes protected details. Source-boundary labels name what kind of source shaped the work. Temporal-validity labels tell whether a context item is current, historical, superseded, contested, unknown-age, or retired-private. The missing layer is lineage: the ordered path by which context becomes an abstracted claim, a requirement, a scorecard, a fixture, or an implementation plan.

## Why this matters
A public artifact can be privacy-safe and still be epistemically opaque. If the artifact only says “based on prior work,” reviewers cannot tell whether the result is:

1. directly sourced,
2. inferred from several sources,
3. carried forward from older architecture,
4. revised after a contradiction,
5. compressed from private material,
6. generated as a speculative extension, or
7. currently missing evidence.

The Context Lineage Ledger solves this by tracking transformation stages without transporting protected source content.

## Ledger concept
Each public artifact should include a compact lineage record:

- `lineage_id`: stable identifier for the artifact lineage.
- `artifact_path`: repository path or intended output surface.
- `source_classes`: public, private-context, file-library, repository, web-research, synthetic-fixture, unknown.
- `admission_status`: admitted, partially admitted, excluded, retired, contested, unknown.
- `transformation_steps`: abstracted, generalized, redacted, synthesized, renamed, scored, split, retired, superseded.
- `claim_transport`: what claim crossed into public form.
- `source_non_transport`: what did not cross.
- `privacy_boundary`: safe, restricted, blocked, synthetic-only.
- `claim_boundary`: fact, inference, design principle, research question, evaluation criterion, product requirement, speculative concept.
- `missingness`: unavailable source, stale source, unverified source, incomplete implementation, absent empirical validation.
- `revision_reason`: new evidence, contradiction, privacy risk, overclaim risk, operational clarity, accessibility, scope correction.
- `release_verdict`: publish, publish-with-labels, revise-before-release, private-only, block.

## Product requirement
Before any MC artifact is published, the system should generate a lineage stub. The artifact may not be marked release-ready unless the ledger explains:

1. what source classes shaped it,
2. what claim crossed into public form,
3. what sensitive content was explicitly blocked,
4. what uncertainty remains,
5. why the current revision exists, and
6. what would require future correction.

## Evaluation question
Can a reviewer reconstruct the public-safe influence path without seeing private material?

Passing answer: yes, the reviewer can see source class, admission decision, transformation type, claim mode, privacy verdict, missingness, and revision reason.

Failing answer: no, the reviewer only sees a polished artifact and must trust that redaction happened correctly.

## Revision reason
This note extends prior MC public-safe work on source boundaries, claim transport, influence ledgers, temporal validity, redaction fidelity, and release readiness. The revision is meaningful because those layers label pieces of the crossing; this layer orders the crossing as a traceable path.

## Key phrase
Do not publish the source. Publish the path the claim survived.
