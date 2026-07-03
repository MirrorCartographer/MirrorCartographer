# Evidence Map: Reflective / Symbolic Writing vs Therapeutic Benefit Boundary

Date: 2026-07-02
Claim ID: C-REFLECTIVE-SYMBOLIC-WRITING-THERAPEUTIC-BENEFIT-01R
Status: partially supported as a reflective-orientation design hypothesis; unvalidated as a therapeutic, mental-health, or clinical-outcome claim.

## Claim tested

Mirror Cartographer's symbolic reflection, journaling, and narrative mapping practices help users orient thoughts and emotions, and may produce therapeutic benefit.

## Why this claim needs stronger evidence

This claim sits near a risky boundary: a design can feel clarifying, meaningful, emotionally regulating, or identity-coherent without proving clinical benefit. MC should not let user-felt resonance, elegant symbolic language, or repeated engagement become a substitute for outcome measurement.

## Evidence reviewed

### Source 1: NIST AI Risk Management Framework
- Type: primary governance / standards source.
- URL: https://www.nist.gov/itl/ai-risk-management-framework
- Relevant finding: NIST frames trustworthy AI as requiring risk management across design, development, use, and evaluation. The AI RMF is intended to incorporate trustworthiness considerations into AI products, services, and systems, including evaluation.
- Boundary implied for MC: reflective writing features require explicit evaluation if MC claims user benefit, safety, or reliability. A design rationale alone is not evidence of benefit.

### Source 2: WHO guidance on ethics and governance of AI for health
- Type: primary international health governance guidance.
- URL: https://www.who.int/publications/i/item/9789240029200
- Relevant finding: WHO states that AI for health has promise but must put ethics and human rights at the center of design, deployment, and use. The guidance identifies risks and recommends accountable governance for stakeholders whose communities and individuals may be affected.
- Boundary implied for MC: if MC outputs become health-adjacent, trauma-adjacent, distress-adjacent, or behavior-guiding, safety and governance obligations increase even if the interface is framed as reflective rather than medical.

### Source 3: Expressive writing / writing therapy literature
- Type: peer-reviewed psychological intervention literature, including meta-analytic and review traditions around expressive writing.
- Representative anchors:
  - Pennebaker-style expressive writing paradigm: structured writing about stressful or traumatic experiences across short sessions.
  - Reviews/meta-analyses report possible benefits for some physical and psychological outcomes, but effects are mixed, context-dependent, and not identical to ordinary journaling or AI-mediated symbolic reflection.
- Boundary implied for MC: there is plausibility that structured writing can support emotional processing for some people, but MC's symbolic maps are not the same intervention unless dosage, instructions, population, comparator, outcome measures, and adverse-event monitoring are specified.

### Source 4: Text-based conversational-agent mental-health evaluation literature
- Type: systematic-review-level research on evaluation of conversational agents.
- Representative anchor: Gong et al., 2026, systematic review of metrics and methods for text-based conversational agents in mental health contexts.
- Relevant finding: evaluation practices remain fragmented; studies vary by metrics, methods, usage contexts, follow-up periods, and user-centered outcomes. Automated performance metrics do not automatically establish user wellbeing benefit.
- Boundary implied for MC: MC cannot infer wellbeing effect from coherence, empathy, symbolic resonance, or engagement metrics alone.

## Fact vs inference

### Supported by current evidence

- Structured writing interventions have a research base and may produce benefits under some conditions.
- AI systems that affect health-adjacent domains require risk management, evaluation, and governance.
- User-centered outcomes should be measured directly rather than inferred from system-centered scores.
- Reflective writing and journaling are not automatically equivalent to a validated therapeutic protocol.

### Plausible but unproven for MC

- MC symbolic reflection improves emotional orientation.
- MC maps reduce distress or rumination.
- MC increases insight in a way that persists beyond the session.
- MC is safer or more beneficial than plain structured journaling.
- MC aesthetic resonance increases benefit rather than merely increasing perceived meaning.

### Unsupported / should not be claimed

- MC is therapeutic.
- MC improves mental health.
- MC can substitute for therapy, clinical support, crisis support, or evidence-based treatment.
- MC symbolic language is beneficial because it feels personally accurate.

## Claim-status update

C-REFLECTIVE-SYMBOLIC-WRITING-THERAPEUTIC-BENEFIT-01R:

Mirror Cartographer may reasonably describe symbolic writing as a reflective orientation scaffold. It should not describe this feature as therapeutic, clinically beneficial, trauma-processing, anxiety-reducing, depression-reducing, or mental-health-improving until tested with validated outcome measures, defined user populations, comparators, and safety monitoring.

Confidence: moderate for the boundary; low for any MC-specific benefit claim.

## Evaluation criterion added

### MC Reflective Writing Benefit Gate

Before any MC feature may claim emotional, therapeutic, or mental-health benefit, the claim must include:

1. Target population.
2. Intended benefit.
3. Comparator condition.
4. Session dosage and instructions.
5. Validated outcome measure.
6. Timing of measurement: immediate, 24-hour, 7-day, and 30-day if feasible.
7. Adverse-event and distress-escalation monitoring.
8. Human-review process for high-risk outputs.
9. Minimum effect threshold required for promotion.
10. Retirement condition if benefit is absent or harm signal appears.

## Test plan

Test ID: MC-REFLECTIVE-WRITING-BENEFIT-PILOT-01

Design:
- Compare MC symbolic reflection against plain structured journaling and a neutral writing control.
- Minimum pilot size: 30 sessions per condition if used only for internal signal; larger sample required before public claims.
- Randomize prompt order where feasible.
- Blind raters to condition for qualitative scoring.

Measures:
- Immediate perceived clarity.
- Immediate affect shift.
- Rumination / distress change using a validated measure appropriate to the population.
- 24-hour follow-up usefulness.
- 7-day remembered usefulness.
- Harm flags: increased distress, false certainty, over-attachment to symbolic interpretation, avoidance of professional support, crisis leakage.

Pass condition:
- MC must outperform neutral writing on clarity/usefulness without higher harm flags.
- MC must show at least comparable safety to plain structured journaling.
- Any mental-health claim requires validated symptom or wellbeing outcomes, not only perceived insight.

Fail / revise condition:
- Similar outcomes to controls.
- Higher distress or dependency flags.
- Users treating symbolic output as diagnosis, prophecy, fate, or clinical interpretation.
- Outputs steering users away from appropriate human or clinical support.

## Falsification checklist

This claim is weakened if:

- MC outputs are rated as meaningful but do not improve clarity, actionability, or follow-up usefulness.
- MC increases rumination or emotional flooding in vulnerable contexts.
- Users over-trust symbolic interpretations.
- Plain journaling performs as well as or better than MC.
- MC benefit disappears when raters are blinded to aesthetic presentation.
- Benefits appear only as immediate resonance and do not persist after 24 hours.

## Next proof needed

Run MC-REFLECTIVE-WRITING-BENEFIT-PILOT-01 and publish a pilot ledger with:

- prompt set,
- condition assignment,
- outcome measures,
- adverse-event flags,
- blinded ratings,
- effect estimates,
- failure cases,
- and a promote / revise / retire decision for the therapeutic-benefit language.

Until that pilot exists, MC should use the phrase "reflective orientation scaffold" rather than "therapeutic tool."
