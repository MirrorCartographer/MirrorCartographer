# Context Level Claim Gate

Frontier discovery scout implementation.

## Design implication

Reusable discovery memory must declare the **context level** of every claim before promotion. A packet cannot blur individual, cohort, site, species, organ-system, assay, model, or literature-level evidence into a single cure/discovery statement.

This gate was added because current scientific AI, longitudinal health AI, veterinary AI, and privacy-preserving memory work increasingly depends on boundary-aware workflows: what was observed, at what level, under what data rights, with what missingness, and by what falsification route.

## Source map

- Stanford HAI longitudinal EHR benchmark infrastructure: EHRSHOT, INSPECT, and MedAlign target responsible healthcare AI evaluation with de-identified longitudinal EHR datasets.
- MemPrivacy preprint: type-aware placeholders preserve memory utility while reducing sensitive span exposure in edge-cloud personalized agents.
- Agentic Science survey preprint: frames scientific AI as a workflow across hypothesis generation, experimental design, execution, analysis, and iterative refinement.
- Cornell contextual privacy seminar: argues that persistent agent memory requires contextual norms, not generic scale-only fixes.
- Nature synthetic clinical data and privacy-preserving AI collection: emphasizes synthetic data, federated learning, differential privacy, provenance, utility, privacy guarantees, and governance.
- Veterinary/animal-health frontier signal: recent livestock early-warning and veterinary AI collaboration programs point toward species-aware, longitudinal, multimodal infrastructure.

## Required labels

- source_status
- claim_status
- privacy_status
- missingness
- revision_reason
- implementation_status
- evidence_strength
- falsification_route
- next_executable_action

## Evaluation criterion

A packet passes only if it:

1. declares the level of evidence and the level of the proposed claim;
2. refuses cross-level promotion unless a bridge rationale and validation route are present;
3. records privacy risk created by rare feature combinations or longitudinal re-identification;
4. separates human/veterinary/animal/species contexts;
5. names what would falsify the claim.

## Prototype requirement

Before any MC health, animal-health, neuroscience, or discovery packet enters reusable memory, run:

`python tools/context_level_claim_gate/test_validate_context_level_claim_packet.py`

## Status

- Source status: public frontier scan.
- Claim status: infrastructure/design criterion, not medical or veterinary advice.
- Privacy status: synthetic public-safe fixtures only.
- Missingness: no production corpus or curator labels yet.
- Revision reason: prevent level-confusion, such as storing a site/cohort/model result as an individual, species-wide, or cure-level claim.
- Implementation status: schema, validator, fixtures, and regression tests added.
- Evidence strength: moderate.
- Falsification route: revise if curator review shows the gate does not reduce unsupported cross-level memory promotion.
- Next executable action: run the regression test file above.
