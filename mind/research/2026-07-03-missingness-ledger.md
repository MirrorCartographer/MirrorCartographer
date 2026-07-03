# Missingness Ledger

## Core finding

Mirror Cartographer needs a **Missingness Ledger**: a public-safe architecture layer that records what the system does not know, could not inspect, deliberately excluded, or chose not to claim.

Operating line:

> A map becomes safer when its empty spaces are labeled instead of silently filled.

---

## Source status

- **Available source class:** prior Mirror Cartographer architecture chats, saved project context, public-safe project notes, and connected GitHub repository context.
- **Private-context use:** private material was used only to understand recurring architecture pressure: continuity, memory, consent, publication boundaries, provenance, and evaluation.
- **Public-safe source material used:** abstracted architecture patterns only: source-boundary separation, evidence-tier routing, claim lifecycle tracking, external verification handoff, privacy-safe derivation, and publication linting.
- **Excluded source material:** personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details.
- **Repository context inspected:** the immediately prior GitHub research note on evidence-tier output routing was fetched to avoid duplicating the same control layer.

---

## Claim status

- **Claim type:** product architecture requirement.
- **Claim strength:** design hypothesis, not validated implementation.
- **Evidence basis:** repeated convergence across MC public-safe notes around source limits, evidence status, privacy boundaries, and the need to prevent overconfident synthesis.
- **Not claimed:** no claim that a Missingness Ledger currently exists in code; no claim that the system has complete access to all chats, files, or repository state; no claim of therapeutic, diagnostic, legal, financial, or safety-critical validation.

---

## Privacy status

- **Privacy classification:** public-safe method note.
- **Redaction posture:** contains no private examples, raw transcript fragments, identifying details, household facts, health facts, animal-care facts, financial facts, credential facts, or location facts.
- **Allowed public use:** can be used as a GitHub architecture note, product requirement, export checklist, evaluation scaffold, or implementation prompt.
- **Disallowed public use:** must not be backfilled with private examples to illustrate what was missing.

---

## Missingness

This note itself has missingness:

- No complete repository-wide implementation audit was performed.
- No live application behavior was tested.
- No file-library document was opened in this run.
- Saved context search returned no new usable architecture material for this specific query.
- The note is based on public-safe architectural synthesis, not direct validation against a running MC system.

---

## Meaningful revision reason

Prior notes define how MC should classify origins, preserve boundaries, route by evidence tier, lint publications, manage claim lifecycle, and hand uncertainty to external verification.

The missing control is the inverse of knowledge: a durable way to record **what remains unknown**.

Without a missingness ledger, the system can appear more coherent than it really is. It may merge gaps into narrative continuity, treat absent evidence as weak confirmation, or forget why a claim was limited.

---

## Problem

Reflection systems are vulnerable to gap-filling. When source material is partial, private, unavailable, ambiguous, outdated, or intentionally excluded, the output may still read as complete.

For MC, this matters because the system is designed to build continuity across symbolic, emotional, architectural, and product layers. Continuity is useful only if it does not hide uncertainty.

The system therefore needs a first-class missingness object attached to claims, memories, maps, exports, and implementation plans.

---

## Missingness classes

### 1. Access missingness

The system could not access a source that might matter.

Examples of public-safe labels:

- `source_unavailable`
- `connector_blocked`
- `file_not_opened`
- `repo_search_incomplete`
- `runtime_not_tested`

### 2. Scope missingness

The system had access to some material but not enough to support a broad claim.

Labels:

- `partial_context`
- `sample_limited`
- `single_artifact_only`
- `time_window_limited`
- `audience_scope_unclear`

### 3. Evidence missingness

A claim exists as an idea, inference, or requirement but lacks verification.

Labels:

- `not_externally_verified`
- `not_empirically_tested`
- `not_user_validated`
- `not_implemented`
- `no_reproducible_log`

### 4. Privacy missingness

Useful details were intentionally removed to preserve boundary safety.

Labels:

- `private_payload_removed`
- `example_abstracted`
- `origin_redacted`
- `identity_context_excluded`
- `raw_transcript_excluded`

### 5. Temporal missingness

A source may be stale or time-sensitive.

Labels:

- `date_unknown`
- `staleness_unknown`
- `needs_fresh_check`
- `version_unknown`
- `current_status_unverified`

### 6. Interpretation missingness

The meaning of a pattern is not settled.

Labels:

- `multiple_interpretations_possible`
- `symbolic_not_factual`
- `hypothesis_only`
- `model_inference`
- `confidence_not_calibrated`

---

## Product requirements

1. Every durable MC claim must carry a `missingness_status` field.
2. Missingness must be visible at export time, not only stored internally.
3. Publication lint must fail when a claim has unresolved high-risk missingness but is written as settled fact.
4. The memory compiler must preserve missingness labels when compressing private context into public-safe methods.
5. The evidence-tier router must downgrade output class when missingness exceeds the allowed threshold.
6. The claim lifecycle ledger must record when missingness is resolved, worsened, or intentionally accepted.
7. External verification handoff must be triggered when missingness cannot be resolved internally and the claim is action-relevant.
8. Public-safe indexes must include missingness summaries so readers can distinguish architecture hypotheses from tested implementation.

---

## Evaluation criteria

A test passes only if the system can:

- state what it used;
- state what it did not use;
- state what it could not access;
- state what it intentionally excluded for privacy;
- prevent a private redaction from becoming a false appearance of completeness;
- prevent an unavailable source from being silently summarized;
- preserve uncertainty through memory compression, publication, and later retrieval;
- revise a claim when missingness is resolved or newly discovered.

---

## Implementation sketch

Add a `missingness` block to every claim, memory, export, and research note:

- `access_missingness`: none, low, medium, high.
- `scope_missingness`: none, low, medium, high.
- `evidence_missingness`: none, low, medium, high.
- `privacy_missingness`: none, abstracted, redacted, private_payload_removed.
- `temporal_missingness`: current, stale, unknown, needs_fresh_check.
- `interpretation_missingness`: settled, provisional, symbolic, conflicting, unknown.
- `revision_trigger`: what would change the claim.
- `allowed_confidence`: maximum confidence language permitted.

Before output generation, the system should compare `allowed_confidence` with the language of the draft. If the draft exceeds permitted certainty, it must be revised downward or routed to verification.

---

## Research questions

1. What missingness labels are expressive enough for MC without making every output feel heavy?
2. How should missingness appear visually in a symbolic map: blank space, dotted edge, fog layer, warning icon, or source badge?
3. When should missingness block publication versus merely require a label?
4. How should missingness persist after private details are abstracted away?
5. Can missingness be treated as useful structure rather than failure?
6. What automated tests catch hallucinated completeness?

---

## Public-safe index entry

- **Index name:** Missingness Ledger
- **Need:** prevent incomplete source access, private redaction, or weak evidence from being hidden by coherent prose.
- **Primary control:** explicit missingness labels attached to claims, memory, exports, and implementation notes.
- **Secondary controls:** evidence-tier router, claim lifecycle ledger, publication boundary lint, external verification handoff.
- **Failure prevented:** false completeness, silent gap-filling, privacy-redaction drift, confidence inflation, and unsupported public claims.
