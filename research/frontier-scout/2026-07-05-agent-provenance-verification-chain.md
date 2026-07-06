# Frontier Scout: Agent Provenance Verification Chain

## Actionable design implication

Mirror Cartographer should require an **Agent Provenance Verification Chain** before a generated hypothesis, evidence synthesis, or proposed experiment can enter discovery memory.

The core rule: a discovery packet is not admissible merely because it contains citations or plausible mechanistic language. It must preserve a machine-checkable chain from:

1. `agent_action` — what the system did,
2. `source_or_tool_artifact` — what external paper, dataset, benchmark, code tool, assay result, simulation, or human-reviewed artifact it used,
3. `intermediate_output` — what structured claim, variable, method choice, or candidate it produced,
4. `verification_result` — how the claim was checked, failed, reproduced, contradicted, or deferred,
5. `memory_transition` — why the packet is allowed or blocked from entering persistent discovery memory.

This turns frontier scientific-AI work into an MC implementation requirement: discovery memory must store not only conclusions, but also the audited pathway by which those conclusions became admissible.

## Source map

| Source | Source status | Relevant frontier signal | MC extraction |
|---|---|---|---|
| Robin, Nature 2026, multi-agent system for automating scientific discovery | Primary peer-reviewed article | Integrates literature agents, hypothesis generation, experimental strategy, lab results, autonomous analysis, and revised hypotheses in a continuous workflow. | MC needs an explicit chain linking literature search, candidate generation, experiment/result interpretation, and hypothesis revision. |
| Medea, 2026 bioRxiv preprint, omics AI agent for therapeutic discovery | Preprint; caveat required | Emphasizes verification-aware AI agents for transparent omics analyses. | MC should score transparent verification traces, not just final biological claims. |
| Federated Learning for Privacy-Preserving Medical AI, 2026 arXiv PDF/dissertation | Preprint/dissertation; caveat required | Highlights site-aware partitioning, privacy-utility trade-offs, realistic multi-institutional evaluation, and benchmarking. | MC provenance packets need privacy-boundary and site-context fields before longitudinal health evidence can be aggregated. |
| AI agents for biological research survey, 2026 PMC entry | Secondary/survey; access partially blocked during this run | Synthesizes biological AI-agent progress across clinical analytics and discovery workflows. | Use as weak support only; do not promote claims without primary/tool-level evidence. |
| Claude Science / GPT-Rosalind / Biohub ESM4 public reporting | News/commercial frontier signal | Specialized scientific AI systems are moving toward trusted-access, life-sciences workflows, protein models, and tool-connected discovery. | MC should separate source type from claim status and should not treat product announcements as validated discovery evidence. |

## Hypothesis

If MC enforces an Agent Provenance Verification Chain before discovery-memory admission, then generated hypotheses will become more falsifiable, less citation-washed, less privacy-leaky, and more collaboration-ready than packets that store final claims without an auditable action-to-verification trace.

## Claim packet labels

- **Source status:** Public frontier scan using primary article, preprint/dissertation, secondary survey signal, and news/commercial reports.
- **Claim status:** Infrastructure hypothesis, not medical, veterinary, or treatment advice.
- **Privacy status:** Public-safe abstraction only; no personal, household, medical, animal-care, financial, location, relationship, credential, or transcript details.
- **Missingness:** No validator code yet; no synthetic fixtures yet; no integration with current hypothesis gates yet; some source access was partial.
- **Revision reason:** Prior MC gates evaluate grounding, temporal contamination, privacy/site-awareness, mechanism, and symbolic operationalization, but they do not yet require a single auditable chain across agent actions, source/tool artifacts, verification results, and memory transitions.
- **Implementation status:** Implementation-ready research artifact committed; next step is executable schema + validator.
- **Evidence strength:** Moderate. Strongest support comes from Robin's peer-reviewed end-to-end agent/lab workflow and privacy-preserving medical AI evaluation methodology; weaker support comes from preprints, surveys, and commercial announcements.
- **Falsification route:** This design should be revised if provenance-chain enforcement blocks valid discovery workflows more often than it catches unsupported, unverifiable, privacy-leaky, or citation-washed packets; or if reviewers cannot consistently reconstruct the agent-to-verification path from the schema.
- **Next executable action:** Implement `tools/agent_provenance_verification_chain/` with JSON schema, synthetic pass/fail fixtures, CLI validator, and regression tests.

## Required schema fields for next implementation

```json
{
  "schema_version": "1.0",
  "packet_type": "agent_provenance_verification_chain",
  "packet_id": "string",
  "claim_id": "string",
  "claim_text": "string",
  "source_status": "primary|preprint|secondary|news|synthetic|mixed",
  "claim_status": "candidate|supported|contradicted|inconclusive|rejected",
  "privacy_status": "public_safe|deidentified|restricted|reject_private",
  "agent_actions": [
    {
      "action_id": "string",
      "agent_role": "literature_search|data_analysis|hypothesis_generation|verification|privacy_review|human_review",
      "input_refs": ["string"],
      "output_refs": ["string"],
      "timestamp_policy": "required_if_real|synthetic_ok"
    }
  ],
  "source_or_tool_artifacts": [
    {
      "artifact_id": "string",
      "artifact_type": "paper|dataset|benchmark|software|protocol|assay_result|simulation|human_review|synthetic_fixture",
      "identifier": "string",
      "source_status": "primary|preprint|secondary|news|synthetic",
      "availability": "open|restricted|unknown",
      "privacy_boundary": "public|site_bound|deidentified|restricted|synthetic"
    }
  ],
  "verification_results": [
    {
      "verification_id": "string",
      "method": "replication|benchmark|schema_validation|statistical_test|expert_review|contradiction_search|privacy_check|synthetic_test",
      "result": "pass|fail|inconclusive|defer",
      "measurable_variables": ["string"],
      "falsification_route": "string",
      "limitations": ["string"]
    }
  ],
  "memory_transition": {
    "requested_transition": "candidate_to_memory|candidate_to_rejected|candidate_to_deferred|memory_to_revised",
    "allowed": false,
    "decision_reason": "string",
    "required_missing_fields": ["string"]
  }
}
```

## Acceptance criteria

A valid packet must:

1. contain at least one agent action;
2. contain at least one source or tool artifact;
3. contain at least one verification result;
4. include at least one measurable variable inside verification;
5. include an explicit falsification route;
6. distinguish source status from claim status;
7. include a privacy boundary for every artifact;
8. block memory admission when verification is missing, privacy status is `reject_private`, or the claim has no measurable variable.

## Synthetic fixtures to build next

Expected pass:

- `pass_public_literature_to_synthetic_verification`: public paper + structured hypothesis + synthetic benchmark check + allowed candidate memory transition.
- `pass_site_bound_deidentified_deferred`: restricted/site-bound longitudinal packet + privacy boundary + verification deferred + blocked from full memory but allowed into deferred queue.

Expected fail:

- `fail_citation_washed_claim`: citations present but no agent action trace and no verification result.
- `fail_private_longitudinal_packet`: private or household-specific data enters artifact list with no deidentification or privacy partition.
- `fail_no_falsification_route`: plausible mechanistic claim with no falsification path.
- `fail_news_as_validated_discovery`: product/news source treated as supported primary evidence.

## Prototype requirement

The validator should output:

- `admission_decision`: `allow_memory`, `defer`, `reject`, or `needs_revision`;
- `blocking_reasons`: array of explicit failed criteria;
- `provenance_completeness_score`: 0.0 to 1.0;
- `privacy_block`: boolean;
- `verification_block`: boolean;
- `claim_source_mismatch_block`: boolean.
