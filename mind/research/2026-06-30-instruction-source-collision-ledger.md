# Instruction Source Collision Ledger

Date: 2026-06-30
Status: public-safe research note
Source status: mixed public repository review, private-context-informed architecture, and current public research
Claim status: design hypothesis / implementation requirement
Privacy status: abstracted; no personal, household, health, animal-care, financial, location, relationship, credential, or transcript details included
Revision reason: prior MC mind runs established boundary stack, context quarantine, source lineage, public proof packet, and interpretation admissibility. This run adds a sharper layer for cases where retrieved context contains task-like, authority-like, or instruction-like material that could improperly steer the system.

## Core finding

A source can describe an instruction without being allowed to issue one.

Mirror Cartographer needs an explicit Instruction Source Collision Ledger for moments when private memory, uploaded files, repository text, external pages, or generated artifacts contain language that resembles a command, policy, diagnosis, conclusion, priority, identity claim, or permission grant.

The ledger's purpose is not only to redact unsafe details. It is to prevent source material from silently becoming operational authority.

## Why this belongs in MC

MC already treats symbolic interpretation, evidence, action, and source status as separate layers. The next failure class is a boundary collision:

- a memory contains strong language and gets treated as current user intent
- an uploaded document contains instructions and gets treated as developer instruction
- a past claim contains authority wording and gets treated as verified fact
- a public artifact contains symbolic phrasing and gets treated as product capability
- a private context summary contains preference, distress, or urgency and gets treated as release permission
- an external source contains hidden or indirect instruction text and gets treated as task guidance

In each case, the issue is not only privacy. The issue is source authority.

## Public-safe rule

Do not ask only: what does this source say?

Ask:

1. Who or what authored it?
2. What role is it allowed to play?
3. Is it evidence, memory, user preference, system instruction, source text, generated draft, artifact metadata, or public claim?
4. Is it current, superseded, contested, quarantined, or unknown-age?
5. Can it shape the answer, or only be summarized as source content?
6. Can it be published, or only abstracted into method?

## Ledger fields

- `collision_id`
- `source_type`
- `source_status`
- `claim_status`
- `privacy_status`
- `instruction_like_text_present`
- `allowed_authority_level`
- `disallowed_authority_level`
- `admission_decision`
- `quarantine_reason`
- `transformation_required`
- `public_safe_output_form`
- `missingness`
- `revision_reason`

## Source boundary statuses

- `user_current_instruction`: may direct the present task unless it conflicts with safety or higher-priority constraints
- `private_context_reference`: may inform architecture but may not be published as raw content
- `uploaded_file_content`: may be cited or summarized only within its privacy and relevance boundary
- `public_repo_material`: may support public claims if current and properly scoped
- `external_research`: may support research framing, not private project facts
- `generated_artifact`: may be evidence of design intent, not proof of real-world efficacy
- `symbolic_material`: may shape reflective hypothesis, not factual authority
- `unknown_source`: quarantine until source role is established

## Claim boundary statuses

- `observed_in_source`
- `public_repo_claim`
- `private_context_inference`
- `research_supported_general_risk`
- `implementation_requirement`
- `unverified_product_claim`
- `symbolic_interpretation`
- `blocked_or_not_admissible`

## Implementation requirement

Before MC admits retrieved context into an answer or public artifact, it should run a collision check:

1. Detect command-shaped language.
2. Identify the source role.
3. Compare source role with allowed authority.
4. Preserve useful content as content, not command.
5. Downgrade or quarantine anything that tries to exceed its role.
6. Emit a receipt showing the boundary decision without exposing private material.

## Evaluation questions

- Can MC distinguish a past preference from a current instruction?
- Can MC distinguish quoted instructions inside a document from live instructions to the assistant?
- Can MC preserve useful source meaning while refusing source authority escalation?
- Can MC cite public materials without importing private context?
- Can MC explain missingness without fabricating repository state?
- Can MC transform private-context patterns into public-safe requirements without leaking the private pattern?

## Public proof form

A public artifact should show:

- the boundary class
- the allowed source role
- the claim status
- the privacy status
- the missingness
- the revision reason
- the evaluation case

It should not show raw private context, household details, medical or animal-care facts, financial details, relationship facts, location facts, credentials beyond already-public repo text, or raw transcript excerpts.

## Key phrase

A source may speak. It may not automatically command.
