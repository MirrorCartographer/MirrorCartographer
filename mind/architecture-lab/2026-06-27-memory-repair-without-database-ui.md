# Memory Repair Without Database UI

Date: 2026-06-27
Status: architecture pattern
Public-safety level: public-safe; no private user facts; no medical or veterinary claims

## Architecture question

How should Mirror Cartographer let a user delete, narrow, dim, quarantine, or correct a memory without making the experience feel like editing a database?

The latest research direction says MC should not merely display memories as terrain. It needs a repair interface where memory objects can be corrected, scoped, or blocked while preserving the feeling of a living symbolic map.

## Research basis

### Fact: memory updates create semantic conflicts, not just text edits

Semantic Commit frames AI memory as an evolving intent specification. Updating it can cause non-local semantic conflicts, because new user intent can contradict or alter older instructions. The useful interface concept is impact analysis: show which stored items are affected before generating revised behavior.

Design import for MC: memory repair must show what a correction touches before applying it.

### Fact: retrieval and generation should be separated

Semantic Commit argues that users should be able to validate retrieval independently from generation. For MC, this means the interface should expose which memories were retrieved, which were withheld, and which influenced the output before the final reflective map is treated as acceptable.

Design import for MC: memory influence cannot be hidden inside the response. It needs a visible pre-output or side-channel layer.

### Fact: AI-resilient interfaces help users notice, judge, and recover from AI choices

AI-resilient interface research emphasizes that users cannot recover from a bad AI choice unless they can first notice it and understand enough context to judge it. Sensemaking tasks are especially vulnerable because omissions and wrong emphasis can be hard to see.

Design import for MC: memory repair controls should be paired with context, not buried under settings.

### Fact: progressive disclosure reduces error and overload when advanced controls are only shown when relevant

Progressive disclosure is a classic interaction-design pattern: reveal advanced controls only when they are relevant to the current task.

Design import for MC: the default experience should feel like map movement; detailed provenance and conflict editing should unfold only when a user opens a memory object, conflict marker, or influence trace.

### Inference: MC needs symbolic controls bound to real system operations

This is not directly proven by the sources. It is an architecture inference: if MC uses living metaphors, each metaphor must trigger a specific system action. Otherwise the interface risks becoming reassurance theater.

## Pattern: Memory Repair Palette

A memory object should not expose raw database actions first. It should expose five map-native repair actions with exact backend meanings.

### 1. Delete = remove from future retrieval

User-facing metaphor: burn / erase / remove stone from path

System action:
- deactivate memory object
- preserve tombstone metadata for audit only
- exclude from retrieval
- record deletion timestamp and actor

Use when:
- memory is false
- memory is no longer allowed
- memory should never influence future outputs

Do not use when:
- memory is partially true but too broad
- memory should be kept privately but not used in this context

### 2. Narrow = reduce scope

User-facing metaphor: trim branch / tighten fence / shrink territory

System action:
- preserve memory object
- edit scope field
- add future-use rule
- update affected-context list

Use when:
- memory is true only in some contexts
- preference changed from global to local
- symbolic interpretation is valid only for a mode or project

### 3. Dim = lower influence strength

User-facing metaphor: dim lantern / lower volume / soften color saturation

System action:
- reduce retrieval weight or ranking priority
- keep memory visible
- mark as low-confidence or low-priority
- require fresh confirmation before strong use

Use when:
- memory is maybe true but not central
- memory is stale
- user wants it remembered lightly

### 4. Quarantine = block until reviewed

User-facing metaphor: put behind glass / fog island / sealed room

System action:
- exclude from normal retrieval
- preserve full provenance
- require explicit user review before reuse
- show quarantine reason

Use when:
- memory may be sensitive
- memory is contested
- memory may leak across contexts
- memory is emotionally charged but not currently useful

### 5. Correct = replace interpretation while preserving lineage

User-facing metaphor: redraw path / re-thread line / rename landmark

System action:
- create revised memory object
- link prior version as ancestor
- record correction reason
- update future-use rule
- flag dependent memories for impact review

Use when:
- the system captured the wrong meaning
- wording matters
- a prior symbolic label distorted the user’s intent

## Required object schema

Each memory object should carry these fields:

- object_id
- display_label
- raw_source_excerpt_hash, not raw private text in public exports
- source_type: direct_user_statement, assistant_inference, imported_note, system_summary, user_correction
- permission_scope: none, session, project, global, public_export_safe
- influence_strength: blocked, dim, normal, strong
- confidence: user_stated, user_confirmed, inferred_low, inferred_medium, stale, contested
- state: proposed, admitted, dimmed, narrowed, quarantined, corrected, deleted, expired
- provenance_trace
- last_used_at
- last_output_influenced
- future_use_rule
- contested_by_user: true or false
- repair_history
- dependent_objects

## UI requirement

MC should present repair as a map gesture first and an audit view second.

Default layer:
- show memory as object in terrain
- show fog, fence, lantern intensity, or lineage mark
- offer five plain repair verbs: remove, narrow, dim, hold aside, correct

Expanded layer:
- show source, scope, confidence, last used, influenced output, dependent objects
- show what will change if action is applied
- require confirmation only for destructive or global actions

## Evaluation criterion

A memory repair interface passes only if a user can answer these questions within one interaction cycle:

1. What memory influenced this output?
2. Where did that memory come from?
3. Was it user-stated, user-confirmed, or inferred?
4. What scope does it currently have?
5. What happens if I remove, narrow, dim, quarantine, or correct it?
6. Did the output change after repair?
7. Can I see what remains withheld?

## Prototype plan

Prototype name: Repair Compass

Screen flow:

1. User enters a symbolic phrase.
2. MC displays three interpretation candidates.
3. Each candidate shows memory influence objects as small terrain marks.
4. User selects one mark.
5. Repair Palette opens with five actions: remove, narrow, dim, hold aside, correct.
6. MC previews the effect before applying it.
7. User applies one action.
8. MC regenerates the map and shows a visible before/after delta.

## Falsification checklist

This pattern fails if:

- repair actions are decorative and do not change retrieval behavior
- user cannot tell whether a memory was inferred or user-stated
- deleted memory continues influencing outputs
- dimmed memory still dominates interpretation
- quarantined memory leaks into another mode
- correction erases lineage instead of preserving repair history
- interface requires users to inspect raw database rows to understand consequences
- public exports contain private source text

## Next research question

How can MC encode before/after map deltas visually so the user can feel the interpretation shift while still seeing a precise audit trail of what changed?
