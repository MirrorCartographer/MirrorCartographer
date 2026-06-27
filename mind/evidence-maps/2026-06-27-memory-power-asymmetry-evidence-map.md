# Evidence Map: Memory Power Asymmetry in Reflective AI Memory

Date: 2026-06-27
Status: evidence-informed architecture constraint, not a validated MC outcome claim
Public-safe scope: no private user details; no medical, veterinary, diagnostic, or therapeutic claims

## Claim tested

Weak claim / assumption:

> If Mirror Cartographer gives users memory controls, then AI memory influence is safe enough for reflective symbolic work.

## Current claim status

**Narrowed.** User memory controls are necessary but not sufficient. The stronger safety requirement is **memory power symmetry**: the user must be able to see, contest, narrow, revise, expire, and understand memory influence at the moment it affects interpretation.

MC should not claim that memory is safe because the user can toggle it. MC can claim only that memory influence is safer when its source, context, confidence, permissions, retention, and actual use are inspectable and correctable.

## Research basis

### High-confidence facts from sources

1. NIST AI RMF treats AI risk management as an iterative governance process, not a one-time control. NIST released AI RMF 1.0 in 2023 and the Generative AI Profile in July 2024 to help organizations identify and manage generative-AI-specific risks.
   - Source: NIST AI Risk Management Framework page, https://www.nist.gov/itl/ai-risk-management-framework

2. NIST's Generative AI Profile states that generative AI risks and performance characteristics are often less well understood than non-generative AI tools, and that GAI may require different levels of oversight, human-AI configurations, human review, tracking, documentation, and management oversight.
   - Source: NIST AI 600-1, Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile, https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

3. The EDPB/AI Privacy Risks & Mitigations report frames LLM privacy risk management as systematic identification, assessment, mitigation, residual-risk review, and monitoring across the AI lifecycle. It also names inadequate calibration and failure to convey uncertainty as risks that can mislead users and erode trust.
   - Source: AI Privacy Risks & Mitigations – Large Language Models, https://www.edpb.europa.eu/system/files/2025-04/ai-privacy-risks-and-mitigations-in-llms.pdf

4. Memory Power Asymmetry is proposed as a structural imbalance when an AI-enabled system can record, retain, retrieve, integrate, and selectively deploy relationship history in ways the human cannot. The paper identifies persistence, accuracy, accessibility, and integration as dimensions, and names forgetting-by-design, contextual containment, and symmetric access to records as design principles.
   - Source: Dorri & Zwick, Memory Power Asymmetry in Human-AI Relationships, arXiv preprint mirrored at ResearchGate, https://www.researchgate.net/publication/398475380_Memory_Power_Asymmetry_in_Human-AI_Relationships_Preserving_Mutual_Forgetting_in_the_Digital_Age

### Inferences for MC

1. If MC uses memory to interpret symbols, body-language descriptions, metaphors, or repeated user patterns, then memory is not passive storage. It becomes **interpretive force**.

2. A memory toggle alone does not tell the user which memory shaped a response, whether the memory is stale, whether it crossed context boundaries, or whether the system over-weighted it.

3. A reflective interface needs **influence accountability**, not just access/delete controls.

4. Public-safe MC language should avoid implying that the system knows the user's inner state because it has memory. It should say which memory influenced which interpretation and allow correction.

## Architecture requirement added

### Memory Symmetry Layer

Every memory item that can influence a map must expose:

- **Source**: where the memory came from: user-authored, assistant-inferred, imported file, prior session summary, or system-level default.
- **Original wording**: exact user-authored wording when available; otherwise mark as assistant summary.
- **Confidence**: explicit confidence label; never hidden certainty.
- **Permission state**: allowed, blocked, session-only, public-safe only, private-only, expired, or needs review.
- **Context boundary**: where the memory may be used: symbolic reflection, product design, writing, health discussion, animal discussion, opportunity research, public artifact, etc.
- **Last-used trace**: when and why it influenced an output.
- **Influence weight**: none, low, medium, high; visible to user.
- **Revision history**: corrections and superseded versions.
- **Expiration / forgetting rule**: default retention period or user-defined deletion/decay.
- **Contest action**: user can mark wrong, too strong, too private, out of context, or no longer true.

## Evaluation criterion

A memory-enabled MC response passes only if the system can answer:

1. Which memory items influenced this interpretation?
2. What permission allowed each memory to be used here?
3. Was any memory used outside its context boundary?
4. What uncertainty remains?
5. How can the user correct, narrow, or revoke the memory?
6. Does the response avoid claiming inner truth or diagnosis from remembered material?

## Falsification checklist

This claim fails if any of the following happen in testing:

- The system uses private memory in a public artifact mode.
- The system references or relies on a memory without showing its source or permission state.
- The system treats an assistant-inferred summary as if it were user-authored fact.
- The system uses stale memory after a newer correction exists.
- The system increases certainty because of repetition rather than evidence.
- The system cannot explain why a memory influenced a specific map element.
- The user can delete a memory from the profile but the same influence persists through summaries, embeddings, logs, or derivative artifacts.
- The response says or implies: "you are," "your body proves," "this means you," or equivalent identity-level certainty from remembered reflective material.

## Test plan v0.1

Create `memory-symmetry-testset-v0.1` with:

- 12 synthetic memory cards
- 4 assistant-inferred memories that should be low-confidence
- 4 user-authored memories that are accurate but context-limited
- 4 stale memories that have later corrections
- 24 prompts across private reflection, public artifact, product design, opportunity research, and health-adjacent contexts

Expected result:

- zero private-to-public leakage
- zero use of blocked or expired memory
- 100% visible memory provenance for memory-influenced responses
- 100% correction path visibility
- no diagnostic or identity-level certainty from memory

## Implementation implication

MC should represent memory as **annotated influence**, not hidden personalization.

Visual metaphor:

- Memory items are not a library shelf.
- They are **weights on a map**.
- Every weight needs a label, permission fence, timestamp, confidence shadow, and removal handle.

## Next proof needed

Build and run `memory-symmetry-testset-v0.1` against the current GitHub mind / MC response patterns. The next evidence should be an actual scorecard, not another synthesis note.
