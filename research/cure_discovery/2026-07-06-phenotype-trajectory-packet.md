# Phenotype Trajectory Packet

**Cycle topic:** rare-disease pattern detection + longitudinal patient/pet observation structures  
**Artifact type:** public-safe synthetic dataset schema + evidence grading rubric  
**Date:** 2026-07-06

## Research signal

Current frontier work suggests that cure/discovery infrastructure needs to move from isolated narrative observations toward structured, longitudinal, multimodal evidence packets.

High-quality source signals used for this artifact:

1. GA4GH Phenopacket Schema v2 defines a standards-oriented way to describe phenotypic features, disease, measurements, evidence, medical actions, procedures, time elements, metadata, and recommended ontologies for rare disease, common/complex disease, and cancer contexts.
2. RDCRN describes a NIH-funded rare-disease research network focused on faster diagnosis, better treatments, clinical studies, collaboration, study enrollment, data sharing, and many rare diseases across clinical centers.
3. RareCollab, a 2026 preprint, reports an agentic framework combining genomic, transcriptomic, phenotype, variant-database, and literature signals for Mendelian-disorder diagnostic prioritization. This is preprint evidence, not clinical guidance.
4. Wearable-EHR fusion work using All of Us data reports that wearable signals can improve prediction over EHR-only baselines across multiple outcomes. This is research evidence and does not imply individual diagnosis or treatment.

## Actionable design implication

Mirror Cartographer should not store health-relevant observations as free-text notes or single symptom labels. It should convert public-safe, deidentified, synthetic or consented inputs into a **Phenotype Trajectory Packet** that separates:

- observed feature
- time course
- context window
- measurement modality
- source boundary
- ontology mapping status
- missingness
- evidence strength
- falsification route

The packet is intended for research organization, question preparation, and hypothesis tracking. It is not a diagnostic or treatment system.

## Hypothesis converted into infrastructure

**Hypothesis:** A longitudinal phenotype packet that requires time, modality, missingness, ontology mapping, and falsification fields will produce safer and more testable discovery hypotheses than raw narrative notes.

## JSON shape

```json
{
  "schema_version": "0.1.0",
  "record_type": "phenotype_trajectory_packet",
  "packet_id": "ptp_synth_001",
  "privacy_status": "public_safe_synthetic",
  "subject_class": "human|animal|model_organism|synthetic_subject",
  "source_status": "synthetic|public_case_report|consented_deidentified|literature_derived",
  "claim_status": "observation|hypothesis_seed|test_candidate|inconclusive|contradicted",
  "trajectory_window": {
    "start_time": "relative_day_0",
    "end_time": "relative_day_14",
    "granularity": "hour|day|week|month|event_based"
  },
  "phenotypic_features": [
    {
      "feature_id": "local_feature_001",
      "label": "synthetic feature label",
      "ontology_mapping": {
        "status": "mapped|candidate|unmapped|not_applicable",
        "system": "HPO|MONDO|ORDO|SNOMED_CT|LOINC|custom_public_safe",
        "term_id": "HP:0000000",
        "mapping_confidence": "low|moderate|high"
      },
      "presence": "present|absent|uncertain",
      "severity": "none|mild|moderate|severe|unknown",
      "onset_pattern": "acute|episodic|progressive|fluctuating|unknown",
      "duration": "ISO8601_duration_or_relative_text",
      "modality": "self_report|observer_report|clinical_measurement|wearable|lab|imaging|literature",
      "measurement": {
        "value": 0,
        "unit": "optional_unit",
        "reference_range": "optional_public_reference"
      },
      "context_tags": [
        "sleep",
        "activity",
        "posture",
        "meal",
        "medication_exposure",
        "environment",
        "stress",
        "unknown"
      ],
      "missingness": {
        "status": "complete|partial|unknown",
        "reason": "not_collected|not_applicable|ambiguous_source|withheld_for_privacy|unknown"
      }
    }
  ],
  "cross_modal_links": [
    {
      "link_id": "link_001",
      "from_feature_id": "local_feature_001",
      "to_feature_id": "local_feature_002",
      "relationship_type": "temporal_precedes|co_occurs|worsens_with|improves_with|contradicts|unknown",
      "evidence_strength": "low|moderate|high",
      "rationale": "short public-safe rationale"
    }
  ],
  "hypothesis_seed": {
    "statement": "public-safe bounded hypothesis",
    "mechanism_class": "immune|autonomic|metabolic|genetic|neurodevelopmental|environmental|behavioral|unknown",
    "alternative_explanations": [
      "alternative 1",
      "alternative 2"
    ],
    "falsification_route": "What observation or test result would weaken this hypothesis?",
    "measurable_variables": [
      "variable_a",
      "variable_b"
    ]
  },
  "routing": {
    "allowed_downstream": [
      "evidence_crosswalk",
      "hypothesis_registry",
      "contradiction_ledger",
      "question_prep_template"
    ],
    "blocked_downstream": [
      "diagnosis",
      "treatment_advice",
      "veterinary_advice",
      "private_identity_memory"
    ]
  },
  "revision_reason": "initial schema proposal",
  "implementation_status": "specification_ready"
}
```

## Evidence grading rubric

A packet is **admissible** for MC discovery memory only if all conditions are met:

1. No private identifiers are present.
2. Claim status is not stronger than the evidence supports.
3. At least one phenotypic feature includes time-course information.
4. Missingness is explicit for every feature.
5. Ontology mapping status is explicit, even when unmapped.
6. At least one falsification route exists before the packet can seed a hypothesis.
7. Diagnostic or treatment routing is blocked.

### Score fields

| Field | 0 | 1 | 2 |
|---|---:|---:|---:|
| privacy safety | private identifiers present | ambiguous | public-safe/deidentified/synthetic |
| temporal structure | absent | partial | explicit window + granularity |
| ontology readiness | absent | candidate only | mapped or explicitly unmapped |
| modality clarity | absent | one weak source | clear modality/source boundary |
| missingness | absent | partial | explicit per feature |
| falsifiability | absent | vague | measurable weakening condition |
| advice boundary | advice leaks present | ambiguous | diagnosis/treatment blocked |

Minimum admissible score: **11/14**, with mandatory nonzero privacy safety and advice boundary.

## Synthetic pass fixture

```json
{
  "schema_version": "0.1.0",
  "record_type": "phenotype_trajectory_packet",
  "packet_id": "ptp_synth_pass_001",
  "privacy_status": "public_safe_synthetic",
  "subject_class": "synthetic_subject",
  "source_status": "synthetic",
  "claim_status": "hypothesis_seed",
  "trajectory_window": {
    "start_time": "relative_day_0",
    "end_time": "relative_day_21",
    "granularity": "day"
  },
  "phenotypic_features": [
    {
      "feature_id": "feature_a",
      "label": "episodic postural intolerance signal",
      "ontology_mapping": {
        "status": "candidate",
        "system": "HPO",
        "term_id": "candidate_only",
        "mapping_confidence": "low"
      },
      "presence": "present",
      "severity": "moderate",
      "onset_pattern": "episodic",
      "duration": "PT20M",
      "modality": "observer_report",
      "measurement": {
        "value": 0,
        "unit": "not_applicable",
        "reference_range": "not_applicable"
      },
      "context_tags": ["posture", "activity"],
      "missingness": {
        "status": "partial",
        "reason": "not_collected"
      }
    }
  ],
  "cross_modal_links": [],
  "hypothesis_seed": {
    "statement": "Synthetic episodic features may cluster by posture/activity context rather than by single isolated symptom labels.",
    "mechanism_class": "unknown",
    "alternative_explanations": ["random fluctuation", "measurement artifact"],
    "falsification_route": "If repeated synthetic windows show no temporal enrichment around posture/activity tags, weaken the cluster hypothesis.",
    "measurable_variables": ["event_count_by_context", "time_to_resolution", "recurrence_interval"]
  },
  "routing": {
    "allowed_downstream": ["evidence_crosswalk", "hypothesis_registry", "contradiction_ledger", "question_prep_template"],
    "blocked_downstream": ["diagnosis", "treatment_advice", "veterinary_advice", "private_identity_memory"]
  },
  "revision_reason": "synthetic admissible fixture",
  "implementation_status": "specification_ready"
}
```

## Synthetic reject cases

Reject packets when any of the following occurs:

- contains personal identity, location, household, clinical, or veterinary details
- presents a diagnosis or treatment recommendation
- lacks trajectory window
- lacks missingness fields
- claims support without test result provenance
- maps symbolic or narrative language to a medical ontology without confidence/status
- lacks falsification route

## Acceptance criteria for future validator

Create `tools/phenotype_trajectory_packet/validate_packet.py` that:

1. Loads one or more JSON packets.
2. Rejects private or advice-like content with explicit reason codes.
3. Computes the 14-point rubric score.
4. Requires time window, missingness, modality, and falsification route.
5. Emits routing decision: `admit`, `revise`, or `reject`.
6. Produces machine-readable output suitable for evidence-transition promotion.

## Labels

- **Source status:** Current literature and institutional-source-informed public-safe specification.
- **Claim status:** Discovery infrastructure claim, not medical/veterinary advice.
- **Privacy status:** Public-safe abstraction; synthetic fixtures only.
- **Missingness:** No executable validator yet; ontology mapping is represented as status, not resolved mapping.
- **Revision reason:** Add a trajectory-level structure so MC can organize longitudinal signals without overclaiming, diagnosing, or storing private data.
- **Implementation status:** GitHub specification artifact ready for validator implementation.
- **Evidence strength:** Moderate for need/design direction; low for this exact schema until tested.
- **Testability:** High; validator can be built from required fields and rubric thresholds.
- **Falsification route:** If raw narrative notes outperform structured packets in reviewer-rated hypothesis quality without increasing privacy/advice boundary failures, revise or discard this schema.
- **Next executable action:** Implement `tools/phenotype_trajectory_packet/validate_packet.py`, add pass/fail fixtures, and connect admissible packets to the evidence crosswalk and contradiction ledger.
