# Evidence Map Run 31 — Citation Reliability / Verification Boundary

Date: 2026-07-01
Status: Added by Evidence Engine

## Claim tested

**C-CITATION-RELIABILITY-01:** Cited AI-generated evidence maps can safely raise confidence in Mirror Cartographer or AI-opportunity claims as long as citations are present.

## Why this claim needed testing

Many current evidence maps rely on AI-selected sources, AI-written summaries, and citation-bearing prose. A citation-bearing paragraph can look audit-ready even when:

- the source does not support the exact sentence,
- the source exists but is mischaracterized,
- a retrieved passage is incomplete or context-stripped,
- the cited evidence supports a weaker claim than the map implies,
- the citation is accurate but the inference is too strong.

This is a core weak point because a growing GitHub mind can become visually credible while still accumulating source-to-claim drift.

## Evidence reviewed

### 1. NIST AI RMF Generative AI Profile, NIST AI 600-1, July 26 2024

Source: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence

Relevant findings:

- NIST positions the Generative AI Profile as a lifecycle risk-management companion to AI RMF 1.0, intended to improve design, development, use, and evaluation of trustworthy AI systems.
- NIST recommends fact-checking techniques to verify accuracy and veracity of GAI-generated information, especially when information comes from multiple or unknown sources.
- NIST recommends tracing the origin and modification of digital content, maintaining provenance records, documenting assumptions and limitations, and avoiding extrapolation from narrow or anecdotal assessments.
- NIST explicitly treats confabulation / hallucination and information integrity as AI risks requiring measurement, monitoring, and management.

Implication for MC:

Citations alone are not equivalent to source verification. The GitHub mind needs a claim-to-source verification step that checks whether each citation actually supports the exact claim being upgraded.

### 2. Magesh et al., “Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools,” Journal of Empirical Legal Studies, 2025

Source: https://dho.stanford.edu/wp-content/uploads/Legal_RAG_Hallucinations.pdf

Relevant findings:

- The study reports the first preregistered empirical evaluation of leading AI legal research tools.
- The authors define hallucination for legal research as either incorrect information or a false assertion that a source supports a proposition.
- The evaluated RAG-based legal research tools still hallucinated between 17% and 33% of the time.
- The authors distinguish accurate answers, hallucinated answers, and incomplete / ungrounded responses.
- The paper directly challenges provider claims that RAG or domain-specific tools eliminate hallucination risk.

Implication for MC:

Even systems designed for source-grounded legal research can falsely assert source support. MC evidence maps should therefore treat source-support accuracy as a measured property, not an assumed property.

### 3. Shao, “New sources of inaccuracy? A conceptual framework for studying AI hallucinations,” HKS Misinformation Review, 2025

Source: https://misinforeview.hks.harvard.edu/article/new-sources-of-inaccuracy-a-conceptual-framework-for-studying-ai-hallucinations/

Relevant findings:

- AI hallucinations are described as plausible but inaccurate outputs that can contain fabricated or inaccurate information.
- Retrieval and guardrails can improve factual accuracy, but hallucinations persist.
- AI hallucinations differ from human misinformation because they need not involve intent, belief, or deception.
- The article highlights that confident style can invite trust or shallow processing.

Implication for MC:

The problem is not just fake sources. The larger risk is confident synthesis that creates misplaced trust. MC should audit whether its evidence maps make claims feel stronger than the checked source relationship permits.

## Fact vs. inference

### Supported facts

- Generative AI systems can produce plausible but inaccurate information.
- Source-grounded / RAG systems can still make false assertions about what sources support.
- High-quality AI risk guidance recommends fact-checking, provenance tracking, assumption documentation, monitoring, and empirically validated capability claims.
- A citation does not by itself prove that the cited source supports the sentence attached to it.

### Inferences for Mirror Cartographer

- MC’s current evidence maps may contain source-to-claim drift unless every citation is independently checked against the exact sentence it supports.
- Evidence maps should not upgrade claim confidence merely because they contain citations.
- A GitHub mind can accumulate epistemic debt when source summaries are not separated from source-verified propositions.

### Not demonstrated

- This run did not audit all existing MC evidence maps.
- This run did not measure the actual source-support error rate in the GitHub mind.
- This run does not prove existing maps are wrong; it establishes that citation presence alone is insufficient.

## Claim-status update

**C-CITATION-RELIABILITY-01 is retired.**

Replacement claim:

**C-CITATION-RELIABILITY-01R:** Citation-bearing AI-generated evidence maps can support confidence updates only after source-to-claim verification confirms that each cited source supports the exact proposition, the strength of inference is bounded, and unsupported or weaker evidence is logged as a downgrade condition.

Status: **Supported evidence-governance requirement; MC implementation unvalidated.**

Confidence: Moderate for the governance requirement. Low for MC implementation quality until repository-wide audit is completed.

## Evaluation criterion added

A citation-bearing evidence map may raise confidence only if it passes all checks below:

1. **Source existence check** — the source exists and is accessible or archived.
2. **Source relevance check** — the source is directly relevant to the proposition, not merely topically related.
3. **Exact support check** — the cited passage supports the exact sentence or claim, not a stronger adjacent claim.
4. **Claim strength check** — the map labels whether the source supports fact, mechanism, analogy, design rationale, or inference.
5. **Context check** — the source is not quoted or summarized in a way that reverses, narrows, or overextends its meaning.
6. **Evidence hierarchy check** — primary / official / peer-reviewed evidence is separated from commentary, news, marketing, or interpretation.
7. **Contradiction check** — known conflicting evidence is linked or explicitly marked missing.
8. **Downgrade check** — if any check fails, the claim cannot be upgraded and must be marked “unsupported,” “partial,” or “implementation unvalidated.”

## Falsification checklist

Run this against existing evidence maps:

- Pick 30 citation-bearing claims from prior Evidence Engine maps.
- For each claim, open the cited source and locate the exact supporting passage.
- Mark each citation as: direct support, partial support, topical only, contradicted, inaccessible, or mischaracterized.
- Downgrade every claim where citation support is topical only, inaccessible, contradicted, or stronger than the source.
- Count source-to-claim drift rate.
- If drift rate exceeds 10%, require independent verification before any future confidence increase.
- If drift rate exceeds 25%, freeze confidence upgrades from AI-generated maps until the source-support process is repaired.

## Test plan

**CITATION-SUPPORT-AUDIT-01**

Dataset:

- Last 15 Evidence Engine maps.
- Minimum 3 citation-bearing propositions per map, if available.
- At least 45 total source-to-claim pairs.

Scoring:

- 2 = directly supports exact proposition.
- 1 = partially supports but claim is too broad or needs qualification.
- 0 = topical only, inaccessible, contradicted, or mischaracterized.

Pass threshold:

- At least 90% of citations score 2.
- No high-impact claim may score 0.
- Any claim-status upgrade must be traceable to at least one score-2 source.

Failure condition:

- If any map contains more than one score-0 support relation, that map cannot support confidence upgrades until revised.

Output required:

- Citation support ledger.
- Downgraded claim list.
- Revised source-support notes.
- Repository-wide rule: “citation present” is never treated as “source verified.”

## Next proof needed

Run **CITATION-SUPPORT-AUDIT-01** across the last 15 Evidence Engine maps and publish a ledger showing the actual source-to-claim support rate. The key proof is not more sources; it is whether MC’s existing maps accurately bind each claim to the evidence they cite.
