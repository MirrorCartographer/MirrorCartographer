# Evidence Map: Conversation Summary Memory Provenance Boundary

Date: 2026-07-02
Status: claim narrowed; implementation unvalidated
Run: Evidence Engine 52

## Claim tested

C-CONVERSATION-SUMMARY-MEMORY-01: AI-generated conversation summaries can safely stand in for original conversation history as reliable long-term memory for Mirror Cartographer / the GitHub mind.

## Why this was a weak point

Mirror Cartographer depends on continuity: symbols, user-stated meanings, design decisions, emotional framing, project history, and evidence updates are carried forward across sessions. If summaries are treated as equivalent to source transcripts, then summary omissions, misattributions, compressions, or hallucinated details can silently become canonical memory.

## Evidence reviewed

### Source 1 — W3C PROV

The W3C PROV overview defines provenance as information about the entities, activities, and people involved in producing a piece of data or thing, usable for assessments of quality, reliability, and trustworthiness. PROV also emphasizes identifying objects, attribution, processing steps, provenance-of-provenance, reproducibility, versioning, procedures, and derivation.

Interpretation for MC: a memory summary is not just content. It is a derived artifact. It needs source, actor, derivation, version, and review metadata before it can be trusted as memory.

### Source 2 — NIST AI 600-1 Generative AI Profile

NIST AI 600-1 recommends documenting and reviewing provenance for generative AI systems, maintaining history for test/evaluation/validation/verification and digital transparency methods, deploying and documenting fact-checking techniques, evaluating whether users understand content lineage and origin, tracking provenance of inputs/metadata/synthetic content, and documenting provenance-data limitations.

Interpretation for MC: summary memory should carry lineage and limitation metadata. It should not be treated as primary evidence unless source-linked and tested.

### Source 3 — Dialogue summarization factual-consistency research

Dialogue summarization research reports non-trivial factual inconsistency rates in LLM-generated summaries. One evaluation found average factual inconsistency in 26.8% of LLM-generated summaries and 16% for ChatGPT in the tested setting, with higher error rates when factual questions were derived from summaries. Topic-focused dialogue summarization research also reports that LLMs hallucinate diverse factual errors in dialogue summaries and that LLM-based factual evaluators may perform poorly compared with specialized factuality metrics.

Interpretation for MC: conversation summaries are useful compression artifacts, but they are not safe substitutes for originals when claims depend on speaker attribution, dates, causality, consent, health context, or project decisions.

## Fact / inference separation

### Supported by reviewed sources

- Provenance is required to assess quality, reliability, and trustworthiness of derived information.
- Generative AI governance benefits from content lineage, provenance tracking, limitation documentation, fact-checking, version history, and TEVV records.
- LLM dialogue summaries can contain factual inconsistencies and hallucinated details.
- Users/operators should be able to understand lineage and origin of generated content.

### Inference for Mirror Cartographer

- MC summaries can be useful as navigation indexes, but should not be treated as primary evidence unless backed by original source references.
- Long-term memory should distinguish user-stated facts, assistant interpretations, external evidence, symbolic hypotheses, and inferred project structure.
- A summary-derived claim should have lower confidence than a transcript-grounded or source-grounded claim unless independently verified.
- The current GitHub mind may contain summary-derived claims whose provenance is insufficient for independent reconstruction.

## Claim-status update

C-CONVERSATION-SUMMARY-MEMORY-01 is retired.

Replacement claim:

C-CONVERSATION-SUMMARY-MEMORY-01R: AI-generated conversation summaries may be used as navigation aids and provisional continuity artifacts, but they are not equivalent to original conversation history. Any summary-derived memory claim must include provenance, source availability, derivation method, confidence level, and a verification path before being promoted to canonical MC/GitHub-mind evidence.

Confidence: moderate for the governance boundary; unvalidated for current MC implementation.

## Evaluation criterion: Summary Memory Provenance Gate

A summary-derived memory item may be promoted to canonical status only if it includes:

1. Memory item identifier.
2. Original source pointer or explicit note that the original is unavailable.
3. Derivation activity: who/what produced the summary, when, and by what process if known.
4. Speaker attribution: user-stated, assistant-stated, external-source-stated, or inferred.
5. Claim type: fact, preference, decision, symbol meaning, hypothesis, interpretation, plan, or evidence claim.
6. Compression risk: low / medium / high, with reason.
7. Confidence level and rationale.
8. Verification path: transcript check, source check, user confirmation, independent artifact, or impossible-to-verify.
9. Last reviewed date.
10. Retirement/revision condition.

## Falsification checklist

The claim that a memory item is reliable fails if:

- It exists only in a summary with no source pointer.
- It merges user statements with assistant interpretation without marking the difference.
- It preserves conclusion but drops uncertainty, context, or dissent.
- It asserts causality, diagnosis, intent, consent, or project completion without primary support.
- It cannot be independently reconstructed from available evidence.
- It remains high confidence after source material is unavailable, contradicted, or stale.

## Test plan

Test ID: SUMMARY-MEMORY-PROVENANCE-GATE-01

Sample: 50 current GitHub-mind memory/claim artifacts that rely on conversation summaries or prior assistant synthesis.

Procedure:

1. Extract each memory claim into a ledger row.
2. Label the claim type and speaker attribution.
3. Mark whether the original source is available.
4. Compare the summary claim to the source when available.
5. Record error type: omission, exaggeration, wrong speaker, wrong date, unsupported causality, missing uncertainty, or hallucinated detail.
6. Assign confidence: canonical, provisional, symbolic-only, deprecated, or unsupported.
7. Patch or retire failed claims.

Passing threshold:

- 95% of canonical memory items have source pointers or explicit unavailable-source notes.
- 100% of health, legal, financial, employment, consent, and safety claims have source/verification metadata.
- 0 high-confidence claims depend only on unverified summary text.

## Next proof needed

Run SUMMARY-MEMORY-PROVENANCE-GATE-01 across the GitHub mind and publish a ledger separating:

- source-grounded memory,
- summary-only memory,
- assistant inference,
- user-confirmed memory,
- contradicted or stale memory,
- and unsupported canonical claims.

Until that audit exists, MC continuity claims should be treated as architecturally plausible but not implementation-proven.
