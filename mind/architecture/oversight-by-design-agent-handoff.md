# Oversight-by-Design Agent Handoff

## Architecture question

When Mirror Cartographer moves from reflection into action, how should it decide which steps can remain lightweight, which steps require user review, and which steps need durable audit evidence?

## Why this question matters

The latest MC research scan surfaced a convergence:

- agentic AI is moving into ordinary workflows,
- reflective interfaces are being framed as human-AI reasoning loops,
- agent systems need auditability once they trigger external effects,
- and generative interfaces need oversight designed into the pipeline rather than added after the fact.

For MC, the hard boundary is not `chatbot vs app`. The hard boundary is `reflection vs action`.

Reflection can stay exploratory. Action needs gates.

## Research basis

### 1. Reflective reasoning belongs in the interaction layer

The reflective human-AI collaboration literature argues that reasoning can be treated as a distributed loop between human and model, rather than as a hidden property inside the model. The useful architecture idea is an externalized reasoning trace: articulation, critique, revision, and review become visible system phases.

MC implication: the interface should not merely show final answers. It should show how a thought moved through phases.

### 2. Oversight must be built into the UI pipeline

Oversight-by-design research argues that human review should not be an afterthought. Interfaces should include explicit escalation rules, risk signals, intervention controls, review feedback, and audit logs.

MC implication: the user should see why a handoff is gated, not only that it is gated.

### 3. Agent systems need auditability before accountability is possible

Agent auditability work separates accountability, auditability, and auditing. The practical dimensions are:

- action recoverability
- lifecycle coverage
- policy checkability
- responsibility attribution
- evidence integrity

MC implication: if MC lets an agent act, it needs a record of what was requested, what policy applied, what evidence was used, what tool was invoked, and what changed.

### 4. Agent interfaces are capability systems

AI-native software design is shifting from human-only interfaces to agent-invocable capabilities. The important unit is no longer just a screen; it is a capability with input contracts, allowed side effects, and reliability boundaries.

MC implication: each action should be represented as a capability card, not as a vague button.

## Design pattern

### The Handoff Gate

A Handoff Gate is a visible transition point where MC converts reflection into structured action.

It has five required fields:

1. Intent: what the user or system is trying to do.
2. Evidence: what sources, notes, or prior artifacts support the move.
3. Risk level: low, medium, high, or blocked.
4. Capability: what tool, workflow, or external system would be invoked.
5. Review mode: none, quick confirm, full review, or blocked.

## Handoff levels

### Level 0 — Reflect only

No external effect.

Examples:

- symbolic mapping
- private interpretation
- brainstorming
- internal comparison
- draft concept

Default review mode: none.

Record needed: optional session trace.

### Level 1 — Durable memory or GitHub note

Creates or updates a public-safe artifact, but does not contact people, spend money, alter accounts, or make claims about private material.

Examples:

- create public-safe concept node
- update roadmap
- add source index row
- write product wedge

Default review mode: quick confirm when interactive; public-safe abstraction when automated.

Record needed: source links, claim labels, privacy label, commit reference.

### Level 2 — Tool action with reversible effect

Uses a tool or connector with a reversible or low-risk outcome.

Examples:

- create draft email
- search files
- label information
- generate a prototype plan

Default review mode: full review before external release.

Record needed: tool call summary, input, output, human approval status.

### Level 3 — External side effect

Contacts people, sends messages, applies to jobs, buys something, deletes/archives data, publishes personal information, or changes account state.

Examples:

- send email
- submit application
- post publicly
- delete files
- schedule external meeting

Default review mode: mandatory explicit user approval.

Record needed: full action card, approval text, timestamp, recipients/targets, rollback path if available.

### Level 4 — Blocked or evidence-required

The action is unsafe, unsupported, or not evidence-grounded.

Examples:

- medical/veterinary claims beyond evidence
- scraping private accounts
- impersonation
- hidden autonomous outreach
- publishing sensitive personal material

Default review mode: blocked.

Record needed: reason blocked and safe alternative.

## Capability card schema

Each MC action capability should declare:

- capability_name
- plain_language_description
- allowed_inputs
- disallowed_inputs
- possible_outputs
- side_effect_level
- required_review_mode
- evidence_requirements
- privacy_requirements
- rollback_or_recovery_path
- audit_record_fields

## UI requirement

Any MC screen that can cause an external effect should show a compact Handoff Gate card before execution:

- `What will happen?`
- `What evidence is this based on?`
- `What could go wrong?`
- `What stays private?`
- `Can it be undone?`
- `Approve / revise / cancel`

For accessibility, the card must be readable as ordinary text and not depend on color alone.

## Public-safe automation rule

In non-interactive automation runs, MC may create or update public-safe internal artifacts if the artifact:

- avoids private details,
- cites sources or clearly marks unsupported ideas,
- does not contact people,
- does not spend money,
- does not publish sensitive material,
- and leaves a durable record in GitHub.

In automation runs, MC must not perform Level 3 actions without explicit prior authorization scoped to that action.

## Product wedge

Name: `MC Handoff Gate`

A small visible approval layer for reflective AI systems that lets a user understand when AI is thinking, saving, organizing, drafting, publishing, or acting.

Potential market:

- personal AI operating systems
- therapy-adjacent journaling tools
- creative research workspaces
- agentic productivity tools
- accessibility-first AI interfaces
- AI governance dashboards for small teams

## Demo idea

Build a prototype with three cards:

1. Reflective note: no gate needed.
2. GitHub concept node: public-safe artifact gate.
3. Send email: external side-effect gate requiring explicit approval.

The user should be able to compare the cards and immediately see why one action is lightweight and another is gated.

## Next experiment

Create a static `Handoff Gate` component for MC with sample data for Level 0, Level 1, and Level 3 actions. Test whether a user can answer three questions in under 30 seconds:

1. What will the AI do?
2. What evidence is it using?
3. Can this affect the outside world?

## Next research question

How can MC make agent audit logs useful to a non-technical user without turning the interface into a wall of compliance language?
