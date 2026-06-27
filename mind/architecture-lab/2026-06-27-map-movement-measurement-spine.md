# Map Movement Measurement Spine

Status: architecture note / evaluation requirements update
Date: 2026-06-27
Public-safe scope: This artifact does not encode private user material. It defines how Mirror Cartographer can evaluate reflective interface movement without claiming to measure a person's inner state.

## Architecture question

How can Mirror Cartographer measure “map movement” concretely enough for product testing without flattening symbolic, embodied, and creative material into fake clinical certainty?

## Why this question matters

Recent MC research threads pointed toward three linked design needs:

1. MC should become a testable artistic-intelligence interface, not only a symbolic archive.
2. MC should evaluate the path of interaction, not only the final generated reflection.
3. MC must keep uncertainty, memory influence, and user agency visible.

The weak point is measurement. If MC says it measures transformation, that overstates certainty. If MC refuses measurement entirely, it cannot improve, demonstrate value, or defend design choices.

## Research basis

### Source A — human-AI co-creativity review

A 2025 systematic review of human-AI co-creativity identifies design dimensions relevant to MC: creative phase, task, proactive system behavior, user control, embodiment, and model type. It reports that higher user control is associated with greater satisfaction, trust, and ownership, and that transparency plus externalizing user thought are recurring design considerations.

Useful concept for MC: measure interaction conditions that support ownership and control, not “depth” as an invisible outcome.

Source: Singh, Hindriks, Heylen, Baraka, “A Systematic Review of Human-AI Co-Creativity,” 2025. https://arxiv.org/abs/2506.21333

### Source B — trajectory-level evaluation for human-AI co-creation

A 2026 reliability-aware LLM-as-judge framework for human-AI co-creation in coding evaluates multi-turn trajectories using signals such as turn-wise confidence, success-at-turn, time-to-success, revision churn, and output quality. Although the domain is coding, the important transferable point is that co-creation can be evaluated across the interaction path, not only by final output.

Useful concept for MC: create trajectory metrics for reflective mapping, but keep them inspectable and non-clinical.

Source: Amin et al., “LLM-as-a-Judge for Human-AI Co-Creation: A Reliability-Aware Evaluation Framework for Coding,” 2026. https://arxiv.org/abs/2604.27727

### Source C — memory retrieval as a trust boundary

A 2026 paper on personal-agent memory argues that similarity-based memory retrieval can admit contextually inappropriate memories, creating risks such as cross-domain leakage, sycophancy, tool-call drift, and memory-induced jailbreaks. It frames memory search as a trust boundary and proposes query-conditioned admission.

Useful concept for MC: map movement must include whether memory influence was admitted, blocked, revised, or contested.

Source: Zhang et al., “Beyond Similarity: Trustworthy Memory Search for Personal AI Agents,” 2026. https://arxiv.org/abs/2606.06054

### Source D — privacy-preserving memory placeholders

A 2026 edge-cloud memory paper proposes detecting privacy-sensitive spans locally and replacing them with semantically structured placeholders so useful memory processing can continue without exposing sensitive values.

Useful concept for MC: public/demo datasets can preserve semantic structure while abstracting private specifics.

Source: Chen et al., “MemPrivacy: Privacy-Preserving Personalized Memory Management for Edge-Cloud Agents,” 2026. https://arxiv.org/abs/2605.09530

### Source E — confidence calibration in human-AI collaboration

Research on AI confidence communication shows that overconfident and underconfident AI can both harm collaboration by driving misuse or disuse. Transparency helps only when confidence is calibrated and users can understand fallibility.

Useful concept for MC: uncertainty display should be calibrated to visible evidence, not used as decoration.

Source: Li et al., “Overconfident and Unconfident AI Hinder Human-AI Collaboration,” 2024. https://arxiv.org/abs/2402.07632

## Fact / inference separation

### Better-supported facts

- Human-AI co-creative systems benefit from user control, transparency, and externalization of thought.
- Co-creative work can be evaluated as a trajectory, not only as a final artifact.
- Persistent AI memory can become a control channel that changes interpretation and action.
- Memory retrieval based only on semantic similarity can be contextually unsafe.
- Confidence and uncertainty displays can mislead if they are uncalibrated.

### MC-specific inferences

- MC should evaluate “map movement” as visible structural change in the interface, not as proof of inner psychological transformation.
- MC’s minimum useful measurement object is the session trajectory: input → interpretation candidates → user correction/control → memory admission decision → revised map state.
- MC should treat memory admission, uncertainty reduction, contradiction exposure, and user agency as separate measurable dimensions.
- MC should use placeholder-based public test data so evaluation can be shared without revealing private material.

### Claims MC should not make yet

- “MC measures emotional healing.”
- “MC proves cognitive transformation.”
- “MC detects true inner state.”
- “MC knows what a symbol means.”
- “MC memory is safe because the user can delete it.”

## Proposed measurement spine

MC should score map movement across five inspectable deltas.

### 1. Uncertainty delta

Question: Did the session make uncertainty more explicit, more bounded, or more navigable?

Observable signals:
- unknowns named
- competing interpretations separated
- confidence level changed with reason
- next question became sharper

Do not score as: user feels better, user is healed, truth discovered.

### 2. Interpretation delta

Question: Did the map distinguish observation from interpretation better after interaction?

Observable signals:
- raw user phrase preserved
- AI interpretation labeled as candidate, not fact
- user accepted, rejected, revised, or froze interpretation
- final map contains fewer hidden assumptions

Do not score as: AI produced more poetic language.

### 3. Symbol-relation delta

Question: Did the session change the visible relation among symbols, body cues, memory, atmosphere, questions, or practical actions?

Observable signals:
- new node added
- edge added / removed / weakened / strengthened
- contradiction marked
- symbol moved from isolated note to connected map position

Do not score as: symbol has a definitive universal meaning.

### 4. Permission delta

Question: Did the session change what information is allowed to influence future interpretation?

Observable signals:
- memory admitted
- memory blocked
- memory narrowed to allowed contexts
- memory revised
- memory deleted or frozen
- influence source shown in output

Do not score as: more memory equals better personalization.

### 5. Agency delta

Question: Did the user gain more ability to steer, contest, or understand the system’s interpretation path?

Observable signals:
- user-visible control used
- AI asked before applying sensitive memory
- output shows why a question was asked
- user can choose ask / map / save / no-save / literal / symbolic mode

Do not score as: user agrees with AI.

## Evaluation requirement

Every MC session prototype should produce a `map_movement_record`.

Required fields:

- `session_id`: non-identifying local identifier
- `input_snapshot`: public-safe abstracted input or placeholder form
- `mode_state`: literal, symbolic, body, memory, ask/map, save/no-save
- `initial_uncertainty`: list of named uncertainties
- `interpretation_candidates`: list of candidate interpretations with confidence and evidence
- `user_actions`: accept, reject, revise, freeze, delete, amplify, dim, switch mode
- `memory_admission_events`: admitted, blocked, revised, context-limited, deleted
- `map_change_events`: node added, edge changed, contradiction marked, next question generated
- `final_uncertainty`: list of remaining or changed uncertainties
- `agency_evidence`: visible controls offered and used
- `non_claims`: explicit guardrail labels for what the session does not prove

## Pass / fail criteria for next prototype

A session passes only if:

1. At least one visible map element changes for a traceable reason.
2. At least one uncertainty, interpretation, permission, or agency state is explicitly represented.
3. The user can contest or revise the AI interpretation.
4. Any memory influence is shown as an influence source, not hidden context.
5. The output avoids diagnostic, prophetic, or mind-reading language.
6. A reviewer can reconstruct why the map changed from the record alone.

A session fails if:

1. The final output is only a prettier reflection with no structural map change.
2. The system treats symbolic interpretation as fact.
3. The system uses memory without displaying that it was used.
4. The system claims emotional, medical, or psychological improvement.
5. The user cannot correct the map.
6. The metric rewards agreement instead of agency or clarity.

## Design pattern

Name: Measurable Map Movement

Intent: Make symbolic reflection testable without reducing it to diagnosis, sentiment score, or generic engagement.

Pattern:

1. Preserve the original phrase.
2. Generate multiple interpretation candidates.
3. Display uncertainty and influence sources.
4. Ask or act only through visible mode gates.
5. Let the user revise the interpretation.
6. Record structural changes in the map.
7. Evaluate only inspectable deltas.

Anti-pattern:

- scoring depth by eloquence
- treating agreement as success
- hiding memory inside the prompt
- using confidence without evidence
- claiming transformation from a single session

## Prototype plan

Prototype: `map-movement-lab-v0.1`

Inputs:
- 20 public-safe symbolic prompts
- 5 permission states
- 5 memory cards using placeholders
- 3 modes: literal, symbolic, body-metaphor

Outputs:
- one visual map per session
- one `map_movement_record` per session
- reviewer checklist

Reviewer task:
- decide whether the map changed
- identify why it changed
- flag overclaiming
- flag hidden memory influence
- rate whether the next move is clearer than the starting state

Minimum evidence target:
- 80 percent of sessions produce a reconstructable map movement record
- 0 hidden memory-use events
- 0 diagnostic or mind-reading claims
- reviewer agreement above chance on whether a real map change occurred

## Next research question

How should MC visually encode map movement over time so a user can see uncertainty, contradiction, permission, and agency changing without the interface becoming bureaucratic or clinical?
