# Self Model: Public Evidence Map

Status: public-safe architecture and proposed evidence contract.

This repository is the **evidence self**: what an outside reader can inspect, reproduce, challenge, and conclude from public artifacts. It pairs with the implementation self in [mirror-cartographer-ui](https://github.com/MirrorCartographer/mirror-cartographer-ui).

## What it means

The evidence self is not a person or a claim of hidden consciousness. It is a revisable public record: demonstrations, synthetic fixtures, provenance-bearing claims, validators, test results, failures, contradictions, and unresolved questions.

| Domain | Evidence representation | Invalid inference to reject |
|---|---|---|
| Experience/state | Observable input/output fixture or run receipt | First-person generated text proves subjective experience |
| Conditions | Version, configuration, context, preconditions | One run generalizes to every context |
| Interpretation | Labeled claim plus alternatives | Fluent narrative is a verified explanation |
| Pattern | Repeated tests and aggregate outcomes | One anecdote establishes a stable trait |
| Values | Explicit policies and measured checks | Stated goals prove goals are always met |
| Agency | Authorized actions and receipts | Describing an action means it executed |

## Evidence path

Question -> observable claim -> primary sources and/or synthetic fixture -> alternatives and falsification route -> test/evaluation -> provenance and missingness -> supported / contradicted / unresolved -> repair task or follow-up test.

## Claim envelope

Each research or behavior claim should state: `source_status` (primary, secondary, synthetic, internal observation, unavailable); `claim_status` (observed, sourced, inferred, hypothesized, contradicted, unknown); rationale for evidence strength; `privacy_class` (public, synthetic, review-required, private); missingness; falsification route; implementation status (proposed, prototyped, tested, verified); and one next action.

## Privacy and scope

Do not publish raw private conversations, personal health or veterinary records, private financial details, credentials, exact private locations, deleted content, or unreviewed personal hypotheses. Use synthetic fixtures, minimal examples, and redacted receipts. This public repo is not a mirror of private chat history.

## Cross-repository contract

- Implementation repo defines behavior and runnable interfaces.
- This repo stores public-safe tests and evidence.
- A discovered defect becomes a reproducible issue or fixture in the implementation repo.
- A fix is not verified until a regression test or observable acceptance check supports it.
- A branch, workflow, receipt, or agent declaration alone does not prove deployment or execution.

## Research boundaries

Repository-owned parsers, schemas, indexes, and tests can support authorized work when ChatGPT's built-in file-analysis features are unavailable. Do not defeat authentication, permissions, rate limits, safety controls, or usage restrictions. Use documented APIs and credentials granted to the project; record blockers and choose authorized alternatives.

## Five-stage cycle

1. Research: formulate and try to falsify one question.
2. Resources: evaluate one capability that unblocks it.
3. Art: create an editable representation when useful.
4. Build: implement a testable component.
5. Integration: check provenance, privacy, contradictions, and regression.

Hourly GitHub Actions can schedule repository-owned checks subject to platform scheduling and runner constraints. Model-assisted research requires a separately configured provider adapter and secret; deterministic validation remains useful without one.
