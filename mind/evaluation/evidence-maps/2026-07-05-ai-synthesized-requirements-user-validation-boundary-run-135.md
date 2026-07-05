# Evidence Map: AI-Synthesized Requirements vs User Validation Boundary

Date: 2026-07-05
Area: Mirror Cartographer / AI opportunity work / GitHub mind evaluation
Status: claim narrowed; confidence moderate, not final

## Claim tested

Mirror Cartographer and the GitHub mind can use AI-synthesized conversations, requirements, and decision maps as a reliable substitute for direct stakeholder/user validation.

## Updated claim status

Previous implicit assumption:

> If AI can synthesize the user’s patterns, conversations, and goals into a coherent requirements map, that map can function as validated product direction.

Updated claim:

> AI synthesis can improve organization, traceability, and hypothesis generation, but it is not validated product direction until representative users or stakeholders test it against concrete tasks, outcomes, constraints, and failure conditions.

Classification: **partial-support / validation-boundary**

## Fact / inference separation

### Facts from primary or high-quality sources

1. NIST AI RMF Measure guidance says appropriate methods and metrics should be identified and applied, including testing procedures and metrics that demonstrate whether a system is fit for purpose and functioning as claimed. It also says unmeasured risks or trustworthiness characteristics should be documented.
   - Source: NIST AI RMF Playbook, Measure 1.1, lines 71-95: https://airc.nist.gov/airmf-resources/playbook/measure/

2. NIST AI RMF Measure guidance says AI risk measurement depends on purpose, audience, evaluation needs, system use, operators, and social context. It also recommends monitoring pre- and post-deployment performance and documenting known risks.
   - Source: NIST AI RMF Playbook, Measure 1.1, lines 77-94: https://airc.nist.gov/airmf-resources/playbook/measure/

3. NIST AI RMF Measure guidance says appropriateness of metrics and controls should be regularly assessed and updated; it specifically recommends assessing external validity, lifecycle effectiveness of metrics, stakeholder feedback, and software quality metrics.
   - Source: NIST AI RMF Playbook, Measure 1.2, lines 121-145: https://airc.nist.gov/airmf-resources/playbook/measure/

4. NIST AI RMF Measure guidance says regular assessment should involve internal experts not serving as front-line developers and/or independent assessors, and that domain experts, users, external AI actors, and affected communities should be consulted when needed.
   - Source: NIST AI RMF Playbook, Measure 1.3, lines 159-181: https://airc.nist.gov/airmf-resources/playbook/measure/

5. NIST AI RMF Measure guidance says prototypes should be evaluated with end-user populations early and continuously, and test outcomes should be documented and used for course correction.
   - Source: NIST AI RMF Playbook, Measure 1.3, lines 166-170: https://airc.nist.gov/airmf-resources/playbook/measure/

6. NIST AI RMF Measure guidance says test sets, metrics, and TEVV materials should be documented because documentation enables repeatability and consistency and supports valid, reliable measurement.
   - Source: NIST AI RMF Playbook, Measure 2.1, lines 200-218: https://airc.nist.gov/airmf-resources/playbook/measure/

7. NIST AI RMF Measure guidance says evaluations involving human subjects should be representative of the relevant population and reflect the population in the context of use.
   - Source: NIST AI RMF Playbook, Measure 2.2, lines 239-261: https://airc.nist.gov/airmf-resources/playbook/measure/

8. A 2026 empirical study on collaborative and AI-supported requirements elicitation found that AI-supported synthesis can help transform collaborative knowledge into structured requirements artifacts, but the study itself describes limited empirical evidence and used an exploratory, limited-sample design with descriptive rather than statistically generalizable results.
   - Source: Salgado Neto, Araujo, Santos, "Collaborative and AI-Supported Requirements Elicitation: An Empirical Study," arXiv, 2026, lines 3-6, 101-124: https://arxiv.org/abs/2606.24060

9. The same study used ISO/IEC/IEEE 29148-derived quality dimensions including completeness, clarity, consistency, absence of ambiguity, level of detail, traceability, and overall quality.
   - Source: Salgado Neto et al., lines 81-84 and 116-124: https://arxiv.org/abs/2606.24060

10. The study’s strongest relevant implication is not that LLM-only generation validates requirements, but that AI-supported synthesis may be strongest when combined with stakeholder collaboration.
   - Source: Salgado Neto et al., lines 3-6 and 90-100: https://arxiv.org/abs/2606.24060

### Inferences for Mirror Cartographer

1. Mirror Cartographer should treat AI-generated requirements maps as **structured hypotheses**, not validated requirements.

2. A coherent MC map may show internal consistency, but that is weaker than evidence that users can complete intended tasks, understand claim boundaries, avoid overreliance, and get durable value.

3. The GitHub mind should not mark a feature, opportunity, or claim as "validated" unless it has evidence from at least one external validation channel: user task test, stakeholder review, independent evaluator, usage metric, deployment outcome, or falsification attempt.

4. For personal-use MC, the user can be a primary stakeholder, but not the only validation surface if the product claim extends to other users, buyers, employers, funders, or public adoption.

## Evidence strength

Moderate.

Why not high:

- NIST provides strong governance guidance, but it is a framework, not a direct empirical test of MC.
- The 2026 requirements-elicitation study is directly relevant but exploratory, with limited participants and descriptive statistics.
- ISO/IEC/IEEE 29148 is highly relevant to requirements quality, but full standard text is not freely quoted here; the update relies on study descriptions of ISO-derived dimensions plus NIST guidance.

## Evaluation criterion added

### MC-REQ-VALIDATION-BOUNDARY-01

A Mirror Cartographer requirement, feature direction, or AI-opportunity claim cannot be labeled **validated** unless it passes all required gates below.

| Gate | Required evidence | Status labels |
|---|---|---|
| Source traceability | Origin of the requirement is documented: user statement, observed behavior, market source, technical constraint, or explicit hypothesis | traced / partially traced / untraced |
| Stakeholder grounding | At least one relevant stakeholder or target user has interacted with the requirement or scenario | grounded / internal-only / absent |
| Task validation | A user attempts a concrete task or decision using the artifact, not just reacts to a description | passed / partial / failed / untested |
| Comprehension check | User can explain what the artifact does, what it does not prove, and what choices remain theirs | passed / partial / failed / untested |
| Outcome metric | Success metric is defined before evaluation, e.g. task success, time, error rate, confidence calibration, retention, application outcome | defined / vague / absent |
| Failure capture | Friction, confusion, misuse, overreliance, emotional pressure, or rejection is logged | logged / partial / absent |
| Revision link | Validation results change the requirement, priority, interface, or claim status | updated / no-change-justified / absent |

### Status rule

- **Hypothesis:** AI synthesis only; no external validation.
- **Structured hypothesis:** AI synthesis plus traceable sources and clear success/failure criteria.
- **Internally supported:** User or creator review supports usefulness, but no representative task test.
- **Task-tested:** At least one relevant user completed a defined task with logged results.
- **Validated-limited:** Multiple relevant users or stakeholders completed tasks, with metrics and revision history.
- **Validated-general:** Evidence spans representative users, contexts, repeated use, and falsification attempts.

## Falsification checklist

This claim should be downgraded further if any of the following are observed:

- Users praise MC descriptions but cannot use them to complete decisions or actions.
- Users cannot distinguish fact, inference, metaphor, and recommendation inside MC artifacts.
- A polished requirements map causes overconfidence without improving task outcomes.
- AI-generated requirements omit major user needs discovered in interviews or task testing.
- Direct user testing reveals confusion that was invisible in AI-only evaluation.
- Requirements remain unchanged after user evidence contradicts them.
- The same requirement cannot be traced back to an observed need, stated goal, or validated constraint.

## Test plan

### MC-REQ-VALIDATION-PILOT-01

Goal: Determine whether AI-synthesized MC requirements survive basic user/stakeholder validation.

#### Sample

- 5 existing MC requirement/feature artifacts from the GitHub mind.
- 3-5 task participants if testing product usability.
- 2 independent reviewers if testing claim quality only.
- Include at least one participant unfamiliar with MC language if public adoption is part of the claim.

#### Procedure

1. Select one MC artifact, such as a decision map, reflection-mode spec, career opportunity map, or evidence-engine workflow.
2. Extract all requirements and claims from the artifact.
3. Label each item as fact, inference, metaphor, design preference, user requirement, system requirement, or evaluation criterion.
4. Create one concrete task per major requirement.
5. Ask participants to use the artifact to complete the task without explanation from the creator.
6. Measure task success, confusion points, time, perceived usefulness, confidence, and whether confidence matches actual task correctness.
7. Ask participants to state what the artifact proves and does not prove.
8. Revise requirement status using the MC-REQ-VALIDATION-BOUNDARY-01 status rule.
9. Commit the revision log to GitHub.

#### Minimum pass condition

A requirement can move from **structured hypothesis** to **task-tested** only if:

- task outcome is recorded,
- at least one failure mode is explicitly considered,
- user comprehension is checked,
- confidence/status is updated after the test,
- and the artifact records what evidence is still missing.

## Practical implementation consequence

The GitHub mind should reserve the word **validated** for evidence-backed claims. AI-only synthesis should use one of these labels instead:

- generated hypothesis
- structured hypothesis
- internally supported
- task-tested
- validated-limited
- validated-general

## Next proof needed

Run `MC-REQ-VALIDATION-PILOT-01` on five existing MC artifacts and produce a validation ledger showing:

1. original AI-synthesized requirement,
2. source trace,
3. task used to test it,
4. participant/reviewer result,
5. observed failure mode,
6. revised claim status,
7. resulting design change.

Only after that pilot should MC claim that its internal maps have moved beyond structured synthesis into validated requirements.
