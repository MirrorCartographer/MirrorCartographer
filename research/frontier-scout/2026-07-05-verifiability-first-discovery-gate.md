# Frontier Scout: Verifiability-First Discovery Gate

Source status: public web frontier scan using primary/preprint/reproducible-method signals where available; secondary news used only as weak trend context.
Claim status: engineering implication for Mirror Cartographer discovery infrastructure, not a medical or veterinary claim.
Privacy status: public-safe abstraction only; no private, household, medical, animal-care, financial, location, relationship, credential, or raw transcript details.
Missingness: no local benchmark run yet; source set is small and should be expanded with primary papers, datasets, and reviewer labels.
Revision reason: recent scientific-AI benchmarks increasingly distinguish testable claims, non-verifiable claims, staged hypothesis generation, evidence alignment, executability, and reproducible workflows. MC needs a gate that stops unverifiable or overclaimed packets from entering discovery memory as if they were established findings.
Implementation status: prototype requirement and evaluation criterion specified; code not yet implemented in this artifact.
Evidence strength: moderate for infrastructure direction; low for any specific cure/discovery outcome.

## Frontier signals scanned

| Signal | Source status | Why it matters for MC | Caveat |
|---|---|---|---|
| BioDSA-1K benchmark for biomedical data-science agents | Preprint, 2025, hypothesis-validation benchmark | Evaluates hypothesis decision accuracy, evidence/conclusion alignment, reasoning correctness, executable analysis code, and explicitly includes non-verifiable hypotheses. | Preprint benchmark; not a clinical validation system. |
| ProjectionBench progressive-disclosure scientific hypothesis benchmark | Preprint, 2026, hypothesis-generation benchmark | Tests whether models make useful early hypotheses before the full paper conclusion is revealed, helping separate discovery-like inference from recall. | Benchmark scope is materials-heavy; needs biomedical/longitudinal adaptation. |
| Federated learning for privacy-preserving medical AI | Dissertation/preprint, 2026 | Emphasizes site-aware partitioning, privacy-utility metrics, and realistic medical-data boundaries. | Domain-specific to ADNI MRI classification; should not be generalized without testing. |
| Claude Science / scientific AI workbench trend | Secondary reporting, 2026 | Points toward integrated scientific workbenches with code, provenance, local/lab infrastructure, and reproducibility traces. | Vendor/reporting signal; needs primary docs before design lock-in. |
| CZ Biohub protein world-model signal | Secondary reporting, 2026 | Shows frontier mechanistic biology moving toward virtual hypothesis testing before wet-lab experiments. | Still preclinical; clinical translation is several steps away. |

## Actionable design implication

MC should add a **Verifiability-First Discovery Gate** before storing any generated hypothesis, literature claim, longitudinal signal, animal-care evidence packet, or symbolic-to-operational translation as discovery memory.

The gate's job is not to decide truth. Its job is to classify whether a claim is currently:

1. **verifiable_now** — enough public-safe evidence, variables, and method detail exist to test it;
2. **non_verifiable_yet** — plausible or interesting, but current evidence/data are insufficient;
3. **overclaimed** — conclusion strength exceeds evidence strength;
4. **requires_privacy_partition** — potentially useful but cannot be pooled without privacy-preserving design;
5. **reject_for_memory** — lacks source, variables, falsification route, or boundary labels.

## Prototype requirement

Create `tools/verifiability_gate/score_verifiability_packet.py`.

### Input shape

```json
{
  "packet_id": "string",
  "title": "string",
  "domain": "scientific_ai | medical_ai_evidence | mechanistic_biology | neuroscience | longitudinal_health | animal_health_research | hci | privacy_memory | hypothesis_generation | symbolic_operational",
  "claim": "string",
  "claim_status": "hypothesis | mechanism | prediction | evidence_summary | contradiction | question",
  "source_status": "primary | preprint | clinical_research_institution | dataset | benchmark | open_source_tool | secondary_context | synthetic_fixture",
  "privacy_status": "public_safe | synthetic_only | deidentified_public | requires_federation | private_disallowed",
  "evidence_strength": "none | weak | moderate | strong",
  "evidence_items": [
    {
      "source_id": "string",
      "source_type": "paper | dataset | benchmark | code | institution | grant | clinical_trial | registry | other",
      "url_or_citation": "string",
      "supports_claim": true,
      "method_detail_present": true
    }
  ],
  "measurable_variables": ["string"],
  "proposed_test": "string",
  "falsification_route": "string",
  "missingness": ["string"],
  "expected_claim_scope": "string",
  "actual_claim_scope": "string"
}
```

### Output shape

```json
{
  "packet_id": "string",
  "classification": "verifiable_now | non_verifiable_yet | overclaimed | requires_privacy_partition | reject_for_memory",
  "score": 0.0,
  "hard_failures": ["string"],
  "warnings": ["string"],
  "next_executable_action": "string"
}
```

## Evaluation rules

Hard reject if any required boundary label is missing:

- source_status
- claim_status
- privacy_status
- evidence_strength
- falsification_route
- measurable_variables
- missingness

Classify as `overclaimed` if:

- actual claim scope is broader than expected claim scope, or
- evidence strength is weak/none while the claim uses cure, proven, diagnostic, guaranteed, generalizable, or causal language, or
- no negative/insufficient-evidence state is allowed.

Classify as `non_verifiable_yet` if:

- the claim is coherent but evidence items lack method detail, or
- measurable variables are present but no dataset/test route is available, or
- missingness explains why the claim cannot yet be tested.

Classify as `requires_privacy_partition` if:

- useful longitudinal or medical/animal-care patterns require cross-subject aggregation, and
- privacy_status is not public_safe/synthetic_only/deidentified_public.

Classify as `verifiable_now` only if:

- at least one evidence item has method detail,
- at least one measurable variable is present,
- a falsification route is explicit,
- privacy status allows the proposed test,
- claim scope does not exceed evidence scope.

## Synthetic test cases

1. Valid benchmark-style claim: public preprint benchmark, measurable variables, executable scoring route, modest scope. Expected: `verifiable_now`.
2. Interesting mechanistic hypothesis with no dataset or method detail. Expected: `non_verifiable_yet`.
3. Weak evidence packet claiming cures or diagnosis. Expected: `overclaimed`.
4. Longitudinal cross-person medical pattern requiring private aggregation. Expected: `requires_privacy_partition`.
5. Symbolic-to-operational translation with no falsification route. Expected: `reject_for_memory`.

## Acceptance criteria

- The scorer must preserve non-verifiable states instead of deleting them.
- Overclaimed packets must not enter supported discovery memory.
- Privacy-restricted packets must be routed to synthetic/federated design, not pooled memory.
- Every accepted packet must have measurable variables and a falsification route.
- Every output must contain a next executable action.

## Falsification route

This gate fails if independent reviewers can construct common MC-relevant discovery packets that are clearly useful but cannot be represented, or if unsupported cure/diagnosis/mechanism claims pass as `verifiable_now`.

## Next executable action

Implement the scorer, JSON fixtures, and regression tests under `tools/verifiability_gate/`, then connect the gate before evidence packets enter retrieval memory, hypothesis backlog, longitudinal signal maps, contradiction ledger, or progressive disclosure tests.

## Sources

- BioDSA-1K: Benchmarking Data Science Agents for Biomedical Research. arXiv:2505.16100. https://arxiv.org/abs/2505.16100
- ProjectionBench: Evaluating Scientific Hypothesis Generation in LLMs Under Progressive Information Disclosure. arXiv:2605.30284. https://arxiv.org/abs/2605.30284
- Federated Learning for Privacy-Preserving Medical AI. arXiv:2603.15901. https://arxiv.org/abs/2603.15901
- Claude Science reporting context: https://www.techradar.com/pro/anthropic-launches-ai-workbench-for-scientists-using-claude
- CZ Biohub protein world-model reporting context: https://www.axios.com/2026/05/27/zuckerbergs-biohub-unveils-ai-world-model-of-proteins
