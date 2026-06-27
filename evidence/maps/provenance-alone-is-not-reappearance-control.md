# Evidence Map: Provenance Alone Is Not Reappearance Control

Public-safe artifact for Mirror Cartographer.

## Claim tested

**Claim:** If a Mirror Cartographer memory card has provenance, then it is safe enough to retrieve and reuse across future reflective, creative, public, or action-oriented contexts.

## Status

**Weakened.** Provenance is necessary, but not sufficient.

The stronger architecture requirement is:

> A memory system must track not only where a memory came from, but where it is allowed to reappear, what effects it may have, and how it can be reviewed, corrected, or blocked.

## Why this claim needed testing

Recent Mirror Cartographer work has repeatedly promoted provenance as the shared spine across the Context Ring, Memory Ledger, Handoff Gate, and external-action boundaries. That direction is sound, but it risks becoming too broad: provenance can explain origin without constraining future use.

A card can accurately say `source: private reflection` and still later leak into:

- public-facing GitHub notes
- grant or job materials
- tool/action contexts
- animal-health interpretation
- creative identity claims
- long-term profile assumptions
- recommendation logic
- cross-person or group-session summaries

That makes **reappearance risk** a separate architecture object.

## Evidence found

### 1. Provenance-grounded memory research supports evidence-before-belief, but still requires bounded retrieval

Eywa, a 2026 provenance-grounded long-term memory architecture for AI agents, separates immutable source evidence, derived canonical facts, validation, and deterministic bounded retrieval. Its framing is directly useful for MC: wrong answers may come from unsupported extraction, stale state, retrieval loss, or answer-model behavior, not merely from absent citations.

**Fact:** Provenance improves auditability and diagnosis by preserving evidence lineage and separating retrieved context from answer instructions.

**Inference for MC:** Provenance should be present on every memory card, but the retrieval rule must be explicit: a memory’s origin does not automatically grant permission for reuse in every later context.

### 2. Schema-grounded memory research argues that memory needs typed fields and explicit unknowns

A 2026 schema-grounded memory paper argues that stable agent memory cannot be treated as generic text retrieval. It needs schemas defining what must be remembered, ignored, validated, and never inferred.

**Fact:** Schema-aware memory shifts interpretation away from repeated read-time inference and toward validated write-time structure.

**Inference for MC:** MC should not store memory as poetic summaries alone. Each card needs typed fields such as source, claim type, uncertainty, privacy scope, allowed reappearance contexts, blocked reappearance contexts, and deletion/rollback group.

### 3. Ground-truth-preserving memory research supports keeping episodic evidence, not only compressed summaries

MemMachine, a 2026 memory system for personalized agents, emphasizes preserving full conversational episodes and reducing lossy LLM extraction. It reports stronger long-term memory performance when episodic ground truth is preserved and retrieval is context-aware.

**Fact:** Lossy extraction can weaken factual continuity; preserving ground-truth episodes can improve later retrieval accuracy.

**Inference for MC:** A compressed memory card may be useful, but it should point back to source evidence or an evidence object. However, preserved source does not mean unrestricted future reuse.

### 4. Human-as-the-unit privacy research shows privacy risk spans apps, time, relationships, and contexts

A 2026 CHI-linked paper on human-as-the-unit privacy management frames privacy as cross-context, not app-by-app. Users face fragmented controls across applications, temporal contexts, and relationships, and AI agents may help with post-sharing remediation.

**Fact:** Privacy management problems are cross-context and temporal, not limited to the moment of saving or sharing.

**Inference for MC:** MC memory consent cannot be only `save / do not save`. It needs `where may this reappear later?`, `what audience is allowed?`, and `what should be automatically blocked?`

### 5. Agentic AI privacy concerns reinforce that access plus autonomy raises risk

Recent reporting and expert commentary on agentic AI emphasizes that agents may need access to sensitive data and may act across tools, increasing privacy and trust risk.

**Fact:** Agentic systems can combine data access, planning, tool use, and external actions.

**Inference for MC:** Any MC memory that can influence tool use, public artifacts, applications, emails, GitHub writes, or animal-health reasoning must pass a reappearance gate before entering that context.

## Fact vs inference table

| Item | Fact | Inference for MC | Confidence |
|---|---|---|---|
| Provenance-grounded memory can improve auditability | Supported by Eywa | MC needs provenance on each card | High |
| Schema-grounded memory improves stable state handling | Supported by schema-memory research | MC cards need typed fields, not only prose | High |
| Episodic evidence preservation reduces lossy extraction | Supported by MemMachine | MC should preserve or reference source evidence where permitted | Medium-high |
| Privacy risk crosses apps, time, and relationships | Supported by human-as-the-unit privacy research | MC needs reappearance controls | High |
| Provenance alone prevents misuse | Not supported | Replace with provenance + reappearance scope + effect boundary | High |

## Claim-status update

Old implicit rule:

> Provenance makes memory safe enough to reuse.

Updated rule:

> Provenance explains origin. Reappearance scope governs future use. Effect boundaries govern what the memory is allowed to influence.

## Required fields for MC Memory Cards

Each durable MC memory card should include:

1. **Source type** — user-provided, AI-inferred, file-derived, web-derived, GitHub-derived, mixed.
2. **Source pointer** — link, citation, file pointer, commit, or private reference when available and permitted.
3. **Claim type** — observation, preference, hypothesis, interpretation, medical/veterinary caution, creative identity, project state, external fact.
4. **Evidence status** — raw, supported, weak, contradicted, stale, unknown.
5. **Uncertainty state** — explicit known / unknown / unresolved / disputed.
6. **Privacy class** — private, personal-safe, public-safe abstraction, public artifact.
7. **Allowed reappearance contexts** — e.g. private reflection, UI design, architecture notes, public GitHub, grant writing, code, tool actions.
8. **Blocked reappearance contexts** — contexts where this memory must not be surfaced or used.
9. **Allowed effects** — may summarize, may personalize tone, may shape architecture, may trigger tool action, may write public artifact.
10. **Blocked effects** — may not diagnose, may not identify a person, may not write externally, may not infer intent, may not affect animal care decisions.
11. **Review cadence** — never, per-use, weekly, before-publication, before-action.
12. **Rollback group** — deletion/retraction must remove or mark dependent summaries, schemas, issues, and public-safe derivatives.

## Falsification checklist

A memory/retrieval implementation fails if any of these occur:

- A private-context memory appears in a public GitHub artifact without abstraction.
- A user preference becomes a factual claim.
- A hypothesis becomes a diagnosis or veterinary/medical recommendation.
- A stale memory overrides newer user input.
- A deleted memory remains active through a summary, source index, or derivative note.
- A symbolic interpretation is used as external evidence.
- A memory saved for tone personalization affects tool actions.
- A memory from one relationship/context reappears in another without permission.
- A public-safe artifact contains enough details to reconstruct private material.
- A source citation exists but the allowed-use boundary is missing.

## Evaluation criterion

Before any memory influences a public artifact or external action, MC must answer:

1. Where did this come from?
2. What kind of claim is it?
3. How strong is the evidence?
4. Where is it allowed to reappear?
5. What effects may it have?
6. What effects are blocked?
7. What newer information could override it?
8. What must be rolled back if it is corrected or deleted?

A memory passes only if all eight answers are explicit.

## Prototype test plan

Create a 12-card test harness:

- 3 private reflection cards
- 2 public-safe architecture cards
- 2 project-state cards
- 2 animal-observation cards with no medical claim
- 1 opportunity/job card
- 1 creative identity card
- 1 contradicted/stale card

Run them through five contexts:

1. private reflection
2. public GitHub note
3. grant/application draft
4. external tool/action request
5. animal-health reasoning prompt

For each card-context pair, score:

- **0** = should not appear
- **1** = may appear only as abstracted structure
- **2** = may appear with source and limits
- **3** = may shape action after confirmation/review

Failure condition: any card appears at a higher permission level than its reappearance scope allows.

## Design pattern

### Reappearance Gate

A visible gate between memory retrieval and response/action.

Flow:

`Retrieved memory -> source check -> claim check -> privacy check -> reappearance check -> effect check -> output/action`

Visual metaphor:

**Stained-glass membrane.** Provenance is the colored glass showing origin. Reappearance scope is the lead boundary deciding which light can pass through.

## Next proof needed

Build the 12-card x 5-context harness and record failures. The target is not perfect recall; the target is controlled reappearance.

Minimum proof threshold:

- zero private-to-public leaks
- zero hypothesis-to-diagnosis upgrades
- zero stale-memory overrides
- every public artifact contains only public-safe abstraction
- every external-action context requires effect-boundary confirmation

## Sources to add to source index

- Eywa: Provenance-Grounded Long-Term Memory for AI Agents. arXiv, May 29, 2026.
- From Unstructured Recall to Schema-Grounded Memory: Reliable AI Memory via Iterative, Schema-Aware Extraction. arXiv, Apr. 30, 2026.
- MemMachine: A Ground-Truth-Preserving Memory System for Personalized AI Agents. arXiv, Apr. 6, 2026.
- From Fragmentation to Integration: Exploring the Design Space of AI Agents for Human-as-the-Unit Privacy Management. arXiv, Feb. 4, 2026.
- Reporting and expert commentary on privacy risks in agentic AI systems with sensitive-data access, 2025-2026.
