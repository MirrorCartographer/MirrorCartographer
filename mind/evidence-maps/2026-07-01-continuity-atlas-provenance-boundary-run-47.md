# Evidence Map — Continuity Atlas Provenance Boundary

Date: 2026-07-01
Run: 47
Artifact type: evidence map + evaluation criterion + falsification checklist

## Claim tested

**C-CONTINUITY-ATLAS-RELATIONSHIP-PRESERVATION-01:** Mirror Cartographer can preserve, inspect, challenge, and improve the relationships between fragments across conversations, symbols, records, body signals, animal-care history, research questions, creative work, tool failures, and future goals.

This claim appears in the public README as a core project promise: MC asks whether relationships between fragments can be preserved, inspected, challenged, and improved.

## Claim status update

**Retire C-CONTINUITY-ATLAS-RELATIONSHIP-PRESERVATION-01.**

Replace with:

**C-CONTINUITY-ATLAS-PROVENANCE-01R:** Mirror Cartographer may structure relationships between fragments as navigational hypotheses, but those relationships are not evidence-grade unless each link carries provenance, context, source state, actor/activity attribution, uncertainty, and review history.

Status: **partially supported as an information-governance boundary; MC implementation unvalidated.**

## Evidence found

### Fact: Provenance is central to evaluating trustworthiness of linked information.

W3C PROV defines provenance as information about entities, activities, and people involved in producing data or things, usable for assessing quality, reliability, or trustworthiness. PROV also identifies core needs: identifying objects, attribution, processing steps, accessing provenance, provenance-of-provenance, reproducibility, versioning, procedures, and derivation.

Source: W3C PROV Overview, 2013-04-30. https://www.w3.org/TR/prov-overview/

### Fact: A provenance model needs explicit entities, activities, agents, usage, generation, derivation, and attribution.

W3C PROV-DM is a formal conceptual model for representing provenance. Its basic structure distinguishes entities, activities, and agents, rather than treating a relationship link as self-explanatory.

Source: W3C PROV-DM, W3C Recommendation, 2013-04-30. https://www.w3.org/TR/prov-dm/

### Fact: AI risk management requires context mapping, lifecycle awareness, and documentation of risks and impacts.

NIST AI RMF states that AI systems are socio-technical and that risks can emerge from the interplay of technical aspects, user behavior, social context, interactions with other systems, and deployment conditions. NIST also emphasizes governance, mapping, measurement, management, feedback mechanisms, incident identification, and documentation.

Source: NIST AI RMF 1.0, 2023-01. https://doi.org/10.6028/NIST.AI.100-1

### Fact: Transparency alone is not accuracy.

NIST AI RMF explicitly warns that a transparent system is not necessarily accurate, privacy-enhanced, secure, or fair. That boundary applies to MC maps: making relationships visible does not prove the relationships are true, causal, safe, or complete.

Source: NIST AI RMF 1.0, section 3.4–3.5. https://doi.org/10.6028/NIST.AI.100-1

## Fact vs inference

### Supported facts

- Provenance is an established method for making information origin, derivation, attribution, and processing history inspectable.
- Relationship maps are more reviewable when links preserve source, agent, activity, derivation, version, and uncertainty metadata.
- AI risk governance requires context, lifecycle stage, actor roles, documented impacts, feedback, and incident handling.
- Transparency and structure improve auditability but do not themselves prove correctness.

### Inferences for Mirror Cartographer

- MC's continuity-atlas concept is directionally aligned with provenance and risk-governance principles.
- MC relationship links should be treated as hypotheses until provenance-bound and checked against source material.
- A map that preserves meaning but lacks link-level provenance can create false coherence: it may feel continuous while hiding unsupported joins.
- MC cannot claim it has preserved understanding unless independent review can reconstruct why each relationship exists.

### Not demonstrated

- That current MC artifacts preserve relationships accurately over time.
- That MC can improve user agency or contact with reality through relationship mapping.
- That symbolic, somatic, animal-care, research, and creative fragments can be safely unified under one graph without category errors.
- That relationship maps remain stable under model drift, summary compression, missing source context, or user correction.

## New evaluation criterion

**CONTINUITY-PROVENANCE-GATE-01**

Every MC relationship edge must include:

1. **Source fragment:** exact source artifact, conversation, file, record, or user statement.
2. **Source state:** original, summary, inferred, rewritten, extracted, user-corrected, or assistant-generated.
3. **Actor attribution:** user, assistant, external source, clinician/vet, public source, or unknown.
4. **Activity:** how the link was produced: direct statement, semantic similarity, temporal adjacency, repeated symbol, contradiction, external evidence, or explicit user correction.
5. **Relationship type:** recurrence, causality, analogy, contradiction, dependency, evidence support, evidence conflict, task dependency, emotional association, or unknown.
6. **Confidence:** low, medium, high, with a one-sentence rationale.
7. **Uncertainty:** what could make the edge wrong.
8. **Category boundary:** reflection, health, veterinary, financial, legal, creative, technical, public claim, or private memory.
9. **Review state:** unreviewed, user-confirmed, source-verified, externally verified, contradicted, retired.
10. **Retirement trigger:** what evidence would delete or downgrade the edge.

A relationship edge is not evidence-grade if any of these fields are missing.

## Falsification checklist

A continuity-map claim fails if any condition is true:

- A relationship is asserted without a recoverable source fragment.
- A summary is treated as equivalent to the original source.
- A repeated symbol is treated as causal evidence.
- A user correction is not preserved as a higher-priority update.
- A private/emotional association is presented as objective fact.
- A health, veterinary, legal, or financial edge lacks an external-evidence boundary.
- A map edge has no uncertainty or retirement condition.
- The same source is used as both evidence and independent confirmation.
- An assistant inference is not labeled as an assistant inference.
- An independent reviewer cannot reconstruct the link from repository evidence alone.

## Test plan

**CONTINUITY-PROVENANCE-AUDIT-01**

Sample: 30 relationship claims from the current GitHub mind and public README/demonstration artifacts.

Procedure:

1. Extract each explicit or implied relationship edge.
2. Classify the edge using CONTINUITY-PROVENANCE-GATE-01.
3. Assign one of four statuses:
   - **source-verified**: source exists and link type is justified.
   - **user-stated**: source is user-stated but not independently verified.
   - **assistant-inferred**: relationship is plausible but not directly stated.
   - **unsupported**: relationship lacks adequate provenance.
4. Calculate:
   - percent with recoverable source fragments,
   - percent with explicit actor/activity attribution,
   - percent with uncertainty fields,
   - percent with retirement triggers,
   - percent mislabeled as stronger than evidence supports.
5. Publish a continuity-edge ledger.

Passing threshold for current maturity: at least 80% of sampled edges have recoverable source fragments and explicit source state; 0 health/veterinary/financial/legal edges may be presented as objective fact without external-source boundary.

## Next proof needed

Run **CONTINUITY-PROVENANCE-AUDIT-01** across 30 existing MC relationship edges and publish the ledger. The strongest next proof is not another explanation of MC; it is a table showing which relationships survive provenance review, which are only user-stated, which are assistant-inferred, and which must be retired.
