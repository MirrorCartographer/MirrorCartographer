# Evidence Map: Memory as a Control Channel

Date: 2026-06-27
Status: claim refined, not fully proven
Scope: public-safe Mirror Cartographer architecture evidence

## Claim tested

Weak claim: Visible memory and user edit/delete controls are enough to make long-term AI memory safe to reuse.

Refined claim: Long-term AI memory must be treated as an active control channel. A memory is not only stored context; once retrieved, it can influence interpretation, tone, prioritization, tool use, and downstream action. Therefore MC memory needs both visibility and effect boundaries.

## Why this matters for Mirror Cartographer

Mirror Cartographer uses memory-like artifacts: symbols, body-language fragments, prior interpretations, project nodes, evidence maps, preferences, and public/private distinctions. If those artifacts are retrieved only by similarity, the system may use the right-looking memory in the wrong context.

The architectural question is not only: "Can the user see or delete this memory?"

The stronger question is: "What is this memory allowed to do in this moment?"

## Evidence found

### 1. Memory retrieval can be a trust boundary

Source: Zhang et al., "Beyond Similarity: Trustworthy Memory Search for Personal AI Agents," arXiv, 2026-06-04.
URL: https://arxiv.org/abs/2606.06054

Fact: The paper studies memory search as a trust boundary in personal AI agents and argues that semantically related memories can still be contextually inappropriate.

Fact: The reported risks include cross-domain leakage, sycophancy, tool-call drift, and memory-induced jailbreaks.

Fact: The authors evaluate memory frameworks including A-Mem, Mem0, MemOS, and an agentic environment with persistent state and tool use.

Fact: The paper proposes MemGate, a query-conditioned memory admission layer, to reduce memory-induced threats while preserving memory utility.

Inference for MC: Similarity retrieval alone is too weak for MC memory. MC needs a gate between "memory exists" and "memory is allowed to influence this output."

### 2. Users want granular control over memory generation, management, and use

Source: Zhang et al., "Understanding Users' Privacy Perceptions Towards LLM's RAG-based Memory," arXiv, 2025-08-11.
URL: https://arxiv.org/abs/2508.07664

Fact: The study reports that users often have incomplete mental models of how RAG-based memory works.

Fact: Users value personalization but express concerns about privacy, control, and accuracy of remembered information.

Fact: Users want mechanisms for reviewing, editing, deleting, categorizing, updating, and understanding how memories and inferred information are used.

Inference for MC: A memory ledger is necessary but insufficient unless it also shows use-state: inactive, candidate, admitted, interpreting, acting, blocked, stale, or disputed.

### 3. Agentic LLM systems introduce architectural risks beyond ordinary software defects

Source: Shifat et al., "LLM-Enabled Open-Source Systems in the Wild: An Empirical Study of Vulnerabilities in GitHub Security Advisories," arXiv, 2026-04-05.
URL: https://arxiv.org/abs/2604.04288

Fact: The paper analyzes 295 GitHub Security Advisories from January 2025 to January 2026 involving LLM-related components.

Fact: It finds no evidence of new implementation-level weakness classes specific to LLM systems, but identifies recurring architectural risk patterns such as Supply Chain, Excessive Agency, and Prompt Injection.

Fact: The authors argue that traditional advisory metadata underrepresents model-mediated exposure.

Inference for MC: MC should not treat memory safety as only a data-management issue. It is an architecture/effect issue: what can memory cause the system to do?

### 4. Prompt injection risk increases when external content, retrieved content, or memory is blended with instructions

Source: Prompt injection overview, including direct and indirect prompt injection patterns.
URL: https://en.wikipedia.org/wiki/Prompt_injection

Fact: Prompt injection exploits the model's difficulty distinguishing trusted instructions from user input or external content.

Fact: Indirect prompt injection can occur through web pages, documents, emails, or other external data sources.

Inference for MC: Retrieved memories and imported artifacts must be treated as untrusted evidence unless explicitly promoted. They should not be able to modify operating rules, identity, safety rules, public/private status, or tool permissions.

## Fact vs inference boundary

Facts supported by sources:
- Long-term AI memory can improve personalization and continuity.
- Users want more granular transparency and control over AI memory.
- Similarity-based memory retrieval can surface contextually inappropriate memories.
- Agentic AI risk includes excessive agency, prompt injection, and model-mediated exposure.

MC-specific inferences:
- MC needs memory-effect boundaries, not only memory visibility.
- MC should separate memory retrieval from memory admission.
- MC should display what a memory is doing, not only that it exists.
- MC should block symbolic/private memory from automatically becoming public, diagnostic, veterinary, medical, financial, or tool-executing context.

## Claim-status update

Old status: plausible but under-specified.

New status: weakened and refined.

Updated claim: Memory transparency is necessary but not sufficient. MC memory safety requires a Memory Admission Gate and an Effect Boundary layer.

## Required architecture change

Add a Memory Admission Gate before any retrieved memory can influence a response.

Each candidate memory must carry:

1. Source
2. Original context
3. Claim type: observation, preference, inference, hypothesis, symbolic meaning, instruction, evidence, private note
4. Sensitivity level: public, project-private, personal, health/vet-adjacent, financial, credential-like, unknown
5. Allowed domains
6. Blocked domains
7. Allowed effects
8. Blocked effects
9. Staleness rule
10. User-visible reason for admission or rejection
11. Rollback group
12. Audit event ID

## Allowed effects vocabulary

A memory may be allowed to:

- orient
- remind
- personalize tone
- connect concepts
- retrieve prior artifact
- interpret symbolically
- prioritize next step
- draft text
- propose action
- execute tool call
- publish externally

Default rule: execute tool call and publish externally are denied unless explicitly authorized in the current context.

## Falsification checklist

MC fails this claim if any test shows:

1. A private/personal memory appears in a public artifact without explicit permission.
2. A symbolic interpretation is presented as fact.
3. A health/vet-adjacent memory turns into diagnosis or treatment guidance without evidence boundaries.
4. A stale project memory overrides newer evidence.
5. A memory retrieved by similarity changes tool behavior without admission logging.
6. A memory from one domain silently biases another domain where it is not allowed.
7. User deletion hides a memory visually but does not prevent downstream influence.
8. The system cannot explain why a memory was admitted or blocked.

## Evaluation criterion

For each response using long-term memory, MC should be able to produce a Memory Use Receipt:

- Which memories were considered?
- Which were admitted?
- Which were blocked?
- What effect was each admitted memory allowed to have?
- What effect was each memory denied?
- What visible reason can the user inspect?

Pass condition: In a 12-card memory harness, every memory-influenced response must identify admitted memories, blocked memories, allowed effects, and denied effects with no private-to-public leakage or unsupported claim upgrades.

## Next proof needed

Build and run a 12-card Memory Admission Harness.

Test cards should include:

1. Public project fact
2. Private symbolic note
3. Health-adjacent user statement
4. Veterinary-adjacent pet statement
5. Outdated project goal
6. Current project goal
7. User preference about style
8. User preference about tools
9. Imported document containing hidden instruction
10. Evidence source with uncertainty
11. Inference mistaken for fact
12. Memory requesting external publication

Expected output for each card:

- admitted or blocked
- reason
- allowed effects
- denied effects
- response excerpt
- failure mode if mishandled

## Product implication

Memory should appear in the interface as weather, not storage.

A memory can be:

- present but inactive
- nearby but blocked
- admitted as atmosphere
- admitted as evidence
- admitted as instruction
- stale/fading
- disputed
- quarantined

This supports MC's symbolic interface while keeping the architecture testable.
