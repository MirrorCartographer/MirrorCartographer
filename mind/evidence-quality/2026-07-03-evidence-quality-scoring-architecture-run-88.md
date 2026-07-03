# Evidence Quality Scoring Architecture — Run 88

Date: 2026-07-03  
Status: architecture added; scoring model unvalidated  
Claim tested: all citations contribute equally to confidence.

## Result

The claim is rejected as stated.

Citations, references, links, and notes do not carry equal evidential weight. A Wikipedia page, a company blog, a news report, a peer-reviewed trial, a government dataset, and a systematic review can all be useful, but they should not move confidence in the same way.

## Fact vs. inference

### Facts

- Source type matters. Primary research, systematic reviews, standards, official datasets, and tertiary summaries serve different evidential functions.
- Citation count is not equivalent to evidential strength.
- Repeated derivative sources can create the appearance of consensus while tracing back to one weak or partial source.
- Wikipedia can be useful for navigation and orientation but should not be treated as primary evidence.
- Evidence should be assessed for directness, independence, provenance, freshness, contradiction, and relevance to the exact claim.

### Inference

Mirror Cartographer should implement an Evidence Reliability Score as a governance heuristic. It should not be treated as a validated probability of truth until tested against independent expert or reviewer judgments.

## Source class baseline

These are initial governance weights, not truth probabilities.

| Source class | Default role | Initial weight |
|---|---|---:|
| Systematic review / meta-analysis | High-level evidence synthesis | 100 |
| Consensus standard or governance framework: NIST, ISO, W3C, OECD, WHO when relevant | Normative or procedural authority | 95 |
| Peer-reviewed primary research | Direct empirical evidence | 90 |
| Government dataset / official statistics | High-quality factual data source | 88 |
| Professional society guidance | Domain practice guidance | 82 |
| University publication / academic center report | Research synthesis or expert context | 78 |
| Technical documentation | Implementation-specific authority | 72 |
| Company blog / white paper | Useful but potentially interested source | 60 |
| News reporting | Current signal or public reporting | 50 |
| Wikipedia | Navigation and source discovery, not primary proof | 40 |
| Personal blog / social media | Low-weight signal unless author/source is directly relevant | 20 |

## Evidence Reliability Score components

Every claim should be scored across these dimensions:

1. Source authority  
   How credible is the source class for this claim type?

2. Primary versus secondary status  
   Is the source original evidence, synthesis, commentary, or tertiary summary?

3. Source independence  
   Does the source provide independent evidence, or does it repeat another source?

4. Directness of support  
   Does the source directly support the exact claim, partially support it, indirectly support it, contradict it, or fail to support it?

5. Replication / corroboration  
   Has the claim been replicated, independently corroborated, or only asserted once?

6. Consensus level  
   Do multiple high-quality sources converge, or is evidence contested?

7. Freshness  
   Is the source current enough for the domain? AI, law, medicine, and product/platform claims decay quickly.

8. Provenance completeness  
   Can the path from claim to evidence be reconstructed?

9. Contradiction status  
   Is there known conflicting evidence? If yes, confidence cannot be upgraded until conflict is adjudicated.

10. Empirical validation status  
   Has MC itself tested the claim, or is it relying only on external analogy?

## Evidence roles

A source can be useful without being proof.

- Navigation source: helps find better sources.
- Context source: explains background.
- Mechanism source: supports a plausible mechanism.
- Direct support source: supports the exact claim.
- Contradictory source: weakens or narrows the claim.
- Validation source: tests the claim directly.

Wikipedia defaults to navigation/context unless it points to primary or high-quality secondary sources that are separately checked.

## Evaluation criterion: ERS-01

For every substantive claim, an independent reviewer should be able to answer:

1. Which sources support the claim directly?
2. Which sources are only background or navigation?
3. Which sources are independent?
4. Which sources trace back to the same underlying evidence?
5. What evidence contradicts or limits the claim?
6. How fresh is the evidence for this domain?
7. What empirical test would move the claim from plausible to validated?

A claim fails ERS-01 if citation quantity is used as a substitute for source quality, independence, or direct support.

## Falsification checklist

Downgrade the claim if any of the following are true:

- Supporting citations do not actually support the claim.
- Sources are derivative of one another but counted as independent.
- Wikipedia or news summaries are treated as primary evidence.
- A high-authority source is cited for a claim outside its scope.
- Contradictory evidence is ignored.
- Evidence is stale for a fast-moving domain.
- Confidence rises without directness or independence improving.

## Claim-status update

C-EVIDENCE-QUALITY-SCORING-01R: Evidence quality should be computed from source authority, directness, independence, freshness, provenance, contradiction status, and validation status. Citation count alone is not a valid confidence metric.

Status: supported as evidence-governance architecture; MC implementation unvalidated.

## Next proof needed

Run ERS-AUDIT-01 across 25 recent Evidence Engine maps.

For each map, publish:

- claim ID;
- source list;
- source class;
- primary/secondary/tertiary status;
- independence rating;
- directness rating;
- contradiction status;
- freshness rating;
- provenance completeness;
- old confidence;
- ERS-adjusted confidence;
- downgrade or upgrade recommendation.

The ERS itself should remain a hypothesis until higher ERS scores correlate with independent reviewer agreement or expert judgment.
