# Animal Health Evidence Gate

## Purpose

Mirror Cartographer needs a species-aware evidence boundary for animal-care research packets. Veterinary AI infrastructure is emerging as its own frontier because animal-health data differs from human health data in species diversity, modality mix, regulation, owner-mediated observations, and longitudinal capture quality.

This gate validates whether an animal-health packet is safe and structured enough for research organization or discovery-memory review. It does not diagnose, treat, or replace veterinary judgment.

## Frontier source map

| Source | Status | Relevant signal | MC design implication |
|---|---|---|---|
| Cornell College of Veterinary Medicine, `From Data to Animal Health: Building Benchmarks for AI-Driven Veterinary Innovation` | institutional / grant-program source | Veterinary AI benchmark building faces species diversity, varied modalities, ethical issues, and different regulatory/protection barriers than human healthcare. | Animal-care packets must explicitly declare species, modality, evidence boundary, privacy boundary, and veterinary-review requirement. |
| Frontiers in Big Data 2026, `A longitudinal multimodal big data infrastructure for precision livestock farming` | peer-reviewed research article | Longitudinal multimodal sensing can support cross-modal query and ML evaluation when workflows and data are released together. | MC animal-health memory should require time-window, baseline, change-event, and confounder definitions before claiming longitudinal pattern value. |
| UC Davis animal-health AI research coverage | institutional research source | Veterinary AI work spans diagnosis/treatment support and requires data-driven infrastructure. | MC should treat animal-care AI as infrastructure and evidence organization, not personal medical/veterinary advice. |
| UF veterinary learning health system coverage | institutional research source | Veterinary precision medicine requires platforms that collect, collate, and analyze patient data. | MC should support future collaborator-readiness with schema-first packets and deidentified/aggregate sharing tiers. |
| `AI applications in veterinary digital health` | secondary / preprint-style caveated source | Veterinary digital health spans imaging, diagnostics, and monitoring but remains unevenly standardized. | MC should reject packets that collapse multimodal observation into unsupported diagnosis or treatment advice. |

## Packet labels required

- source status
- claim status
- privacy status
- missingness
- revision reason
- implementation status
- evidence strength
- falsification route
- next executable action

## Acceptance criteria

A packet passes only if it:

1. States species context and warns against direct human-to-veterinary translation.
2. Declares allowed and disallowed claims.
3. Requires veterinary review.
4. Includes at least two modalities and a clinical-record modality for research-organization packets.
5. Defines longitudinal baseline, change event, time window, and confounders.
6. Rejects raw-data sharing in public-safe packets.
7. Provides falsification logic.
8. Avoids diagnosis, treatment, or medication-action language.

## Run

```bash
python tools/animal_health_evidence_gate/validate_animal_health_evidence_packet.py \
  tools/animal_health_evidence_gate/fixtures.synthetic.json --fixtures

python tools/animal_health_evidence_gate/test_validate_animal_health_evidence_packet.py
```

## Cure/discovery connection

This component improves animal-care evidence organization and longitudinal pattern tracking by forcing animal-health observations into a reviewable, falsifiable, privacy-bounded packet before they can influence MC discovery memory.

## Next executable action

Wire this gate before animal-care evidence-transition promotion and add a fixture generator that produces synthetic longitudinal packets for dog, cat, and livestock research scenarios.
