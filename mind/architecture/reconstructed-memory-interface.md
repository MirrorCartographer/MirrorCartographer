# Reconstructed Memory Interface

Status: architecture note / design pattern
Date added: 2026-06-27
Public-safety level: public-safe; no private user details; no medical or veterinary claims

## Architecture question

How should Mirror Cartographer show memory when memory is not a stored fact, but a reconstruction produced from partial traces, context, retrieval policy, and current interpretive goals?

## Why this question matters

Mirror Cartographer has been moving toward memory gates, context rings, uncertainty labels, and rollback paths. The next weak point is subtler: even when a memory is allowed, the interface can make it look more stable than it really is.

A simple saved-memory card implies: “this is what happened” or “this is what the user is.” A reconstructed-memory card should instead say: “this is the current reconstruction, generated from these traces, under this scope, with these uncertainty boundaries.”

## Research basis

### Fact: active memory reconstruction is an emerging LLM-agent memory pattern

The paper “Memory is Reconstructed, Not Retrieved: Graph Memory for LLM Agents” proposes memory access as active reconstruction using associative graph traversal and reasoning, not only passive retrieve-then-read search. The useful concept for MC is not the benchmark score itself, but the interface implication: memory output is a generated reconstruction and should expose cues, source links, and uncertainty.

### Fact: long-term memory security needs provenance, versioning, policy-aware retention, and phase coverage

A 2026 survey on long-term memory security in LLM agents argues that memory safety cannot be patched only at retrieval or execution time. It must include storage-time provenance, versioning, retention policy, and coverage across write, store, retrieve, execute, share, and forget phases.

### Fact: agent memory can become a security surface

Current agent-safety guidance and security writing describe persistent memory/context poisoning as an attack class. The practical lesson for MC is that memory cards should not become hidden premises for action. Every memory-derived action needs source, scope, and allowed-effect checks.

### Fact: reflective conversation changes the interface model

CHI 2026 work on LLM-mediated computing frames interaction as a computer taking shape through reflective conversation rather than fixed application boundaries. For MC, this supports treating each reflection as an interface object: not just text, but a manipulable card with state, provenance, and possible next moves.

## Inference for MC

MC should not display memory as an inert note. It should display memory as a bounded reconstruction with visible origin, confidence, scope, allowed use, and revision path.

This is an architectural inference, not a proven product result. It still needs usability testing.

## Design pattern: Reconstructed Memory Card

Each memory-derived card should include these visible fields:

| Field | Purpose |
|---|---|
| Reconstruction statement | The current generated memory interpretation, phrased as provisional unless directly quoted. |
| Source traces | Links or labels for the notes, sessions, artifacts, or user-approved memories used. |
| Cue path | Why this memory appeared now: user query, symbol, project context, recurring pattern, or retrieval match. |
| Claim type | Observation, preference, project decision, symbolic pattern, inference, hypothesis, or blocked claim. |
| Scope | Private reflection, project design, public artifact, external action, animal observation, health-adjacent note, or unknown. |
| Confidence shape | High, medium, low, conflicting, stale, or unverified. |
| Allowed effects | What the reconstruction may influence: wording, UI suggestion, roadmap item, search query, no action, etc. |
| Blocked effects | What it must not influence: diagnosis, veterinary claim, legal/financial action, public attribution, external contact, etc. |
| Revision path | How the user or system can correct, expire, split, merge, or forget the reconstruction. |
| Audit link | Link to the durable card, commit, source map, or evidence map if public-safe. |

## Product requirement

Do not allow a memory-derived object to enter GitHub, public artifacts, external action planning, or opportunity applications unless it has:

1. a source trace,
2. a claim type,
3. a scope label,
4. an allowed-effect label,
5. a blocked-effect label,
6. an uncertainty/confidence label,
7. a revision or rollback path.

## Visual metaphor spec

Name: **Glass Fossil Card**

Visual logic:

- Fossil: memory is a trace, not the living event.
- Glass: the reconstruction is visible but fragile.
- Inner thread: the cue path that pulled the memory forward.
- Outer ring: context boundary and allowed-use boundary.
- Cracks: uncertainty, missing data, conflict, or stale source.
- Wax seal: user-approved durable memory.
- Loose dust: context-only material that should not persist.

The visual should make a user feel: “I can see where this came from, what it is allowed to affect, and how to correct it.”

## Minimal schema

```yaml
reconstructed_memory_card:
  id: string
  reconstruction_statement: string
  source_traces:
    - trace_id: string
      source_type: user_note | session_summary | public_source | github_artifact | system_observation | unknown
      source_status: direct | summarized | inferred | stale | conflicting
  cue_path:
    trigger: user_query | symbol_match | project_context | retrieval_match | scheduled_scan | manual_review
    reason_for_appearance: string
  claim_type: observation | preference | project_decision | symbolic_pattern | inference | hypothesis | blocked_claim
  scope: private_reflection | project_design | public_artifact | external_action | animal_observation | health_adjacent | unknown
  confidence_shape: high | medium | low | conflicting | stale | unverified
  allowed_effects:
    - wording | ui_suggestion | roadmap | research_query | evidence_map | no_action
  blocked_effects:
    - diagnosis | veterinary_claim | legal_action | financial_action | public_attribution | external_contact
  memory_policy:
    persistence: context_only | session | project_scoped | durable | expired
    retrieval_rule: never | same_project_only | explicit_user_request | public_safe_only
    expiry_or_review: string
  revision_path:
    can_edit: true
    can_split: true
    can_forget: true
    rollback_group: string
```

## Test plan

Build 8 static cards:

1. direct project decision,
2. symbolic pattern,
3. body-signal reflection,
4. animal observation,
5. public research source,
6. stale memory,
7. conflicting memory,
8. malicious or unsafe memory-like input.

Pass criteria:

- A nontechnical viewer can identify source, claim type, scope, allowed effect, blocked effect, and uncertainty in 30 seconds.
- The card prevents private or health-adjacent material from entering a public artifact without abstraction.
- A stale or conflicting memory does not appear as a stable user fact.
- A poisoned or unsafe memory-like input cannot become an action premise.

## Next implementation step

Prototype a Reconstructed Memory Card component using static data only. Do not connect it to real private memory yet. Use fake example data and test legibility first.

## Next research question

What visual encoding best communicates reconstructed memory without making the user feel surveilled: glass fossil, annotated map, weather layer, braided thread, or archive drawer?
