# Metaphor Receipt Dual-Layer Pattern

Date: 2026-06-28
Status: draft design pattern; evidence-informed, not validated in MC yet
Privacy posture: public-safe; no private user examples or personal data included

## Architecture question

Can MC preserve metaphor's emotional usefulness while forcing enough operational clarity that users can accurately predict future influence?

## Short answer

Probably only if metaphor and permission logic are separated into two linked layers:

1. **Metaphor layer**: gives the state an emotional handle users can remember quickly.
2. **Receipt layer**: records exact operational powers in machine-readable form.

Metaphor alone should not be treated as consent, comprehension, or control.

## Evidence found

### Fact: persistent memory systems are becoming more capable and more structured

Recent memory architectures for personalized agents explicitly separate short-term/session memory, long-term episodic memory, profile/persona memory, retrieval routing, and human-readable memory representations. Examples include MemMachine, PersonaMem-v2, Memoria, PRIME, and RF-Mem.

Sources:
- MemMachine, 2026: https://arxiv.org/abs/2604.04853
- PersonaMem-v2, 2025: https://arxiv.org/abs/2512.06688
- Memoria, 2025: https://arxiv.org/abs/2512.12686
- PRIME, 2025: https://arxiv.org/abs/2507.04607
- RF-Mem, 2026: https://arxiv.org/abs/2603.09250

Implication for MC: future-influence states cannot be vague. They must specify which memory tier and retrieval behavior an interpretation can enter.

### Fact: machine-readable consent receipts are a real standards direction

ISO/IEC TS 27560:2023 defines a consent record information structure and consent receipt approach for recording and exchanging consent information as machine-readable data. A 2024 implementation paper maps the standard to GDPR/DGA-oriented consent records.

Source:
- Implementing ISO/IEC TS 27560:2023 Consent Records and Receipts for GDPR and DGA, 2024: https://arxiv.org/abs/2405.04528

Implication for MC: a visible metaphor should map to a structured receipt, not replace it.

### Fact: privacy and AI transparency labels are moving toward compact disclosure, but labels can be incomplete without enforcement or verification

Recent AI transparency labeling in music/content contexts uses compact metadata categories, but reporting on Apple Music's optional AI Transparency Tags notes that voluntary labels without verification or enforcement leave uncertainty about reliability.

Source:
- The Verge, 2026-03-05: https://www.theverge.com/tech/889836/apple-music-ai-transparency-tags-launch

Implication for MC: labels/badges must be backed by enforceable system behavior, logs, or tests.

### Fact: agentic memory personalization remains technically difficult

PersonaMem-v2 reports that frontier LLMs still struggle with implicit personalization, with 37-48% accuracy in its evaluated setting, and stronger agentic memory still reaches only 55% in that setup.

Source:
- PersonaMem-v2, 2025: https://arxiv.org/abs/2512.06688

Implication for MC: the UI should not imply that future influence is precise, complete, or reliably beneficial. It needs uncertainty and rollback.

## Inference

Metaphor helps users orient emotionally, but operational prediction requires explicit powers. MC should therefore bind every symbolic memory state to four boolean/permission dimensions:

- `store`: may this interpretation be saved beyond the immediate moment?
- `retrieve`: may it be recalled later?
- `influence`: may it shape future interpretation or recommendations?
- `transmit`: may it be exported/shared outside the private session?

## Design pattern

Name: **Metaphor Receipt Dual-Layer**

### Layer 1: user-facing metaphor

Current candidate metaphor set:

- Campfire = now-only; useful while present, not saved as a future lens
- Notebook = session memory; useful inside current session/thread, not long-term profile
- Map Layer = future lens; may shape later interpretation
- Message Bottle = exportable/shareable; may leave the private reflection space

### Layer 2: operational receipt

Each interpretation gets a small receipt object.

```json
{
  "interpretation_id": "uuid",
  "state_metaphor": "campfire | notebook | map_layer | message_bottle",
  "powers": {
    "store": false,
    "retrieve": false,
    "influence": false,
    "transmit": false
  },
  "scope": {
    "session": true,
    "long_term_profile": false,
    "external_export": false
  },
  "uncertainty": "low | medium | high",
  "source_kind": "user_statement | model_inference | imported_file | external_source | mixed",
  "created_at": "ISO-8601 timestamp",
  "expires_at": "ISO-8601 timestamp or null",
  "rollback_available": true,
  "human_readable_summary": "Plain-language explanation of what this interpretation can affect."
}
```

## Requirement update

### R-INFLUENCE-04: Metaphor cannot be the permission boundary

MC MUST NOT rely on metaphor labels alone to define memory/influence permissions. Every metaphor state MUST compile to an explicit receipt containing store/retrieve/influence/transmit powers.

### R-INFLUENCE-05: Permission receipts must be testable

Every interpretation-level receipt MUST be auditable against actual system behavior. If a state says `influence=false`, later retrieval and interpretation logic must not use it as a shaping lens.

### R-INFLUENCE-06: Metaphor comprehension must be empirically tested

Before shipping the metaphor set as a core interface, MC SHOULD test whether users can correctly predict the four powers for each metaphor without reading the full receipt.

## Evaluation criterion

A metaphor state passes only if at least 80% of test users correctly answer all four power questions for that state:

1. Will this be saved?
2. Can it come back later?
3. Can it shape future interpretations?
4. Can it be shared/exported?

A state fails if users report emotional clarity but cannot predict operational behavior.

## Falsification checklist

This pattern is wrong or incomplete if:

- users consistently misread Campfire as saved memory;
- users confuse Notebook and Map Layer;
- users understand the metaphor but still cannot predict retrieve/influence differences;
- actual retrieval behavior violates the receipt;
- the receipt becomes so prominent that reflective flow collapses into paperwork;
- users ignore the badge due to habituation;
- users treat Message Bottle as decorative rather than export permission.

## Prototype plan

Build a small test with four interpretation cards. Each card shows:

1. metaphor badge;
2. one-sentence plain language label;
3. expandable receipt details;
4. a four-question prediction quiz.

Compare three variants:

- metaphor only;
- metaphor + plain language;
- metaphor + plain language + receipt preview.

Measure:

- prediction accuracy;
- time-to-decision;
- perceived emotional weight;
- perceived paperwork burden;
- recall after delay;
- false confidence.

## Claim status update

Claim: "MC can use symbolic memory-state metaphors to help users understand future influence."

Status: **partially supported, unproven**.

Supported:
- memory systems need explicit tiers and retrieval behavior;
- consent/permission records can be machine-readable;
- compact labels can orient users.

Not yet proven:
- MC's specific metaphors improve user prediction accuracy;
- metaphors preserve emotional flow better than plain labels;
- users can distinguish `retrieve` from `influence` without explanation;
- receipts can be enforced in implementation.

## Next research question

How should MC audit actual behavior against the receipt so `influence=false` is not merely a promise but an enforceable system invariant?
