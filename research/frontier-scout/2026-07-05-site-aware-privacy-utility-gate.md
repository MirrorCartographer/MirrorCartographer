# Frontier Scout: Site-Aware Privacy–Utility Gate

Date: 2026-07-05

## Design implication

Mirror Cartographer should require a **site-aware privacy–utility gate** before any longitudinal health, animal-health, or collaboration dataset design is considered suitable for discovery infrastructure.

A discovery system that stores longitudinal signals must not only ask whether a hypothesis is measurable. It must also ask whether the data layout would remain valid under real-world institutional, household, clinic, lab, or collaborator boundaries. Current frontier medical-AI work repeatedly shows that privacy-preserving systems fail when evaluation assumes unrealistic centralized data, random splits, or privacy-free aggregation.

## MC hypothesis

If MC models longitudinal observations as partitioned records with explicit site/context boundaries, privacy budget fields, uncertainty fields, and utility metrics, then downstream hypothesis scoring will be less likely to overstate generality, leak private context, or confuse local pattern fit with transferable evidence.

## Frontier source map

| Source | Type | Frontier signal | MC translation |
| --- | --- | --- | --- |
| Federated Learning for Privacy-Preserving Medical AI, arXiv 2603.15901 | 2026 dissertation / preprint | Site-aware partitioning, adaptive local differential privacy, privacy–utility benchmarking, ADNI MRI use case | Require site/context partition fields before longitudinal packets can be used for cross-context inference |
| TrustFed, arXiv 2603.21656 | 2026 preprint | Federated uncertainty quantification under heterogeneous and imbalanced medical imaging data | Require uncertainty coverage fields when claims rely on multi-context evidence |
| zkFL-Health, arXiv 2512.21048 | 2025 preprint | Zero-knowledge and TEE-based verifiable federated aggregation audit trail | Add optional audit/proof fields for future collaboration-grade evidence memory |
| FedOnco-Bench, arXiv 2511.00795 | 2025 preprint | Synthetic CT benchmark quantifies segmentation utility versus membership-inference privacy leakage | Require explicit privacy risk and task utility metrics instead of a single performance score |
| FEDMEKI, arXiv 2408.09227 | 2024 benchmark | Multi-site, multi-modal, multi-task medical foundation model benchmark under privacy constraints | Allow multimodal longitudinal packets but force modality, task, site, and privacy-boundary declarations |
| LABBench2, arXiv 2604.09554 | 2026 benchmark | Realistic biology research tasks and public eval harness | Treat MC discovery gates as runnable evaluations, not narrative claims |
| BABE Biology Arena Benchmark, arXiv 2602.05857 | 2026 benchmark | Cross-scale biological reasoning from experimental results plus context | Require claims to distinguish local experimental context from broader mechanism transfer |

## Proposed component

Path for next executable implementation:

`tools/site_aware_privacy_utility_gate/`

Required files:

- `site_aware_packet_schema.json`
- `fixtures.synthetic.json`
- `score_site_aware_packets.py`
- `test_score_site_aware_packets.py`

## Required packet fields

```json
{
  "packet_id": "synthetic-public-id",
  "schema_version": "1.0",
  "source_status": "synthetic|public|primary|preprint|institutional",
  "claim_status": "hypothesis|candidate_signal|supported|contradicted|inconclusive",
  "privacy_status": "public_safe|deidentified|private_blocked|requires_partition",
  "domain": "longitudinal_health|animal_health_research|scientific_ai|mechanistic_biology|hci|privacy_memory",
  "site_partition": {
    "partition_type": "individual|household|clinic|institution|lab|synthetic_site",
    "site_count": 1,
    "cross_site_transfer_claimed": false,
    "site_shift_risk": "low|moderate|high|unknown"
  },
  "modalities": ["text_observation"],
  "measurable_variables": [
    {
      "name": "variable_name",
      "unit": "unit_or_scale",
      "measurement_window": "time_window"
    }
  ],
  "utility_metrics": [
    {
      "name": "prediction_accuracy|coverage|calibration_error|recall|specificity|reviewer_agreement",
      "value": 0.0,
      "higher_is_better": true
    }
  ],
  "privacy_metrics": [
    {
      "name": "membership_inference_auc|epsilon|k_anonymity|redaction_pass_rate",
      "value": 0.0,
      "acceptable_threshold": 0.0
    }
  ],
  "uncertainty": {
    "coverage_claimed": false,
    "confidence_interval": null,
    "known_imbalance": "none|class|site|time|unknown"
  },
  "falsification_route": "A concrete test that would make the packet fail or downgrade.",
  "revision_reason": "Why this packet was created or changed."
}
```

## Scoring rule

A packet is admissible only if all of the following pass:

1. Privacy status is not `private_blocked`.
2. Site partition is explicit.
3. Cross-site transfer claims require `site_count >= 2` and a non-unknown site-shift risk.
4. At least one measurable variable is present.
5. At least one utility metric and one privacy metric are present.
6. Any supported or cross-site claim requires uncertainty metadata.
7. Falsification route is non-empty and operational.

## Synthetic fixtures to create

### Should pass

- Single-site public-safe longitudinal research packet with no transfer claim, measurable variables, utility metric, privacy metric, and falsification route.
- Multi-site synthetic benchmark packet with cross-site transfer claim, privacy metric, calibration/coverage metric, and uncertainty fields.

### Should fail

- Packet with strong cross-site claim but `site_count: 1`.
- Packet with accuracy metric but no privacy metric.
- Packet with privacy metric but no utility metric.
- Packet with `private_blocked` privacy status.
- Packet with no falsification route.
- Packet claiming supported status without uncertainty metadata.

## Acceptance criteria

The gate is successful when regression tests prove that MC cannot admit privacy-blind, site-blind, or uncertainty-free longitudinal packets into discovery memory.

## Labels

Source status: public frontier scan plus assistant-generated public-safe design.

Claim status: infrastructure hypothesis, not medical or veterinary advice.

Privacy status: public-safe abstraction only; no personal or clinical records.

Missingness: no executable validator in this commit; no real dataset ingestion; no human reviewer labels.

Revision reason: recent frontier work indicates that privacy-preserving medical AI must evaluate site heterogeneity, privacy leakage, uncertainty, and utility together.

Implementation status: source map and implementation-ready gate specification committed.

Evidence strength: moderate. Multiple preprints and benchmarks converge on the same design direction, but clinical deployment evidence remains limited and source maturity varies.

Falsification route: reject or revise this gate if real collaborative scientific workflows can safely and reproducibly evaluate longitudinal packets without site boundaries, privacy metrics, and uncertainty fields.

Next executable action: implement `tools/site_aware_privacy_utility_gate/score_site_aware_packets.py` with synthetic fixtures and regression tests.
