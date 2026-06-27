# Automation Execution Ledger Protocol

## Purpose

This protocol exists because manual execution of scheduled Mirror Cartographer automations can fail if the assistant compresses several automation prompts into one broad synthesis. That failure hides task identity, weakens evidence boundaries, and makes it unclear what was actually researched, implemented, or left incomplete.

The capability added here is a repeatable execution ledger for any manual automation run.

## Failure marked

### Failure name

Automation compression drift.

### Failure pattern

A user asks to perform the work of several automations. The assistant summarizes the spirit of the tasks instead of executing each automation as its own job.

### Why it is bad

- The requested tasks lose identity.
- Research claims become vague.
- Tool access limits are blurred.
- GitHub updates can sound broader than what actually changed.
- The user cannot inspect what was interpreted, skipped, completed, or blocked.

### Required correction

Every automation must produce a separate ledger row before any synthesis is allowed.

## Capability: Automation Execution Ledger

When a user asks to run, perform, trigger-equivalent, simulate, or manually execute automations, the assistant must create or report an execution ledger with one entry per automation.

Each automation entry must include:

1. `automation_name`
2. `original_task_interpretation`
3. `execution_mode`
4. `inputs_checked`
5. `research_performed`
6. `evidence_status`
7. `implementation_performed`
8. `state_change_proof`
9. `blocked_or_incomplete_parts`
10. `next_executable_action`

## Execution modes

Use one of these labels:

- `scheduled_runtime_unavailable`: the chat cannot force the automation scheduler to run.
- `manual_equivalent_run`: the assistant performs the closest faithful version in the current conversation.
- `partial_manual_run`: only part of the automation can be performed.
- `documentation_only`: the work is captured as a spec or issue, not implemented.
- `github_write_completed`: a durable GitHub state change was made.
- `github_write_blocked`: an attempted GitHub change failed or access was unavailable.

## Evidence status labels

Use one or more:

- `current_web_checked`
- `github_checked`
- `repo_state_checked`
- `source_bound`
- `inference_only`
- `not_current_checked`
- `needs_primary_sources`
- `needs_user_context`
- `unsafe_to_publish_raw`

## Implementation proof rules

Do not say “updated GitHub” unless a GitHub write action returned a success result.

Acceptable proof includes:

- commit SHA
- issue number
- pull request number
- file path created or updated
- exact blocked error

If there is no durable state change, say `no_state_change`.

## Required output shape

For every manual automation run, produce this table or equivalent structured report:

| Automation | Interpretation | Mode | Evidence | Implementation | Proof | Blocker | Next action |
|---|---|---|---|---|---|---|---|

After the table, produce at most one synthesis section.

The synthesis must not replace the ledger.

## Mirror Cartographer fit

This protocol strengthens Mirror Cartographer because it applies the same principles the product claims to value:

- source status
- claim status
- privacy status
- correction memory
- auditability
- bounded interpretation
- visible uncertainty
- separation between symbol, evidence, and action

## Product implication

The same pattern should become a UI feature: `Interpretation Ledger`.

A Mirror Cartographer reflection should be inspectable in the same way an automation run is inspectable:

- What was the input?
- What was inferred?
- What was remembered?
- What was evidence-backed?
- What was symbolic only?
- What changed after correction?
- What action, if any, actually happened?

## Next implementation target

Create a schema file for `AutomationExecutionRecord` and `InterpretationLedgerRecord` so automation runs and user reflections share one audit grammar.
