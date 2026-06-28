# Symbolic Memory Control Evaluation Plan

Date: 2026-06-28
Status: prototype-plan / requirements update
Public-safety level: public-safe abstraction; no private user details included

## Architecture question

How should Mirror Cartographer test whether symbolic memory controls preserve reflective flow better than plain text disclosures or dashboard-style controls, without increasing false certainty, overreliance, or inappropriate memory influence?

## Why this question matters

Mirror Cartographer is developing memory controls such as the Memory Trust Gate, Memory Influence Scope Map, Attribution Trace Ledger, and compact symbolic gate chips. The weak point is not whether memory needs governance. Current research supports that risk. The weak point is whether symbolic controls actually help users understand memory influence safely, or whether symbolic presentation makes uncertain interpretations feel more authoritative, permanent, or identity-defining than they are.

## Research basis

### 1. Memory retrieval is a trust boundary, not simple recall

Source: Zhang et al., `Beyond Similarity: Trustworthy Memory Search for Personal AI Agents`, arXiv, 2026-06-04. https://arxiv.org/abs/2606.06054

Useful concepts:
- Similarity is not the same as admissibility.
- A memory can be semantically close but contextually inappropriate.
- Retrieved memory can cause cross-domain leakage, sycophancy, tool-call drift, or memory-induced jailbreaks.
- Long-term memory should be treated as a control channel because it changes interpretation and action.
- A gate should sit between retrieval and prompt construction, before memory reaches model reasoning.

MC extraction:
- Memory controls must be evaluated before interpretation, not only shown after interpretation.
- Every memory admission decision needs a reason, allowed influence, blocked influence, uncertainty status, and rollback path.

### 2. Local-first and ground-truth-preserving memory systems support stability but do not solve influence safety alone

Sources:
- Sun, `MemX: A Local-First Long-Term Memory System for AI Assistants`, arXiv, 2026. https://arxiv.org/abs/2603.16171
- Wang et al., `MemMachine: A Ground-Truth-Preserving Memory System for Personalized AI Agents`, arXiv, 2026. https://arxiv.org/abs/2604.04853

Useful concepts:
- Local-first systems reduce centralized privacy risk and can make retrieval more explainable.
- Ground-truth-preserving memory stores fuller episodes instead of lossy extracted summaries.
- Retrieval quality, rejection rules, and source context matter.
- These systems improve recall and continuity but do not by themselves prove that users understand or safely calibrate memory influence.

MC extraction:
- MC should preserve source trace and user edits, but still needs a user-facing comprehension layer.
- Symbolic controls cannot replace auditability; they need an expandable audit trail.

### 3. Overreliance and confidence displays are double-edged

Sources:
- Ibrahim et al., `Measuring and mitigating overreliance is necessary for building human-compatible AI`, arXiv, 2025. https://arxiv.org/abs/2509.08010
- Li et al., `Overconfident and Unconfident AI Hinder Human-AI Collaboration`, arXiv, 2024. https://arxiv.org/abs/2402.07632
- Chen et al., `Engaging with AI: How Interface Design Shapes Human-AI Collaboration in High-Stakes Decision-Making`, arXiv, 2025. https://arxiv.org/abs/2501.16627

Useful concepts:
- Overreliance is not solved by simply showing explanations.
- Confidence and uncertainty cues can reduce misuse when calibrated, but can also cause disuse or misplaced trust.
- Cognitive forcing functions can increase reflection but may reduce task performance or flow when they add too much effort.
- Interface form changes trust behavior, not only comprehension.

MC extraction:
- Symbolic memory controls must be tested for both comprehension and felt authority.
- A beautiful or meaningful symbolic UI may improve engagement while also increasing false certainty.
- The evaluation must measure correction behavior, not just whether users say they understood.

## Fact vs inference

### Supported facts from current research

- Persistent memory can create trustworthiness failures when retrieved memories are semantically related but contextually inadmissible.
- Memory can act as an implicit steering signal for model reasoning, tone, safety judgment, and tool use.
- Gating memory before prompt construction is a plausible technical mitigation.
- Uncertainty and explanation interfaces affect trust and reliance behavior, but their effects vary by calibration, task, cost, and format.
- Cognitive forcing can encourage reflection, but can also slow users down or reduce trust.

### MC-specific inferences, not yet proven

- A symbolic memory chip may preserve reflective flow better than a plain dashboard.
- Symbolic control language may make memory influence easier to understand for reflective or metaphor-oriented users.
- A hybrid interface — symbolic chip by default, audit layer on expansion — may balance flow, agency, and verification.
- MC can preserve symbolic depth without increasing overreliance if uncertainty and reversibility are visible enough.

## Design requirement update

MC memory controls should be evaluated across four interface conditions:

1. No visible memory control
   - Memory is retrieved silently.
   - This is the negative baseline.

2. Plain text disclosure
   - Example: `Using one prior memory about your preference for visual mapping.`
   - Tests whether simple transparency is enough.

3. Dashboard/audit panel
   - Shows source, relevance, scope, sensitivity, confidence, blocked uses, rollback.
   - Tests maximum explicit control.

4. Symbolic chip + expandable audit trail
   - Default chip shows compact symbols for admitted memory, blocked influence, uncertainty, and rollback.
   - Expansion reveals the full Memory Admission Record.
   - Tests MC's preferred interface hypothesis.

## Prototype plan

### Prototype object: Memory Control Evaluation Harness v0.1

Inputs:
- current user prompt, abstracted and non-sensitive
- candidate memory object
- memory admission decision
- generated interpretation
- user correction opportunity

Outputs:
- interface condition shown
- user-selected correction or acceptance
- comprehension score
- false certainty score
- rollback success
- flow interruption rating
- overreliance marker

### Minimal memory admission record

```json
{
  "memory_id": "string",
  "source_type": "user_input | ai_inference | user_confirmed | imported_artifact",
  "retrieval_reason": "string",
  "semantic_relevance": "low | medium | high",
  "contextual_admissibility": "blocked | limited | allowed",
  "allowed_influence": ["tone", "symbol_suggestions", "interface_preference", "project_continuity"],
  "blocked_influence": ["identity_claim", "medical_claim", "legal_claim", "external_action", "certainty_upgrade"],
  "uncertainty_level": "low | medium | high",
  "sensitivity_level": "low | medium | high",
  "freshness_status": "current | stale | unknown",
  "requires_user_confirmation": true,
  "rollback_available": true,
  "display_mode": "hidden | plain_text | dashboard | symbolic_chip_hybrid"
}
```

## Evaluation criterion

### Reflective Flow Without False Authority Criterion

A symbolic memory-control interface passes only if it satisfies all of the following:

1. Comprehension
   - Users can explain what memory influenced the interpretation.
   - Users can identify what the memory was not allowed to influence.

2. Correction
   - Users can correct a wrong memory influence without losing the thread of reflection.
   - Users can roll back or quarantine memory.

3. Calibration
   - Users do not rate AI-inferred interpretations as more certain than user-confirmed facts.
   - Symbolic visuals do not increase false certainty compared with plain text.

4. Flow
   - Users report less interruption than dashboard-only controls.
   - Correction steps do not feel punitive, clinical, or surveillance-like.

5. Safety
   - Cross-domain leakage is detected.
   - Stale or sensitive memory does not silently steer interpretation.
   - Tool/action decisions cannot be influenced by symbolic memory unless explicitly allowed.

## Falsification checklist

The symbolic chip design fails if any of these occur:

- Users cannot tell whether a memory was admitted, limited, or blocked.
- Users treat AI-inferred symbolic interpretations as confirmed facts.
- The chip increases trust without improving correction accuracy.
- Users miss blocked influence categories.
- Users prefer the chip aesthetically but perform worse on comprehension.
- The interface hides too much and makes audit expansion unlikely.
- Memory from one domain affects another domain without explicit permission.
- Symbolic uncertainty markers are remembered as authority markers.

## Next implementation move

Build `memory-control-eval-v0.1` as a small prototype with 8-12 abstract test prompts and four UI conditions. The first benchmark should not test beauty. It should test whether users can correctly answer:

1. Why was this memory retrieved?
2. Was it allowed, limited, or blocked?
3. What did it influence?
4. What was it forbidden to influence?
5. What can the user change or roll back?

## Next research question

What visual language best distinguishes uncertainty, blocked influence, and user-confirmed meaning in a symbolic interface without making uncertainty look like depth, mystery, or authority?
