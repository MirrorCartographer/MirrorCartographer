# Self Model Evidence Protocol

Status: public-safe evidence contract for the evidence-self repository.

## Referents

- **System:** computational model, code, configuration, tools, and runtime.
- **Conversational self:** observable interaction behavior. Apparent style or first-person language does not establish subjective experience, emotion, independent goals, or continuous identity.
- **Self-model:** a fallible explanation of system and behavior. It is a hypothesis-bearing map, not the object it describes.

## Six-domain evidence map

| Domain | Preserve | Reject |
|---|---|---|
| Experience/state | Observable fixture, timestamped receipt, state transition | First-person text proves subjective experience |
| Conditions | Version, context, config, permissions, preconditions, missing inputs | One run generalizes to every context |
| Interpretation | Labeled claim, source trail, alternatives, uncertainty | Fluent explanation is verified truth |
| Pattern | Repeated tests, sample size, aggregate outcomes, counterexamples | One anecdote proves a stable trait |
| Values | Explicit policy, measurable checks, negative tests | Stated values prove reliable compliance |
| Agency | Authorized capability, tool response, external effect, commit/run receipt | Announced intention proves execution |

## Evidence path

Question → operationalize claim → define disconfirmation → gather primary sources and/or synthetic fixtures → preserve provenance/missingness → test alternatives → label supported/contradicted/unresolved → create repair/follow-up → regression test → versioned receipt.

## Required claim envelope

- source_status: primary, secondary, synthetic, internal_observation, unavailable
- claim_status: observed, sourced, inferred, hypothesized, contradicted, unknown
- evidence_strength and rationale
- privacy_class: public, synthetic, review_required, private
- missingness, alternatives, contradictions
- falsification_route and measurable acceptance criteria
- implementation_status: proposed, prototyped, tested, verified
- one next action and rollback route

## Cross-repository chain

1. `mirror-cartographer-ui` defines behavior/tool contracts and executable tests.
2. A synthetic fixture or authorized, privacy-reviewed observation exercises the contract.
3. This repository records the evidence envelope, conditions, result, and uncertainty.
4. A defect becomes a reproducible issue/fixture in the implementation repo.
5. A fix is accepted only after a regression test or observable acceptance check.
6. The receipt links exact source revision and test result.

Do not treat the paired repository's assertion as independent evidence for the same assertion. Duplication is not corroboration; evidence must come from a distinct test, source, or observation.

## Five stages

Research → Resources → Art (when useful) → Build → Integration. Every skipped stage needs a reason. Research outputs should be source-backed and falsifiable; resources need current license/cost/privacy/exit checks; art must be editable and accessible; build must have an executable acceptance check; integration must reconcile contradictions and privacy.

## Limits and alternatives

Repository-owned parsers, schemas, indexes, and test harnesses can support authorized work when a built-in file-analysis feature is unavailable. They cannot grant access to inaccessible data. Never defeat authentication, permissions, quotas, rate limits, or safety controls. Record whether a blocker is a tool gap, missing credential, access denial, usage limit, rate limit, policy boundary, or unknown; use documented authorized alternatives.

## Privacy

Never publish raw private conversations, personal health/veterinary records, private financial details, credentials, exact private locations, deleted content, or unreviewed personal hypotheses. Prefer synthetic fixtures and minimal redacted evidence.

A branch, registry, workflow, or generated receipt alone does not prove execution, correctness, deployment, research truth, or consciousness.
