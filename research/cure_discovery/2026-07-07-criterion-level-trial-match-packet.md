# Criterion-Level Trial Match Packet

## Purpose

This artifact defines a public-safe Mirror Cartographer infrastructure component for organizing clinical-trial matching evidence at the criterion level. It is not medical advice, treatment guidance, veterinary advice, or a patient-matching service. It is a research-memory and question-prep structure for future discovery tooling.

## Selected topic

Clinical-trial matching infrastructure.

## Frontier source scan

1. TrialGPT frames clinical-trial matching as a three-stage pipeline: retrieve candidate trials, classify patient eligibility at the criterion level, then rank trials. Its reported evaluation used synthetic patient cohorts, large-scale trial annotations, manual criterion-pair evaluation, and human time-savings measurement.
   - Source: https://arxiv.org/abs/2307.15051

2. LLM-Match extends trial matching with open-source LLMs, retrieval-augmented patient context extraction, structured prompts combining eligibility criteria and patient context, fine-tuning, classification heads, and evaluation on n2c2, SIGIR, TREC 2021, and TREC 2022 datasets.
   - Source: https://arxiv.org/abs/2503.13281

3. TrialMatchAI emphasizes heterogeneous clinical data, biomedical entity normalization, hybrid lexical/semantic retrieval, reranking, criterion-level eligibility classification, explainable rationales, privacy-aware local deployment, and Phenopackets-compatible structured inputs.
   - Source: https://arxiv.org/abs/2505.08508

4. TrialPanorama proposes a large structured clinical-trial database and benchmark suite spanning trial search, screening, evidence summarization, eligibility-criteria generation, endpoint selection, and trial completion assessment. Its core design implication is that clinical-trial AI needs ontology-grounded structured records plus benchmark tasks rather than unstructured trial text alone.
   - Source: https://arxiv.org/abs/2505.16097

## Actionable design implication

MC should represent trial-matching evidence as a criterion-level packet instead of a whole-trial label. A packet must separate:

- the observed or synthetic phenotype/profile facts;
- the trial criterion text;
- the normalized biomedical entities;
- the model or reviewer judgment;
- the evidence boundary;
- the privacy partition;
- the falsification route;
- the missingness state.

This makes future discovery more possible because a failed match can become usable evidence: the system can learn whether the blocker was missing data, conflicting data, criterion ambiguity, ontology mismatch, retrieval failure, or overclaiming.

## Packet interface

```json
{
  "schema_version": "1.0",
  "record_type": "criterion_level_trial_match_packet",
  "packet_id": "string",
  "source_status": "primary|preprint|benchmark|institutional|synthetic|derived",
  "claim_status": "research_infrastructure|hypothesis|validated_tooling|contradicted|inconclusive",
  "privacy_status": "public_safe|deidentified|synthetic_only|requires_private_partition|reject_private",
  "trial_reference": {
    "registry": "clinicaltrials.gov|eu_ctr|who_ictrp|other|synthetic",
    "trial_id": "string",
    "trial_version_or_date": "YYYY-MM-DD|string",
    "condition_terms": ["string"],
    "intervention_terms": ["string"]
  },
  "criterion": {
    "criterion_id": "string",
    "criterion_type": "inclusion|exclusion|unknown",
    "raw_text_public_safe": "string",
    "normalized_entities": [
      {
        "text": "string",
        "ontology": "HPO|SNOMED_CT|LOINC|RxNorm|DrugBank|MedDRA|MONDO|NCIT|other|none",
        "ontology_id": "string|null",
        "mapping_status": "exact|narrow|broad|ambiguous|unmapped"
      }
    ]
  },
  "profile_evidence": {
    "profile_type": "synthetic|deidentified|aggregate|public_case|private_forbidden",
    "facts": [
      {
        "fact_id": "string",
        "variable": "string",
        "value_type": "present|absent|numeric|categorical|temporal|unknown",
        "value_public_safe": "string|number|null",
        "time_anchor": "relative|absolute_public|unknown",
        "source_boundary": "self_report|record_extract|literature|synthetic|unknown"
      }
    ],
    "missingness": [
      {
        "variable": "string",
        "missingness_type": "not_collected|not_applicable|withheld_private|ambiguous|contradictory",
        "effect_on_match": "blocks_decision|weakens_confidence|no_effect|unknown"
      }
    ]
  },
  "judgment": {
    "label": "eligible|ineligible|possibly_eligible|insufficient_information|reject_private",
    "confidence": "low|moderate|high",
    "rationale_public_safe": "string",
    "evidence_links": ["fact_id|string"],
    "contradiction_links": ["fact_id|string"]
  },
  "evaluation": {
    "retrieval_rank": "integer|null",
    "criterion_accuracy_if_labeled": "correct|incorrect|unlabeled|not_applicable",
    "human_review_required": true,
    "failure_mode": "none|missing_data|criterion_ambiguity|ontology_mismatch|retrieval_failure|privacy_violation|overclaim|contradiction"
  },
  "falsification_route": "string",
  "next_executable_action": "string"
}
```

## Acceptance criteria

A valid packet must:

1. operate at the criterion level, not only the whole-trial level;
2. include one and only one criterion;
3. distinguish inclusion from exclusion criteria when known;
4. preserve source status separately from claim status;
5. include privacy status and reject packets requiring private detail when no private partition exists;
6. include at least one explicit missingness entry when the label is `insufficient_information`;
7. include normalized entity records even when the mapping status is `unmapped`;
8. include a falsification route;
9. include the next executable action;
10. avoid diagnosis, treatment, or patient-specific recommendation language.

## Synthetic test cases

### Should pass

- Synthetic criterion with exact HPO mapping, synthetic profile fact, label `possibly_eligible`, and human review required.
- Public benchmark criterion with missing biomarker variable, label `insufficient_information`, and missingness marked `not_collected` with `blocks_decision`.
- Synthetic exclusion criterion with contradictory profile fact, label `ineligible`, and contradiction link.

### Should fail

- Packet lacks privacy status.
- Packet includes whole-trial recommendation but no criterion object.
- Packet marks `eligible` while evidence links are empty.
- Packet uses private identifiers in `raw_text_public_safe` or `value_public_safe`.
- Packet gives treatment advice or directs a person to enroll.
- Packet labels `insufficient_information` but contains no missingness records.

## Labels

- Source status: current-source-informed implementation specification using public frontier literature and synthetic/public abstractions.
- Claim status: research infrastructure proposal, not a clinical or veterinary claim.
- Privacy status: public-safe only; private patient/pet details are excluded by design.
- Missingness: no validator code committed in this artifact; schema still needs machine-enforced checks.
- Revision reason: frontier systems show criterion-level eligibility and structured ontology grounding are more useful than whole-trial summaries for auditable discovery infrastructure.
- Implementation status: GitHub specification committed; ready for schema extraction and validator implementation.
- Evidence strength: moderate for design direction because multiple independent trial-matching systems converge on criterion-level assessment, retrieval, structured entities, and explainability; low for exact MC packet fields until tested.
- Testability: high; JSON Schema validation plus pass/fail synthetic fixtures can test conformance.
- Falsification route: revise or reject this packet design if criterion-level packets do not improve reviewer-rated traceability, error diagnosis, missingness handling, or retrieval-to-judgment auditability compared with whole-trial labels.
- Next executable action: implement `tools/criterion_trial_match_packet/validate_packet.py`, `criterion_trial_match_packet.schema.json`, and synthetic pass/fail fixtures.
