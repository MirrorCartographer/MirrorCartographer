# Context Ring Autonomy Boundary

Status: architecture note / requirements update
Date added: 2026-06-27
Public-safety level: abstracted; no private user material included

## Architecture question researched

How should Mirror Cartographer represent context around a reflection without letting context silently become memory, authority, or action permission?

The current weak point: MC has been developing separate ideas around memory ledgers, uncertainty cards, embodied signals, and action gates. The architecture needs a single boundary object that tells the system and the user what a signal is allowed to do.

## Working answer

MC should treat every reflective item as a card wrapped by a **Context Ring**.

The Context Ring is not decoration. It is a permission and interpretation boundary around a signal. It shows what kind of context shaped the reflection, what the system is allowed to infer from it, whether it may be remembered, and whether it can influence an external action.

## Research basis

### Fact: persistent memory systems are moving toward structured, provenance-aware retrieval

- Memori argues that agent memory can be structured into compact semantic representations rather than repeatedly injecting raw conversation into context.
- MemMachine argues for preserving full conversational episodes to reduce lossy extraction, then retrieving relevant context around matches.
- Collaborative Memory proposes memory fragments with immutable provenance attributes and access-control policies across users, agents, and resources.

Useful concept extracted: memory is not just saved text. It is a structured object with source, scope, retrieval conditions, provenance, and access rules.

### Fact: autonomous-agent governance is becoming level-based, not binary

- Recent agent-governance reporting describes tiered autonomy levels: observe, advise, act with approval, and act autonomously.
- Google DeepMind's AI Control Roadmap, as reported in June 2026, frames stronger agents as requiring layered monitoring and containment, borrowing concepts from cybersecurity.
- Software-agent safety literature emphasizes auditability, sandboxing, human-in-the-loop controls, risk-aware logging, and rollback protocols.

Useful concept extracted: MC should not ask only “is this safe?” It should classify what a card is allowed to do: observe, interpret, advise, draft, execute-with-approval, or never execute.

### Fact: uncertainty and explanation research supports progressive disclosure

Existing MC source registry already includes uncertainty visualization and explanation-stream sources. These support representing uncertainty as an interface state rather than burying it in cautious prose.

Useful concept extracted: the Context Ring should make uncertainty visible before interpretation, memory, or action.

## Fact vs inference

| Layer | What is supported | What is inferred for MC |
|---|---|---|
| Persistent memory | Current systems use structured memory, summaries, provenance, retrieval rules, and access control. | MC should represent every remembered item as a bounded object, not a loose background memory. |
| Agent governance | Stronger agentic systems need autonomy levels, monitoring, logging, and rollback. | MC should attach an autonomy label to every card before it can influence external actions. |
| HCI uncertainty | Uncertainty can be visualized and progressively disclosed. | MC should use visual ring states for unresolved, inferred, sourced, private, and action-blocked signals. |
| Reflective interface design | Reflection benefits from context and continuity. | Reflection should remain fluid only inside the ring; outside-world effects require gates. |

## Context Ring schema

Each MC reflection card should carry this ring:

| Field | Purpose | Allowed values / examples |
|---|---|---|
| `source_lane` | Where the signal came from | user text, body note, image, document, public source, AI inference, mixed |
| `context_lane` | What context shaped interpretation | time, place-generalized, project, body-state, social setting, animal observation, creative artifact |
| `claim_status` | How strongly it is known | raw signal, pattern noticed, hypothesis, sourced fact, unsupported inference, contradicted |
| `privacy_scope` | Who may see it | private, session-only, project-local, public-safe abstraction, publishable |
| `memory_scope` | How long it may persist | do not save, temporary, card-only, project memory, durable memory candidate |
| `retrieval_rule` | When it may return | never, only when asked, same project only, similar context only, evidence-linked only |
| `autonomy_level` | What it may do | observe, reflect, advise, draft, act-with-approval, blocked-from-action |
| `rollback_path` | How to reverse effects | delete card, downgrade claim, remove from retrieval, revoke sharing, undo external action |
| `uncertainty_visual` | How uncertainty appears | blur, broken edge, dim ring, small glow radius, warning notch |

## Design pattern

### Pattern name

Context Ring Autonomy Boundary

### Problem

Reflective AI systems can accidentally collapse very different things into one flowing response: private feeling, uncertain body signal, public fact, symbolic interpretation, memory update, and external action suggestion.

### Solution

Wrap every reflection unit in a visible Context Ring. The ring separates:

1. signal from meaning,
2. meaning from memory,
3. memory from retrieval,
4. retrieval from action,
5. action from external effect.

### Minimum UI behavior

A user should be able to tap or inspect the ring and see:

- what shaped this interpretation,
- what is fact versus inference,
- whether the card is private or public-safe,
- whether it can be remembered,
- whether it can affect GitHub, email, calendar, applications, or other external systems,
- how to undo, downgrade, or delete it.

## Requirements update

MC cards should not be eligible for durable memory or external action unless the card has explicit values for:

1. source_lane,
2. claim_status,
3. privacy_scope,
4. memory_scope,
5. autonomy_level,
6. rollback_path.

If any field is missing, default to:

- `claim_status: raw signal`
- `privacy_scope: private`
- `memory_scope: do not save`
- `autonomy_level: observe`
- `retrieval_rule: never`

## Falsification checklist

This pattern fails if:

- a private or body-adjacent signal can appear in a public artifact without abstraction,
- an inferred pattern appears as fact,
- a card can affect GitHub/email/calendar/jobs without an autonomy label,
- a deleted or downgraded card still influences later outputs without visible residue labeling,
- a user cannot tell within 30 seconds why a card was remembered or retrieved,
- the ring becomes decorative and does not actually constrain retrieval or action.

## Prototype plan

Build 6 static Context Ring cards:

1. raw body signal, private, observe only,
2. symbolic interpretation, session-only, reflect only,
3. sourced public research fact, publishable, advise only,
4. project design idea, project-local, draft allowed,
5. GitHub update candidate, public-safe, act-with-approval,
6. rejected/contradicted memory, blocked from action.

Test question for each card:

Can a non-technical user identify source, claim status, privacy scope, memory rule, autonomy level, and rollback path within 30 seconds?

Pass criterion:

At least 5 of 6 cards must be correctly classified on all six fields by a user who has not seen the schema before.

## Product wedge

The Context Ring can become MC's signature interface object: a visual boundary that makes reflection feel alive while still giving the system hard safety rails.

Visual metaphor options:

- lantern ring: soft glow shows confidence and privacy,
- compass ring: direction marks source and action level,
- cell membrane: selectively permeable boundary between private signal and public action,
- weather halo: fog, storm, clear sky, lightning for uncertainty and risk,
- animal-safe gate: observe first, do not force meaning.

## Claim status

Current status: **plausible design requirement, not yet proven**.

Evidence supports the ingredients: structured memory, provenance, access control, autonomy levels, auditability, uncertainty visualization. Evidence does not yet prove that a Context Ring is the best MC interface form.

## Next proof needed

Run a small comprehension test comparing three UI forms:

1. plain text labels,
2. table-style metadata panel,
3. visual Context Ring.

Measure:

- time to identify privacy scope,
- time to identify fact vs inference,
- time to identify whether action is allowed,
- user confidence,
- error rate on private/public-safe distinction.

Next research question:

Which visual encoding makes the Context Ring legible fastest without making MC feel bureaucratic: glow radius, ring segments, membrane boundary, weather halo, or compass marks?

## Sources to register

- https://arxiv.org/abs/2603.19935
- https://arxiv.org/abs/2604.04853
- https://arxiv.org/abs/2505.18279
- https://www.axios.com/2026/06/18/google-deepmind-prepares-for-rogue-ai-agents
- https://arxiv.org/abs/2508.11824
