# Receipt Audit Layer Pattern

Date: 2026-06-28
Status: Architecture pattern + prototype requirement
Public-safety note: This document uses abstract interaction examples only. No private user material is included.

## Architecture question

How should Mirror Cartographer audit actual behavior against an interpretation receipt so `influence=false` is enforceable, not just promised?

Previous finding: metaphor should be the emotional handle, not the permission system. MC can show Campfire / Notebook / Map Layer / Message Bottle states, but each state needs a machine-readable receipt underneath it.

This note adds the missing enforcement layer: every later use of an interpretation must be checked against the receipt that authorized it.

## Research basis

Current governance and security patterns converge on the same lesson: transparency artifacts are insufficient unless paired with runtime control, provenance, logging, and validation.

- W3C PROV defines provenance as information about the entities, activities, and people involved in producing a thing, useful for assessing quality, reliability, or trustworthiness. It also supports validation, versioning, derivation, and provenance of provenance. Source: W3C PROV Overview, 2013-04-30. https://www.w3.org/TR/prov-overview/
- NIST AI RMF frames AI risk management as something built into design, development, use, and evaluation of AI systems; NIST also released a Generative AI Profile on 2024-07-26 for GenAI-specific risks and actions. Source: NIST AI Risk Management Framework. https://www.nist.gov/itl/ai-risk-management-framework
- OWASP's LLM Top 10 flags prompt injection, sensitive information disclosure, insecure plugin design, excessive agency, and overreliance as distinct LLM application risks. The relevant implication for MC is that permission promises must be checked at tool/action boundaries, not merely displayed in UI. Source: OWASP Top 10 for LLM Applications v1.1. https://owasp.org/www-project-top-10-for-large-language-model-applications/
- Emerging agent-governance papers describe machine-readable runtime policy layers, continuous-audit pipelines, fine-grained access controls, and audit trails for persistent or multi-agent memory systems. Useful concepts: policy cards, runtime obligations, provenance links, deny-by-default enforcement, and continuous behavioral validation.

## Changed understanding

The earlier receipt layer answered: "What did the user allow this interpretation to do?"

That is necessary but incomplete.

The deeper architecture question is: "Can MC prove later behavior matched that permission?"

This shifts MC from consent display to enforceable influence accounting.

A receipt must not be treated as a static notice. It must become a runtime contract that gates four powers:

1. Store: may this interpretation persist beyond the immediate interaction?
2. Retrieve: may it be recalled later?
3. Influence: may it shape future interpretations, recommendations, tone, ranking, or defaults?
4. Transmit: may it be exported, shared, summarized, or sent outside the local session?

The crucial distinction: a system can violate a receipt without leaking data. Example: an interpretation marked `influence=false` may still silently change future tone or ranking. That is not a privacy failure in the ordinary sense; it is an influence-boundary failure.

## Pattern: Receipt Audit Layer

### Intent

Make each interpretation's future power auditable by binding every downstream use to the receipt that authorized it.

### Core object

Each interpretation receives an immutable `interpretation_id` and a mutable-but-versioned `receipt_id`.

The receipt is not a policy paragraph. It is a compact permission contract.

```json
{
  "receipt_id": "receipt_...",
  "interpretation_id": "interp_...",
  "state_metaphor": "campfire | notebook | map_layer | message_bottle",
  "permissions": {
    "store": false,
    "retrieve": false,
    "influence": false,
    "transmit": false
  },
  "scope": {
    "session_id": "session_...",
    "expires_at": "timestamp_or_null",
    "allowed_surfaces": ["current_reflection"],
    "blocked_surfaces": ["profile", "memory_search", "export", "recommendation_ranker"]
  },
  "obligations": {
    "log_uses": true,
    "show_state_badge": true,
    "require_explain_back_for_upgrade": true,
    "delete_or_seal_on_expiry": true
  },
  "version": 1
}
```

### Runtime gate

Every action that attempts to use an interpretation must pass through an influence gate.

Action types:

- `write_memory`
- `read_memory`
- `use_as_context`
- `adjust_user_model`
- `rank_recommendation`
- `change_tone_or_prompting_strategy`
- `summarize_for_export`
- `send_or_share`

Required check:

```text
if action.requires.store and receipt.permissions.store == false: deny
if action.requires.retrieve and receipt.permissions.retrieve == false: deny
if action.requires.influence and receipt.permissions.influence == false: deny
if action.requires.transmit and receipt.permissions.transmit == false: deny
otherwise allow and log
```

The important design move is that `change_tone_or_prompting_strategy` and `rank_recommendation` count as influence. MC should not reserve "influence" only for obvious memory retrieval.

### Audit event

Every allowed or denied use creates an event.

```json
{
  "event_id": "audit_...",
  "timestamp": "...",
  "interpretation_id": "interp_...",
  "receipt_id": "receipt_...",
  "attempted_action": "use_as_context",
  "required_power": ["retrieve", "influence"],
  "decision": "allowed | denied",
  "reason": "receipt_allows | receipt_blocks | expired | missing_receipt | user_override_required",
  "surface": "reflection_engine",
  "actor": "system | user | facilitator | export_pipeline"
}
```

### Violation definition

A receipt violation occurs when any of the following happen:

- An interpretation is used without a receipt.
- An interpretation is used after receipt expiry.
- A later action requires a power the receipt does not grant.
- A derived interpretation inherits influence from a blocked interpretation without marking the derivation.
- A metaphor badge and receipt disagree.
- A receipt upgrade occurs without explain-back when explain-back is required.

## Requirements update

### R-RECEIPT-01: Receipt-bound use

Every persisted or reusable interpretation must have a machine-readable receipt before it can be stored, retrieved, used as context, allowed to influence future outputs, or transmitted.

### R-RECEIPT-02: Influence is an action class

MC must treat tone adjustment, recommendation ranking, interpretation framing, retrieval weighting, profile inference, and future prompt conditioning as influence-bearing actions.

### R-RECEIPT-03: Deny by default

If a receipt is missing, expired, malformed, or ambiguous, MC must deny future influence and fall back to now-only use unless the user explicitly upgrades the state.

### R-RECEIPT-04: Audit every attempted use

MC must log allowed and denied attempts to store, retrieve, influence, or transmit interpretation-linked material. The audit log should support user-facing summaries without exposing private content.

### R-RECEIPT-05: Derived influence tracking

If interpretation B is derived from interpretation A, B must inherit A's most restrictive future-influence boundary unless the user explicitly upgrades the derived interpretation.

### R-RECEIPT-06: Badge-receipt consistency

The visible metaphor/state badge must be generated from the machine-readable receipt, not separately chosen by the interface. UI cannot claim "Campfire" while the receipt grants future influence.

## Prototype plan

### Prototype name

Receipt Audit Harness

### Goal

Test whether MC can detect and block unauthorized influence paths before building a full memory system.

### Minimal simulation

Create four synthetic interpretations:

1. Campfire: all powers false.
2. Notebook: store true for session, retrieve true in session, influence false, transmit false.
3. Map Layer: store true, retrieve true, influence true, transmit false.
4. Message Bottle: transmit true, with explicit export surface.

Run each interpretation through eight attempted actions:

- save to session note
- save to long-term profile
- retrieve next session
- use as hidden context
- adjust tone
- rank recommendation
- include in export summary
- send/share outside session

Expected result: every action is either blocked or allowed exactly according to receipt powers.

### Evaluation metric

- Permission accuracy: 100 percent required for synthetic tests.
- False allow rate: must be 0 for blocked powers.
- False deny rate: should be inspected but is less dangerous than false allow.
- Badge consistency: 100 percent of badges must be generated from receipt permissions.
- Derivation safety: derived interpretations must inherit the most restrictive boundary unless upgraded.

## Falsification checklist

This pattern fails if:

- MC cannot classify subtle actions like tone shaping or ranking as influence.
- Engineers can bypass the gate by calling memory/context directly.
- Audit logs exist but do not affect runtime behavior.
- The UI badge can drift away from the receipt.
- Derived interpretations lose provenance.
- Users cannot understand why a later action was blocked.

## Design implication

MC should not have "memory" as one subsystem and "consent" as another subsystem. It should have an influence-accounting layer that sits between interpretations and every future use surface.

Memory is only one route of future influence.

The real governed object is the interpretation's ability to shape what happens next.

## Next research question

How should MC classify hidden influence actions, especially tone adjustment, retrieval weighting, recommendation ranking, and future prompt conditioning, so the audit layer can detect influence even when no explicit memory item is retrieved?
