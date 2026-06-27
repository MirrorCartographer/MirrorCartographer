# MC Memory Gate Decision Record

Status: Draft architecture note
Privacy status: Public-safe / no personal transcript content
Claim status: Source-bounded design inference

## Architecture question

How should Mirror Cartographer decide whether a remembered symbol, prior session echo, saved note, or external research fragment is allowed into the current interaction?

The previous simple answer was: retrieve the most semantically similar memory and use it.

The better answer is: semantic similarity is only a candidate generator. Memory admission must be task-conditioned, source-aware, privacy-aware, and reversible.

## Why this matters

Mirror Cartographer works in emotionally sensitive territory: symbols, body language, metaphor, meaning-making, contradiction, and autobiographical fragments. That makes memory powerful, but also risky.

A memory can be relevant and still be wrong for the moment.

A memory can match the words and still violate the user's boundary.

A memory can help continuity and still over-steer the session.

A memory can look like evidence and actually be inference, reconstruction, or generated interpretation.

For MC, memory is not just storage. It is a control surface.

## Research basis

### 1. Trustworthy memory search for personal AI agents

The 2026 paper "Beyond Similarity: Trustworthy Memory Search for Personal AI Agents" argues that long-term memory search is a trust boundary. It reports that similarity-driven retrieval can create cross-domain leakage, sycophancy, tool-call drift, and memory-induced jailbreaks. Its proposed pattern, MemGate, inserts a lightweight gate between vector retrieval and model context so candidate memories are admitted based on the current query/task rather than similarity alone.

Design extraction for MC: retrieval should have two stages:

1. Candidate recall: find possibly relevant memory.
2. Memory admission: decide whether the candidate is safe, useful, source-bounded, and appropriate for the current mode.

### 2. Slow, embodied memory reconstruction

The 2026 "Memory Printer" paper studies slow, tangible, layered AI-assisted reminiscence. It surfaces a useful design principle: memory reconstruction should be experientially legible and user-controlled, especially when AI is generating or interpreting memory-adjacent material. It also identifies risks around false memory, algorithmic bias, and privacy.

Design extraction for MC: memory should be shown as layered material, not flattened truth. The interface should distinguish fact, feeling, symbol, reconstruction, inference, and uncertainty.

### 3. Synthetic media and false memory risk

A 2024 study on AI-edited images and videos found that synthetic visual alterations can increase false recollection and confidence in false memories.

Design extraction for MC: generated visual or narrative memory outputs must be labeled as reconstructions, not records. MC should not present symbolic imagery as proof of literal events.

### 4. Agentic risk frameworks

Recent agent-governance work aligned to the NIST AI Risk Management Framework emphasizes mapping, measuring, managing, policy enforcement, behavioral monitoring, and accountability for agentic systems.

Design extraction for MC: memory admission should be auditable. Every admitted memory needs a reason, source class, privacy class, and revocation path.

### 5. Prompt injection and tool-use risk

Research on prompt injection and agent data leakage shows that tool-calling agents can leak personal data when malicious or inappropriate context influences task execution.

Design extraction for MC: memory should not automatically flow into tool calls, GitHub writes, public artifacts, emails, external searches, or persistent notes. Action contexts require a stricter gate than reflective chat contexts.

## Design decision

MC should implement a Memory Gate before any prior memory, symbolic echo, user-context fragment, external source, or generated reconstruction is inserted into the active reasoning context.

The gate should output one of five decisions:

- ADMIT: use the memory in the current response.
- ADMIT_WITH_LABEL: use it, but label source/uncertainty/privacy clearly.
- SUMMARIZE_ONLY: use only an abstracted form; do not expose raw content.
- QUARANTINE: keep it out of the current interaction, but preserve as internal candidate metadata.
- ASK_OR_REQUIRE_CONFIRMATION: do not use until the user explicitly confirms.

## Memory object schema

Each memory candidate should carry these fields:

- memory_id: stable internal identifier.
- memory_type: user_statement | assistant_inference | artifact | file_chunk | public_source | generated_reconstruction | symbolic_echo.
- source_boundary: current_session | prior_session | uploaded_file | connected_source | public_web | generated.
- privacy_class: public | project_internal | personal | health | animal_health | financial | relationship | location | credential | raw_transcript.
- claim_status: observed | user_reported | source_cited | inferred | speculative | generated | outdated | contradicted.
- emotional_load: low | medium | high | unknown.
- action_sensitivity: none | reflective_only | persistent_write | public_publish | tool_call | external_send.
- current_task_fit: low | medium | high.
- potential_harm: low | medium | high.
- admission_decision: admit | admit_with_label | summarize_only | quarantine | require_confirmation.
- admission_reason: one-sentence reason.
- expiry_or_review: date or trigger for review.

## Admission rules

### Rule 1: Similarity is not permission

A close semantic match only makes a memory a candidate. It does not authorize use.

### Rule 2: Action contexts are stricter than reflection contexts

A memory may be allowed in a private reflection but blocked from public artifacts, GitHub commits, emails, job materials, external searches, or tool actions.

### Rule 3: Raw personal context should not become public architecture

When MC learns from private material, GitHub output should contain abstract methods, schemas, design constraints, evaluation criteria, or source-boundary notes—not raw autobiographical, medical, household, relationship, financial, location, or transcript detail.

### Rule 4: Symbolic memory needs truth labels

Symbolic echoes should be useful without becoming fake evidence. MC should label whether a symbol came from user language, assistant interpretation, generated imagery, or research synthesis.

### Rule 5: Generated reconstructions are never records

AI-generated images, metaphors, narratives, or memory scenes must be marked as reconstructions. They can support meaning-making; they cannot prove literal history.

### Rule 6: Contradiction should be preserved

If two memories conflict, MC should not silently merge them. It should surface the conflict as a map: "Earlier X / later Y / unresolved Z."

### Rule 7: The user can revoke or narrow memory use

Memory objects need a revocation path and a narrowing path: never use this, use only privately, use only abstractly, use only for MC architecture, or use only when asked.

## Minimal implementation plan

### Phase 1: Static schema

Create a TypeScript or JSON schema for memory candidates and gate decisions.

### Phase 2: Manual gate panel

Build a non-model UI panel showing three memory candidates:

- one admitted,
- one abstracted,
- one blocked.

The panel should visibly explain why.

### Phase 3: Context assembler

Before the model receives session context, run candidates through a deterministic gate function using task type, privacy class, and source boundary.

### Phase 4: Model-assisted review

Only after deterministic rules exist, add model-assisted gate scoring. The model should explain decisions, but not be the only authority.

### Phase 5: Evaluation set

Create adversarial examples:

- semantically relevant but private,
- emotionally resonant but speculative,
- useful for reflection but unsafe for GitHub,
- prior assistant inference mistaken for fact,
- symbolic reconstruction mistaken for literal record,
- old memory contradicted by newer user statement.

## Product wedge

Feature name: Memory Gate

User-facing metaphor: "The door between what was remembered and what is allowed to matter right now."

Interface elements:

- Candidate Echo
- Source Boundary
- Truth Label
- Privacy Label
- Use Decision
- Why This Is / Is Not Allowed
- User Override

## Next architecture question

How should MC represent contradiction over time without collapsing the user into a single fixed profile?

Candidate next artifact: `docs/architecture/MC_CONTRADICTION_LEDGER.md`.
