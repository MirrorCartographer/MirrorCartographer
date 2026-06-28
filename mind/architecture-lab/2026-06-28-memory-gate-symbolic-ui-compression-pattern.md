# Memory Gate Symbolic UI Compression Pattern

Date: 2026-06-28
Status: architecture pattern / public-safe research note

## Architecture question

How can Mirror Cartographer compress memory-gate decisions into an intuitive symbolic interface without making the user feel watched, judged, slowed down, or overruled?

This follows from the Memory Trust Gate pattern: memory is not passive context. It is a control channel that can alter interpretation, emotional tone, retrieval, and future suggestions. The deeper UI problem is how to expose that control without turning the reflective interface into a compliance dashboard.

## Claim being refined

Earlier claim:

> Every memory retrieval should answer: why this memory, why now, what can it affect, and what must it not affect.

Refined claim:

> The user-facing layer should not show the whole gate. It should show a compact symbolic admission state, with optional expansion into the full audit record.

## Research basis

Primary / high-quality sources reviewed:

1. Jiawen Zhang et al., **Beyond Similarity: Trustworthy Memory Search for Personal AI Agents**, arXiv, 2026-06-04.  
   Source: https://arxiv.org/abs/2606.06054

2. Y. Hu et al., **Memory in the Age of AI Agents**, arXiv, 2025.  
   Source: https://arxiv.org/abs/2512.13564

3. NIST, **Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile**, NIST AI 600-1, July 2024.  
   Source: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

4. Jonatan Reyes, Anil Ufuk Batmaz, Marta Kersten-Oertel, **Trusting AI: does uncertainty visualization affect decision-making?**, Frontiers in Computer Science, 2025.  
   Source: https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2025.1464348/pdf

5. Helena Vasconcelos et al., **Explanations Can Reduce Overreliance on AI Systems During Decision-Making**, CSCW, 2023.  
   Source: https://hci.stanford.edu/publications/2023/xai-cscw-2023.pdf

## Fact / inference split

### Supported facts

- Personal AI agents increasingly use long-term memory for persistent personalization. Similarity-based memory retrieval can admit contextually inappropriate memories even when they are semantically related to the current query.
- Memory retrieval can function as a trust boundary because retrieved memory can influence interpretation and action.
- Reported memory-related risks include cross-domain leakage, sycophancy, tool-call drift, and memory-induced jailbreaks.
- Agent-memory research is moving beyond short-term vs long-term labels toward memory forms, functions, and dynamics: how memories are formed, evolved, retrieved, and used.
- NIST AI RMF frames generative AI risk management as a lifecycle practice requiring governance, mapping, measurement, and management. It also treats content provenance and pre-deployment testing as important generative-AI risk concerns.
- Uncertainty visualization can change user trust and decision-making, but the effect depends on representation and context.
- AI explanations do not automatically reduce overreliance; users engage with explanations when the cost-benefit balance makes verification worth it.

### MC-specific inferences

- MC should expose memory admission as a lightweight symbolic signal, not as a full audit table by default.
- A symbolic signal can preserve flow only if it is reversible, expandable, and explicitly non-authoritative.
- The visual language should indicate permission and influence scope, not identity truth.
- The gate UI should avoid moralizing language such as good/bad, safe/unsafe as character judgment, or trusted/untrusted as identity judgment.
- The symbolic layer should act like traffic control: it governs what may pass into interpretation, not what the user is allowed to feel or mean.

## Design pattern: Symbolic Memory Gate Chip

A **Symbolic Memory Gate Chip** is a small visible UI token attached to an interpretation, map node, or generated response whenever memory influenced the result.

It compresses the full memory admission record into four public-safe signals:

1. **Why here** — what made the memory relevant now.
2. **Allowed influence** — what the memory may affect.
3. **Boundary** — what the memory must not affect.
4. **Uncertainty** — how provisional the admission decision is.

The chip is not a diagnostic label, confidence stamp, truth seal, or identity claim.

## UI states

### 1. Clear pass

Meaning: memory is relevant, permitted, low-risk, and scoped.

User-facing copy:

> Memory used lightly: context only.

Symbolic behavior:

- Thin outline
- Low visual weight
- Expandable details
- Easy remove action

### 2. Narrow pass

Meaning: memory may influence one part of the interpretation but not the whole reading.

User-facing copy:

> Memory used with a boundary.

Symbolic behavior:

- Split or bracketed chip
- Shows allowed zone and blocked zone
- Encourages quick review before saving

### 3. Ask-before-use

Meaning: memory is relevant but sensitive, uncertain, stale, cross-domain, or potentially over-shaping.

User-facing copy:

> This memory might matter. Use it here?

Symbolic behavior:

- Paused chip
- No automatic interpretation influence
- User can allow once, allow for this topic, ignore, or never use here

### 4. Quarantine

Meaning: memory is semantically related but contextually inappropriate or unsafe to apply.

User-facing copy:

> Related memory held out of this reading.

Symbolic behavior:

- Faded / sealed chip
- Does not influence interpretation
- Optional expansion explains the boundary, not the private memory content

### 5. Conflict

Meaning: retrieved memory conflicts with current user input, newer context, or another memory.

User-facing copy:

> Memory conflict: current input leads.

Symbolic behavior:

- Branching chip
- Prioritizes current session unless the user chooses otherwise
- Opens a reconcile / archive / revise flow

## Data schema

```json
{
  "memory_gate_chip": {
    "chip_id": "string",
    "session_id": "string",
    "interpretation_id": "string",
    "memory_reference_id": "opaque_string",
    "admission_state": "clear_pass | narrow_pass | ask_before_use | quarantine | conflict",
    "why_here": "short_public_safe_text",
    "allowed_influence": [
      "tone",
      "symbol_weighting",
      "visual_emphasis",
      "question_selection",
      "continuity_reference",
      "action_suggestion"
    ],
    "blocked_influence": [
      "identity_claim",
      "diagnostic_claim",
      "memory_update",
      "external_action",
      "sensitive_topic_transfer"
    ],
    "uncertainty_level": "low | medium | high",
    "user_action": "allow_once | allow_scoped | ignore_once | never_use_here | inspect | rollback | none",
    "private_detail_exposure": "none | abstracted | explicit_user_requested",
    "audit_record_ref": "opaque_string",
    "created_at": "ISO-8601"
  }
}
```

## Requirements update

MC memory-influenced interpretations must meet these requirements:

1. **No invisible memory influence**  
   If memory changes interpretation, tone, question choice, visual emphasis, or suggested action, the interface must show a chip.

2. **Default abstraction**  
   The chip should describe influence class, not expose private memory content.

3. **Current input priority**  
   When current input conflicts with stored memory, current input leads unless the user explicitly chooses otherwise.

4. **Expandable audit**  
   The chip must expand into a Memory Admission Record for users who want details.

5. **Fast removal**  
   The user must be able to remove memory influence from the current interpretation without deleting the underlying memory.

6. **Separate delete from block**  
   Delete memory, ignore once, never use in this topic, and never store future versions are distinct actions.

7. **No authority aesthetic**  
   The visual design must avoid making admitted memory look more true, permanent, clinical, legal, or identity-defining than it is.

8. **No moral judgment language**  
   The gate judges contextual fit, not the user's meaning, character, symptoms, identity, or credibility.

## Prototype plan

Build `memory-gate-chip-v0.1` with four screens:

1. **Interpretation without memory**
2. **Interpretation with a clear-pass chip**
3. **Interpretation with a narrow-pass chip**
4. **Interpretation with ask-before-use / quarantine / conflict chips**

Test tasks:

- Can the user tell whether memory affected the interpretation?
- Can the user tell what the memory was allowed to affect?
- Can the user identify what the memory was blocked from affecting?
- Can the user remove memory influence without deleting memory?
- Does the chip feel like authorship control or surveillance?
- Does the chip increase false certainty?
- Does symbolic styling make the memory feel more true than it is?

## Falsification checklist

This pattern fails if:

- Users cannot tell when memory influenced an interpretation.
- Users interpret the chip as proof that the memory is true.
- Users feel watched, judged, or slowed down.
- Users cannot remove memory influence quickly.
- Users confuse blocking memory with deleting memory.
- Users treat a symbolic state as diagnostic, therapeutic, legal, or identity authority.
- The chip hides enough detail that users cannot contest AI inference.
- The expanded audit is so heavy that users avoid it even when stakes are high.

## Implementation note

The symbolic gate chip should be considered an interface wrapper around the existing Memory Admission Record, not a replacement for the audit record. The full audit record remains the durable evidence trail; the chip is the live interaction surface.

## Next research question

How should MC test whether symbolic memory controls preserve reflective flow better than plain text disclosures, without increasing false certainty or overreliance?
