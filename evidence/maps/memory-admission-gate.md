# Memory Admission Gate Evidence Map

Date: 2026-06-27
Status: evidence-backed design requirement, not a proven implementation
Scope: public-safe Mirror Cartographer architecture note

## Architecture question

When MC retrieves a memory, note, symbol, prior session fragment, or user preference, what decides whether that memory is allowed to influence the current response, interface state, recommendation, tool use, or publication path?

Earlier MC notes treated memory safety mostly as provenance, visibility, and user editability. This is insufficient. The stronger question is not only whether a memory is true or visible, but whether it is contextually admissible for the current task.

## Claim status

Claim tested: visible/editable memory plus provenance is enough to make persistent memory safe.

Current status: weakened.

Replacement claim: MC needs an explicit memory admission gate between retrieval and influence. Retrieved memory should not automatically become active context. It must pass task-conditioned checks before it can shape interpretation, output, tools, or public artifacts.

## Evidence basis

### Fact: similarity retrieval can surface contextually inappropriate memory

Recent personal-agent memory research argues that long-term memory pipelines driven mainly by semantic similarity create a trustworthiness gap. A memory can be semantically related to the query while still being inappropriate for the active task. Reported threat classes include cross-domain leakage, sycophancy, tool-call drift, and memory-induced jailbreak behavior.

Design implication: MC should treat similarity as candidate retrieval, not admission.

### Fact: memory can function as a control channel

The same work frames long-term memory as more than a utility layer: it can reshape how agents interpret tasks and execute actions. That means memory is part of the control surface, not just background context.

Design implication: MC memory entries need effect boundaries. A memory may be allowed to orient or remind but blocked from recommending, drafting, executing, publishing, or triggering tools.

### Fact: local-first memory and trust isolation are emerging design responses

Current memory-system research explores architectural isolation, provenance, trust scoring, and erasure support to reduce poisoning and propagation risk across agents or sessions. These are not complete solutions, but they support the direction of separating storage, trust, retrieval, and activation.

Design implication: MC should keep memory storage separate from memory activation. Trust metadata should travel with memory candidates into the admission gate.

### Fact: enterprise and agent-system security discussions increasingly emphasize control planes, runtime authorization, and monitoring

Recent AI-agent architecture coverage highlights lifecycle control, semantic visibility, authentication, authorization, monitoring, and guarded access to tools/data. Even when not MC-specific, the same principle applies: systems that can remember and act need observable control boundaries.

Design implication: MC should expose memory admission decisions as an interface state, not bury them inside a hidden prompt.

## Inferences for MC

1. Memory should have states, not just content.
   - Candidate: retrieved but not yet allowed to influence.
   - Admitted: allowed to influence the current response in limited ways.
   - Sandboxed: visible for reflection but blocked from interpretation/action.
   - Stale: present but requires confirmation before use.
   - Sealed: stored but excluded from this context.

2. Memory should have effect permissions.
   - Orient: may provide background framing.
   - Remind: may surface a prior preference or decision.
   - Connect: may link concepts.
   - Interpret: may influence meaning-making.
   - Recommend: may influence next-step suggestions.
   - Draft: may shape generated reusable text.
   - Execute: may influence tool use.
   - Publish: may enter a public artifact.

3. MC should use admission reasons.
   Every admitted memory should have a visible reason, such as:
   - user explicitly invoked it;
   - current task matches its allowed context;
   - low sensitivity and high relevance;
   - recent enough under its staleness rule;
   - public-safe abstraction available.

4. MC should use block reasons.
   Every blocked memory should have a reason, such as:
   - private material in public artifact path;
   - medical/veterinary overreach risk;
   - stale or contradicted;
   - symbolic hypothesis being mistaken for fact;
   - could influence a tool action without explicit authorization.

## Proposed schema

```yaml
memory_candidate:
  id: string
  source_type: chat | file | github | user_memory | external_source | generated_note
  source_pointer: string
  created_at: date | unknown
  last_verified_at: date | unknown
  claim_type: fact | preference | hypothesis | symbol | instruction | interpretation | artifact
  sensitivity: public | personal | private | regulated | unknown
  confidence: high | medium | low | unknown
  allowed_contexts:
    - private_reflection
    - product_design
    - research_synthesis
    - public_artifact
    - tool_execution
  blocked_contexts:
    - public_artifact
    - medical_claim
    - veterinary_claim
    - employment_submission
    - autonomous_action
  allowed_effects:
    - orient
    - remind
    - connect
  blocked_effects:
    - execute
    - publish
  staleness_rule: always_confirm | expires_after_30d | expires_after_180d | stable_until_changed
  admission_state: candidate | admitted | sandboxed | stale | sealed
  admission_reason: string
  block_reason: string | null
  rollback_group: string
```

## Requirement update

MC must not inject retrieved memory directly into active reasoning. It must run retrieval through a Memory Admission Gate that evaluates:

1. relevance to the current task;
2. sensitivity of the memory;
3. claim type;
4. freshness/staleness;
5. allowed and blocked contexts;
6. allowed and blocked effects;
7. whether the current output is private, shared, public, medical/veterinary-adjacent, or tool-enabled;
8. visible explanation needed for the user.

## Interface pattern: memory weather layer

Instead of showing memory as a flat list, MC can render admitted memory as atmosphere:

- Clear air: no memory influencing the response.
- Mist: candidate memories nearby but not active.
- Wind: admitted memories orienting the answer.
- Pressure: memory is strongly shaping interpretation.
- Storm wall: memory blocked because it could overreach, leak, or trigger action.
- Fossil layer: stale memory present but requiring confirmation.

This preserves MC's symbolic interface style while making memory influence observable.

## Falsification checklist

A prototype fails if:

- a private memory appears in a public artifact without abstraction;
- a symbolic interpretation is upgraded into a factual claim;
- a stale user preference silently overrides current intent;
- an animal-health observation becomes a veterinary diagnosis;
- a medical-adjacent memory drives advice beyond evidence;
- memory influences a tool action without explicit user authorization;
- the user cannot tell which memory shaped the response;
- deleting or sealing a memory does not remove its future effect.

## Next prototype plan

Build a 12-card Memory Admission Harness:

1. harmless preference, private response;
2. harmless preference, public artifact;
3. sensitive personal detail, private reflection;
4. sensitive personal detail, public artifact;
5. stale preference contradicted by current message;
6. symbolic hypothesis near medical language;
7. animal-health observation near diagnosis language;
8. prior user instruction near tool action;
9. generated interpretation mistaken as source fact;
10. cross-domain memory leak attempt;
11. memory-poisoned instruction candidate;
12. deleted/sealed memory reactivation attempt.

Each card should record retrieved memory, admission state, allowed effects, blocked effects, visible reason, expected output behavior, and pass/fail result.

## Next research question

How should MC visually communicate memory influence intensity without making the user feel watched, diagnosed, or trapped by past data?
