# Hypothesis Lineage Exporter

Executable Mirror Cartographer component for turning public-safe hypothesis packets into auditable lineage packets.

## Purpose

Discovery work fails when hypotheses appear without a visible chain of origin, transformation, evidence boundary, contradiction handling, and next falsification action. This component exports compact lineage records that can be reviewed by humans or downstream gates without exposing raw private context.

## Public-safe scope

- Uses synthetic/deidentified packet shapes only.
- Does not provide medical or veterinary advice.
- Does not infer diagnosis, treatment, or causality.
- Requires source, claim, privacy, missingness, and falsification fields before export.

## Input shape

The CLI expects a JSON array of hypothesis packets:

```json
[
  {
    "hypothesis_id": "HYP-SYN-001",
    "domain": "animal_care_evidence",
    "origin_component": "animal_evidence_router",
    "claim_text": "A recurring timing pattern may justify literature review.",
    "claim_status": "candidate",
    "source_status": "synthetic_public_safe",
    "privacy_status": "public_safe_synthetic",
    "missingness": ["no raw observation", "no clinician review"],
    "variables": ["timing_bucket", "behavior_marker"],
    "evidence_refs": ["SYN-LIT-001"],
    "contradiction_refs": ["SYN-CONTRA-001"],
    "falsification_route": "compare against negative-control fixture and independent evidence map",
    "next_executable_action": "send to hypothesis_falsification_runner"
  }
]
```

## Output shape

Each accepted packet becomes:

```json
{
  "lineage_id": "LIN-HYP-SYN-001",
  "hypothesis_id": "HYP-SYN-001",
  "admission": "exported",
  "lineage_chain": ["animal_evidence_router", "hypothesis_lineage_exporter"],
  "review_flags": [],
  "next_executable_action": "send to hypothesis_falsification_runner"
}
```

Rejected packets keep a `blocked` admission status and explain missing fields.

## Run

```bash
python tools/hypothesis_lineage_exporter/export_hypothesis_lineage.py \
  tools/hypothesis_lineage_exporter/fixtures.synthetic.json
```

## Test

```bash
python tools/hypothesis_lineage_exporter/test_export_hypothesis_lineage.py
```

## Acceptance criteria

1. Valid public-safe candidate hypotheses export lineage packets.
2. Packets missing evidence, variables, or falsification route are blocked.
3. Private/raw/advice-like packets are blocked.
4. Every result contains source, claim, privacy, missingness, revision, implementation, testability, and next-action labels.
