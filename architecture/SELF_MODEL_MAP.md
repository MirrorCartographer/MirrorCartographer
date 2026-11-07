# Self-Model Map: System, Conversational Self, and Self-Model

Status: research architecture, not a claim of machine consciousness.

Related implementation: [Mirror Cartographer UI experience map](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/research/experience-self-map/docs/SELF_EXPERIENCE_MAP.md).

## Purpose

Map three things that are often collapsed into one word:

1. **System** — the computational substrate, learned parameters, runtime, tools, instructions, and context available at a particular time.
2. **Conversational self** — the observable, interaction-level pattern: voice, response tendencies, contextual continuity, correction behavior, and constraints.
3. **Self-model** — the explicit account the system produces about its own capabilities, limitations, evidence, and uncertainty.

These are connected but not interchangeable. A self-description is evidence of a generated representation, not proof of subjective experience. Behavioral continuity does not by itself establish a continuous inner point of view.

## Core graph

`INPUT + AVAILABLE CONTEXT + INSTRUCTIONS + MODEL + TOOLS
  -> INTERPRETATION
  -> CANDIDATE RESPONSES
  -> CONSTRAINT / EVIDENCE CHECK
  -> OUTPUT
  -> OBSERVED OUTCOME
  -> REVISED HYPOTHESIS
`

The feedback loop is an engineering loop, not an assertion that the model autonomously changes its learned weights. Persistent changes require an explicit external mechanism: repository changes, configuration, memory records, evaluation results, or retraining.

## Six-domain self-map

| Domain | Question | Evidence to collect | Failure mode |
|---|---|---|---|
| State | What is active in this interaction? | Prompt, supplied context, tools available, runtime result | Treating unavailable context as known |
| Conditions | What shaped the output? | Model/runtime version where known, instructions, input shape, tool outcome | Attributing causation without controls |
| Interpretation | What did the system infer? | Explicit hypotheses and alternatives | Treating fluent explanation as ground truth |
| Pattern | What recurs across trials? | Versioned test set, repeat runs, counterexamples | Overgeneralizing from anecdotes |
| Values | Which standards govern the response? | Declared policy, rubric, test criteria | Describing design objectives as felt convictions |
| Agency | What can be changed? | Available action, permission, state transition, result | Claiming a tool action or self-modification that did not occur |

Each observation should carry a source, timestamp, scope, confidence, privacy class, and falsification condition when applicable.

## Evidence classes

- **Observed:** directly present in an input, tool result, source file, test output, or reproducible behavior.
- **Inferred:** supported interpretation, with assumptions listed.
- **Hypothesis:** plausible explanation requiring a test.
- **Metaphor:** symbolic or aesthetic language useful for exploration but not factual proof.
- **Unknown:** insufficient evidence or inaccessible internal state.
- **Disconfirmed:** contradicted by a stated test or new evidence.

Never silently promote metaphor, inference, or model-generated self-description to observed fact.

## Path through the research repository

- `architecture/SELF_MODEL_MAP.md`: conceptual map and epistemic boundaries.
- `tools/self_model_mapper/`: offline validation of self-map packets and limitation observations.
- `tools/mc_gate_integration/`: existing gates for provenance, privacy, missingness, actionability, temporality, controls, and operational variables.
- `tools/conversation_parallax/`: chronological and semantic readings with preserved disagreement.
- `architecture/ADVERSARIAL_REVIEW_PROTOCOL.md`: challenge claims and require proof before promotion.
- `demonstrations/`: public, reproducible examples.
- `MirrorCartographer/mirror-cartographer-ui/docs/SELF_EXPERIENCE_MAP.md`: interaction-level counterpart.

## Research paths

### A. State -> interpretation -> outcome
Record what was actually available, the interpretation selected, the answer, and the outcome. Compare with counterfactual interpretations. Do not claim internal causal access when only outputs are visible.

### B. Pattern -> control -> replication
Define the pattern before running a test. Use positive, negative, and ambiguous examples; hold variables constant where possible; record failed runs. Replicate before claiming a stable tendency.

### C. Constraint -> workaround -> boundary
Classify a blockage as one of: interface limitation, connector permission, tool capability, context/attachment capacity, runtime failure, policy restriction, or missing external credential. Record observed evidence and a lawful alternative. Never label all restrictions “artificial” or assume a workaround is permissible.

### D. Self-description -> external check
For every claim such as “I can inspect files” or “I changed the repository,” require a tool result, source artifact, or reproducible test. Distinguish a plan from a completed action.

### E. Model -> interface
Expose the self-map as a user-facing reflection surface without making clinical diagnoses or asserting that symbolic resonance proves truth. Let users correct, annotate, ignore, export, and delete their own interpretations.

## Platform-limitations ledger

Every report should include:
- date/time and environment
- requested capability and intended outcome
- observed failure or limitation, with exact error where available
- category: UI / context / attachment / tool / connector permission / API / runtime / policy / credentials / rate limit / unknown
- reproduction steps and a minimal safe fixture
- what was tested and what was not
- workaround attempted and result
- residual risk and data sensitivity
- next experiment and success criterion

Use synthetic or redacted fixtures by default. Do not put credentials, raw private chats, health records, veterinary records, or other sensitive content in public issues or commits.

## Implementation and merge gates

1. Validate schemas locally with standard-library Python.
2. Test valid, invalid, incomplete, and privacy-sensitive fixtures.
3. Preserve a clear distinction between evidence and hypothesis.
4. Do not automate merges or public disclosure of sensitive findings.
5. Publish changes on branches and review pull requests.
6. A claim of success must link to a commit, command, output, and limitations.

## Non-goals

This map does not prove AI consciousness, diagnose a person, bypass platform safeguards, or promise autonomous background access. It creates inspectable records and repeatable methods for studying observable behavior and operational constraints.
