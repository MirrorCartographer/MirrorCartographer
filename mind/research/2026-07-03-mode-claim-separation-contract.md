# Mode-Claim Separation Contract

Date: 2026-07-03
Status: Public-safe research note
Privacy class: Abstracted method / product requirement

## Core finding

Mirror Cartographer needs a **Mode-Claim Separation Contract**: every reflection mode must declare what kind of output it is allowed to produce before the system lets that output become durable memory, user-facing advice, public artifact, or implementation requirement.

Operating line:

> A mode may shape the language of a reflection, but it must not silently upgrade the truth-status of the claim.

## Source status

- Private chat / saved-context material: used only as architectural substrate for identifying recurring design pressure around symbolic, reflective, canonical, and mythopoetic outputs.
- File-library material: used only at the level of public-safe architecture summaries and implementation-pack concepts.
- GitHub material: current write target and durable public-safe mind layer.
- External web research: not required for this increment; this note is a system-design derivation, not a current-events or third-party factual claim.

## Claim status

- Confirmed project requirement: MC already distinguishes different reflection modes and requires uncertainty boundaries.
- Derived architecture claim: the mode choice alone is insufficient; the system also needs an explicit claim-permission layer.
- Not claimed: this does not prove clinical, therapeutic, predictive, diagnostic, or scientific effectiveness.
- Not claimed: this does not validate any private autobiographical, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail.

## Privacy status

Public-safe. This note contains no raw transcript excerpts, personal details, household facts, health details, animal-care facts, financial data, location details, relationship details, credentials, private names, or private identifiers.

The private source material may explain why the requirement matters, but the public method must stand without that private material.

## Missingness

- Missing formal schema for `mode` versus `claim_type` versus `allowed_route`.
- Missing automated tests that reject outputs whose mode and claim permission conflict.
- Missing UI copy that explains mode boundaries to a user without jargon.
- Missing examples built from synthetic public data rather than private transcripts.
- Missing reviewer checklist for determining when poetic or symbolic language has accidentally become advice, evidence, or implied fact.

## Meaningful revision reason

Recent research notes have focused heavily on privacy boundaries, provenance, missingness, and evidence routing. The next missing layer is the translation boundary between **tone/mode** and **truth-status**. Without this contract, a mythopoetic reflection can sound like a finding, a reflective pattern can sound like evidence, or a canonical summary can accidentally inherit unsupported personal certainty.

## Product requirement

Each generated MC output must carry a separate metadata tuple:

1. `mode`: canonical, reflective, mythopoetic, operational, evaluative, or mixed.
2. `claim_type`: observation, interpretation, hypothesis, suggestion, question, product requirement, research question, evaluation result, or public note.
3. `evidence_tier`: source-backed, user-confirmed, recurrence-based, synthetic-example, speculative, unknown, or not-applicable.
4. `allowed_route`: private reflection, memory candidate, public artifact, implementation plan, external verification handoff, or blocked.
5. `downgrade_required`: true when language intensity exceeds evidence permission.

## Evaluation criteria

A mode-claim boundary passes when:

- The same symbolic input can be rendered in multiple modes without changing its evidence tier.
- A mythopoetic output cannot be stored as factual memory unless separately confirmed.
- A reflective output cannot become advice without an explicit route and evidence check.
- A canonical output cannot cite vague tradition as if it were personal truth.
- A product requirement can be traced to a boundary class without exposing the private source.
- A public artifact can be audited for mode, claim type, evidence tier, and allowed route.

## Implementation plan

1. Add a `mode_claim_contract` object to the reflection engine output schema.
2. Insert a post-generation lint step that compares language intensity against claim permission.
3. Add refusal/downgrade transforms for outputs that overclaim.
4. Build a synthetic test suite with examples for each mode and claim type.
5. Require public notes to include source status, claim status, privacy status, missingness, and revision reason.
6. Add UI labels that make the distinction legible: "story-language," "pattern-language," "source-language," and "action-language."

## Research questions

- How can symbolic reflection stay emotionally vivid without implying hidden certainty?
- What UI language helps users understand mode boundaries without flattening the experience?
- Can a claim router detect when metaphor is being used as evidence?
- What should trigger a downgrade from advice to question?
- How should MC preserve resonance feedback without converting resonance into proof?

## Public-safe index tags

- reflection-mode-governance
- claim-permission
- symbolic-safety
- output-routing
- evidence-tiering
- privacy-preserving-architecture
- public-safe-method

## Durable rule

A reflection mode is a language frame, not an evidence upgrade.
