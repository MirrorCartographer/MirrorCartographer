# Public-Safe Memory Ingestion Protocol

Date: 2026-07-04
Status: research finding
Repository area: mind/research

## Core finding

Mirror Cartographer needs a **Public-Safe Memory Ingestion Protocol**: a rule system for deciding when private-context learning may influence architecture without becoming public memory, public evidence, examples, fixtures, interface labels, or product claims.

Operating line:

> A system may learn from private context, but it must not remember private context publicly unless the memory has been transformed into a boundary-safe abstraction with visible source, claim, privacy, and missingness labels.

## Source status

- Source class: available chat context, saved assistant context, prior MC GitHub research pattern, and repository-local public-safe research sequence.
- Source use: architectural interpretation only.
- Source exclusion: no raw transcripts, personal details, household details, health details, animal-care details, financial details, location details, relationship details, credentials, private identifiers, or sensitive biographical examples are included.
- Repository status: written as a public-safe method note inside a private repository; suitable for later publication only after repo-wide public-release review.

## Claim status

- Claim type: product architecture requirement.
- Claim strength: design hypothesis, not empirical proof.
- Evidence basis: repeated need for MC artifacts to preserve conceptual learning while preventing private rehydration, accidental implication, or identity-bearing examples.
- Current maturity: requirements-level specification.
- Not claimed: that this protocol is complete, legally sufficient, security audited, or safe for automated publication without human review.

## Privacy status

- Privacy classification: public-safe abstraction.
- Private-context dependency: yes, but only as architectural signal.
- Publication risk: low if kept abstract; medium if paired later with examples derived from private context.
- Required guardrail: any implementation must use synthetic examples first and must reject private-derived fixtures unless explicitly cleared through a separate release gate.

## Missingness

- Missing implementation schema for memory objects.
- Missing automated detector for identity-bearing or private-source leakage.
- Missing fixture suite for safe versus unsafe memory promotion.
- Missing release checklist integration with existing public-safe claim gates.
- Missing distinction between human-readable memory, model-facing memory, interface memory, and repository memory.

## Protocol requirement

Every candidate memory derived from private or mixed-source material should be processed through six gates before it enters public-facing MC artifacts.

### 1. Source boundary gate

Record where the memory came from without exposing the source contents.

Allowed labels:

- `private_context_architecture_signal`
- `public_repository_material`
- `synthetic_fixture`
- `external_public_source`
- `mixed_source_requires_review`

Rule: mixed-source memory defaults to non-public until manually decomposed.

### 2. Transformation gate

State what changed during abstraction.

Required fields:

- `removed_details`
- `retained_function`
- `generalized_requirement`
- `revision_reason`

Safe pattern:

- Private signal: removed.
- Functional role: preserved.
- Product implication: generalized.
- Evidence claim: demoted if needed.

### 3. Claim demotion gate

Prevent private familiarity from becoming public certainty.

Default demotions:

- “This proves” -> “This suggests a design requirement.”
- “Users need” -> “Some workflows may require.”
- “The system knows” -> “The system records a labeled inference.”
- “This happened” -> “This pattern is represented abstractly.”

### 4. Example safety gate

No public memory should include examples whose meaning depends on private biography, private relationships, private health, private household context, raw chat sequences, or identifiable history.

Allowed example classes:

- invented synthetic users
- neutral task scenarios
- non-sensitive interface states
- abstract data records
- generic product workflows

### 5. Rehydration gate

A public memory object must not contain hooks that allow later reconstruction of private source material.

Reject if it includes:

- unique phrases from private context
- precise timelines linked to private events
- uncommon combinations of traits
- literal symbols that function as identity anchors
- private project nicknames not already cleared for public use
- examples that point back to a specific household, animal, health, financial, or relationship context

### 6. Placement gate

Decide where the memory is allowed to live.

Allowed placements:

- `private_internal_context_only`
- `private_repository_research_note`
- `public_safe_method_note`
- `implementation_requirement`
- `synthetic_test_fixture`
- `public_release_candidate`

Default placement for mixed-source findings: `private_repository_research_note`.

## Proposed memory object schema

```yaml
memory_id: public_safe_memory_ingestion_protocol
source_status:
  class: private_context_architecture_signal
  source_contents_exposed: false
claim_status:
  type: product_architecture_requirement
  strength: design_hypothesis
privacy_status:
  classification: public_safe_abstraction
  private_context_dependency: architecture_only
missingness:
  implementation_schema: missing
  automated_leakage_detector: missing
  synthetic_fixture_suite: missing
revision:
  reason: prevent private-derived learning from becoming public memory without visible gates
allowed_placements:
  - private_repository_research_note
  - public_safe_method_note_after_review
blocked_placements:
  - raw_public_example
  - identity_bearing_fixture
  - evidence_claim_without_source_boundary
```

## Evaluation criteria

A memory ingestion process passes only if:

1. A reviewer can tell what kind of source influenced the memory without seeing private contents.
2. The retained idea is functional, not biographical.
3. The claim is appropriately demoted when evidence is private or mixed.
4. The public artifact cannot reconstruct the private source by implication.
5. All examples are synthetic or independently public.
6. Missingness is explicit enough to guide the next implementation step.

## Product implications

MC should treat memory as a typed artifact, not a vague retained impression.

Required product components:

- memory source labels
- public-safe abstraction workflow
- memory promotion states
- claim demotion rules
- synthetic-only fixture generation
- rehydration-risk checks
- release placement labels
- revision reason log

## Research questions

1. What is the smallest useful memory object that preserves architecture without preserving private identity?
2. Can MC generate synthetic fixtures that preserve relational structure while removing all source-derived identity anchors?
3. Should memory promotion require a human review step, an automated leak check, or both?
4. How should the UI show that a public feature was inspired by private architecture signals without implying public evidence?
5. What kinds of symbolic or narrative language are most likely to rehydrate private context accidentally?

## Implementation plan

Phase 1: Define memory labels and promotion states.

Phase 2: Add a memory-ingestion checklist to research artifact templates.

Phase 3: Build a synthetic fixture generator for abstracted examples.

Phase 4: Add regression tests for rehydration risk.

Phase 5: Integrate memory status into public release review.

## Meaningful revision reason

Prior MC research artifacts established public-safe claims, redaction gates, maturity ladders, evidence compilers, and source rehydration gates. This note adds the missing ingestion layer: the point where private-context learning first becomes a durable memory candidate. Without this layer, later gates can reject unsafe output, but the system may still accumulate unsafe internal memory forms before publication review.

## Public-safe summary

MC should remember architecture, not private biography. Every memory that originates from private or mixed-source material needs a visible transformation path before it can influence public artifacts.