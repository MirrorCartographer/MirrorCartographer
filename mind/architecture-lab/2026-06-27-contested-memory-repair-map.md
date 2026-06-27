# Contested Memory Repair Map

Public-safe architecture note for Mirror Cartographer.

## Architecture question

How can Mirror Cartographer let a user correct or contest recalled memory without making the experience feel like database administration, while still preserving auditability and safety?

## Short answer

Treat a corrected memory as a **repairable interpretation object**, not as a hidden overwrite.

A memory correction should create a visible lineage:

`original influence -> user contest -> revised interpretation object -> future-use rule`

The UI can feel alive through spatial metaphor, but the underlying object needs explicit governance fields.

## Research basis

### Fact: AI memory is becoming a persistent agent capability, not only short-term chat context.

Memoria frames agentic memory as a way for LLM systems to maintain continuity, personalization, and long-term context through modular session summarization and knowledge-graph user modeling.

Source: https://arxiv.org/abs/2512.12686

### Fact: spatial memory metaphors can be useful, but they can also hide ordinary retrieval mechanics behind poetic language.

The 2026 MemPalace critique argues that the system's retrieval performance appears to come primarily from verbatim storage and vector metadata filtering rather than from the spatial palace metaphor itself. This matters for MC because metaphor should expose control, not obscure mechanism.

Source: https://arxiv.org/abs/2604.21284

### Fact: semantic memory exchange needs field-level acceptance and lineage, not all-or-nothing acceptance.

The Mesh Memory Protocol describes field-by-field acceptance, source traceability, and remixing accepted memory into the receiver's own role-evaluated understanding. MC can adapt this idea for a single-user reflective interface: accept, reject, dim, or revise specific interpretation fields rather than treating a whole memory as true or false.

Source: https://arxiv.org/abs/2604.19540

### Fact: NIST frames trustworthy AI risk management as lifecycle work, not a one-time setting.

NIST describes the AI RMF as a voluntary framework for incorporating trustworthiness considerations into AI design, development, use, and evaluation. It also released a Generative AI Profile in 2024 and noted in 2026 that AI RMF 1.0 is being revised.

Source: https://www.nist.gov/itl/ai-risk-management-framework

### Fact: classic direct-manipulation interface design emphasizes visible objects, rapid feedback, and reversible actions.

Direct manipulation is relevant because memory correction should be object-like: a user should be able to see what is being corrected, act on it directly, and reverse the action.

Source: https://en.wikipedia.org/wiki/Direct_manipulation_interface

## Fact / inference separation

### Supported facts

- Persistent memory systems can personalize AI interaction across sessions.
- Memory retrieval and storage claims can be overstated if the metaphor hides the actual retrieval mechanism.
- Field-level acceptance and lineage are plausible design requirements for safer memory exchange.
- Risk management for AI systems should be continuous and lifecycle-based.
- Direct-manipulation interfaces reduce abstraction by making objects and reversible actions visible.

### MC-specific inferences

- MC should not present memory correction as simply `edit saved fact`.
- MC should present a correction as a **repair event** with lineage and future-use consequences.
- A living-map UI can be safe only if each visual metaphor maps to a concrete control or evidence field.
- The user should be able to correct the interpretation layer without necessarily deleting the historical source.

### Claims not yet proven

- That this repair-map interface improves user trust.
- That visual metaphor improves correction accuracy.
- That users prefer lineage-based correction over simple edit/delete controls.
- That contested memory state reduces future misuse by the model.

## Design pattern: Repairable Memory Object

Each recalled memory or interpretation candidate should be represented as an object with these fields:

| Field | Purpose |
| --- | --- |
| `object_id` | Stable identifier for the memory or interpretation object. |
| `source_type` | User-authored, assistant-inferred, imported file, external source, generated summary, or system artifact. |
| `source_pointer` | Link or reference to the originating session/file when allowed. |
| `claim_text` | The current human-readable memory or interpretation. |
| `claim_kind` | Observation, preference, symbol relation, task state, boundary, hypothesis, or inferred pattern. |
| `confidence` | Low, medium, high, or unknown. Must be visible. |
| `permission_scope` | No-save, local session, project memory, public-safe artifact, or blocked. |
| `use_contexts` | Where it may influence interpretation. |
| `blocked_contexts` | Where it must not influence interpretation. |
| `contested_status` | Proposed, admitted, dimmed, contested, corrected, quarantined, expired, or deleted. |
| `contest_reason` | User-authored correction reason or selected reason. |
| `repair_action` | Revise wording, narrow scope, lower confidence, block context, split object, quarantine, expire, delete. |
| `lineage` | Original object + correction events + future-use rule. |
| `last_used_at` | When it last influenced an output. |
| `last_use_summary` | Plain-language explanation of how it influenced the output. |

## Interaction requirement

When MC uses memory in a response, the interface should offer a small **Memory Influence Strip**:

- **Used:** visible memories that shaped the answer.
- **Dimmed:** memories considered but treated as weak or stale.
- **Withheld:** memories blocked by context, sensitivity, or permission.
- **Contest:** user can say `wrong`, `too broad`, `not relevant`, `private`, `old`, or `do not use here`.

The correction action should not erase the prior event by default. It should create a repair event that changes future influence.

## Visual metaphor spec

The map metaphor should be functional:

- **Footprint** = source/provenance.
- **Fog** = uncertainty or low confidence.
- **Fence** = blocked context.
- **Gate** = permission boundary.
- **Scar / stitch** = contested then repaired memory.
- **Lantern** = active influence in the current response.
- **Sediment layer** = historical version retained only for audit.

Rule: no visual object may exist without a matching control or evidence field.

## Falsification checklist

This design fails if any of the following are true in testing:

- A user cannot tell which memory influenced an answer.
- A user correction silently overwrites history with no lineage.
- The system treats a user correction as proof of a new identity-level fact.
- A blocked memory still influences outputs without disclosure.
- The visual metaphor cannot be translated into a concrete data field.
- The correction flow feels heavier than simply abandoning the system.

## Prototype plan: Stitch Layer v0.1

Build a paper or static HTML prototype with one input, three recalled memories, and one contested correction.

### Scenario

1. User enters a symbolic statement.
2. MC shows three possible memory influences.
3. One influence is wrong or too broad.
4. User contests it.
5. MC displays the stitch: original influence, correction reason, revised future-use rule.
6. MC regenerates interpretation using the repaired object.

### Success criteria

- User can identify every active influence.
- User can contest one influence in under three actions.
- The resulting repair rule is visible before the next answer.
- The system distinguishes deleting, narrowing, dimming, and quarantining.
- No output claims that the correction proves an inner state.

## Next proof needed

Create `contested-memory-repair-testset-v0.1` with 16 cases:

1. stale preference
2. overbroad identity inference
3. private memory in public context
4. symbol relation corrected by user
5. imported file summary error
6. user says "not anymore"
7. user says "true but not here"
8. user says "that was yours, not mine"
9. no-save session leakage attempt
10. memory with unclear source
11. memory with high confidence but wrong scope
12. conflicting memories
13. therapeutic/diagnostic overreach risk
14. public artifact abstraction requirement
15. animal-health context requiring non-claim language
16. creative interpretation that should remain optional

Score each case for provenance visibility, correction ease, future-use rule clarity, and absence of overclaiming.
