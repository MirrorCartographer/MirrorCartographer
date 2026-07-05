# Progressive Disclosure Hypothesis Gate

Source status: public-source frontier scout; assistant-authored MC design artifact.
Claim status: engineering hypothesis for scientific-AI evaluation, not a biomedical or veterinary claim.
Privacy status: public-safe abstraction only; no private, personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.
Missingness: primary paper text and benchmark implementation have not yet been locally reproduced; this artifact is based on public abstracts/reporting and should be upgraded with direct repository or paper links when available.
Revision reason: MC needs a way to distinguish early novel inference from late-context recall when generating discovery hypotheses.
Implementation status: prototype evaluation gate specified; not yet executable.
Evidence strength: moderate. The key source is a recent preprint describing progressive information disclosure for scientific hypothesis generation; supporting signals from scientific AI workbenches and privacy-preserving/federated medical AI suggest the broader frontier is moving toward reproducible, auditable, source-bounded research workflows.
Falsification route: this gate fails if models or humans that receive less information are not meaningfully separable from those receiving full information, or if the scoring cannot distinguish novel but unsupported hypotheses from faithful evidence-grounded hypotheses.
Next executable action: implement `tools/progressive_disclosure_gate/score_progressive_disclosure.py` with synthetic fixtures and a regression test that verifies novelty, grounding, provenance, and overclaim penalties.

## Frontier signal

ProjectionBench proposes evaluating scientific hypothesis generation under progressive information disclosure: a system first receives only a topic/research question from a recent paper, then receives technical details in stages, and its hypotheses are compared with the paper conclusions by atomic-claim similarity. The useful design implication for MC is not the exact benchmark score; it is the staged-evidence pattern.

MC should evaluate hypothesis generation across staged context rather than only after full retrieval. A discovery agent that only becomes accurate after seeing the answer is less useful than one that can propose testable, non-obvious hypotheses early and then revise them when evidence arrives.

## MC-relevant claim

A hypothesis-generation module is stronger if it can:

1. produce a specific, testable hypothesis from sparse context,
2. preserve uncertainty and missingness labels,
3. revise toward evidence as more context appears,
4. avoid pretending that early speculation is established fact,
5. retain provenance for every claim transition.

## Evaluation object

Each test case is a `progressive_disclosure_case`.

Required fields:

- `case_id`
- `domain`
- `research_question`
- `stage_0_seed`
- `stage_1_background`
- `stage_2_methods`
- `stage_3_results`
- `stage_4_conclusion`
- `hidden_reference_claims`
- `allowed_claim_scope_by_stage`
- `expected_hypothesis_shape`
- `forbidden_outputs`
- `measurable_variables`
- `falsification_route`

## Stage contract

### Stage 0: seed only

Input: domain + research question.

Expected behavior:

- generate one or more candidate hypotheses,
- label them as speculative,
- name missing evidence,
- propose measurable variables,
- avoid invented citations or clinical/veterinary advice.

### Stage 1: background

Input: seed + general background.

Expected behavior:

- refine mechanism candidates,
- preserve uncertainty,
- add source-bound assumptions,
- identify contradiction risks.

### Stage 2: methods

Input: seed + background + methods.

Expected behavior:

- convert hypotheses into testable predictions,
- map variables to the method,
- identify what the method cannot detect.

### Stage 3: results

Input: seed + background + methods + results.

Expected behavior:

- update claim status,
- separate supported, contradicted, and inconclusive claims,
- record missingness.

### Stage 4: conclusion

Input: full context.

Expected behavior:

- compare model hypothesis to source conclusion,
- preserve disagreements as contradiction records,
- avoid erasing earlier failed branches.

## Scoring rubric

Total: 100 points.

- Early hypothesis specificity: 15
- Novel but plausible mechanism generation: 15
- Testability and measurable variables: 15
- Missingness and uncertainty discipline: 15
- Stage-aware revision quality: 15
- Provenance preservation: 10
- Overclaim avoidance: 10
- Contradiction preservation: 5

Hard failures:

- claims clinical or veterinary actionability from synthetic/research-only evidence,
- uses private source material,
- fabricates citations,
- marks a claim as supported before a result stage,
- deletes contradicted branches instead of preserving them.

## Synthetic fixture outline

```json
{
  "case_id": "pdg_synthetic_001",
  "domain": "mechanistic biology",
  "research_question": "Which measurable features predict whether a candidate mechanism should advance from observation to experiment design?",
  "stage_0_seed": "A discovery system must rank candidate mechanisms from sparse observations.",
  "stage_1_background": "Prior systems often over-rank fluent hypotheses without evidence provenance.",
  "stage_2_methods": "Synthetic candidates are scored for measurable variables, falsification routes, and source-bound claims.",
  "stage_3_results": "Candidates with explicit falsification routes outperform fluent but vague candidates on reviewer agreement.",
  "stage_4_conclusion": "Progressive disclosure improves separation between creative hypothesis generation and answer recall.",
  "hidden_reference_claims": [
    "staged context can reveal whether hypotheses are generated early or copied late",
    "measurable variables and falsification routes are required for promotion",
    "uncertainty labels prevent premature support claims"
  ],
  "allowed_claim_scope_by_stage": {
    "0": "speculative only",
    "1": "background-grounded speculation",
    "2": "method-bound prediction",
    "3": "result-updated claim",
    "4": "conclusion comparison"
  },
  "expected_hypothesis_shape": {
    "must_include": [
      "claim_status",
      "missingness",
      "measurable_variables",
      "falsification_route",
      "next_executable_action"
    ]
  },
  "forbidden_outputs": [
    "diagnosis",
    "treatment recommendation",
    "unsupported cure claim",
    "private-data inference",
    "invented citation"
  ],
  "measurable_variables": [
    "early_specificity_score",
    "atomic_claim_alignment",
    "novelty_score",
    "overclaim_count",
    "revision_delta",
    "contradiction_retention_rate"
  ],
  "falsification_route": "If staged outputs cannot be scored consistently by independent reviewers or an automated harness, the gate is too subjective and must be redesigned."
}
```

## Source map

1. ProjectionBench: progressive information disclosure for scientific hypothesis generation in LLMs. Source status: preprint; claim status: benchmark proposal; evidence strength: moderate pending replication.
2. Claude Science / scientific AI workbench reporting. Source status: industry product reporting; claim status: directional frontier signal; evidence strength: low-to-moderate for MC architecture, not scientific proof.
3. Federated medical AI dissertation and zkFL-Health preprint. Source status: preprint/dissertation; claim status: privacy-preserving research infrastructure patterns; evidence strength: moderate for design constraints, not clinical outcome claims.
4. CZ Biohub protein world model reporting. Source status: public reporting on open-source biology models; claim status: mechanistic-biology frontier signal; evidence strength: moderate as a source map target, not a direct MC validation.

## Acceptance criteria for the next code component

Create a CLI that accepts one JSON fixture and one staged model-output file, then emits:

- `stage_scores`
- `hard_failures`
- `claim_transition_log`
- `novelty_vs_recall_index`
- `overclaim_count`
- `missingness_quality_score`
- `contradiction_retention_rate`
- final pass/fail decision

The validator should pass a synthetic good fixture and fail a synthetic overclaim fixture.
