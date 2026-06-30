# Draft-to-Record Gate

## Status

Genesis artifact. Public-safe. Not promoted to Museum.

## Attractor

Contradiction.

AI-generated documentation can reduce administrative load and preserve attention for human relational work, yet the same tool can harden hallucinated, misattributed, or over-interpreted language into official records. The contradiction is not whether AI documentation is useful. The contradiction is that documentation support becomes dangerous when a draft silently crosses into record authority.

## Core primitive

A **Draft-to-Record Gate** is the boundary between an AI-assisted note, summary, transcript, synthesis, or care narrative and any official record used for decisions, services, eligibility, assessment, discipline, billing, legal review, or clinical/social-care continuity.

The gate requires explicit verification before the draft becomes a record.

## Invariant

**A draft has no record authority until a responsible human verifies source fidelity, missingness, interpretation boundaries, and action consequences.**

## Required gate fields

- **Source capture:** where the source material came from.
- **Speaker attribution:** who said what, and what is uncertain.
- **Verbatim versus interpretation:** what is transcript-like versus synthesized judgment.
- **Inserted content check:** whether the AI added language not present in the source.
- **Risk phrase check:** whether high-impact terms were introduced, such as suicidal ideation, neglect, abuse, diagnosis, refusal, consent, capacity, danger, or noncompliance.
- **Human verifier:** the accountable person who checked the draft.
- **Verification method:** skim, line-by-line, source comparison, second review, or expert review.
- **Action ceiling:** what the record may and may not be used for.
- **Revision path:** how a correction is requested, logged, and propagated.
- **Privacy boundary:** whether the artifact contains personal, clinical, legal, child, family, or protected information.

## State transition

Draft -> Review Candidate -> Verified Record -> Action-Bounded Record -> Revised Record -> Retired Record

A document cannot skip the review candidate state if it came from AI-generated text.

## Failure mode addressed

The artifact addresses official-record contamination: a generated phrase, hallucinated detail, or distorted summary becoming part of institutional memory and later being treated as factual because it appears in a record.

## Relationship to existing GitHub Mind primitives

- **Handoff Integrity:** the governance state must travel with the document.
- **Claim Portability Test:** a record must be rechecked when moved into a new context.
- **Context Lease:** record authority expires or narrows when context changes.
- **Sequence Risk Ledger:** small documentation steps can compose into consequential action.
- **Authority/Capability Separation:** AI may have drafting capability without record authority.
- **Control Placement Matrix:** the gate sits across design, runtime, and assurance layers.

## Practical lane 1: income

Mirror Cartographer can package this as a public-safe service:

**AI Documentation Risk Review**

Deliverables:

- Draft-to-Record Gate template.
- Record contamination risk map.
- High-impact phrase checklist.
- Verification workflow.
- Revision and correction protocol.
- Staff-facing plain-language guidance.

Target users:

- solo clinicians,
- therapists,
- care coordinators,
- social-care teams,
- small nonprofits,
- veterinary clinics,
- AI documentation startups needing clearer audit language.

## Practical lane 2: medical and social-care support

Evidence-supported use is not diagnosis or automated intervention. The safe support lane is structured continuity documentation with a clear boundary between observations, quotes, interpretations, and verified record text.

The highest-value intervention is reducing record distortion: preserving source fidelity, making uncertainty visible, and creating a correction path before a draft influences decisions.

## Labels

- **Source:** Public research and reporting on agentic AI governance, healthcare agent lifecycle controls, runtime guardrails, medical AI ethics, and social-care AI documentation errors.
- **Claim:** AI-assisted documentation needs an explicit gate before generated text becomes official record evidence.
- **Privacy:** Public-safe; contains no private user, patient, client, or animal-specific details.
- **Missingness:** Needs field testing with real documentation workflows and role-specific legal review.
- **Revision:** Initial Genesis proposal.
- **Confidence:** High for the need for a gate; medium for the exact field list.
- **Evidence maturity:** Moderate.
- **Authority:** Documentation architecture only; not clinical, legal, or social-work advice.
- **Validation status:** Unvalidated repository primitive.
- **Decision reversal threshold:** Revise if evidence shows existing documentation workflows already reliably prevent AI-generated record contamination without a distinct gate.

## Sources

- Guardian, 2026-02-11, social-work AI transcription and summarization errors in official care records: https://www.theguardian.com/education/2026/feb/11/ai-tools-potentially-harmful-errors-social-work
- Prakash, Lind, and Sisodia, 2026-01-22, Agentic AI Governance and Lifecycle Management in Healthcare: https://arxiv.org/abs/2601.15630
- Koch, 2026-04-06, From Governance Norms to Enforceable Controls: https://arxiv.org/abs/2604.05229
- Bisson et al., 2026-03-14, Six Interventions for Responsible and Ethical Implementation of Medical AI Agents: https://arxiv.org/abs/2603.13743
- Khan, Joyce, and Habiba, 2025-12-02, AGENTSAFE framework: https://arxiv.org/abs/2512.03180
