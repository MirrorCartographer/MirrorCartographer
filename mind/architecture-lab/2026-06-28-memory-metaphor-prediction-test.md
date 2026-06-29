# Memory Metaphor Prediction Test

Date: 2026-06-28
Status: Draft pattern / test plan
Public-safety note: This artifact abstracts personal examples into generic interface cases. It should not include private user material.

## Architecture question

Can users correctly predict what MC's symbolic memory-state metaphors allow without reading a policy receipt?

Current metaphor set:

- Campfire = now-only: may help in the current exchange, but should not be stored, retrieved, profiled, or exported.
- Notebook = session memory: may remain available inside the current session, but should not become a future lens.
- Map Layer = future lens: may shape later interpretation, retrieval, and personalization.
- Message Bottle = exportable/shareable: may be prepared for transmission outside the current session or user-private workspace.

## Why this needs evidence

The metaphor set is promising, but a metaphor can create false confidence. If users like the symbols but cannot predict the actual system powers behind them, the design becomes decorative rather than protective.

This is not only a privacy problem. It is an influence-governance problem: what a remembered interpretation is allowed to affect later.

## Evidence reviewed

1. Interface-level consent research suggests layout and interaction patterns can guide attention, but comprehension is not guaranteed by interface form alone. In a 2026 eye-tracking study, guided structures shaped attention and reading patterns, but comprehension depended strongly on sustained attention rather than interface type by itself.

Source: Wei Xiao, Mengke Wu, Yeeun Jo, "Designing for Understanding: How Interface-Level Consent Designs Shape Attention and Understanding in Privacy Disclosures," 2026. https://arxiv.org/abs/2603.13747

2. Agentic memory research is moving toward persistent, interpretable, context-rich user models. Memoria describes dynamic session summarization plus a weighted knowledge-graph user-modeling engine for long-term personalization.

Source: Sarin et al., "Memoria: A Scalable Agentic Memory Framework for Personalized Conversational AI," 2025. https://arxiv.org/abs/2512.12686

3. PersonaMem-v2 highlights that implicit personalization is hard even for strong models. The benchmark reports frontier models struggling with implicit personalization and frames human-readable memory as a compact alternative to full conversation history.

Source: Jiang et al., "PersonaMem-v2: Towards Personalized Intelligence via Learning Implicit User Personas and Agentic Memory," 2025. https://arxiv.org/abs/2512.06688

4. Contextual integrity frames privacy as appropriate information flow rather than secrecy or simple control. The relevant dimensions are sender, recipient, subject, information type, and transmission principle. MC's memory-state metaphors should therefore map to flow permissions, not vague comfort language.

Source: Helen Nissenbaum, Privacy in Context, 2010. Summary reference: https://en.wikipedia.org/wiki/Contextual_integrity

5. False-memory research in LLM-mediated interviews shows that conversational AI can alter user confidence and recollection, especially in sensitive interpretive settings. This supports treating future influence as a safety-relevant design object, not merely a storage preference.

Source: Chan et al., "Conversational AI Powered by Large Language Models Amplifies False Memories in Witness Interviews," 2024. https://arxiv.org/abs/2408.04681

## Fact / inference split

### Facts from reviewed sources

- Interface structure can guide attention, but does not automatically guarantee comprehension.
- Persistent and agentic memory architectures are moving toward human-readable summaries, session summaries, knowledge graphs, and long-term user models.
- Implicit personalization remains difficult and error-prone.
- Privacy can be evaluated as appropriateness of information flow, not only whether data is secret.
- LLM-mediated interaction can influence human memory and confidence in sensitive contexts.

### Inferences for MC

- MC needs users to understand future influence, not just whether something is stored.
- Memory-state metaphors must be tested behaviorally: can users predict what each state permits?
- A metaphor should fail if it increases comfort without increasing accurate prediction.
- Campfire / Notebook / Map Layer / Message Bottle should be treated as interface hypotheses, not finished design truths.

## Proposed evaluation criterion

R-MEM-METAPHOR-01: A memory-state metaphor is acceptable only if users can correctly predict at least four permission powers with minimal explanation:

1. Store: can this interpretation be saved after the current moment?
2. Retrieve: can it be brought back automatically later?
3. Influence: can it shape future interpretations or recommendations?
4. Transmit: can it be shared, exported, or used outside the current private workspace?

Passing threshold for prototype testing:

- At least 85% correct classification across the four powers after exposure to the metaphor plus a one-sentence explanation.
- No single metaphor may fall below 75% correct on any one power.
- Users must be able to explain the difference between Session Memory and Future Lens in their own words.
- Users must not report higher confidence than accuracy by more than 15 percentage points.

## Prototype test plan

### Participants

Start with 8-12 formative testers, then expand to 30-50 for a stronger signal.

### Conditions

A. Text label only
- Now-only
- Session memory
- Future lens
- Exportable

B. Metaphor only
- Campfire
- Notebook
- Map Layer
- Message Bottle

C. Metaphor + one-line operational explanation
- Campfire: use now, do not shape later.
- Notebook: keep in this session, not future sessions.
- Map Layer: may shape future interpretation.
- Message Bottle: may be prepared to share or export.

D. Metaphor + four-icon permission strip
- Store
- Retrieve
- Influence
- Transmit

E. Metaphor + explain-back gate
- User must choose what the state allows before confirming.

### Tasks

For each condition, show 12 generic interpretation cards. Ask users to predict whether each card can store, retrieve, influence, or transmit.

Example generic cards:

- "The system notices a repeated preference for visual summaries."
- "The system forms a tentative interpretation of a recurring symbol."
- "The system prepares a short summary for export."
- "The system uses an observation only to respond in the current exchange."

### Measurements

- Permission prediction accuracy.
- Confidence calibration.
- Time to decision.
- Subjective burden.
- Ability to distinguish Session Memory from Future Lens.
- False-positive comfort: cases where users report the design feels clear but answer permission questions incorrectly.

## Falsification checklist

This pattern should be revised or rejected if any of the following happen:

- Users consistently confuse Notebook with Map Layer.
- Users assume Campfire still saves something by default.
- Users assume Message Bottle means public sharing even when it only means export-ready.
- Users like the metaphors but cannot predict system powers.
- Users feel emotionally reassured while misunderstanding actual influence boundaries.
- The four-icon strip outperforms metaphor language by a large margin.
- Explain-back improves accuracy but kills reflective flow.

## Design requirement update

R-MEM-METAPHOR-02: Memory-state metaphors must always be bound to machine-actionable permission fields. A metaphor label alone is not sufficient state.

Suggested fields:

```json
{
  "memory_state": "campfire | notebook | map_layer | message_bottle",
  "may_store": false,
  "may_retrieve_later": false,
  "may_influence_future": false,
  "may_transmit": false,
  "expires_at": null,
  "requires_explain_back": false,
  "user_confirmed_prediction": null,
  "confidence": "low | medium | high",
  "provenance": []
}
```

## Claim-status update

Claim: The Campfire / Notebook / Map Layer / Message Bottle metaphor set can make memory-state permissions understandable.

Status: Plausible but unproven.

Supported by:

- Interface metaphor theory: familiar domains can help users approach unfamiliar systems.
- Contextual integrity: the metaphors can map to different information-flow permissions.
- Consent-interface evidence: better structure may guide attention.

Not yet proven:

- That users correctly infer system powers from these metaphors.
- That emotional lightness can coexist with accurate prediction.
- That the metaphors work across different literacy levels, cultures, neurotypes, or emotional states.

## Next proof needed

Run a lightweight prototype study comparing text labels, metaphors, metaphors plus operational explanations, metaphors plus permission strips, and metaphors plus explain-back.

The next architecture question is:

Can MC preserve the emotional usefulness of metaphor while forcing enough operational clarity that users can accurately predict future influence?
