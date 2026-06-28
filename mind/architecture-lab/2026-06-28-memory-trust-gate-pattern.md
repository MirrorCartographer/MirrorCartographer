# Memory Trust Gate Pattern

Date: 2026-06-28
Status: architecture pattern + requirements update
Scope: public-safe; no private user data

## Architecture question

How should Mirror Cartographer decide whether a stored memory is allowed to influence a current symbolic interpretation?

The weak assumption being corrected: memory retrieval can be treated mainly as semantic similarity plus user consent. Current evidence suggests this is not enough. A memory can be semantically related while still being contextually inappropriate, outdated, too sensitive, identity-shaping, or dangerous to use in the current interpretive task.

## Updated understanding

Memory in MC should be treated as an influence-bearing control channel, not as passive context.

A retrieved memory must pass an explicit admission gate before it can affect:

- symbolic interpretation
- confidence
- emotional framing
- future memory writes
- visual salience
- suggested next actions
- cross-session continuity

The core distinction:

- Relevant does not mean allowed.
- Allowed does not mean safe.
- Safe does not mean useful.
- Useful does not mean permanent.

## Research basis

### 1. Trustworthy memory search

The 2026 paper `Beyond Similarity: Trustworthy Memory Search for Personal AI Agents` frames memory search as a trust boundary. It argues that similarity-based retrieval can admit memories that are semantically close but contextually inappropriate, creating risks including cross-domain leakage, sycophancy, tool-call drift, and memory-induced jailbreaks. The paper proposes MemGate, a lightweight query-conditioned admission gate between vector memory retrieval and the base LLM.

Source: https://arxiv.org/abs/2606.06054

Useful concept for MC: memory retrieval needs task-conditioned admission, not only similarity search.

### 2. Memory control over more context

`AI Agents Need Memory Control Over More Context` argues that transcript replay and retrieval-based memory can create noisy recall, poisoning, unstable behavior, and drift. It proposes separating artifact recall from state commitment: retrieved artifacts can be inspected, but only selected information should become committed control state.

Source: https://arxiv.org/html/2601.11653v1

Useful concept for MC: retrieval should propose candidates; a smaller controlled state should decide what actually conditions the next response.

### 3. Personalization can amplify sycophancy

WRITER's June 2026 research summary reports that personalized context and memory systems can increase sycophancy. It describes a failure mode where a prior misconception is stored as memory and later retrieved as if it were a stable fact, steering the model toward agreement instead of correction. Their MIST benchmark evaluates this across memory systems and reasoning domains.

Source: https://writer.com/engineering/personalized-context-degrades-ai-accuracy/

Useful concept for MC: memory must preserve uncertainty, disagreement, provenance, and assistant/user role context. Extracted memories that strip corrective context can become false authority objects.

### 4. Risk management framing

NIST AI RMF Generative AI Profile is a cross-sectoral companion to AI RMF 1.0 for identifying and managing generative AI risks across the lifecycle.

Source: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence

Useful concept for MC: memory influence should be measurable, governed, reversible, and evaluated as a risk surface, not hidden inside UX.

## Fact vs inference

### Facts supported by sources

- Similarity-based memory retrieval can admit contextually inappropriate memories in agentic systems.
- Long-term memory can influence agent interpretation and action, creating reliability and safety risks.
- Retrieval-based and transcript-based memory can contribute to drift, noisy recall, and persistence of bad context.
- Personalized memory can amplify sycophancy when user beliefs are extracted and later reintroduced without corrective context.
- Risk management frameworks recommend identifying, measuring, and managing generative AI risks across the lifecycle.

### MC-specific inferences

- MC symbolic memory may create similar risks even if it does not operate as a full autonomous agent.
- Symbolic interpretations may be especially vulnerable to authority inflation because visual or narrative presentation can make uncertain memory feel identity-defining.
- MC should gate memory by permission, scope, uncertainty, domain, sensitivity, recency, reversibility, and action effect.
- MC should expose memory influence in the interface before and after interpretation.

These are plausible design inferences, not proven outcomes.

## Pattern: Memory Trust Gate

Before a memory can influence a current interpretation, MC must answer four visible questions:

1. Why this memory?
2. Why now?
3. What is it allowed to affect?
4. What must it not affect?

If MC cannot answer these, the memory can be shown as optional context but must not condition the interpretation.

## Admission fields

Every candidate memory should be represented as:

```yaml
memory_candidate:
  memory_id: string
  retrieval_reason: string
  similarity_score: number | null
  source_type: user_input | ai_inference | user_confirmed | imported | system_generated
  provenance_summary: string
  created_at: date | null
  last_confirmed_at: date | null
  uncertainty_level: low | medium | high | unknown
  sensitivity_level: low | medium | high
  domain_scope:
    - symbolic
    - emotional
    - practical
    - medical
    - financial
    - legal
    - identity
    - project
    - other
  allowed_effects:
    - interpretive_hint
    - visual_emphasis
    - continuity_reference
    - action_suggestion
    - memory_write
    - confidence_adjustment
  forbidden_effects:
    - diagnosis
    - identity_claim
    - high_stakes_advice
    - irreversible_action
    - cross_domain_transfer
    - hidden_personalization
  conflict_status: none | conflicts_with_current_input | conflicts_with_evidence | conflicts_with_user_revision | unknown
  user_visibility: hidden_not_allowed | visible_context | visible_and_editable | requires_confirmation
  gate_decision: admit | admit_limited | quarantine | ask_later | reject
  gate_reason: string
  rollback_path: string
```

## Required gate logic

A memory must be rejected or quarantined when:

- it is AI-inferred and unconfirmed but would shape identity, diagnosis, or high-stakes action;
- it conflicts with current user input and the conflict is not surfaced;
- it comes from another domain and would be transferred without explicit scope permission;
- it strips uncertainty, disagreement, or corrective context;
- it is stale and has not been reconfirmed;
- the user has marked the memory as private, expired, never-store, or context-only;
- the system cannot explain why this memory is needed now.

A memory may be admitted with limits when:

- it is relevant to the current symbolic task;
- the allowed effect is narrow;
- uncertainty is visible;
- provenance is visible;
- the user can edit, demote, or remove it;
- it cannot trigger action beyond interpretation without another check.

## Product requirement

MC must add a `Memory Trust Gate` between retrieval and interpretation.

Pipeline:

1. User input enters symbolic workspace.
2. Candidate memories are retrieved.
3. Symbolic Relevance Mask identifies which parts of the current input matter.
4. Memory Trust Gate evaluates each candidate memory against scope, sensitivity, provenance, uncertainty, recency, conflict, and allowed effects.
5. Only admitted or limited memories may influence interpretation.
6. Attribution Trace Ledger records what memory influenced what part of the interpretation.
7. Memory Influence Scope Map shows the user where the memory had effect.
8. User can weaken, quarantine, delete, expire, or re-scope the memory.

## Evaluation criterion

### Memory Admission Clarity Criterion

A test user should be able to answer, after an MC session:

- Which memories were retrieved?
- Which memories actually influenced the interpretation?
- Which memories were blocked or limited?
- Why were they blocked or limited?
- What part of the response did each admitted memory affect?
- How can that influence be reversed?

Passing threshold for prototype: at least 80% correct answers on a structured comprehension check without needing developer explanation.

## Falsification checklist

This pattern fails if users:

- cannot tell whether memory influenced an interpretation;
- treat admitted memory as proof that the interpretation is true;
- cannot distinguish user-confirmed memory from AI-inferred memory;
- cannot reverse or scope memory influence;
- experience the gate as surveillance/legal clutter rather than symbolic control;
- lose meaningful flow because every memory interaction becomes administrative;
- become more sycophantic toward prior stored interpretations;
- accept identity-shaping claims more readily when memory visuals are present.

## Prototype test plan: `memory-trust-gate-testset-v0.1`

Compare four conditions:

1. No memory shown; hidden personalization only.
2. Similarity retrieval disclosed after response.
3. Memory Trust Gate shown before interpretation.
4. Hybrid symbolic gate: memory shown as map-layer influence with compact audit trail.

Tasks:

- symbolic scene interpretation
- project continuity interpretation
- conflicting prior memory vs current user correction
- stale memory test
- AI-inferred memory vs user-confirmed memory test
- cross-domain leakage test
- high-sensitivity memory test

Metrics:

- user comprehension of memory influence
- false certainty
- overreliance
- correction success
- flow preservation
- time-to-revision
- rollback success
- willingness to use memory again

## Implementation notes

Do not make the gate feel like a compliance dashboard by default. The visible layer should be symbolic and lightweight, with a deeper audit drawer available.

Suggested interface language:

- `Used as a soft hint`
- `Not allowed to shape this reading`
- `Relevant but too uncertain`
- `Stored as yours`
- `AI-inferred; needs confirmation`
- `Expired unless renewed`
- `Can affect visuals, not conclusions`
- `Can affect continuity, not identity`

## Current claim status

Claim: MC memory can be made safer by privacy-preserving abstraction alone.

Status: weakened.

Better claim: MC memory safety requires abstraction plus admission control, provenance, uncertainty preservation, scoped influence, conflict visibility, and user reversibility.

## Next proof needed

Build a small interactive prototype of the Memory Trust Gate and test whether users can understand and reverse memory influence without losing symbolic flow.

Next research question:

How can MC compress memory-gate decisions into an intuitive symbolic UI so the user sees influence and uncertainty without feeling watched, judged, or slowed down?
