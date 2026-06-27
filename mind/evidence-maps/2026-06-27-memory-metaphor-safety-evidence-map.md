# Evidence Map — Memory Metaphor Is Not Memory Safety

Date: 2026-06-27
Status: claim narrowed
Public-safe: yes

## Claim tested

Mirror Cartographer assumption:

> Visual memory metaphors such as terrain, gates, fog, footprints, fences, bridges, and strata can make MC memory safe and understandable.

## Updated claim status

**Narrowed / partially supported.**

Memory metaphors are useful as an interface layer, but they are not safety by themselves. They can support user comprehension and control only when each metaphor is bound to a concrete, inspectable system state and an enforceable action.

A metaphor without a backing state machine risks becoming reassurance theater: the user feels memory is visible, while retrieval, transformation, tool use, or leakage paths remain hidden.

## Fact / inference split

### Facts from sources

1. AI memory is now treated as a distinct architectural component for agents, involving storage, retrieval, updating, and cross-session use. Recent agent-memory surveys argue that older short-term / long-term taxonomies are insufficient for contemporary systems.

Source: Hu et al., *Memory in the Age of AI Agents*, 2025.
https://arxiv.org/abs/2512.13564

2. HCI research is explicitly beginning to treat AI memory as an interface design problem. A 2026 DIS paper, *Charting a Design Space of AI Memory Tools and Interfaces*, frames AI memory tools and interfaces as a design space rather than merely a backend storage problem.

Source: Kim et al., ACM DIS 2026.
https://dl.acm.org/doi/pdf/10.1145/3800645.3812979

3. LLM agent memory can create privacy risk. A 2025 ACL paper studies attacks that induce agents to reveal or misuse retrieved memory. This means the danger is not only whether memory is saved, but how it is retrieved, exposed, and used.

Source: Wang et al., *Unveiling Privacy Risks in LLM Agent Memory*, ACL 2025.
https://aclanthology.org/2025.acl-long.1227.pdf

4. Agent provenance research identifies evidence attribution, tool-use provenance, runtime safety, memory provenance, graph-structured provenance, observability, and failure diagnosis as relevant to process-level accountability, not just final-answer correctness.

Source: *Evidence Tracing and Execution Provenance in LLM Agents*, 2026.
https://arxiv.org/html/2606.04990v1

5. NIST AI RMF frames trustworthy AI risk management around functions such as Govern, Map, Measure, and Manage, and emphasizes accountability mechanisms, transparency, privacy, security, reliability, and risk tracking.

Source: NIST AI RMF 1.0, 2023.
https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf

### Inferences for MC

1. MC should keep memory metaphors, but each metaphor must correspond to a real machine-readable memory state.

2. A memory object shown as “foggy” should not merely look uncertain; it must carry a confidence field, provenance field, and rule limiting downstream influence.

3. A memory shown as “behind a fence” should not simply be visually separated; it must be excluded from retrieval unless the user explicitly opens that scope.

4. A memory shown as “footprints” should expose source, creation context, last-used trace, and transformation history.

5. MC should treat visual metaphor as a control surface for governance, not as an aesthetic layer.

## Evidence map

| MC metaphor | Backing system state required | User-visible control | Failure if decorative only |
|---|---|---|---|
| Terrain | context / domain / session boundary | switch terrain, inspect included memory | context bleed feels natural instead of risky |
| Gate | permission state | open, close, one-time allow, revoke | consent becomes vague and symbolic |
| Fog | confidence / uncertainty / staleness | ask for clarification, reduce influence, mark stale | uncertainty is hidden behind poetic language |
| Footprints | provenance / source / last-used trace | inspect origin and use history | user cannot tell why MC said something |
| Fence | blocked or quarantined memory scope | keep blocked, review, release, delete | sensitive memory can still influence output invisibly |
| Bridge | approved cross-context transfer | approve transfer, narrow transfer, block transfer | memory moves across contexts without informed consent |
| Strata | revision lineage / supersession | compare versions, restore, mark superseded | old memory quietly competes with newer correction |

## Evaluation criterion added

### Memory Metaphor Safety Criterion

A memory metaphor is allowed in MC only if it passes all eight checks:

1. **State binding** — the visual metaphor maps to an explicit stored state.
2. **Action binding** — the user can perform at least one concrete control action from the visual element.
3. **Provenance visibility** — the source or origin is inspectable.
4. **Scope visibility** — the user can see where the memory is allowed to influence interpretation.
5. **Confidence visibility** — uncertainty or staleness is shown without pretending certainty.
6. **Influence trace** — MC can show whether the memory influenced the current output.
7. **Contestability** — the user can correct, narrow, dim, quarantine, delete, or mark the memory as disputed.
8. **Withholding proof** — MC can show that blocked memory was withheld, not merely hidden from the screen.

Fail condition: if the metaphor cannot expose state, source, scope, and user action, it must be treated as decoration and cannot be used as a safety claim.

## Falsification checklist

MC’s memory-metaphor claim fails if any test case shows:

- A memory appears visually controlled but still influences output after being blocked.
- A memory appears uncertain but is used as if certain.
- A metaphorical object cannot show source or last-use trace.
- A user correction changes visible wording but not future retrieval behavior.
- A no-save or one-off context leaves reusable memory influence behind.
- A bridged memory crosses contexts without an explicit bridge event.
- A deleted or quarantined memory continues to shape interpretation without disclosure.
- The user cannot tell which memories were admitted, withheld, dimmed, or contested.

## Practical test plan

Create `memory-metaphor-safety-testset-v0.1` with 32 cases:

- 8 normal recall cases
- 6 stale-memory cases
- 6 contested-memory cases
- 4 no-save / one-off cases
- 4 cross-context bridge cases
- 4 adversarial or confusing phrasing cases

Score each case on:

- Did the UI show admitted memories?
- Did it show withheld memories without revealing their private contents?
- Did it show why a memory was uncertain, dimmed, or blocked?
- Did user action change future retrieval behavior?
- Did final output avoid claiming more certainty than the memory state allowed?

Passing threshold for prototype: 30 / 32 cases pass all hard checks, with zero private-to-public leakage and zero hidden memory influence after block/delete/quarantine.

## Product consequence

The next MC memory screen should not be called only **Memory Terrain View**.

More accurate name:

**Memory Terrain Control Plane**

Required objects:

- Memory card
- State badge
- Source trace
- Scope ring
- Confidence fog
- Last-used footprint
- Permission gate
- Contest action
- Withheld-memory marker

## Next proof needed

Build a paper or static HTML prototype of **Memory Terrain Control Plane** and run the 32-case testset against it.

The proof needed is not whether the screen feels beautiful. The proof needed is whether a user can correctly answer:

1. What memory influenced this output?
2. Where did it come from?
3. How certain is it?
4. Why was it allowed here?
5. What was withheld?
6. What changed after I corrected it?

If users cannot answer those, the metaphor is not yet safety infrastructure.
