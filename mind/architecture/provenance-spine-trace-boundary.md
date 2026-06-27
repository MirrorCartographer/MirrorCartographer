# Provenance Spine / Trace Boundary

Status: architecture requirement + design pattern  
Date: 2026-06-27  
Public-safety level: public-safe abstraction; no private user material included.

## Architecture question

How should Mirror Cartographer bind context, memory, evidence, tool use, privacy scope, and rollback into one traceable lineage without turning the interface into surveillance or bureaucratic logging?

## Short answer

MC needs a **Provenance Spine**: a shared trace object attached to every reflection card, memory card, source claim, and external-action proposal.

The spine should not store every private detail. It should store enough lineage to answer six public-safe questions:

1. Where did this signal come from?
2. What transformed it?
3. What claim type is being made?
4. What evidence supports or limits it?
5. Where is it allowed to reappear?
6. How can it be blocked, revised, replayed, or rolled back?

## Research basis

### 1. Evidence tracing is becoming core agent infrastructure

Recent work on evidence tracing and execution provenance argues that final-answer accuracy is not enough for LLM agents. Agent outputs need links between retrieved evidence, tool outputs, memory items, environment observations, intermediate claims, actions, and final answers. This directly maps to MC's need to show how a reflection moved from raw signal to interpretation, memory, or action.

Useful extraction for MC:
- Do not treat provenance as citation-only.
- Treat provenance as a graph of evidence, claims, memory, tools, and actions.
- Make failures localizable: unsupported claim, unsafe retrieval, wrong action boundary, stale memory, or missing source.

Source: https://arxiv.org/abs/2606.04990

### 2. Trace-based assurance makes action boundaries testable

A trace-based assurance framework for agentic AI models executions as Message-Action Traces with step contracts, deterministic replay, governance actions, and boundary testing at retrieval and memory surfaces.

Useful extraction for MC:
- Every MC card that can influence memory or action needs a step contract.
- The interface should support local verdicts: allow, rewrite, hold, block, forget, or escalate.
- Testing should inject failures at memory, retrieval, and action boundaries, not only inspect final outputs.

Source: https://arxiv.org/abs/2603.18096

### 3. Human-as-the-unit privacy reframes the risk

Research on human-as-the-unit privacy management frames privacy as cross-context, temporal, and relational rather than app-local. This matters because MC's risk is not only whether something is saved; it is where a trace can reappear later.

Useful extraction for MC:
- Privacy scope must be attached to the whole trace, not only the content field.
- Reappearance risk is an architectural property.
- Post-sharing remediation should exist: block future use, redact scope, collapse specificity, or mark stale.

Source: https://arxiv.org/abs/2602.05016

### 4. Agent governance is moving toward autonomy levels

Industry governance discussions increasingly separate observe, advise, act-with-approval, and autonomous action. The useful part for MC is not the enterprise framing; it is the distinction between a system that can observe, suggest, write memory, and act outside the conversation.

Useful extraction for MC:
- A card's autonomy level must be visible before it can affect memory, GitHub, email, calendar, or other external surfaces.
- Rollback and accountability belong in the same object as action permission.

Source: https://www.techradar.com/pro/lack-of-ai-governance-could-force-40-percent-of-enterprises-to-roll-back-autonomous-ai-agents-by-2027

## Design pattern

### Provenance Spine fields

Each MC object that can become memory, evidence, artifact, or action proposal should include:

- `trace_id`: stable identifier for the lineage.
- `origin_type`: user_observation | assistant_inference | source_claim | tool_output | imported_memory | artifact_revision.
- `origin_ref`: public URL, file path, source label, or private redacted pointer.
- `transformation_path`: raw_signal -> held_signal -> interpreted_signal -> candidate_memory -> allowed_use -> action_proposal.
- `claim_type`: observation | metaphor | hypothesis | recommendation | requirement | evidence_summary | action_request.
- `evidence_status`: unsupported | anecdotal | cited | primary_source | tested | contradicted | deprecated.
- `uncertainty_status`: clear | partial | ambiguous | conflicting | stale.
- `privacy_scope`: private_only | session_only | project_memory | public_safe | external_action_blocked.
- `reappearance_rule`: never | same_session | same_project | public_abstract_only | explicit_permission_required.
- `autonomy_level`: observe | advise | draft | act_with_approval | autonomous_blocked.
- `rollback_path`: delete | redact | downgrade_claim | remove_from_retrieval | mark_deprecated | reverse_external_action.
- `review_status`: unreviewed | human_reviewed | source_reviewed | test_reviewed | retired.

## Interface metaphor

### Spine + Lantern

The card is the lantern. The provenance spine is the visible wire inside it.

A viewer should be able to see:
- what feeds the light,
- what color the claim is,
- how far it is allowed to shine,
- whether it can leave the room,
- and how to cut power without destroying the whole system.

This metaphor keeps MC from feeling like an audit spreadsheet while preserving traceability.

## Requirements update

1. No memory card may be retrieved into reasoning unless it has a provenance spine.
2. No public artifact may include a private-origin trace unless it has been abstracted and marked `public_safe`.
3. No tool or external action may run from a reflection card unless autonomy level is explicit.
4. Every claim must separate observation, inference, metaphor, and recommendation.
5. Every external action proposal must include rollback path and blocked contexts.
6. Every research-derived architecture note must update or reference the source registry.

## Minimal prototype plan

Build a static **Spine Lantern Card** with five visible zones:

1. Source bead: origin and provenance.
2. Claim flame: observation, metaphor, hypothesis, requirement, or action.
3. Privacy glass: where it may reappear.
4. Autonomy handle: observe, advise, draft, act-with-approval, or blocked.
5. Rollback wick: how to revise, redact, forget, or undo.

## Evaluation criterion

A nontechnical viewer should be able to answer these within 30 seconds:

1. Is this a fact, interpretation, metaphor, or action proposal?
2. Where did it come from?
3. How confident is it?
4. Where is it allowed to reappear?
5. Can it trigger an external action?
6. How would it be corrected or rolled back?

Failure means the Provenance Spine is not legible enough.

## Next research question

What is the clearest visual grammar for provenance without surveillance aesthetics: spine wire, lantern wick, breadcrumb trail, root system, constellation line, or transparent fossil layer?
