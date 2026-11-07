# Investigation Desk — implementation contract

**Purpose:** a usable, local-first implementation of the Mirror Cartographer investigation method.  
**Entry point:** `site/investigation/index.html`.  
**Deterministic engine:** `site/investigation/engine.mjs`.  
**Schema:** `site/investigation/investigation.schema.json`.

## The investigation loop

1. **Define the inquiry.** State the question, domain, population/system, context, time window, and outcome.
2. **Model the observer and instrument.** Record standpoint, access, assumptions, selection, transformations, blind spots, observer effects, and revision triggers.
3. **Register sources and observations.** A source needs a recoverable URL or repository path plus an exact location. Observations link to sources. Missingness has distinct states: observed, unknown, not collected, redacted, not applicable.
4. **Register claims.** Claims have a type, explicit review state, confidence rationale, scope, alternatives, what is not established, and a next test.
5. **Attach evidence.** Each evidence link records whether it supports, contradicts, qualifies, or does not address a claim, plus an exact source location and scope-fit note.
6. **Generate competing hypotheses.** Each needs predictions and an explicit falsification condition.
7. **Pre-register tests.** Define protocol, measurements, comparison/control, time window, and disconfirmation before recording a result.
8. **Record unknowns and decisions.** A decision stores its rationale, evidence references, uncertainty, reversibility, and review trigger.
9. **Audit, export, return.** The structural audit detects malformed references and incomplete workflow structure. Export/import preserves the full investigation and event history.

## Claim promotion contract

The engine does not infer claim truth. Review states are explicit and constrained:

- `unreviewed → source-checked`: at least one source record exists.
- `source-checked → qualified`: at least one exact evidence link exists.
- `qualified → tested`: a linked test has a recorded result and result-source linkage.
- `qualified/tested → corroborated`: supporting evidence comes from at least two independent source groups.
- `contested`: at least one contradictory evidence link exists.
- `revised`: requires a recorded reason; the revision history is retained.
- `retired`: terminal; create a new linked claim rather than rewriting history.

Repeated publications, reports, or pages from one underlying study must share an `independence_group`. They do not count as independent corroboration.

## Privacy and runtime boundary

- The desk runs entirely in the browser and stores data in browser localStorage.
- No network request, AI provider call, authentication, or account sync is performed by this implementation.
- Browser localStorage is not encrypted. Do not store passwords, account identifiers, raw private conversation exports, or sensitive health/veterinary/financial records here.
- Public-safe export is blocked unless every source is explicitly marked `public_safe`. This is a user-declared review state, not an independent privacy audit.
- Private JSON export remains under the user's control. Clear site data only after exporting anything that must be retained.
- No AI output is automatically admitted as evidence. A future model adapter must emit proposals as unreviewed, source-attributed material and pass the same gates.

## What the audit proves—and does not prove

The audit checks schema shape, record IDs, source references, exact evidence locations, evidence directions, source-group dependence, hypothesis falsifiers, test/result consistency, decision references, and privacy review states.

It does **not** determine whether a source is authentic or accurate, whether a passage supports the interpretation, whether a study is methodologically sound, whether a causal inference is justified, or whether a decision is appropriate. Those require source appraisal, domain expertise, and human review.

## Integration boundary

This desk is the first complete interactive investigation surface. It reuses the repository's existing claim lifecycle and evidence principles. The specialized tools under `tools/` remain separate gates and validators; this UI does not pretend to execute every domain-specific gate yet. The next integration step is a server-side adapter that accepts a validated packet, runs the relevant registered gates, returns a signed/versioned result, and preserves the exact source commit and tool versions. No browser secret or model API key belongs in this page.


## Integrated gate registry

The browser desk loads `gate-registry.json`, which is checked for exact structural parity with the canonical `tools/mc_gate_integration/gate_registry.json` in Node tests. The browser runner evaluates the 18 current registry entries using the shared packet contract and routes incomplete work to `needs_more_evidence`, contradictions to `route_to_contradiction_ledger`, and structurally invalid investigations to `reject`.

**Important boundary:** the 18 current registry entries share the current common packet specification. This browser check does not execute every specialized validator under `tools/`; those remain separate executable tools and are not represented as having run merely because the browser registry passes.
