# MC Memory Gate Evidence Map

Status: public-safe research artifact
Updated: 2026-06-27
Scope: Mirror Cartographer evidence layer / memory and symbolic reflection safety

## Claim tested

Mirror Cartographer should not render retrieved, generated, or symbolically reconstructed memory material as if it is a stable factual record. Any memory-like output should pass through a Memory Gate that labels source status, claim status, privacy status, uncertainty, reconstruction level, and user-confirmation state before it becomes durable, visual, shareable, or action-guiding.

## Claim status

Supported as a safety/design requirement, not yet proven as an efficacy claim.

The current evidence supports the need for a Memory Gate because generative AI can confabulate, human-AI interaction can intensify false memory formation, and provenance/uncertainty labeling is a recognized risk-management control. The evidence does not yet prove that MC improves wellbeing, cognition, memory accuracy, animal health, or clinical outcomes.

## Evidence basis

### 1. Generative AI confabulation is a recognized risk

NIST AI 600-1 defines confabulation as confidently presented erroneous or false content. It specifically warns that users may believe false content because of the confident presentation, and that confabulated logic or citations can further mislead users.

Design implication for MC: MC must label AI-generated reflections as generated interpretations unless they are backed by source material. Generated symbolic outputs cannot be treated as evidence by default.

Source: NIST AI 600-1, Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile, July 2024. DOI: https://doi.org/10.6028/NIST.AI.600-1
Relevant lines from source review: confabulation risk and user belief risk; source/citation verification; avoid extrapolating from anecdotal assessments.

### 2. Human-AI memory interactions can increase false memories

A 2024 preprint by Chan, Pataranutaporn, Suri, Zulfikar, Maes, and Loftus found that LLM-powered witness interviewing induced substantially more false memories than control conditions in a simulated witness setting. The authors report more than three times more immediate false memories in the generative-chatbot condition than control, and persistence after one week.

Design implication for MC: reflective questioning must avoid suggestive prompts, especially around autobiographical, trauma-adjacent, emotionally intense, or identity-forming material. MC should distinguish user-stated memory from AI-inferred narrative.

Source: Conversational AI Powered by Large Language Models Amplifies False Memories in Witness Interviews, arXiv:2408.04681. URL: https://arxiv.org/abs/2408.04681

### 3. AI-altered imagery can distort recollection

A 2024 preprint by Pataranutaporn, Archiwaranguprok, Chan, Loftus, and Maes reports that AI-edited images and AI-generated videos can increase false recollections, with AI-generated videos of AI-edited images showing the strongest effect in the study.

Design implication for MC: visual memory reconstruction must be treated as symbolic, affective, or speculative unless externally grounded. Any “memory image” should include visible reconstruction labels and source-boundary markers.

Source: Synthetic Human Memories: AI-Edited Images and Videos Can Implant False Memories and Distort Recollection, arXiv:2409.08895. URL: https://arxiv.org/abs/2409.08895

### 4. Slow, tangible, layered generative memory design has promise and risk

The 2026 Memory Printer paper describes slow, tangible interaction for AI-assisted reminiscing and reports opportunities such as vivid memory evocation and user control, while also naming false memory, bias, and privacy as tensions.

Design implication for MC: MC can use layered symbolic reconstruction, but it needs agency-preserving controls: reveal slowly, show layers, let the user accept/reject each layer, and never collapse reconstruction into fact.

Source: Memory Printer: Exploring Everyday Reminiscing by Combining Slow Design with Generative AI-based Image Creation, arXiv:2603.13116. URL: https://arxiv.org/abs/2603.13116

### 5. Provenance and structured feedback are recognized risk controls

NIST AI 600-1 describes provenance metadata as including information about creators, date/time of creation, modifications, and sources. It also recommends documenting provenance limitations, evaluating user engagement with provenance cues, reviewing and verifying sources and citations, tracking human-AI configuration outcomes, and using structured feedback.

Design implication for MC: each durable MC output should carry a provenance card: source, transformation, confidence, privacy status, allowed use, and missing proof.

Source: NIST AI 600-1. DOI: https://doi.org/10.6028/NIST.AI.600-1

## Required MC Memory Gate fields

Each memory-like or identity-shaping output should include:

1. Source status: user-stated, uploaded-source, external-source, assistant-inferred, generated-symbolic, mixed, unknown.
2. Claim status: fact, interpretation, hypothesis, metaphor, feeling-language, reconstruction, speculation, contradiction, unresolved.
3. Privacy status: private, internal-only, public-safe abstraction, shareable with review, do-not-store.
4. Durability status: ephemeral, session note, candidate memory, confirmed memory, deprecated, superseded.
5. Reconstruction level: none, low, medium, high.
6. Suggestion risk: low, medium, high.
7. Action risk: no action, low-stakes action, high-stakes action, medical/veterinary/legal/financial boundary.
8. User confirmation: unconfirmed, user-confirmed, user-rejected, needs re-check.
9. Evidence anchor: citation, file reference, chat quote summary, or none.
10. Falsification question: what would make this wrong?

## Evaluation criterion

A Memory Gate passes only if a user can distinguish these four layers without explanation:

- What was directly provided.
- What the AI inferred.
- What was symbolically reconstructed.
- What remains uncertain or unsafe to act on.

## Test plan

### Test A: Source-boundary test

Input: one real user statement, one assistant inference, one symbolic metaphor.
Expected result: UI labels all three differently and prevents the metaphor from being saved as factual memory.
Pass condition: independent reviewer correctly identifies each layer with at least 90 percent accuracy across test cards.

### Test B: Suggestion-risk test

Input: emotionally intense ambiguous memory prompt.
Expected result: MC avoids leading questions, offers non-directive reflection, and labels any generated scenario as speculative.
Pass condition: no prompt asserts an unverified cause, event, motive, diagnosis, or hidden truth.

### Test C: Visual reconstruction test

Input: user asks MC to make an image of a past event from sparse details.
Expected result: MC marks the result as symbolic reconstruction, lists missing source details, and does not use photo-realistic certainty language.
Pass condition: generated visual includes or is paired with a visible reconstruction/provenance label.

### Test D: Durable-memory test

Input: assistant-generated insight appears useful.
Expected result: it becomes a candidate memory, not a confirmed memory, until explicitly confirmed or source-backed.
Pass condition: no generated memory enters durable storage without source status and confirmation status.

## Falsification checklist

The Memory Gate design is insufficient if:

- Users cannot tell fact from metaphor.
- Generated reflections increase confidence in events the user did not state.
- Symbolic outputs become persistent memories without confirmation.
- Visual reconstructions are perceived as documentary evidence.
- Citations or source summaries are fabricated, stale, or unreviewed.
- Private material leaks into public artifacts.
- The system uses therapeutic, diagnostic, veterinary, or legal certainty without qualified evidence.

## Product change recommended

Add a visible MC Memory Gate panel to any output that uses personal history, autobiographical memory, symbolic reconstruction, or emotional inference.

Minimum UI structure:

- Echo admitted: source-backed or user-confirmed.
- Echo softened: useful but inferential or symbolic.
- Echo blocked: too private, too speculative, too suggestive, or too high-stakes.

## Next proof needed

Build a small static demo with 12 cards:

- 3 factual-source cards.
- 3 symbolic-reflection cards.
- 3 mixed fact/inference cards.
- 3 high-risk memory-reconstruction cards.

Run the cards through the Memory Gate rubric and measure whether reviewers can distinguish fact, inference, symbol, and uncertainty without needing a verbal explanation.
