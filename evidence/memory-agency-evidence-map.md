# Evidence Map: Memory Agency Boundary

## Claim tested

Mirror Cartographer should not treat persistent memory as a simple personalization feature. Because MC works with symbolic, emotional, and interpretive material, every durable memory or interpretation needs visible provenance, user control, claim type, sensitivity level, and a path to correction or deletion.

## Claim status

**Supported as a design requirement, not yet validated as a finished product pattern.**

The evidence supports the need for visible memory controls, source/provenance cues, project/session boundaries, temporary/incognito modes, and sensitivity handling. It does not yet prove the exact MC interface pattern that will work best for non-technical users.

## Fact / evidence table

| Evidence | Fact | What it supports | Limit |
|---|---|---|---|
| OpenAI Memory FAQ, updated June 2026 | ChatGPT memory can use chats, files, and connected apps; users can enable/disable memory, use Temporary Chats, review/edit summaries, and inspect memory sources. | Memory systems need controls beyond storage: visibility, source awareness, editability, deletion, temporary mode. | Product FAQ; not independent evaluation of whether users understand or use the controls correctly. |
| OpenAI Memory FAQ | The memory summary may not show everything the model uses; full deletion can require deleting memories, chats, files, and disconnecting connected apps. | A visible ledger should not pretend a short summary is a complete causal record; MC needs source pointers and deletion scope warnings. | This is specific to ChatGPT implementation, not a universal rule. |
| Anthropic Claude memory announcement, Sept/Oct 2025 | Claude memory is optional, project-scoped, viewable/editable, and paired with incognito chats. Anthropic states they safety-tested memory for sensitive wellbeing topics, over-accommodation, and harmful pattern reinforcement. | Project-scoped memory and incognito/session boundaries are strong patterns for MC. Sensitive symbolic/emotional use cases need explicit safety testing. | Company announcement; public details do not reveal full test methodology. |
| NIST AI RMF 1.0 page | NIST frames AI risk management as design/development/use/evaluation work for trustworthiness; NIST released a Generative AI Profile in July 2024 and notes AI RMF 1.0 is being revised. | MC should frame memory as risk-managed lifecycle design, not a static preference toggle. | General governance framework, not MC-specific UX evidence. |
| Algorithmic Self-Portrait paper, 2026 | Study of real-world ChatGPT memories reports most sampled memories were system-created and many included personal/psychological information; authors raise concerns about agency, sensitivity, and fidelity. | Supports MC's separation of user-stated, user-approved, and system-inferred memory. | Empirical dataset is limited to sampled users and one platform context; findings should guide caution, not be overgeneralized. |
| Agentic AI governance papers, 2025-2026 | Recent work argues point-in-time audits are weak for agentic systems and proposes continuous assurance/evidence binding for AI controls. | MC should keep an evidence trail for claims used in memory, public artifacts, and agentic recommendations. | Mostly framework/prototype-level literature; not direct evidence of user comprehension. |

## Inference separated from fact

### Facts

- Current major AI assistants are adding persistent memory controls, summaries, source views, project boundaries, temporary/incognito modes, and edit/delete pathways.
- Memory can involve information beyond explicit user-authored saved facts, including synthesized context from previous chats and connected sources.
- Sensitive or psychological information can enter memory-like systems if shared or inferred.
- Governance sources increasingly frame trustworthy AI as ongoing evidence, evaluation, and control rather than one-time documentation.

### Inferences for MC

- MC should make memory provenance visible at the point of use, not only in settings.
- MC should label claims as user-stated, user-approved, system-inferred, session-local, or public-safe abstraction.
- MC should treat symbolic interpretations as hypotheses until accepted by the user.
- MC should require a public-safety transform before any private-derived design insight is written to GitHub.
- MC needs a falsification checklist for memory: what would prove this memory is stale, overreaching, private, or wrongly inferred?

## Falsification checklist

A memory or interpretation fails MC's agency boundary if any answer is yes:

1. Does it state an identity claim as fact when it was only inferred?
2. Does it merge separate projects, roles, animals, symptoms, relationships, or goals without user approval?
3. Does it store private, medical, household, credential, or location detail when an abstraction would work?
4. Does it appear in a public artifact without a public-safe transform?
5. Can the user not see where it came from?
6. Can the user not edit, delete, downgrade, or expire it?
7. Is it used to steer an answer without being visible as memory, interpretation, or hypothesis?
8. Does it reinforce a harmful pattern because the system is optimizing agreement instead of evidence?

## Evaluation criterion added

MC memory implementation should pass this minimum test before being treated as product-ready:

A user reviewing any durable MC output must be able to answer four questions in under one minute:

1. What did MC remember or infer?
2. Where did that claim come from?
3. Is it fact, user-approved meaning, system hypothesis, or public-safe abstraction?
4. How do I correct, delete, downgrade, or keep it session-only?

## Implementation implication

The existing `architecture/agency-preserving-memory.md` pattern should be treated as **evidence-supported but not UX-validated**. The next build step should be a small Memory Ledger prototype with three views:

1. **Plain view** — user-readable labels: “You said,” “You approved,” “MC guessed,” “Only for now,” “Safe to publish.”
2. **Evidence view** — source pointer, sensitivity, confidence, allowed uses, prohibited uses.
3. **Action view** — approve, edit, forget, make session-only, make public-safe abstraction.

## Sources

- https://help.openai.com/en/articles/8590148-memory-faq
- https://claude.com/blog/memory
- https://www.nist.gov/itl/ai-risk-management-framework
- https://www.nist.gov/itl/ai-risk-management-framework/generative-artificial-intelligence-profile
- https://arxiv.org/abs/2602.01450
- https://arxiv.org/abs/2510.25863
- https://arxiv.org/abs/2603.03340

## Next proof needed

Test whether non-technical users can correctly classify memory items into **fact**, **interpretation**, **hypothesis**, and **public-safe abstraction** without feeling like they are filling out compliance paperwork.
