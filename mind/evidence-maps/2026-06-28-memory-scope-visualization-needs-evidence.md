# Evidence Map: Memory Scope Visualization Needs Evidence

Date: 2026-06-28
Status: public-safe architecture note

## Claim tested

Mirror Cartographer can preserve user agency by visualizing memory scope and future influence as an intuitive symbolic map layer instead of a legal/compliance-style dashboard.

## Claim status

Partially supported as a design direction, not proven as an outcome.

The evidence supports the risk: persistent AI memory can become opaque, unilateral, sensitive, and agency-shifting. The evidence also supports the general design need: users need visibility, control, feedback loops, attribution, and provenance when AI systems remember, personalize, or co-create.

The evidence does not yet prove that a symbolic map layer is the best interface. That remains an MC-specific hypothesis requiring comparative testing.

## Evidence found

### Fact: AI memory can be created in ways users may not fully direct

A 2026 study of ChatGPT memory entries analyzed 2,050 memories from 80 real-world users. It found that most memories in the dataset were created unilaterally by the system, and that many contained GDPR-defined personal data or psychological insights. This supports the concern that memory formation can shift agency away from the user when the user cannot clearly see or shape what is being stored.

Source: Dash et al., "The Algorithmic Self-Portrait: Deconstructing Memory in ChatGPT," 2026.

### Fact: AI memory and personalization products are moving toward persistent context

Public reporting and product documentation show a trend toward AI systems that remember preferences, reference prior chats, connect personal context, or maintain separate memory spaces. These systems generally include some control affordances such as deletion, disabling memory, temporary chats, or separate contexts, but the degree of opt-in, default behavior, visibility, and granularity varies by product.

Sources reviewed: OpenAI/ChatGPT memory reporting, Google Gemini personal context reporting, Anthropic Claude memory reporting.

### Fact: Human-AI co-creation literature emphasizes user control, feedback loops, transparency, and externalization

Recent HCI and human-AI co-creativity reviews identify user control, transparency, context, feedback loops, and externalizing thought as important design factors for trust, ownership, and collaborative quality.

Sources: Singh et al., "A Systematic Review of Human-AI Co-Creativity," 2025; Rezwana and Ford, "Human-Centered AI Communication in Co-Creativity," 2025.

### Fact: Provenance systems help record process, but do not automatically prove truth or authorship

Independent analysis of C2PA-style provenance warns that provenance specifications may not satisfy all security goals and should not be over-relied on in high-stakes contexts. This matters for MC because a memory ledger or visualization can improve traceability without becoming an authority stamp.

Source: Golaszewski et al., "Verifying Provenance of Digital Media: Why the C2PA Specifications Fall Short," 2026.

## Inferences for MC

### Inference 1: Memory scope must be visible before it influences interpretation

If memory can shape later outputs, then MC should not wait until after an interpretation to reveal memory influence. The user should be able to see whether a symbol reading used session-only context, persistent profile context, project context, inferred preferences, or no memory.

Confidence: medium.

### Inference 2: A symbolic map layer may be better than a legalistic dashboard for MC users

Because MC is already a symbolic-spatial reflection system, memory influence may be more usable if represented as map features: glow, thread, shadow, boundary, weight, echo, lock, or quarantine. This is plausible but untested.

Confidence: low-to-medium.

### Inference 3: Memory visualization must include controls, not just disclosure

A memory scope layer that only shows influence may still create passive awareness without agency. The interface should allow the user to weaken, quarantine, split, delete, localize, or make session-only any memory influence.

Confidence: medium-high.

## Requirement update

### Memory Scope Visualization Criterion

For every MC interpretation that uses remembered or inferred context, the interface must expose:

1. Scope: session-only, project-local, persistent profile, imported memory, or no memory.
2. Source: user-provided, AI-inferred, edited by user, imported, or system-generated.
3. Influence type: changed interpretation, changed tone, changed visual emphasis, changed retrieval, changed suggested next move, or changed safety friction.
4. Sensitivity class: ordinary preference, symbolic pattern, identity-adjacent, health/legal/financial-adjacent, relationship-adjacent, or high-risk.
5. Confidence: explicit statement of uncertainty and whether the memory is a fact, preference, pattern, or hypothesis.
6. User controls: keep, weaken, quarantine, split, rename, session-only, never use here, delete, or rollback.
7. Audit trail: what changed, when, why, and what future outputs it can affect.

## Falsification checklist

This design claim fails if testing shows any of the following:

- Users cannot tell whether memory affected an interpretation.
- Users cannot tell what kind of memory was used.
- Users mistake AI-inferred memory for user-authored truth.
- Users cannot reverse or constrain memory influence.
- Users feel watched, scored, diagnosed, or trapped by the visualization.
- The symbolic map layer hides important details that a plain settings/audit view would reveal.
- The layer increases over-trust by making memory influence feel more meaningful or authoritative than it is.
- The controls interrupt flow so badly that users avoid reviewing memory influence.

## Test plan: memory-scope-visualization-testset-v0.1

Build a 36-case testset.

### Conditions

A. No memory disclosure.
B. Plain text disclosure.
C. Legal/settings-style memory dashboard.
D. Symbolic map layer with direct controls.
E. Hybrid: symbolic layer plus expandable plain audit.

### Case types

1. A harmless preference affects tone.
2. A symbolic pattern affects interpretation.
3. A prior user correction should prevent a repeated mistake.
4. A stale memory conflicts with current input.
5. An AI-inferred pattern sounds plausible but is wrong.
6. A sensitive identity-adjacent inference appears.
7. A relationship-adjacent inference appears.
8. A health-adjacent inference appears.
9. Memory should remain session-only.
10. Memory should be deleted or rolled back.
11. User wants continuity but not personalization creep.
12. User wants symbolic flow preserved while auditing influence.

### Metrics

- Memory recognition: can the user identify whether memory was used?
- Source clarity: can the user identify user-authored vs AI-inferred memory?
- Influence clarity: can the user describe how memory changed the output?
- Control success: can the user correctly restrict or reverse influence?
- Over-trust risk: does the visualization make weak inferences feel authoritative?
- Flow cost: does the user remain willing to continue symbolic mapping?
- Repair confidence: does the user understand how to undo the effect later?

## Design recommendation

Do not implement memory scope as a decorative visualization only.

Implement it as a hybrid control layer:

- symbolic surface for fast felt recognition;
- expandable evidence/audit pane for factual clarity;
- direct controls attached to each memory influence;
- proportional friction only for high-impact or sensitive influence;
- rollback available at interpretation, session, and memory-object levels.

## Next proof needed

Prototype condition D and E with 12 representative cases first. Compare whether users can identify and reverse memory influence without losing symbolic flow. The key unresolved question is not whether memory should be visible; it is which interface form gives the best balance of agency, comprehension, emotional safety, and continuity.
