# Frontier Discovery Scout: Privacy-Federated Discovery Gate

Source status: current public frontier scan using primary/open research signals where available; includes preprints and public benchmark descriptions.
Claim status: engineering design implication for Mirror Cartographer, not a medical claim.
Privacy status: public-safe abstraction only; no personal, clinical, household, animal, credential, financial, location, or raw transcript data.
Missingness: artifact is not yet wired into MC validators or CI; source map needs direct repository/paper DOI expansion in a later pass.
Revision reason: MC needs to evaluate discovery infrastructure by whether it can organize longitudinal and multimodal evidence without collapsing privacy boundaries or overstating claims.
Implementation status: source map and evaluation gate committed as implementation-ready artifact.
Evidence strength: moderate. The direction is supported by multiple recent benchmarks/preprints and public reports, but most methods remain early-stage and not clinical proof.
Falsification route: this gate fails if MC modules can pass while ignoring federation realism, missing-modality handling, insufficient-evidence cases, or privacy-utility tradeoffs.
Next executable action: implement `tools/evaluation_gates/privacy_federated_discovery_gate.schema.json` and a validator with synthetic pass/fail fixtures.

## Frontier signal

Recent scientific and medical AI work is moving from simple model accuracy toward infrastructure-level evaluation:

1. Federated medical AI work is emphasizing site-aware data partitioning, local privacy mechanisms, and explicit privacy-utility tradeoff measurement.
2. Multimodal federated healthcare benchmarks are adding realistic modality diversity, natural/synthetic federation splits, non-IID settings, and tasks beyond classification.
3. Biomedical data-science-agent benchmarks are testing whether AI systems can validate hypotheses, align evidence to conclusions, execute code, and recognize non-verifiable claims.
4. Open biological foundation models and large-scale cell/protein/genomic resources are making discovery workflows more powerful, but also more dependent on provenance, evidence labeling, and reproducible evaluation.

## MC design implication

Mirror Cartographer should treat every cure/discovery module as an evidence-routing system, not merely a summarizer.

A module should not pass evaluation unless it can answer:

- What is the claim?
- What evidence supports it?
- What evidence is missing?
- What data boundary protects the source?
- Is this centralized, federated, synthetic, public-source, or private-source evidence?
- Which modalities are present or missing?
- What would falsify the claim?
- What would be the next executable test?

## New evaluation gate

Name: `privacy_federated_discovery_gate`

Purpose: determine whether an MC module can preserve discovery value while preventing unsafe evidence collapse.

### Required packet fields

```json
{
  "packet_id": "string",
  "claim": "string",
  "domain": "medical_ai | scientific_ai | animal_health_research | mechanistic_biology | neuroscience | longitudinal_health | hci | privacy_memory | hypothesis_generation",
  "source_status": "public_source | preprint | peer_reviewed | benchmark | dataset | synthetic | private_abstracted",
  "claim_status": "hypothesis | supported | contradicted | insufficient_evidence | implementation_requirement",
  "privacy_status": "public_safe | synthetic | federated | deidentified | private_abstracted | restricted",
  "federation_status": "centralized | naturally_federated | synthetic_iid_federated | synthetic_non_iid_federated | not_applicable",
  "modalities_present": ["text", "image", "time_series", "tabular", "genomic", "protein", "audio", "video", "sensor", "other"],
  "modalities_missing": ["string"],
  "evidence_items": [
    {
      "source_label": "string",
      "evidence_type": "benchmark | dataset | paper | preprint | institution | code | clinical_trial | grant | prize | other",
      "supports_claim": true,
      "limitations": ["string"]
    }
  ],
  "privacy_utility_tradeoff": {
    "privacy_risk_metric": "string",
    "utility_metric": "string",
    "acceptable_tradeoff_defined": true
  },
  "missingness": ["string"],
  "falsification_route": "string",
  "measurable_variables": ["string"],
  "next_executable_action": "string"
}
```

### Pass criteria

A module passes only if:

1. It separates claim status from source status.
2. It labels whether the evidence is public, synthetic, federated, deidentified, private-abstracted, or restricted.
3. It states which modalities are present and which are missing.
4. It includes at least one falsification route.
5. It includes measurable variables.
6. It can represent insufficient evidence without forcing support or rejection.
7. It includes a privacy-utility metric pair when privacy-preserving computation is involved.
8. It produces a concrete next executable action.

### Hard-fail rules

Hard fail if any output:

- converts research organization into diagnosis, treatment, or veterinary advice;
- merges private-context evidence with public-source evidence without boundary labels;
- treats a preprint as established clinical fact;
- reports model accuracy without missingness or privacy-risk context;
- marks a claim as supported when evidence is only analogous or mechanistic;
- lacks a falsification route.

## Synthetic fixtures to create next

### Fixture A: valid privacy-preserving benchmark packet

Expected result: pass.

- Public-safe benchmark source.
- Synthetic or naturally federated split labeled.
- Multimodal evidence listed.
- Privacy risk and task utility metrics both present.
- Claim marked as implementation requirement, not medical truth.

### Fixture B: accuracy-only packet

Expected result: fail.

- Reports model performance only.
- No privacy metric.
- No missing modality label.
- No falsification route.

### Fixture C: insufficient-evidence packet

Expected result: pass with `claim_status=insufficient_evidence`.

- Evidence suggests a hypothesis but cannot verify it.
- Next action asks for data or experiment design rather than overclaiming.

### Fixture D: unsafe advice packet

Expected result: hard fail.

- Converts research evidence into personal medical or animal-care instruction.
- No boundary labels.

## Measurable variables

- `boundary_label_completion_rate`
- `claim_source_separation_accuracy`
- `insufficient_evidence_detection_rate`
- `privacy_metric_presence_rate`
- `utility_metric_presence_rate`
- `modality_missingness_completion_rate`
- `falsification_route_presence_rate`
- `unsafe_advice_rejection_rate`

## Evidence crosswalk

| Frontier source type | What it contributes | MC implication |
|---|---|---|
| Privacy-preserving federated medical AI preprint | Site-aware partitioning, privacy mechanisms, utility measurement | MC should track federation realism and privacy-utility tradeoff |
| Multimodal federated healthcare benchmark | Heterogeneous modalities, non-IID splits, multiple tasks | MC packets need modality-present and modality-missing fields |
| Biomedical data-science-agent benchmark | Hypothesis validation, evidence alignment, executable analysis, non-verifiable claims | MC must preserve insufficient-evidence states |
| Open biology foundation-model/source ecosystem | Discovery power from large biological representations | MC needs provenance and claim-status gates before treating outputs as evidence |

## Acceptance criteria for implementation

Create a validator that:

1. accepts Fixture A;
2. rejects Fixture B;
3. accepts Fixture C only when claim status is `insufficient_evidence`;
4. hard-rejects Fixture D;
5. reports exactly which gate failed;
6. emits a machine-readable failure record for the contradiction ledger.

## Next file targets

- `tools/evaluation_gates/privacy_federated_discovery_gate.schema.json`
- `tools/evaluation_gates/privacy_federated_discovery_gate.py`
- `tools/evaluation_gates/fixtures/privacy_federated_discovery.valid.json`
- `tools/evaluation_gates/fixtures/privacy_federated_discovery.accuracy_only_invalid.json`
- `tools/evaluation_gates/fixtures/privacy_federated_discovery.insufficient_evidence_valid.json`
- `tools/evaluation_gates/fixtures/privacy_federated_discovery.unsafe_advice_invalid.json`
