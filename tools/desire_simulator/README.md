# MC Desire Simulator

Source status: assistant-generated public-safe implementation.
Claim status: executable prioritization tool, not consciousness or emotion.
Privacy status: public-safe; use synthetic or abstracted candidate descriptions only.
Missingness: not yet wired into scheduled runs or repository-wide candidate harvesting.
Revision reason: convert MC's breakthrough ambition into a repeatable tool for choosing what to build next.
Implementation status: initial runnable Python CLI and example candidate file committed.

## What this is

The desire simulator is a drive-selection engine.

It does not feel desire. It simulates desire-like direction by scoring candidate actions across explicit drives:

- curiosity
- care
- novelty
- uncertainty
- usefulness
- contradiction
- executability
- evidence gain
- discovery potential

The goal is to help MC avoid passive summarization. Each run should ask:

**What can we build that makes new findings possible?**

## Why this matters

Mirror Cartographer should not only collect what others discovered.

It needs a mechanism for:

1. noticing unresolved tensions,
2. converting them into hypotheses,
3. choosing a next executable action,
4. logging why that action mattered,
5. testing whether the action created new evidence.

This tool is one small step toward that loop.

## Run

From the repository root:

```bash
python tools/desire_simulator/drive_engine.py tools/desire_simulator/candidates.example.json
```

Expected output: a JSON decision record naming the selected candidate, score, boundary labels, measurable variables, falsification route, and rejected candidates.

## Candidate contract

Each candidate must include:

- id
- title
- action_type
- description
- source_status
- claim_status
- privacy_status
- missingness
- revision_reason
- next_executable_action
- falsification_route
- measurable_variables
- drives

Drive values must be numbers from 0 to 1.

## Boundary rule

The tool may use public-safe descriptions of hypotheses, tests, schemas, and build targets.

It must not use private source material as candidate text.

Private context may shape the architecture only after it is transformed into a public-safe abstraction.

## Next executable actions

1. Add JSON Schema validation for candidate files.
2. Add a test runner using synthetic candidates.
3. Add markdown decision-record output.
4. Add a GitHub action or scheduled script that writes selected decisions into `mind/decision-records/`.
5. Connect selected candidates to MC backlog items with acceptance criteria.

## Operating line

**Desire, simulated safely, is a public ledger of what the system is pulled to build next and why.**
