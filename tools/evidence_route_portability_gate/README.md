# Evidence Route Portability Gate

## Frontier scout finding

Current scientific-AI and biomedical-agent work is converging on a requirement that claims remain inspectable across model, tool, dataset, time, privacy, and domain boundaries. A scientific output is not ready for discovery memory merely because it sounds plausible or passes a single benchmark. It needs a portable evidence route: another reviewer, model, or future run must be able to reconstruct what evidence was used, what was excluded, what tooling produced intermediate artifacts, what privacy boundary applies, and what would falsify the claim.

## Source map

| Source | Source status | Relevant signal | Claim status | Evidence strength |
|---|---|---|---|---|
| LABBench2, arXiv 2604.09554v2, 2026-05-05 | Preprint / benchmark | Evaluates AI systems on more realistic scientific tasks, not just closed-form answers | Supports need for workflow-reconstructable scientific evaluation | Moderate |
| GeneBench / GeneBench-Pro, 2026 | Primary benchmark / preprint + research announcement | Evaluates ambiguity, consequential judgment, and multi-stage computational biology reasoning | Supports need for consequence-aware, route-aware biology claims | Moderate |
| Co-Scientist, Nature 2026 | Peer-reviewed research system | Uses tools, search, specialized models, and human steering for hypothesis generation | Supports tool-grounded hypothesis route capture | Strong |
| ESL-Bench, arXiv 2604.02834v1, 2026-04-03 | Preprint / synthetic longitudinal benchmark | Models multi-year health trajectories with device, exam, event, and missingness structure | Supports temporal/missingness route requirements | Moderate |
| Cornell CVM animal-health AI benchmark call | Clinical/research institution program | Identifies species diversity, varied modalities, regulation gaps, FAIR-data barriers | Supports cross-species and veterinary data provenance fields | Moderate |
| Nature animal-health AI collection | Publisher research collection | Calls for benchmark datasets, interoperability protocols, open-source toolkits, and ethics | Supports infrastructure-oriented animal-health evidence routing | Moderate |

## Actionable design implication

Mirror Cartographer needs an **Evidence Route Portability Gate** before discovery-memory promotion. A claim can only be promoted if its evidence path can travel between contexts without silently changing meaning:

- from paper to benchmark task;
- from human-health data to animal-health data;
- from one model/tool run to another;
- from public literature to private memory;
- from current evidence cutoff to later revision;
- from correlation/prediction to mechanism/intervention;
- from complete records to explicitly missing or irregular records.

## Gate rule

A packet passes only if it declares:

1. source status;
2. claim status;
3. privacy status;
4. missingness;
5. revision reason;
6. implementation status;
7. evidence strength;
8. falsification route;
9. next executable action;
10. evidence route steps with input, transformation, output, actor/tool, portability risk, and reconstruction requirement;
11. transfer boundaries across species, modality, model, site, and time.

## Privacy status

This tool uses only public-safe synthetic fixtures. No personal medical, veterinary, or identifying data is included.

## Missingness policy

Missingness is not a note; it is a required gate dimension. Claims that do not declare unavailable data, irregular timing, excluded modalities, or unobserved confounders fail validation.

## Falsification route

This gate should be revised or demoted if curator review shows that route-portable packets do not improve reconstruction accuracy, reduce unsupported promotion, or expose more bridge failures than ungated claim packets.

## Next executable action

Run:

`python tools/evidence_route_portability_gate/test_validate_evidence_route_portability_packet.py`
