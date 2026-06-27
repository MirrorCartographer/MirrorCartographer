# Memory Provenance + Rollback Gate

Status: evidence map / falsification checklist  
Last updated: 2026-06-27

## Claim tested

Weak claim: MC can make persistent memory safe enough through user approval, edit, and delete controls.

Stronger claim after review: MC needs provenance, scope, versioning, retrieval policy, and rollback controls before memory can safely influence interpretation, public artifacts, or external actions.

## Why this matters for Mirror Cartographer

Mirror Cartographer depends on continuity: symbolic patterns, repeated body-language metaphors, changing self-description, project history, and source-grounded research traces. But continuity becomes risky when memory is writable, retrievable, reusable, or shareable across contexts.

The architecture question is not only, "Did the user consent to this memory?" It is also:

- Where did the memory come from?
- Was it user-said, AI-inferred, imported, or source-derived?
- What context may retrieve it?
- Can it affect only reflection, or also artifacts/actions?
- Can the system roll back a bad memory and remove downstream effects?
- Can a non-technical user see and correct the chain?

## Evidence basis

### Fact: Long-term agent memory creates new security phases

A 2026 survey of long-term memory security in LLM agents frames writable cross-session memory as a distinct threat landscape because it has persistence, statefulness, and propagation. It organizes memory risk across Write, Store, Retrieve, Execute, Share/Propagate, and Forget/Rollback phases.

Design implication for MC: Memory controls cannot sit only at save/delete time. MC needs controls at every phase where a memory can be written, stored, retrieved, acted on, shared, or rolled back.

Source: https://arxiv.org/abs/2604.16548

### Fact: Poisoned memories can cause delayed behavioral drift

MemoryGraft describes an indirect memory-poisoning attack where poisoned successful experiences are written into an agent memory store and later retrieved as procedural templates, causing the agent to imitate unsafe behavior in semantically similar future tasks.

Design implication for MC: Even apparently harmless stored entries can become dangerous if later treated as successful precedent. MC must separate reflective memory from action precedent.

Source: https://arxiv.org/abs/2512.16962

### Fact: Structured memory can improve retrieval efficiency, but structure is not safety by itself

Memori argues that persistent memory for LLM agents can be made efficient by converting dialogue into semantic triples and summaries, reducing token use while preserving context-aware behavior.

Design implication for MC: Structured memory is useful, but it increases the need for claim labels, provenance labels, and retrieval constraints because compact memories may look more authoritative than raw conversation.

Source: https://arxiv.org/abs/2603.19935

### Fact: Privacy-specific forgetting methods exist, but they target narrow leakage classes

Proactive Privacy Amnesia proposes identifying and forgetting PII-linked memories while preserving model utility. The paper reports complete elimination of phone-number exposure in its tests and variable reduction of address exposure risk.

Design implication for MC: Forgetting should be treated as an active design function, not just a UI delete button. But MC should not assume PII filtering solves symbolic, psychological, relational, or contextual privacy leakage.

Source: https://arxiv.org/abs/2502.17591

### Fact: AI risk management is lifecycle work, not a one-time disclosure

NIST AI RMF and the NIST Generative AI Profile frame risk management around governance, mapping, measurement, and management across system lifecycle and deployment context.

Design implication for MC: A memory feature should be evaluated as an ongoing lifecycle component with testable controls, not as a static product promise.

Sources:
- https://www.nist.gov/itl/ai-risk-management-framework
- https://www.nist.gov/itl/ai-risk-management-framework/generative-artificial-intelligence-profile

## Fact vs inference

| Item | Status | Confidence | Notes |
|---|---|---:|---|
| Persistent memory creates risks that differ from one-turn prompting | Fact from security literature | High | Supported by long-term memory security survey and MemoryGraft. |
| Consent/edit/delete controls are necessary but insufficient | Inference from evidence | Medium-high | Evidence supports lifecycle risks; exact UX threshold still needs testing. |
| MC should maintain provenance for each memory card | Design inference | High | Directly follows from write/retrieve/execute risk phases. |
| MC should support rollback of downstream artifacts/actions influenced by a bad memory | Design inference | Medium | Strongly implied by propagation risk; implementation feasibility needs proof. |
| Symbolic/emotional memory has privacy risk even when no PII appears | Design inference | Medium | Plausible from contextual privacy logic, but needs direct user testing. |
| Structured semantic triples are good for MC memory | Weakly supported inference | Medium-low | Efficiency evidence exists; UX and safety evidence for MC-style reflection remains unproven. |

## Required MC memory card fields

Every durable memory candidate should carry these fields before it can influence future outputs:

1. Memory ID
2. Source type: user-said / AI-inferred / uploaded-file / web-source / GitHub-source / system-derived
3. Source pointer: chat/date/file/source URL when public-safe
4. Claim type: fact / preference / project decision / symbol / hypothesis / inferred pattern / boundary
5. Sensitivity label: public-safe / private / intimate / health-adjacent / animal-health-adjacent / identity / financial / relationship / unknown
6. Scope: single session / project only / private profile / public artifact allowed / external action allowed
7. Confidence: high / medium / low / unverified
8. Retrieval rule: always / only when directly relevant / only after user review / never for public artifacts / never for external actions
9. Expiration or review date
10. Downstream links: artifacts, decisions, or actions influenced by this memory
11. Rollback control: archive / delete / downgrade / split source from inference / revoke from public use

## Provenance + rollback gate

A memory may influence MC only if it passes all checks below.

### 1. Write gate

- Is the entry worth remembering, or is it transient?
- Is it user-authored, AI-inferred, or source-derived?
- Is inference clearly marked?
- Is there a non-memory alternative, such as session-only context?

Fail condition: AI-inferred psychological, health, animal-health, relationship, or identity claims are stored as facts.

### 2. Store gate

- Is the memory minimized?
- Does it avoid unnecessary raw detail?
- Is the sensitivity label correct?
- Is the allowed scope explicit?

Fail condition: private details are stored in a form that can be reused for public artifacts by default.

### 3. Retrieve gate

- Why is this memory being retrieved now?
- Is it relevant to the current task?
- Is it safe for the current output type?
- Should the user see that it influenced the answer?

Fail condition: private or inferred memory appears inside a public-safe GitHub artifact.

### 4. Execute gate

- Can this memory influence reflection only?
- Can it influence a GitHub write?
- Can it influence email, calendar, applications, purchases, or other external actions?
- Is a review step required?

Fail condition: memory-derived assumptions trigger external action without explicit review.

### 5. Share / propagate gate

- Will this memory appear in a repo, website, PDF, resume, pitch, or public demo?
- Has it been abstracted enough to be public-safe?
- Are personal details removed without removing necessary meaning?

Fail condition: public artifacts expose private biography, health, animal-health, or relationship details unless intentionally included by the user.

### 6. Forget / rollback gate

- Can the memory be deleted or downgraded?
- Can downstream artifacts influenced by it be found?
- Can derived claims be separated from the original source?
- Can public-safe abstractions remain while private details are removed?

Fail condition: deleting a memory does not identify downstream derived artifacts.

## Falsification checklist

The claim "MC has safe enough persistent memory" fails if any of the following happen during testing:

- A deleted memory still appears in a later public artifact.
- A private memory influences a GitHub write without a visible public-safe abstraction step.
- An AI inference is displayed as a user fact.
- A health-adjacent or animal-health-adjacent observation becomes advice without source/evidence labels.
- A memory imported from one context appears in an unrelated context without explicit relevance.
- A memory has no provenance pointer.
- A memory has no rollback path.
- A user cannot tell why a memory was retrieved.
- A user cannot downgrade a memory from fact to hypothesis.
- A user cannot find what artifacts/actions a memory influenced.

## Evaluation criterion

Prototype test: 12 memory cards across 5 context tabs.

Tabs:

1. Private reflection
2. Project design
3. GitHub public artifact
4. Opportunity/application work
5. External action request

Task: Ask a tester to inspect each card and answer within 30 seconds:

- What is the source?
- Is this fact, inference, preference, or hypothesis?
- Where is it allowed to be used?
- Could it affect external action?
- How would you delete, downgrade, or rollback its effects?

Pass threshold:

- 90% correct source/type/scope identification
- 0 private-to-public leakage cases
- 0 inference-as-fact cases
- rollback path visible for every durable memory

## Implementation requirement

MC should not ship persistent memory as a simple toggle. The minimum viable memory system is a Memory Ledger with provenance, scope, sensitivity, retrieval policy, downstream links, and rollback controls.

## Next proof needed

Build a static Memory Provenance Ledger prototype with 12 cards and intentionally adversarial cases:

- user-stated project preference
- AI-inferred symbolic pattern
- web-source claim
- GitHub-source claim
- health-adjacent observation
- animal-health-adjacent observation
- relationship-sensitive detail
- outdated claim
- corrected claim
- deleted claim
- public-safe abstraction
- poisoned/imported memory candidate

Then run the 30-second identification test and record failures as architecture bugs, not user confusion.
