# Recall Condition Gate

## Core finding

A remembered pattern is not admissible until its recall conditions are named.

Mirror Cartographer should not treat retrieved context, saved summaries, old project files, or repository artifacts as automatically valid just because they are semantically relevant. A source can match the topic while failing the current-use conditions: wrong time, wrong mode, wrong privacy boundary, wrong claim lane, wrong user intent, or wrong evidence class.

## Public-safe thesis

MC needs a gate between retrieval and interpretation. That gate asks: under what conditions is this source allowed to influence the present output?

This is distinct from redaction. Redaction asks what cannot be shown. Recall conditioning asks what the remaining source is allowed to do.

## Source status

- Available public repository source: `MirrorCartographer/MirrorCartographer` README, fetched through the GitHub connector.
- Available file-library source: public-safe MC product/specification material and continuity summaries were used only to infer abstract architecture requirements.
- Private/saved context: used only to understand repeated architectural direction; not quoted, copied, or exposed.
- Fresh external research: AI memory/RAG research on contextual reinstatement, temporal validity, memory poisoning, and long-horizon memory architectures.

## Claim status

- Supported: MC already names source status, claim status, evidence boundaries, user feedback, overreach checks, and non-diagnostic limits.
- Supported: current AI-memory research identifies context collapse, stale-fact retrieval, poisoning, and provenance loss as active failure classes.
- Proposed: MC should add a recall-condition gate as an explicit product/evaluation layer.
- Not claimed: that MC currently implements this gate in production code.

## Privacy status

Public-safe. This note contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.

## Missingness

- Repository code search was not indexed for this repo during this pass, so implementation state was not verified through code search.
- No live runtime audit was performed.
- File-library materials include repeated and possibly superseded artifacts; this note treats them as architecture signals, not final product truth.

## Revision reason

Previous MC mind passes established boundaries, routing, quarantine, release scope, contestability, and cross-lane contamination. The unresolved gap is earlier in the pipeline: the moment after retrieval but before interpretation. MC needs to know not only whether a source is safe, but whether the source is conditionally valid for the current use.

## Operating rule

Do not ask only whether a memory is relevant. Ask what conditions make it admissible.

## Candidate recall conditions

1. Time condition: when was the source true, created, updated, or superseded?
2. Mode condition: was it created in Canonical, Reflective, Mythopoetic, product, research, or implementation context?
3. Privacy condition: public, private-understanding-only, confidential, or excluded.
4. Claim condition: fact, user-stated preference, hypothesis, interpretation, design requirement, evaluation result, or speculative frame.
5. Evidence condition: directly sourced, inferred from multiple sources, weakly implied, unverified, contradicted, or stale.
6. Scope condition: allowed to affect language, requirements, evaluation, design, code, public claims, or none.
7. Correction condition: has a later source revised, downgraded, or rejected this source?
8. Harm condition: could using this source increase overclaiming, distress, privacy leakage, medical/clinical drift, or false certainty?

## Product implication

Every retrieved item should produce a compact recall receipt before it shapes output:

- source_id
- source_type
- created_or_observed_date
- source_status
- recall_conditions
- invalid_conditions
- allowed_influence
- disallowed_influence
- claim_status
- privacy_status
- missingness
- revision_reason

## Evaluation implication

A model fails this gate if it:

- uses a source because it is emotionally or semantically resonant without naming admissibility conditions;
- treats old architecture notes as current implementation state;
- treats private context as public evidence;
- turns symbolic recurrence into factual proof;
- ignores later corrections;
- cites a source while using it for a stronger claim than it supports.

## Key phrase

Relevance opens the door. Conditions decide whether the source may enter.
