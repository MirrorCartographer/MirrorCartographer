# Frontier Scout: Discovery Workbench Evaluation Gate

Date: 2026-07-05

## Source status

Current public-source scan. Sources used:

1. Reuters, 2026-06-30: Anthropic launched Claude Science, a scientific research workbench for literature review, data analysis, and research workflows.
2. TechRadar, 2026-07-04: Claude Science is described as integrating common scientific tools such as PubMed, Jupyter, and R, emphasizing reproducibility through code and message history and local infrastructure use.
3. arXiv 2603.11659, 2026-03-12: FL-MedSegBench proposes a benchmark for federated medical image segmentation across nine tasks and ten modalities, evaluating accuracy, fairness, communication efficiency, convergence, and generalization.
4. arXiv 2412.17228, 2024-12-23: MatchMiner-AI describes an open-source cancer clinical-trial matching pipeline using longitudinal EHR extraction, vector ranking, classification, synthetic data, and released model assets.
5. Reuters, 2026-05-27: CZ Biohub released an open-source protein-biology world model based on evolutionary-scale modeling, intended to accelerate drug discovery and protein design.
6. arXiv 2605.10985, 2026-05-09: SoftBlobGIN is proposed as an interpretable companion for protein language model representations, producing auditable structural explanations.

## Claim status

Design hypothesis, not validated.

## Privacy status

Public-safe. No personal data, patient data, animal records, or private transcripts are included.

## Missingness

- No direct execution against Claude Science, Biohub models, MatchMiner-AI, or FL-MedSegBench yet.
- No local benchmark runner has been wired into the repository yet.
- Evaluation criteria need conversion into JSON Schema and automated tests.
- Source list should be refreshed on future runs because scientific AI tooling is moving quickly.

## Revision reason

Frontier scientific AI is moving toward integrated workbenches and domain-specific models. The risk is that MC becomes a news digest. The opportunity is to turn frontier signals into an evaluation gate: every external frontier tool should be translated into a reusable MC build requirement.

## Frontier pattern detected

Across current frontier systems, the useful pattern is not simply stronger models. It is:

1. integrated scientific workspace,
2. provenance trail,
3. executable code or reproducible workflow,
4. privacy-preserving or local-data boundary,
5. benchmarked performance under realistic heterogeneity,
6. interpretable or auditable explanation layer,
7. synthetic or public-safe data for development,
8. human-in-the-loop review for clinical or scientific consequence.

## Actionable design implication

MC should add a **Discovery Workbench Evaluation Gate**.

Any future MC module that claims to advance cures, scientific discovery, medical AI organization, animal-care evidence maps, or hypothesis generation must pass this gate before being treated as a discovery-capable artifact.

The gate asks:

Can this module produce new testable work, preserve source/provenance boundaries, avoid private-data leakage, expose uncertainty, and leave behind an executable or semi-executable trace?

## Evaluation gate v0.1

A module passes only if it produces all required outputs below.

### Required outputs

1. `claim_record`
   - precise claim
   - claim status
   - source status
   - evidence strength
   - known missingness

2. `source_map`
   - source URLs or citations
   - source type: primary, institution, preprint, news, documentation, dataset, code
   - source freshness date
   - dependency status: load-bearing, context-only, or speculative

3. `privacy_packet`
   - privacy status
   - data class: public, synthetic, abstracted, private, unknown
   - de-identification requirement
   - exclusion rule for private or sensitive fields

4. `measurable_variables`
   - at least three variables that can be measured
   - each variable has unit, expected direction, and failure threshold

5. `falsification_route`
   - one concrete observation that would weaken or refute the claim
   - one test fixture or dataset needed to check it

6. `execution_trace`
   - code, schema, fixture, scoring rubric, experiment design, or benchmark plan
   - next command or next file to create

7. `human_review_boundary`
   - whether expert review is required
   - what the system must not decide on its own
   - whether medical, veterinary, legal, financial, or safety review is implicated

## Scoring rubric

Each field is scored 0, 1, or 2.

- 0: absent or vague
- 1: present but not independently checkable
- 2: specific, source-bound, and testable

Minimum passing score: 11 of 14.

Automatic fail conditions:

- no falsification route,
- no privacy packet,
- no source map,
- clinical/veterinary recommendation framed as advice instead of research organization,
- claims of discovery without measurable variables,
- use of private data in a public artifact.

## Hypothesis test

### Hypothesis

If MC requires every frontier-derived module to pass the Discovery Workbench Evaluation Gate, then its outputs will shift from summaries toward reusable discovery infrastructure.

### Measurable variables

1. `executable_artifact_rate`
   - Definition: fraction of frontier scout outputs that create code, schema, fixture, rubric, benchmark plan, or source map.
   - Target: >= 0.80.
   - Failure threshold: < 0.50 over 10 runs.

2. `falsification_presence_rate`
   - Definition: fraction of outputs with a concrete falsification route.
   - Target: 1.00.
   - Failure threshold: < 0.90 over 10 runs.

3. `privacy_packet_completion_rate`
   - Definition: fraction of outputs with source status, claim status, privacy status, missingness, revision reason, and implementation status.
   - Target: 1.00.
   - Failure threshold: < 0.95 over 10 runs.

4. `source_to_requirement_conversion_rate`
   - Definition: fraction of reviewed sources that generate at least one explicit design requirement.
   - Target: >= 0.60.
   - Failure threshold: < 0.30 over 10 runs.

5. `reusability_score`
   - Definition: human or model rating from 0 to 2 for whether the output can be reused by another module without rereading the source material.
   - Target: average >= 1.5.
   - Failure threshold: average < 1.0.

## Falsification route

The gate is weakened if, after 10 frontier-scout outputs, most artifacts still remain narrative summaries and do not create reusable tests, schemas, source maps, or prototype requirements.

The gate is refuted if applying it slows output without increasing executable artifacts, falsification routes, or reusable decision records.

## Implementation status

Implemented as a repository specification and evaluation rubric.

Not yet implemented as:

- JSON Schema,
- Python validator,
- GitHub action,
- decision-record generator,
- automated score report.

## Next executable action

Create:

`schemas/discovery_workbench_gate.schema.json`

Then create:

`tests/fixtures/discovery_workbench_gate.valid.json`
`tests/fixtures/discovery_workbench_gate.invalid.json`
`tools/validators/validate_discovery_gate.py`

The validator should reject any artifact missing source status, claim status, privacy status, missingness, revision reason, measurable variables, falsification route, or next executable action.

## Design consequence for MC

MC should not copy frontier systems. MC should metabolize them.

The frontier says: workbenches, provenance, code traces, privacy-preserving infrastructure, benchmark realism, interpretability, and human review boundaries are becoming the shape of serious scientific AI.

MC's next move is to make those requirements native to its own hypothesis and discovery loop.
