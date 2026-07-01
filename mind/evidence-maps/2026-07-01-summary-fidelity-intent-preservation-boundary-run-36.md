# Evidence Map Run 36: Summary Fidelity and Intent Preservation Boundary

Date: 2026-07-01

## Claim tested

**C-SUMMARY-FIDELITY-01:** Compressed conversation summaries, memory notes, or evidence-map abstracts preserve user intent well enough to serve as reliable downstream evidence inside the GitHub mind.

## Why this claim matters

Mirror Cartographer and the current GitHub mind repeatedly depend on compressed artifacts: chat summaries, evidence-map summaries, claim ledgers, automation reports, status updates, and memory-like notes. If those summaries omit constraints, convert uncertainty into fact, flatten emotional-symbolic context, or preserve only the assistant's interpretation, then later reasoning can drift while still looking documented.

## Evidence found

### Primary / high-quality sources

1. **NIST AI RMF 1.0**
   - NIST frames AI systems as socio-technical systems whose risks and benefits depend on technical behavior plus human behavior, context of use, and social deployment conditions.
   - NIST states that trustworthy AI requires validity and reliability, accountability and transparency, and context-aware measurement.
   - NIST warns that representing complex human phenomena as measurable quantities can remove necessary context, making impacts harder to understand.
   - Source: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

2. **ISO 9241-210:2019**
   - ISO 9241-210 provides requirements and recommendations for human-centred design throughout the lifecycle of interactive systems.
   - It supports claims of conformance through checklist-style lifecycle evidence rather than assertion alone.
   - Source: https://www.iso.org/standard/77520.html

3. **W3C WCAG overview**
   - WCAG applies to web content and web applications, including information, structure, presentation, and dynamic interfaces.
   - For MC, this reinforces that compressed summaries cannot be the only usable form of meaning if they erase structure or accessibility-relevant context.
   - Source: https://www.w3.org/WAI/standards-guidelines/wcag/

4. **TofuEval: Evaluating Hallucinations of LLMs on Topic-Focused Dialogue Summarization**
   - This dialogue-summarization benchmark found that LLM summaries can contain factual inconsistencies in dialogue settings, and that LLMs used as binary factual evaluators can perform poorly compared with specialized factuality metrics.
   - This is directly relevant because MC/GitHub mind summaries often compress multi-turn dialogue, not just single-document factual articles.
   - Source: https://arxiv.org/abs/2402.13249

5. **Factually Consistent Summarization via Reinforcement Learning with Textual Entailment Feedback**
   - This work treats factual consistency in summarization as a measurable problem and uses textual entailment feedback to improve consistency.
   - It supports using source-to-summary entailment checks rather than treating a fluent summary as faithful by default.
   - Source: https://arxiv.org/abs/2306.00186

## Fact vs inference

### Supported facts

- AI risk and trustworthiness measurement should account for intended context of use, lifecycle stage, limitations, and human-AI interaction dynamics.
- Dialogue summaries can introduce factual inconsistencies, omissions, or hallucinated claims.
- A fluent or useful summary is not automatically faithful to source dialogue.
- Human-centred systems require lifecycle evidence and context-sensitive evaluation, not one-time assertion.

### Inferences for MC / GitHub mind

- MC summaries may be especially vulnerable to distortion because the source material often contains emotional-symbolic language, ambiguous metaphors, shifting intent, and high context dependence.
- Current evidence maps may preserve the assistant's distilled interpretation better than they preserve the user's original constraints, uncertainty, or symbolic load.
- A GitHub mind built from summaries can become internally coherent while becoming less faithful to the original conversation.

These inferences are plausible but not yet proven for the repository.

## Claim status update

**C-SUMMARY-FIDELITY-01 is retired.**

Replacement claim:

**C-SUMMARY-FIDELITY-01R:** Compressed summaries may be useful navigation artifacts, but they are not strong evidence unless they pass source-to-summary fidelity checks for factual accuracy, uncertainty preservation, omitted constraints, speaker attribution, affective-symbolic preservation, and downstream decision impact.

Status: **Supported evaluation-governance requirement; MC implementation unvalidated.**

Confidence: **Moderate for the boundary requirement; low for current MC compliance.**

## Evaluation criterion added

A summary, memory note, evidence-map abstract, or automation report may support a confidence update only if it has a visible fidelity record with these fields:

1. **Source scope** — exact source span, file, thread, or artifact being summarized.
2. **Speaker attribution** — whether a claim came from the user, assistant, external source, or inference.
3. **Fact preservation** — no factual claim added without source support.
4. **Uncertainty preservation** — uncertainty, doubt, hypothesis, and contradiction remain marked.
5. **Constraint preservation** — user requirements and refusals are not dropped.
6. **Affective-symbolic preservation** — symbolic/emotional content is not flattened into generic labels unless marked as interpretation.
7. **Decision boundary** — summary states what downstream decisions it can and cannot support.
8. **Spot-check sample** — at least three source claims are traced to exact summary lines.
9. **Failure consequence** — if fidelity fails, any downstream confidence increase is downgraded or blocked.

## Falsification checklist

Run against existing GitHub mind summaries and evidence maps:

- Find summaries that contain claims not present in the cited source.
- Find summaries that omit strong user constraints, especially instructions about tone, accessibility, authorship, safety, or non-therapy boundaries.
- Find summaries that convert metaphor into psychological fact.
- Find summaries that convert assistant inference into user belief.
- Find evidence maps where the reported status is stronger than the source evidence supports.
- Find memory-style notes that are stale, sensitive, or overgeneralized.
- Find downstream files that cite a summary when they should cite the original source.

Any one of these failures is enough to downgrade the summary from evidence to navigation-only.

## Test plan

**SUMMARY-FIDELITY-GATE-01**

Sample:
- 20 existing GitHub mind artifacts.
- Include at least 5 evidence maps, 5 claim-status updates, 5 user-intent summaries, and 5 automation reports if available.

Method:
1. Select each summary and identify its source span.
2. Extract 5 atomic claims from the summary.
3. Label each atomic claim as: supported, contradicted, unsupported, inference, or ambiguous.
4. Check for omitted constraints and omitted uncertainty.
5. Check whether symbolic/emotional language was preserved or flattened.
6. Record whether the summary was later used to increase confidence, drive a claim status, or justify a build decision.

Pass threshold:
- At least 95% of factual atomic claims must be source-supported.
- 100% of user constraints relevant to downstream action must be preserved.
- 100% of uncertainty markers relevant to claim status must be preserved.
- No assistant inference may be recorded as user belief.

Failure rule:
- If a summary fails, it may remain as a navigation artifact but cannot support claim confidence, product claims, medical/wellness boundaries, opportunity recommendations, or authorship attribution.

## Next proof needed

Run **SUMMARY-FIDELITY-GATE-01** across the last 20 GitHub mind artifacts and publish a ledger showing:

- factual support rate,
- omitted-constraint rate,
- uncertainty-erasure rate,
- inference-as-fact rate,
- symbolic-flattening rate,
- and every downstream confidence update that must be downgraded.

Until that audit exists, the GitHub mind should treat summaries as useful maps, not as verified terrain.
