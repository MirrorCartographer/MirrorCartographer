# Evidence Map: Explanation Trace vs Trustworthy Understanding

Date: 2026-07-05
Status: Claim narrowed / requires evaluation
Area: Mirror Cartographer evaluation, context-switch explanations, GitHub mind governance

## Claim tested

Mirror Cartographer can make its reasoning safer and more trustworthy by showing context switches, explanation traces, and why a conclusion changed.

## Updated claim status

NARROWED.

Explanation traces are potentially useful, but they do not by themselves prove trustworthiness, safety, interpretability, or better user judgment. They become evidence only when evaluated for:

- fidelity: the explanation accurately represents the actual process or evidence used;
- usefulness: the explanation helps the user perform the task or detect error;
- calibration: the explanation helps the user rely appropriately, neither blindly trusting nor reflexively rejecting;
- limitation disclosure: the explanation makes uncertainty, missing evidence, and possible failure modes visible;
- outcome effect: the explanation improves measurable decision quality or reflection quality compared with a baseline.

## Evidence found

### Source 1: NIST AI Risk Management Framework

Type: primary / government framework.
URL: https://www.nist.gov/itl/ai-risk-management-framework

Relevant facts:

- NIST describes the AI RMF as a framework for managing risks to individuals, organizations, and society associated with AI.
- NIST says the AI RMF is intended to improve the ability to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI systems.
- NIST released the AI RMF 1.0 on 2023-01-26 and provides a companion playbook and later GenAI profile.

Interpretation for MC:

- Trustworthiness is not a single explanation feature. It is a lifecycle property involving design, use, evaluation, and risk management.
- A context-switch trace can be one artifact inside a trustworthiness program, but it cannot substitute for evaluation.

### Source 2: DARPA Explainable Artificial Intelligence program

Type: primary / government R&D program.
URL: https://www.darpa.mil/research/programs/explainable-artificial-intelligence

Relevant facts:

- DARPA frames explainability as necessary for users to understand, appropriately trust, and effectively manage AI partners.
- DARPA's XAI program aimed to produce more explainable models while maintaining performance.
- DARPA explicitly pairs explainable models with human-computer-interface methods that translate models into useful explanation dialogues.
- DARPA states that XAI research prototypes were tested and continually evaluated during the program.

Interpretation for MC:

- The phrase "appropriately trust" is the key boundary. Explanation is not meant to maximize trust; it is meant to calibrate trust.
- MC should not count narrative coherence as proof. It should test whether the explanation trace helps the user find errors, compare alternatives, and revise confidence.

### Source 3: Papenmeier, Englebienne, and Seifert, 2019 / 2022 publication lineage, "How model accuracy and explanation fidelity influence user trust"

Type: peer-reviewed / empirical XAI trust study lineage.
URL: https://arxiv.org/abs/1907.12652

Relevant facts:

- The study distinguishes model accuracy from explanation fidelity.
- The authors warn users should not be fooled by persuasive but untruthful explanations.
- Their findings emphasize that accuracy matters more for trust than explanation alone, and that nonsensical explanations can harm trust.

Interpretation for MC:

- A beautiful symbolic explanation can be persuasive without being faithful.
- MC needs an explanation-fidelity check: does the trace cite the actual evidence and reasoning move, or does it merely narrate a plausible story after the fact?

### Source 4: Vasconcelos et al., 2022, "Explanations Can Reduce Overreliance on AI Systems During Decision-Making"

Type: empirical human-AI decision-making study.
URL: https://arxiv.org/abs/2212.06823

Relevant facts:

- Prior work found overreliance can persist when AI provides explanations.
- The paper argues that explanations reduce overreliance only under certain task and cost-benefit conditions.
- The study suggests users must have enough incentive and usable explanation structure to verify the AI prediction.

Interpretation for MC:

- Explanations are not automatically protective. They work when they reduce the cost of checking the system.
- MC should prefer short, checkable explanation traces over elaborate narratives when the claim affects decisions, health, finances, legal issues, or identity.

### Source 5: XAI 2.0 Manifesto, 2023

Type: high-quality interdisciplinary research synthesis.
URL: https://arxiv.org/abs/2310.19775

Relevant facts:

- The paper identifies many unresolved open challenges in XAI.
- It frames XAI as interdisciplinary and not merely a technical explanation-output problem.

Interpretation for MC:

- MC should not claim solved interpretability. It should treat explanation design as an open evaluation surface.
- Symbolic, emotional, and spatial explanations may be useful MC-specific interfaces, but their value requires user testing and error testing.

## Fact / inference separation

### Facts

- NIST frames AI trustworthiness as a risk-management and evaluation problem, not as a single UI feature.
- DARPA frames explainability around understanding, appropriate trust, effective management, and continual evaluation.
- XAI research distinguishes explanation fidelity from persuasion or user satisfaction.
- Empirical human-AI work shows explanations may reduce overreliance only under certain conditions and may fail when they do not help users verify the output.

### Inferences

- MC context-switch explanations should be treated as hypotheses about reasoning, not proof of reasoning.
- MC should downgrade any claim that "because the system explained itself, the result is trustworthy."
- MC needs a specific explanation-trace evaluation criterion before claiming that context-switch explanations improve user safety, clarity, or decision quality.

## Evaluation criterion added

ID: MC-EXPLANATION-FIDELITY-01

For any MC output that explains a context switch, changed conclusion, symbolic reading, decision recommendation, or claim-status update, score the explanation on five dimensions:

1. Traceability
   - Does the explanation point to the concrete source, user input, observation, or evidence that caused the reasoning move?

2. Fidelity
   - Does the explanation describe the actual reasoning/evidence path, or does it produce a plausible post-hoc story?

3. Contrast
   - Does it state what alternative interpretation was rejected or deprioritized?

4. Reliance calibration
   - Does it tell the user how much weight the explanation should carry and what it cannot prove?

5. Verification utility
   - Can a user or reviewer use the explanation to check the claim, reproduce the step, falsify it, or ask for a targeted correction?

Scoring:

- 0 = absent
- 1 = present but vague
- 2 = specific and checkable
- 3 = specific, checkable, and linked to a falsification/revision path

Minimum passing threshold for high-impact MC claims: 12/15, with no zero scores.

## Falsification checklist

The claim "MC explanation traces improve trustworthiness" should be downgraded if any of the following occur in testing:

- Users rate explanations as clear but fail to detect intentionally inserted errors.
- Explanation traces increase confidence without improving correctness.
- Different runs produce incompatible explanations for the same reasoning step without flagging uncertainty.
- The trace omits missing evidence or uncertainty that materially affects the claim.
- The trace explains a conclusion after the fact but cannot identify the evidence that caused the conclusion to change.
- Users report symbolic explanations as emotionally persuasive while reviewers classify the underlying evidence as weak or absent.

## Test plan

ID: MC-EXPLANATION-TRACE-PILOT-01

Design:

- Select 20 prior MC outputs that include context switches, symbolic interpretations, decision maps, or claim-status updates.
- For each output, produce two versions:
  1. normal narrative explanation;
  2. structured explanation trace using MC-EXPLANATION-FIDELITY-01.
- Insert controlled weak points into 5 examples, such as missing evidence, unsupported inference, stale source, or overclaim.
- Have reviewers or the user perform three tasks:
  1. identify the main claim;
  2. identify what evidence supports it;
  3. identify what would falsify or weaken it.

Measures:

- error detection rate;
- overreliance rate;
- time to verification;
- confidence-before vs confidence-after;
- user clarity rating;
- reviewer fidelity rating;
- number of corrected claims.

Pass condition:

Structured explanation traces outperform narrative explanations on error detection and verification utility without increasing unsupported confidence.

## Next proof needed

MC-EXPLANATION-TRACE-PILOT-01.

The next proof is not another theoretical argument. It is a controlled audit showing that MC explanation traces help detect errors, calibrate trust, and improve verification compared with ordinary narrative explanation.
