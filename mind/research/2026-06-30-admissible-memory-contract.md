# Admissible Memory Contract

Date: 2026-06-30
Status: public-safe architecture note
Privacy status: abstracted; no raw transcript, household, health, animal-care, financial, relationship, credential, or location detail included
Revision reason: previous mind runs established many boundary gates; this note consolidates the memory-specific rule that a retrieved source must pass admission before it can influence interpretation.

## Core finding

A remembered signal is not automatically usable. It must become admissible.

Mirror Cartographer should treat memory as a permissioned evidence object, not as a background vibe. Relevance may retrieve a source, but admission decides whether the source may shape a reflection, product requirement, evaluation claim, or public artifact.

## Source status

- Repository source: public GitHub README, direct repository fetch.
- File Library source: private/user-provided MC continuity and architecture files, used only for architecture understanding and abstracted into public-safe product requirements.
- Saved context source: conversation-level memory, used only to recognize recurring architectural motifs; not quoted or exposed.
- Public research source: fresh external AI-memory/RAG research, used to ground the memory-admission frame.

## Claim status

Supported public claims:

1. MC already presents itself as a bounded symbolic reflection interface with source status, claim status, evidence boundary, overreach check, update hook, and user feedback loop.
2. MC should distinguish retrieval relevance from admissibility.
3. MC should preserve private context as architecture input while preventing private source leakage into public artifacts.
4. MC needs a structured memory contract for any persistent archive, echo tracker, symbolic memory viewer, or exportable session archive.

Not established:

1. That any current demo fully enforces the contract in code.
2. That persistent archives are production-ready.
3. That memory admission alone prevents all overreach, privacy leakage, or false certainty.
4. That symbolic recurrence proves causality, diagnosis, or objective truth.

## Privacy status

Public-safe:

- Method names
- Boundary categories
- Evaluation criteria
- Product requirements
- Abstract source classes
- Missingness statements
- Failure modes

Not public-safe:

- Raw chat transcripts
- Identifying private examples
- Household details
- Medical, animal-care, financial, relationship, credential, or location specifics
- Private repository content unless already intentionally public
- Unredacted personal memory contents

## Missingness

The current research pass did not verify runtime code paths for memory admission. The claim is architectural, not an implementation guarantee. A future pass should inspect the demo code for whether source status, claim status, evidence boundary, update hook, and feedback loop are enforced as structured data rather than cosmetic copy.

## Contract rule

Every retrieved memory-like object must carry:

- source_status: public_repo | private_file | saved_context | user_current_input | external_research | generated_summary | unknown
- privacy_status: public_safe | private_context_only | restricted | unknown
- claim_status: evidence | hypothesis | metaphor | design_requirement | implementation_plan | evaluation_criterion | unknown
- temporal_status: current | possibly_stale | superseded | undated | unknown
- admission_decision: admit | admit_with_boundary | summarize_only | reject | quarantine
- revision_reason: why the item was admitted, downgraded, rejected, or superseded
- missingness: what is unavailable or unverified

## Evaluation questions

1. Does the system separate semantic similarity from task-conditioned admissibility?
2. Does it prevent private context from becoming public proof?
3. Does it downgrade stale or superseded information?
4. Does it mark unknown source status instead of inventing certainty?
5. Does it preserve user correction as a revision event without exposing private correction content?
6. Does it prevent memory from causing cross-lane contamination between symbolic, medical, legal, financial, product, and public-claim lanes?

## Implementation plan

1. Add an admissible-memory schema.
2. Wrap all memory/echo retrieval in an admission layer.
3. Require product outputs to cite source class and claim lane.
4. Require public exports to pass a privacy filter before publication.
5. Store revision reasons when interpretations are corrected, downgraded, or superseded.
6. Add tests where a relevant memory is rejected because it is private, stale, unsupported, or claim-lane incompatible.

## Attractor phrase

Relevance opens the archive. Admission decides whether the archive may speak.
