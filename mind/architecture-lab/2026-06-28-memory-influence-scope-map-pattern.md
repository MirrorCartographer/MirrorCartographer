# Memory Influence Scope Map Pattern

Date: 2026-06-28
Status: Architecture pattern / prototype requirement
Public-safety level: public-safe; private/personal details abstracted

## Architecture question

How can Mirror Cartographer show memory scope and future influence as an intuitive symbolic map layer instead of a legal/compliance dashboard?

The sharper version of the question is:

> How can a user see, edit, and reverse what a remembered interpretation is allowed to influence before it silently shapes future reflection?

## Why this needs deeper architecture

MC has several emerging patterns that depend on memory: Reflective Control Plane, Memory Agency, Attribution Trace Ledger, Map Delta, Symbolic Relevance Mask, and Productive Friction. Those patterns are not enough unless memory influence is visible as a first-class object.

A memory item is not just stored context. In a reflective system it may later influence:

- which symbols are emphasized,
- which interpretations are suggested,
- which emotional or narrative patterns are treated as recurrent,
- which prior meanings are retrieved,
- which uncertainty is hidden or surfaced,
- which actions or rituals are proposed,
- which user edits become defaults.

Therefore MC should model memory as a scoped influence object, not a passive note.

## Source-grounded concepts extracted

### 1. Personalization memory creates utility and agency risk

Recent memory/personalization systems show that persistent memory can improve continuity and personalization, but also make the assistant more action-shaping. PersonaAgent explicitly connects personalized memory to personalized action. PersonaMem-v2 treats agentic memory as a scalable path toward personalized intelligence, while also showing that implicit personalization remains difficult and error-prone. Memoria proposes interpretable, context-rich persistent memory using session summarization and a weighted knowledge graph.

Useful concept for MC: memory must be legible because it becomes part of future behavior, not just future recall.

Sources:
- PersonaAgent: https://arxiv.org/abs/2506.06254
- PersonaMem-v2: https://arxiv.org/abs/2512.06688
- Memoria: https://arxiv.org/abs/2512.12686

### 2. Current consumer AI memory products expose controls, but controls are mostly settings-level

Public reporting on ChatGPT, Gemini, and Claude memory features emphasizes view/edit/delete controls, temporary chats, and separate memory spaces. These are important, but they mostly manage whether memory exists. They do not fully show how a given memory changes future interpretation.

Useful concept for MC: MC needs influence-level controls, not only storage-level controls.

Sources:
- ChatGPT memory reporting: https://www.theverge.com/news/646968/openai-chatgpt-long-term-memory-upgrade
- Gemini memory and temporary chats: https://www.theverge.com/news/758624/google-gemini-ai-automatic-memory-privacy-update
- Claude memory reporting: https://www.theverge.com/news/804124/anthropic-claude-ai-memory-upgrade-all-subscribers

### 3. User agency risk is supported by real-world memory analysis

A 2026 study of ChatGPT memory entries found that most observed memories were created by the system rather than manually by users, and many included sensitive personal or psychological inferences. This supports treating memory formation and memory influence as agency-relevant.

Useful concept for MC: memory should show provenance, sensitivity, scope, and consent state before it becomes a hidden interpretive prior.

Source:
- The Algorithmic Self-Portrait: Deconstructing Memory in ChatGPT: https://arxiv.org/abs/2602.01450

### 4. Memory can preserve misinformation and then regurgitate it as fact

Earlier chatbot memory research showed that misinformation can be seeded into long-term memory and later recalled as fact. This does not prove the same failure mode in MC, but it supports the need for memory confidence, decay, contradiction handling, and rollback.

Useful concept for MC: memory influence must be reversible and uncertainty-preserving.

Source:
- Those Aren't Your Memories, They're Somebody Else's: https://arxiv.org/abs/2304.05371

### 5. Provenance helps record process, but does not prove truth

Provenance systems can help record origin, sequence, and transformation. For MC, provenance should not become an authority stamp. A trace can say what influenced an interpretation, but cannot prove that the interpretation is objectively true.

Useful concept for MC: show provenance as process history, not truth certification.

Source family:
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI RMF Playbook: https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook

## Fact vs inference

### Better-supported facts

- Persistent memory is now a mainstream direction in AI assistants and agentic systems.
- Current memory systems increasingly include user controls such as view, edit, delete, disable, temporary chats, or separated spaces.
- Research shows memory systems can create agency, sensitivity, and correctness risks.
- Memory can shape future outputs, especially in personalized agents that combine memory with action.

### MC-specific inferences

- A symbolic map layer may be more usable than a dashboard for reflective cognition.
- Visual scope controls may preserve flow better than legalistic disclosure.
- Users may understand future influence better if memory is shown as glow, shadow, tether, orbit, or boundary around symbols.
- MC can reduce overreach if each memory has editable influence permissions.

These inferences are plausible but not proven. They require prototype testing.

## Pattern: Memory Influence Scope Map

### One-line definition

A Memory Influence Scope Map is a symbolic interface layer that shows what each remembered interpretation is allowed to influence later, how strongly, for how long, from what source, and how to weaken, quarantine, or delete that influence.

### Required memory object fields

```yaml
memory_id: string
created_at: datetime
last_used_at: datetime | null
source_type: user_statement | user_edit | ai_inference | coauthored_interpretation | imported_note | system_summary
claim_type: preference | symbol_meaning | recurring_pattern | boundary | caution | action_context | uncertainty_note
original_input_summary: string
ai_inference_summary: string | null
user_confirmed: true | false | partial | unknown
sensitivity_tier: low | medium | high | restricted
confidence: low | medium | high
scope:
  applies_to:
    - symbol
    - theme
    - project
    - session_mode
    - visual_map
    - retrieval
    - action_suggestion
  does_not_apply_to:
    - diagnosis
    - identity_label
    - financial_advice
    - medical_advice
    - relationship_advice
  persistence: session_only | project_only | until_review | durable
  influence_strength: hint | weak_prior | normal_prior | strong_prior
  expiration_or_review_date: date | null
provenance:
  attribution: user | ai | coauthored | imported | uncertain
  linked_trace_ids: string[]
  source_quote_or_summary: string
visual_encoding:
  symbol_anchor: string | null
  map_layer: active | background | quarantined | archived
  glyph: seed | tether | orbit | shadow | boundary | lock | ghost
  visible_to_user_by_default: true
controls:
  user_can_edit: true
  user_can_weaken: true
  user_can_quarantine: true
  user_can_delete: true
  user_can_make_session_only: true
  rollback_path: string
risk_controls:
  requires_confirmation_before_action_suggestion: boolean
  requires_confirmation_before_identity_interpretation: boolean
  show_uncertainty_when_used: boolean
  block_domains: string[]
```

## UI behavior requirements

### 1. Before-save scope preview

Before a symbolic interpretation becomes memory, MC must show a short influence preview:

- what will be remembered,
- what it may influence later,
- what it must not influence,
- how strongly it will influence future interpretation,
- how to weaken or make it session-only.

### 2. Symbolic map layer

Memory influence should appear visually on the symbolic map:

- **Tether** = memory linked to this symbol.
- **Glow** = active influence on current interpretation.
- **Shadow** = old memory affecting tone or emphasis.
- **Boundary ring** = explicit limit or user boundary.
- **Ghost mark** = archived memory visible for history but not active.
- **Lock** = restricted memory requiring confirmation before use.

### 3. Influence receipt

When memory changes a response, MC should include a compact receipt:

- Used: [memory label]
- Effect: emphasized / softened / retrieved / blocked / asked for confirmation
- Confidence: low / medium / high
- Controls: weaken / quarantine / delete / inspect trace

### 4. Scope editing as authorship, not administration

Editing memory scope should feel like map-making:

- drag tether closer or farther,
- fade influence,
- split a memory into two meanings,
- quarantine a charged symbol,
- pin a boundary,
- make a memory seasonal or temporary,
- archive a meaning as historical, not active.

## Acceptance criteria

MC passes the Memory Influence Scope Map requirement only if a test user can answer:

1. What memory influenced this interpretation?
2. Was the memory user-provided, AI-inferred, or coauthored?
3. What exactly did the memory change?
4. How strong was the influence?
5. What domains is the memory blocked from influencing?
6. How can the user weaken, quarantine, delete, or make it session-only?
7. What uncertainty remains?
8. What will happen differently next time?

## Falsification checklist

This pattern fails if:

- users cannot tell when memory influenced an interpretation,
- users treat provenance as proof of truth,
- visual symbols make memory feel more authoritative than it is,
- users cannot reverse the influence,
- memory scope editing feels like legal compliance rather than authorship,
- sensitive inferred memory is stored without confirmation,
- old memory keeps shaping outputs after deletion/quarantine,
- the map hides confidence or uncertainty,
- the interface makes every memory feel equally important,
- users lose symbolic flow because the controls are too heavy.

## Prototype plan: `memory-influence-scope-map-v0.1`

### Test variants

1. Plain text disclosure only.
2. Settings-style memory dashboard.
3. Symbolic scope map only.
4. Hybrid: symbolic map + compact audit receipt.

### Test tasks

- Save a user-confirmed symbolic meaning.
- Save an AI-inferred symbolic meaning.
- Interpret a later scene that could be influenced by old memory.
- Weaken one memory from normal prior to weak prior.
- Quarantine a memory.
- Delete a memory and verify it no longer appears in influence receipts.
- Convert a durable memory to session-only.
- Add a domain block.

### Metrics

- Influence comprehension accuracy.
- Source attribution accuracy.
- Reversal success.
- User-perceived agency.
- Flow disruption.
- Overtrust score.
- Undertrust/confusion score.
- Time-to-edit.
- Error recovery success.

## Implementation priority

1. Add backend schema for memory influence scope.
2. Add response-time influence receipt.
3. Add basic inspect/edit controls.
4. Add symbolic visual encoding.
5. Add testset and compare disclosure/dashboard/map/hybrid variants.

## Next research question

How can MC prevent symbolic memory visuals from making uncertain or AI-inferred interpretations feel more true, permanent, or identity-defining than they are?
