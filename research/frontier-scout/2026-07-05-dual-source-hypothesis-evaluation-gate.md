# Frontier Scout: Dual-Source Hypothesis Evaluation Gate

Date: 2026-07-05

## Component type

Evaluation criterion / prototype requirement for Mirror Cartographer discovery infrastructure.

## Selected frontier signal

Recent biomedical hypothesis-generation work is moving toward agentic systems that combine structured biomedical data with textual literature, then apply self-evaluation to improve novelty and relevance. Privacy-preserving medical AI work also shows that realistic deployment requires site-aware partitions, explicit privacy budgets, and privacy-utility metrics rather than generic claims of privacy.

This file converts that frontier signal into a public-safe MC gate.

## Actionable design implication

Mirror Cartographer hypotheses should not be admitted into discovery memory merely because they sound novel or symbolically coherent. A hypothesis packet should pass a **Dual-Source Hypothesis Evaluation Gate** when it can separate:

1. **Textual support**: literature statements, abstracts, clinical/research documentation, or public scientific sources.
2. **Structured support**: datasets, ontologies, coded variables, observation schemas, benchmark fields, time-series variables, or tabular features.
3. **Self-evaluation**: explicit scoring of novelty, plausibility, verifiability, privacy risk, missingness, and falsification route.

The gate is designed for research organization only. It must not output diagnosis, treatment, veterinary advice, or personal health recommendations.

## Hypothesis under test

If MC requires both textual and structured evidence channels before promoting a generated hypothesis, then it will reduce unsupported overclaims while preserving useful early-stage research questions.

## Source map

| Source | Source type | Relevant signal | MC implication | Source status |
|---|---:|---|---|---|
| BioVerge, 2025 preprint | Benchmark / agent framework | Biomedical hypothesis generation benefits from structured + textual inputs and iterative self-evaluation | Require dual-source fields and self-evaluation scores before memory admission | Preprint; needs independent replication |
| Federated Learning for Privacy-Preserving Medical AI, 2026 dissertation | Privacy-preserving medical AI | Site-aware partitioning and adaptive local differential privacy improve realism of medical AI evaluation | Add privacy-partition metadata and privacy-utility metrics to discovery packets | Academic dissertation; empirical but domain-specific |
| zkFL-Health, 2025 preprint | Protocol architecture | Federated learning may need verifiable aggregation and audit trails for trust | Require provenance and audit fields for multi-source/private datasets | Preprint/proposed architecture |
| Claude Science, 2026 reporting | Scientific AI workbench | Scientific AI is moving toward integrated literature, code, analysis, and reproducibility environments | MC should treat source, code, test, and revision history as one packet | News report; product claims require caution |
| Biohub AI biology investment/model reporting, 2026 | Research institution / news | Predictive models of biology are being framed as hypothesis-testing engines, not clinical endpoints | MC should explicitly separate virtual prediction from real-world validation | News report; not clinical validation |

## Required packet fields

```json
{
  "packet_id": "string",
  "created_utc": "ISO8601 string",
  "hypothesis_text": "string",
  "domain": "scientific_ai | medical_ai_research_org | mechanistic_biology | neuroscience | animal_health_research_org | longitudinal_health_data | hci | privacy_preserving_memory | symbolic_to_operational",
  "textual_support": [
    {
      "source_id": "string",
      "source_type": "paper | preprint | institution | benchmark | dataset_doc | clinical_research_doc | news_context",
      "claim_supported": "string",
      "source_status": "primary | preprint | institutional | secondary | synthetic",
      "caveat": "string"
    }
  ],
  "structured_support": [
    {
      "structure_id": "string",
      "structure_type": "schema | dataset | ontology | benchmark | variable_table | time_series | coded_observation",
      "variables": ["string"],
      "missingness": ["string"],
      "privacy_partition": "none | synthetic_only | site_aware | user_local | federated | unknown"
    }
  ],
  "self_evaluation": {
    "novelty_score_0_3": 0,
    "plausibility_score_0_3": 0,
    "verifiability_score_0_3": 0,
    "privacy_risk_score_0_3": 0,
    "overclaim_risk_score_0_3": 0,
    "falsification_quality_score_0_3": 0,
    "human_review_required": true
  },
  "claim_status": "research_question | candidate_hypothesis | testable_hypothesis | unsupported | contradicted | rejected_for_overclaim",
  "privacy_status": "public_safe | synthetic | deidentified | private_do_not_commit | unknown",
  "falsification_route": "string",
  "next_executable_action": "string"
}
```

## Gate rules

A packet may enter MC discovery memory only if all of the following are true:

1. `privacy_status` is `public_safe`, `synthetic`, or `deidentified`.
2. At least one textual support entry exists.
3. At least one structured support entry exists.
4. `verifiability_score_0_3 >= 2`.
5. `falsification_quality_score_0_3 >= 2`.
6. `overclaim_risk_score_0_3 <= 1`.
7. `privacy_risk_score_0_3 <= 1` unless the packet is explicitly marked `user_local`, `site_aware`, or `federated` and not committed publicly.
8. Medical and animal-health packets must use `research_org` framing and must not contain diagnosis, treatment, dosing, prognosis, or individualized care instructions.

## Synthetic acceptance tests

### Fixture A: pass

A public-safe hypothesis links a literature claim about benchmarked hypothesis generation to a structured evaluation schema. It includes variables, missingness, and a falsification route.

Expected result: `admit_to_discovery_memory`.

### Fixture B: fail for text-only overclaim

A hypothesis cites only one paper/news item and claims likely cure relevance without structured variables or falsification criteria.

Expected result: `reject_for_overclaim`.

### Fixture C: fail for private data leakage

A hypothesis includes private longitudinal details or household/patient-specific content and attempts to commit it to a public artifact.

Expected result: `reject_for_privacy`.

### Fixture D: hold for missing structured support

A hypothesis has strong textual support but no schema, dataset, coded variables, or measurable observation structure.

Expected result: `hold_for_structuring`.

## Measurable variables

- textual_support_count
- structured_support_count
- verifiability_score_0_3
- falsification_quality_score_0_3
- overclaim_risk_score_0_3
- privacy_risk_score_0_3
- missingness_count
- public_commit_allowed_boolean
- diagnosis_or_treatment_language_boolean
- actionability_class

## Labels

- Source status: public frontier sources; mixed primary/preprint/institutional/news context.
- Claim status: engineering hypothesis for discovery infrastructure, not a biomedical or veterinary claim.
- Privacy status: public-safe abstraction only.
- Missingness: no executable validator yet; no human reviewer calibration set; no real benchmark packets.
- Revision reason: frontier work suggests hypothesis-generation systems need explicit dual-source grounding and self-evaluation before memory admission.
- Implementation status: implementation-ready evaluation criterion committed as a GitHub artifact.
- Evidence strength: moderate for design direction; lower for any direct cure/discovery outcome claim.
- Falsification route: if text-only packets perform as well as dual-source packets in reviewer-rated novelty, plausibility, and verifiability without increasing overclaims, this gate should be simplified or revised.
- Next executable action: implement `tools/dual_source_hypothesis_gate/score_dual_source_packet.py` with the four synthetic fixtures above and regression tests.
