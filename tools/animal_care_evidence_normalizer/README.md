# Animal Care Evidence Normalizer

Executable Mirror Cartographer component for turning public-safe animal-care observations and source snippets into normalized evidence packets before they enter longitudinal tracking, hypothesis generation, falsification, or collaborator review.

## Purpose

The cure/discovery ambition requires disciplined handling of animal-care evidence: symptoms, interventions, observations, literature snippets, veterinary notes, and uncertainty must not collapse into advice or cure claims. This component normalizes input packets, labels missingness, blocks privacy leakage, separates observation from interpretation, and routes each packet to the correct next stage.

## Public-safe scope

This tool ships with synthetic examples only. It is not medical or veterinary advice. It does not diagnose, treat, prescribe, or recommend action. It prepares evidence packets for review and safer downstream reasoning.

## Input shape

A JSON file containing an array of packets:

```json
[
  {
    "packet_id": "animal-syn-001",
    "species": "dog",
    "domain": "ophthalmology",
    "observation_text": "Synthetic dog had higher measured eye pressure at night in a fictional care log.",
    "source_type": "owner_observation",
    "source_status": "synthetic",
    "claim_status": "observation_only",
    "privacy_status": "public_safe",
    "timestamp": "2026-07-07T12:00:00Z",
    "measurements": [
      {"name": "eye_pressure_pattern", "value": "higher_at_night", "unit": "categorical"}
    ],
    "missingness": ["no_exam_findings", "no_treatment_outcome"],
    "revision_reason": "normalize animal-care observation before downstream reasoning"
  }
]
```

## Output shape

The CLI prints JSON:

```json
{
  "component": "animal_care_evidence_normalizer",
  "normalized_packets": [
    {
      "packet_id": "animal-syn-001",
      "normalized_status": "accepted_for_review",
      "routing": ["longitudinal_tracking", "source_chain_validation"],
      "blocked_reasons": [],
      "evidence_boundary": "observation_only",
      "labels": {
        "source_status": "synthetic",
        "claim_status": "observation_only",
        "privacy_status": "public_safe",
        "missingness": ["no_exam_findings", "no_treatment_outcome"],
        "revision_reason": "normalize animal-care observation before downstream reasoning",
        "implementation_status": "executable_cli",
        "testability": "unit_tests_and_fixture"
      }
    }
  ]
}
```

## Routing rules

- `privacy_status` must be `public_safe`.
- `source_status` must be one of `synthetic`, `public_source`, `deidentified_review_note`.
- `claim_status` must be one of `observation_only`, `literature_summary`, `measurement_record`, `review_question`.
- Missing `missingness` array routes to blocker.
- Diagnosis, treatment, prescription, cure, or emergency advice terms route to blocker.
- Accepted packets are routed by source and claim type:
  - owner observation / measurement record -> longitudinal tracking and source-chain validation
  - literature summary -> medical/animal literature routing and source-chain validation
  - review question -> review packet indexer

## CLI

Run:

```bash
python tools/animal_care_evidence_normalizer/normalize_animal_care_evidence.py \
  tools/animal_care_evidence_normalizer/fixtures.synthetic.json
```

## Acceptance criteria

1. Public-safe synthetic observation packets are accepted for review.
2. Private or unknown privacy packets are blocked.
3. Packets with missing missingness labels are blocked.
4. Packets containing diagnosis, prescription, treatment, cure, or emergency advice language are blocked.
5. Output preserves required status labels for downstream provenance.
6. Tests run without network access or third-party packages.

## Integration point

Place this component after raw animal-care note ingestion and before longitudinal tracking, source-chain validation, hypothesis seed generation, falsification task queue, and collaborator export.

## Labels

- Source status: assistant-generated public-safe synthetic implementation.
- Claim status: animal-care evidence normalization gate, not medical/veterinary advice.
- Privacy status: blocks private/unknown packets and identifier residue.
- Missingness: explicit missingness array required and tested.
- Revision reason: prevent animal-care observations from becoming premature diagnosis, treatment, cure, or advice claims.
- Implementation status: README, fixture, CLI normalizer, and tests.
- Testability: run `python tools/animal_care_evidence_normalizer/test_normalize_animal_care_evidence.py`.
- Next executable action: wire after animal-care note ingestion and before source-chain validation / longitudinal tracking.
