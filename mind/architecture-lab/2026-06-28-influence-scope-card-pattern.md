# Influence Scope Card Pattern

Date: 2026-06-28
Status: Architecture note / prototype requirement
Scope: public-safe Mirror Cartographer architecture

## Architecture question

Can MC make an interpretation's allowed influence understandable without turning reflective work into paperwork?

This follows from the prior Risk-Bounded Interpretation pattern. The weak point is usability: a precise control surface may protect agency, but if it is too heavy, users may ignore it, rubber-stamp it, or avoid the reflective flow entirely.

## Short answer

MC should not expose a full governance form by default. It should expose a small **Influence Scope Card** attached to each interpretation, with deeper inspection available only when needed.

The card treats an interpretation as something that may influence later reasoning only inside a declared scope.

## Evidence basis

### 1. Persistent memory creates contextual leakage risk

CIMemories evaluates whether LLMs control information flow from persistent memory according to task context. The reported result is important for MC: memory failures are not only about storing the wrong thing; they are about using a stored thing in the wrong context. The paper reports attribute-level leakage/violation risks and instability across repeated runs, which suggests prompt-only privacy instructions are not a sufficient design control.

Source: https://arxiv.org/abs/2511.14937

### 2. Contextual integrity provides a useful privacy grammar

Contextual integrity frames privacy as appropriate information flow, not mere secrecy or user possession of data. Its five parameters are useful for MC influence scope design:

- data subject
- sender
- recipient
- information type
- transmission principle

For MC, this becomes:

- whose material is being interpreted
- what introduced the claim
- what future process may receive it
- what kind of interpretive content it is
- under what permission/constraint it may travel

Source: Helen Nissenbaum, *Privacy in Context*; overview: https://nissenbaum.tech.cornell.edu/papers/privacy-in-context/

### 3. NIST AI RMF supports lifecycle risk management, not one-time disclaimers

NIST's AI RMF describes risk management across design, development, use, and evaluation. NIST released the Generative AI Profile, NIST AI 600-1, on 2024-07-26 to help organizations identify generative-AI-specific risks and risk-management actions. MC should therefore treat influence scope as a lifecycle property: proposed, used, revised, restricted, retired.

Source: https://www.nist.gov/itl/ai-risk-management-framework

### 4. Information-flow security suggests release controls must say what, who, where, and when

Information-flow and declassification work distinguishes controlled release from total secrecy. The useful concept for MC is that a memory or interpretation can be partially released under specific conditions. MC should avoid binary controls like `use / do not use` when context-specific influence is the real problem.

Useful mapping:

- what may be used
- who/what may receive it
- where it may appear
- when it expires or must be rechecked
- why it is justified

Reference overview: Sabelfeld & Sands, "Dimensions and Principles of Declassification"; summary: https://en.wikipedia.org/wiki/Information_flow_(information_theory)#Declassification

### 5. Memory engineering papers improve retrieval, but do not solve normative permission

Recent memory architectures such as Memori and Memoria emphasize structured, efficient, context-aware memory. These are useful for representation, but efficiency and relevance do not by themselves answer whether a memory or interpretation should influence a given context.

Sources:
- Memori: https://arxiv.org/abs/2603.19935
- Memoria: https://arxiv.org/abs/2512.12686

## Fact vs inference

### Facts supported by sources

- Persistent-memory LLMs can reveal stored attributes in contexts where those attributes are inappropriate.
- Contextual integrity offers a mature model for evaluating whether information flow is appropriate in context.
- NIST AI RMF frames AI risk management as an ongoing lifecycle process, not a one-time warning.
- Structured memory systems can improve retrieval efficiency and coherence.

### Inferences for MC

- MC should treat interpretation influence as an information-flow problem.
- A lightweight card may be more usable than a full policy editor.
- The core control should be `allowed influence`, not only `remember / forget`.
- Symbolic reflection needs permission boundaries because symbolic material can be emotionally sticky even when evidentially weak.

### Unproven

- Users will understand the Influence Scope Card quickly.
- The card will reduce false certainty, overreliance, or unwanted memory influence.
- A lightweight card can preserve flow better than a checklist, dashboard, or plain-language warning.

## Design pattern: Influence Scope Card

Every Interpretation Object receives a compact scope card.

### Default collapsed view

```text
Influence Scope
Use for: reflection only
Do not use for: diagnosis, identity claims, major decisions
Confidence: low / medium / high
Expires: after this session / after user approval / date
Why visible: based on current scene + prior approved memory
```

### Expanded view

```yaml
interpretation_id: string
status: proposed | active | restricted | retired | contested
source_material:
  user_provided: true
  ai_generated: true | false
  prior_memory_used: true | false
  external_evidence_used: true | false
influence_scope:
  allowed_contexts:
    - reflection
    - creative synthesis
    - pattern tracking
  blocked_contexts:
    - medical diagnosis
    - legal conclusion
    - identity fixation
    - employment claim
    - relationship certainty claim
  transmission_principle:
    - user-approved
    - session-local
    - reversible
    - not externally shareable by default
confidence:
  evidence_level: none | weak | moderate | strong
  uncertainty_note: string
review:
  expires: session_end | date | condition
  falsification_trigger: string
  rollback_action: remove_from_future_context | quarantine | rewrite | split
```

## Requirements update

MC memory and interpretation systems should support four layers of control:

1. **Storage control** — whether something is saved.
2. **Retrieval control** — whether it can be brought back.
3. **Influence control** — what future outputs it is allowed to shape.
4. **Transmission control** — whether it can appear in exported/public/shared artifacts.

The current architecture should prioritize layer 3 because that is where subtle harm occurs: a claim may be saved and retrieved correctly but still influence the wrong kind of answer.

## Prototype plan

Build a minimal prototype with three conditions:

1. Plain interpretation with disclaimer.
2. Interpretation plus full checklist.
3. Interpretation plus compact Influence Scope Card.

### Test task

Give users a symbolic input and an AI-generated interpretation containing both safe reflective claims and unsafe overreach.

Ask them to:

- identify what the interpretation is allowed to influence
- block one inappropriate future use
- approve one safe use
- revise the scope if the interpretation feels too strong
- explain in one sentence what the card means

### Measures

- comprehension accuracy
- time to complete
- number of unsafe approvals
- number of useful approvals blocked by overcaution
- subjective burden
- whether users can restate the scope without jargon
- whether symbolic flow feels preserved

## Falsification checklist

The pattern should be weakened or redesigned if:

- users treat the card as a generic disclaimer
- users cannot distinguish storage from influence
- users approve everything to move faster
- users block everything because the card feels alarming
- the card reduces reflective flow more than it reduces unsafe influence
- users cannot explain what `allowed influence` means in plain language
- the expanded view is required too often

## Current claim status

**Supported as a design hypothesis, not proven as an effective intervention.**

The evidence supports the need for context-sensitive memory and interpretation controls. It does not prove that MC's Influence Scope Card is the right interface. The next proof must be empirical and comparative.

## Next research question

What visual or interaction form lets users grasp `allowed influence` fastest: label, slider, card, traffic-light state, permission receipt, or timeline?
