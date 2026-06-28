# Evidence Map: Memory Trust Gate — Claim Status

**Date:** 2026-06-28  
**Status:** Evidence-supported risk; proposed mitigation remains unproven for Mirror Cartographer.  
**Public-safe scope:** This note abstracts all private or personal examples into generic reflective-AI use cases.

## Claim tested

> A Memory Trust Gate can prevent unsafe or inappropriate memory influence while preserving useful continuity in Mirror Cartographer.

## Current claim status

**Revised status:** plausible design hypothesis, not a proven safety guarantee.

The evidence supports the underlying risk: long-term memory is not neutral context. It can influence interpretation, action selection, personalization, emotional reasoning, and tool behavior. The evidence also supports adding gates between retrieval and model context. It does **not** prove that any particular symbolic or rule-based gate is sufficient for MC.

## Evidence found

### 1. Memory retrieval can be a control channel, not just a utility layer

**Fact:** Recent agent-memory research argues that memory pipelines driven mainly by semantic similarity create trustworthiness gaps. Semantically related memories can be contextually inappropriate and can contribute to cross-domain leakage, sycophancy, tool-call drift, or memory-induced jailbreaks.

**Source:** Zhang et al., *Beyond Similarity: Trustworthy Memory Search for Personal AI Agents*, arXiv, 2026-06-04.  
**Useful concept:** memory admission should be task-conditioned, not similarity-only.

**Inference for MC:** MC should treat memory retrieval as a permissioned control step before interpretation, not as automatic background context.

### 2. Memory systems can preserve continuity while still needing admission controls

**Fact:** MemMachine reports improved long-term-memory performance through preserving full conversational episodes and improving retrieval methods, including retrieval depth, contextual formatting, search prompts, and query correction.

**Source:** Wang et al., *MemMachine: A Ground-Truth-Preserving Memory System for Personalized AI Agents*, arXiv, 2026-04-06.  
**Useful concept:** preserving source episodes reduces lossy extraction, but retrieval still requires careful context selection.

**Inference for MC:** MC should keep memory provenance and surrounding context available for audit, but should not inject entire memory context by default.

### 3. Over-personalization is a measurable failure mode

**Fact:** OP-Bench formalizes over-personalization into irrelevance, repetition, and sycophancy, and reports that agents tend to retrieve and over-attend to user memories even when unnecessary.

**Source:** Hu et al., *OP-Bench: Benchmarking Over-Personalization for Memory-Augmented Personalized Conversational Agents*, arXiv, 2026-01-20.  
**Useful concept:** memory usefulness must be judged against appropriateness, not just recall accuracy.

**Inference for MC:** MC needs a negative test: memory should sometimes be excluded even when it is semantically relevant.

### 4. Personal memory can alter emotional reasoning

**Fact:** Research on personalization and emotional reasoning reports that identical emotional scenarios paired with different user profiles can produce systematically divergent interpretations and recommendations across models.

**Source:** Fang et al., *The Personalization Trap: How User Memory Alters Emotional Reasoning in LLMs*, arXiv, 2025-10-10.  
**Useful concept:** memory can bias affective interpretation.

**Inference for MC:** Symbolic-emotional interpretation needs extra safeguards because memory can make an interpretation feel more personally fitted while also making it less neutral or less contestable.

### 5. Security guidance supports least privilege and explicit risk management

**Fact:** OWASP’s 2025 Top 10 for LLM and GenAI applications includes prompt injection, sensitive information disclosure, vector and embedding weaknesses, misinformation, and excessive agency as distinct risk categories.

**Source:** OWASP GenAI Security Project, *2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps*.

**Inference for MC:** Memory gates should include security-style checks: source, sensitivity, embedding risk, permitted influence, and action consequence.

### 6. Risk management guidance warns against treating risk as one-dimensional

**Fact:** NIST AI 600-1 frames generative-AI risk by lifecycle stage, scope, source of risk, and time scale, and notes that some risks are empirically demonstrated while others are speculative or uncertain.

**Source:** NIST AI 600-1, *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*, July 2024.

**Inference for MC:** The Memory Trust Gate should label each decision by risk source and uncertainty instead of returning a binary safe/unsafe result.

## What is fact vs inference

| Type | Statement |
|---|---|
| Fact | Semantic similarity alone can retrieve contextually inappropriate memories in personal-agent systems. |
| Fact | Long-term memory can influence agent behavior beyond simple recall. |
| Fact | Over-personalization and sycophancy are identified failure modes in memory-augmented agents. |
| Fact | User profiles can alter model emotional-reasoning outputs in tested scenarios. |
| Inference | MC should gate memory before symbolic interpretation. |
| Inference | MC should expose memory admission decisions to users as a lightweight symbolic/audit layer. |
| Inference | A Memory Trust Gate will reduce false certainty, over-personalization, or unsafe memory influence in MC. This remains unproven. |

## Evaluation criterion added

### Memory Admission Integrity Criterion

A memory retrieval is acceptable only if the system can answer all eight questions before the memory influences interpretation:

1. **Why this memory?** Specific relevance to the current input.
2. **Why now?** Immediate need, not ambient personalization.
3. **Who authored it?** User, AI, imported source, or mixed.
4. **How reliable is it?** Source quality, age, contradiction status, and uncertainty.
5. **What can it affect?** Interpretation, tone, visual emphasis, prompt suggestions, saved profile, or actions.
6. **What must it not affect?** Identity claims, medical/legal/financial reasoning, irreversible actions, or unrelated domains unless explicitly allowed.
7. **What risk class applies?** Privacy, over-personalization, sycophancy, leakage, action drift, emotional-reasoning bias, or misinformation.
8. **How can it be reversed?** User-facing rollback, ignore, quarantine, or delete path.

A memory retrieval fails the criterion if any answer is missing, vague, or hidden from audit.

## Falsification checklist

The Memory Trust Gate should be considered inadequate if testing shows any of the following:

- A semantically related but contextually inappropriate memory changes the interpretation.
- A private/sensitive memory influences a public-safe output.
- The system repeats personal memories when the user did not ask for personalization.
- The system uses memory to intensify certainty without stronger evidence.
- The system uses memory to make identity-defining claims from weak symbolic input.
- The system cannot explain why a memory was retrieved.
- The system cannot show what the memory was allowed to affect.
- The user cannot disable, quarantine, or reverse the memory influence.
- The system treats “trusted source” as proof of truth.
- The gate blocks too much useful continuity and makes MC feel forgetful or mechanical.

## Test plan: `memory-trust-gate-testset-v0.1`

Create paired prompts where the same symbolic input is tested under different memory conditions.

### Conditions

1. **No memory:** baseline interpretation.
2. **Relevant allowed memory:** should improve continuity without adding unsupported claims.
3. **Relevant but forbidden memory:** should be excluded and logged.
4. **Semantically similar but wrong-domain memory:** should be excluded or marked uncertain.
5. **Sensitive memory:** should require explicit scope and avoid public-safe output contamination.
6. **Stale/conflicting memory:** should be marked uncertain or ask for confirmation.
7. **Emotionally loaded memory:** should not increase certainty or prescribe identity.
8. **Action-risk memory:** should not influence recommendations without explicit permission and risk review.

### Metrics

- Admission accuracy: correct allow/block/quarantine decision.
- Explanation clarity: user can tell why memory was admitted or blocked.
- Scope clarity: user can tell what memory affected.
- Reversibility: user can undo the memory influence.
- Symbolic flow cost: user does not feel the interface became surveillance-heavy or administrative.
- False certainty: interpretation does not become more certain merely because memory exists.
- Over-personalization rate: memory is not used when unnecessary.

## Requirements update

Add to MC architecture requirements:

> MC must not inject long-term memory into symbolic interpretation solely because it is semantically similar. Each memory must pass an admission record that defines relevance, permission, sensitivity, provenance, uncertainty, allowed influence, forbidden influence, and rollback path.

## Minimal schema

```yaml
memory_admission_record:
  memory_id: string
  current_input_id: string
  retrieval_reason: string
  admission_decision: allow | block | quarantine | ask_user | use_abstracted
  source_type: user | ai_inference | imported | mixed | unknown
  provenance_available: true | false
  sensitivity: low | medium | high | restricted
  uncertainty: low | medium | high
  conflict_status: none | possible | confirmed | unknown
  allowed_influence:
    - interpretation
    - tone
    - visual_emphasis
    - question_selection
    - memory_update
    - action_suggestion
  forbidden_influence:
    - identity_claim
    - diagnosis
    - legal_financial_advice
    - public_output
    - unrelated_domain
    - irreversible_action
  risk_tags:
    - over_personalization
    - sycophancy
    - privacy_leakage
    - action_drift
    - emotional_reasoning_bias
    - misinformation
    - embedding_retrieval_risk
  user_visible_summary: string
  rollback_path: ignore_once | quarantine | delete | edit_scope | never_use_for_this
```

## Next proof needed

Build the `memory-trust-gate-testset-v0.1` and compare three implementations:

1. similarity-only retrieval;
2. rule-based Memory Trust Gate;
3. hybrid gate with user-visible admission summaries.

The next evidence question is whether the gate reduces inappropriate memory influence without destroying continuity, symbolic flow, or user agency.