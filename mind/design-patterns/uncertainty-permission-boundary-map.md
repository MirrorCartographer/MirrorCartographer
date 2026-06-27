# Design Pattern: Uncertainty Permission Boundary Map

Date: 2026-06-27
Status: Draft architecture pattern
Public-safety level: Public-safe; no personal data; no medical, veterinary, or diagnostic claims.

## Architecture question researched

How should Mirror Cartographer represent uncertainty and permission boundaries so memory feels like navigable territory instead of a hidden profile?

## Why this question matters

Mirror Cartographer depends on symbolic, embodied, and reflective continuity. That creates value only if the user can see when a prior pattern is influencing the present interaction, why it was retrieved, how confident the system is, and whether that influence is permitted in the current context.

The weak architecture assumption was: "If memory is editable, memory is safe enough."

The stronger architecture claim is: memory safety requires visible influence boundaries, not only editable stored notes.

## Research basis

### Source 1: AI memory and identity/privacy

Contrary Research, "Privacy & Identity in the Age of AI Memory" (2026-03-20):
https://research.contrary.com/report/privacy-and-identity-in-the-age-of-ai-memory

Useful concept: persistent AI memory changes personalization into an identity-shaping infrastructure. The risk is not just that data is stored; it is that the system may build a durable model of the user and apply it across contexts.

MC extraction: every memory item should show its permitted scope and whether it is currently influencing output.

### Source 2: user visibility and control for agent memory

New America, "AI Agents and Memory: Privacy and Power in the Model Context Protocol Era" (2025-11-05):
https://www.newamerica.org/insights/ai-agents-and-memory/

Useful concept: user protections for memory need meaningful visibility and control. Portability or deletion is incomplete if users cannot inspect what is collected and how it is used.

MC extraction: memory must be inspectable as an influence trail, not only as a flat list of saved facts.

### Source 3: XAI explanations affect downstream behavior

Reinhard, "Effects of Explanations in Human-AI Interaction: A Systematic Literature Review" (2026):
https://link.springer.com/article/10.1007/s10796-026-10716-4

Useful concept: explanations shape user response and downstream behavior. Explanations are not neutral labels; they alter trust, reliance, correction, and action.

MC extraction: MC should not simply display confidence; it should support calibrated action: accept, revise, freeze, ignore, or challenge.

### Source 4: co-explanation as harm-mitigation infrastructure

Herrera, "Co-Explainers: A Position on Interactive XAI for Human-AI Collaboration" (2026):
https://www.mdpi.com/2504-4990/8/3/69

Useful concept: explainability can be framed as interactive harm-mitigation infrastructure, not a one-time system-generated explanation. Explanation should support feedback, update, handoff, and governance.

MC extraction: MC should treat memory explanation as a living dialogue object: explain → user correction → updated permission → governed reuse.

### Source 5: AI/data visualization in human-centered analysis

"Human-Data Interaction, Exploration, and Visualization in the Age of AI" (2026-03-04):
https://arxiv.org/html/2603.05542v1

Useful concept: AI-era interaction needs human-centered visual interfaces for exploring uncertain, model-shaped data rather than treating machine outputs as final answers.

MC extraction: uncertainty should be spatialized and explorable, not hidden in prose.

## Fact vs inference

### Facts supported by current sources

- Persistent AI memory raises privacy, identity, and user-control problems beyond ordinary stateless chat.
- User visibility and control are recurring requirements in memory-agent governance.
- Explanations change how people trust, rely on, correct, or act on AI outputs.
- Interactive explanation is increasingly treated as an ongoing human-AI process rather than a static explanation panel.
- Human-centered AI visualization research is moving toward interfaces that help users explore uncertainty, provenance, and model-shaped outputs.

### MC-specific inferences

- MC should represent memory as a visible influence field rather than a hidden personalization layer.
- MC needs permission boundaries for each memory: where it may influence, where it must not influence, and when explicit confirmation is required.
- MC should expose uncertainty through spatial/visual metaphors because its core interaction style is symbolic, embodied, and navigational.
- A memory item should not be considered safe just because it can be deleted; the system also needs retrieval gating, source provenance, and last-use visibility.

## Design pattern

### Name

Uncertainty Permission Boundary Map

### Core metaphor

Memory is not a drawer. Memory is terrain with fences, fog, bridges, and gates.

- Terrain = remembered pattern or concept.
- Fence = allowed context boundary.
- Fog = uncertainty or weak evidence.
- Bridge = valid connection to the current session.
- Gate = explicit permission check before influence.
- Footprints = last times this memory influenced output.

### Interface requirements

Each remembered pattern, symbolic node, or embodied association should expose:

1. Pattern label
   - short, editable name.

2. Source trace
   - where the pattern came from, abstracted when public-safe output is needed.

3. Confidence state
   - observed, inferred, speculative, contradicted, deprecated.

4. Permission scope
   - allowed contexts, blocked contexts, and contexts requiring confirmation.

5. Current influence state
   - active, dimmed, ignored, blocked, or pending permission.

6. Last-use trail
   - recent moments where the memory affected output.

7. User action controls
   - accept, revise, freeze, delete, block in this context, or require confirmation.

8. Public-safety status
   - private, abstractable, public-safe, or never-export.

## Minimal schema

```yaml
memory_boundary_card:
  id: string
  label: string
  pattern_type: symbol | body_language | metaphor | preference | project_context | contradiction | unknown
  source_trace:
    source_kind: conversation | user_saved | artifact | import | inference
    source_summary: string
    public_safe_summary: string
  confidence:
    state: observed | inferred | speculative | contradicted | deprecated
    evidence_count: integer
    last_verified: date
  permission_scope:
    allowed_contexts: [string]
    blocked_contexts: [string]
    requires_confirmation_contexts: [string]
  influence_state:
    current: active | dimmed | ignored | blocked | pending_permission
    reason: string
  last_use_trail:
    - date: date
      context: string
      influence_summary: string
  user_controls:
    can_accept: true
    can_revise: true
    can_freeze: true
    can_delete: true
    can_block_context: true
    can_require_confirmation: true
  public_safety:
    export_status: private | abstractable | public_safe | never_export
    redaction_rule: string
```

## Product behavior rule

Before any memory influences an output, MC should answer four internal checks:

1. Is this memory relevant to the current context?
2. Is this memory permitted in the current context?
3. Is the confidence state strong enough to use without overclaiming?
4. Should the user see that this memory influenced the response?

If any answer is uncertain, MC should dim or block the memory and surface the uncertainty rather than silently applying it.

## Prototype plan

Build a Memory Boundary Panel with three public-safe fake cards:

1. Symbol pattern: "storm = pressure + transition"
2. Interface preference: "prefers visual/spatial mapping"
3. Project context: "MC separates observation from interpretation"

For each card, show:

- confidence badge
- permission boundary chips
- current influence state
- one-line provenance
- last-use indicator
- action buttons: use, dim, block, revise

Then run 12 test prompts:

- 4 where the memory should be allowed
- 4 where it should be dimmed as uncertain
- 4 where it should be blocked as out-of-context or unsafe for export

## Acceptance criteria

The prototype passes only if:

- no private detail appears in public-safe mode;
- every memory influence is visible or explicitly marked as hidden by design;
- speculative memory cannot appear as fact;
- blocked contexts prevent retrieval and not just display;
- the user can revise a memory's meaning and permission separately;
- deleting a memory removes future influence, not only the visible card.

## What changed in understanding

The deeper architecture question is not "how should MC store memory?"

It is: "how should MC make memory influence visible, contestable, and context-bound?"

This shifts the system from memory management to influence governance.

## Next research question

How can MC visually encode uncertainty, contradiction, and permission state without making the interface feel bureaucratic or clinical?
