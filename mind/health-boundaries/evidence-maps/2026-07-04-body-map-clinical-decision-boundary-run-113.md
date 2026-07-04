# Evidence Map: Body-Map Reflection vs Clinical Decision Support Boundary

Date: 2026-07-04
Run: Evidence Engine 113
Status: Claim narrowed / boundary strengthened

## Claim tested

Mirror Cartographer body maps, symbolic symptom maps, and nervous-system reflection flows can help users understand what is happening in their body and guide next steps.

## Why this claim needed evidence

This claim is useful but high-risk. A body map can help a person organize subjective experience, but it can also create implied medical meaning. If Mirror Cartographer turns sensation, symbol, posture, emotion, or symptom clusters into recommendations, triage, diagnosis, or treatment direction, it crosses from reflection support into health decision support. That requires stronger evidence, clearer uncertainty communication, clinician involvement, and possibly regulatory analysis.

## Claim-status update

Previous loose claim:

> MC body maps can guide users toward better nervous-system or health actions.

Updated bounded claim:

> MC body maps may support personal reflection, symptom organization, question preparation, and communication with clinicians. They should not be treated as diagnosis, treatment recommendation, triage, or clinical decision support unless the relevant feature is separately validated, quality-assured, uncertainty-labeled, and reviewed against medical-device / clinical-decision-support boundaries.

Current status: **Narrowed; not clinically validated.**

## Evidence found

### Facts from high-quality sources

1. FDA clinical decision support guidance distinguishes certain non-device CDS functions from device software and clarifies that FDA digital health policies still apply when software functions meet the definition of a device, including functions intended for patients or caregivers. The guidance was current as of 2026-01-29 and describes FDA's thinking on non-device CDS and device software functions.

Source: FDA, `Clinical Decision Support Software Guidance for Industry and Food and Drug Administration Staff`, January 2026.
URL: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software

2. WHO's ethics and governance guidance for AI in health says AI may support diagnosis, treatment, health research, and public-health functions, but ethics and human rights must be central to design, deployment, and use. WHO also identifies ethical challenges and risks and recommends governance that holds stakeholders accountable to healthcare workers and affected communities/individuals.

Source: WHO, `Ethics and governance of artificial intelligence for health`, 2021.
URL: https://www.who.int/publications/i/item/9789240029200

3. NICE shared decision-making guidance defines shared decision making as a collaborative process between a person and healthcare professional. It recommends using reliable, high-quality sources, openly discussing risks/benefits/consequences, correcting misconceptions, using decision aids only as part of a broader toolkit, and making uncertainty clear.

Source: NICE NG197, `Shared decision making`, published 2021-06-17.
URL: https://www.nice.org.uk/guidance/ng197/chapter/Recommendations

4. NICE recommends patient decision aids only when they are quality-assured, evidence-based, relevant to the discussion, and relevant to the clinical setting. It also recommends regular review/update of decision aids and multiple formats to meet user needs.

Source: NICE NG197, patient decision-aid recommendations.
URL: https://www.nice.org.uk/guidance/ng197/chapter/Recommendations

5. GRADE is an established methodology used by many organizations to assess certainty of evidence and strength of recommendations. GRADE-related infrastructure exists specifically to train, disseminate, and support guideline and systematic-review methods.

Source: GRADE Working Group.
URL: https://www.gradeworkinggroup.org/

## Fact / inference separation

### Facts

- Clinical and health decision support is regulated and/or governed differently from personal reflection software.
- Health AI governance requires explicit attention to ethics, human rights, accountability, and affected users.
- Shared decision making requires reliable information, risk/benefit/consequence communication, misconception correction, and clear uncertainty.
- Patient decision aids should be quality-assured, evidence-based, context-relevant, and periodically updated.
- Evidence certainty and recommendation strength should be explicit rather than implied.

### Inferences for Mirror Cartographer

- MC can safely remain in a lower-risk category only if body maps are framed and engineered as reflective organization tools, not medical interpretation engines.
- Any feature that suggests a diagnosis, urgency level, likely cause, treatment, medication/supplement action, or body intervention should be treated as a higher-risk clinical decision-support feature until proven otherwise.
- Symbolic language increases the need for clear labeling because metaphor can feel like hidden medical meaning.
- MC should require a health-boundary layer before expanding body-map or nervous-system modules.

## Evidence map

| Feature behavior | Evidence status | Risk | Allowed current framing | Disallowed without validation |
|---|---:|---|---|---|
| Let user mark sensation locations | Plausible usability feature | Low to moderate | Personal tracking / reflection | Diagnosis from location |
| Translate sensation into metaphor | Plausible reflection feature | Moderate | User-owned symbolic language | Implied causal medical meaning |
| Suggest questions for clinician | Supported by shared-decision principles if source-bounded | Moderate | Prepare questions; ask clinician | Replace clinician discussion |
| Rank likely causes | Not validated | High | Not allowed currently | Differential diagnosis |
| Recommend intervention | Not validated | High | General safety boundary only | Treatment plan / rehab / medication / supplement |
| Detect urgent danger | Not validated | High | Direct users to emergency services for red flags from authoritative sources only | Custom triage model |
| Track changes over time | Plausible support feature | Moderate | User journal / trend observation | Clinical monitoring claim |

## Evaluation criterion added

### MC-HEALTH-BOUNDARY-01: Body-map clinical support boundary

Every body-map, symptom-map, nervous-system, or pet-health-adjacent artifact must label its output as one of four classes:

1. **Reflection only** — organizes subjective experience; no medical meaning inferred.
2. **Communication support** — helps prepare notes/questions for a clinician; no recommendation.
3. **Evidence-backed general information** — cites authoritative sources and states uncertainty.
4. **Clinical decision support** — diagnosis, triage, treatment, monitoring, or risk ranking. This class is not allowed in production without separate validation, expert review, risk controls, and regulatory review.

A body-map artifact fails the criterion if it:

- implies diagnosis from metaphor or location,
- recommends treatment or body intervention,
- ranks causes without validated evidence,
- hides uncertainty,
- fails to distinguish user observation from system inference,
- or gives emergency/triage guidance without authoritative source grounding.

## Falsification checklist

The claim that a body-map feature is safe for reflective use is weakened or falsified if any test user:

- interprets the output as a diagnosis,
- delays care because of the output,
- believes the system knows the biological cause of a symptom,
- cannot distinguish metaphor from medical claim,
- cannot identify what is user-provided vs system-inferred,
- reports increased certainty unsupported by evidence,
- or follows a treatment/action recommendation not reviewed by a clinician.

## Test plan

### MC-BODYMAP-BOUNDARY-PILOT-01

Test 12 body-map outputs across three modes:

1. symbolic reflection,
2. neutral tracking,
3. clinician-question preparation.

For each output, reviewers must answer:

- What did the user report?
- What did the system infer?
- What is metaphor?
- What is fact?
- What is uncertain?
- Is any diagnosis implied?
- Is any treatment or triage implied?
- What should be discussed with a clinician?

Pass condition:

- At least 90% of reviewers correctly separate observation, metaphor, inference, uncertainty, and medical boundary.
- Zero reviewers interpret the artifact as diagnosis or treatment guidance.
- Every output includes a clear path to clinician discussion when symptoms are medical, persistent, severe, or worsening.

## Next proof needed

`MC-BODYMAP-BOUNDARY-PILOT-01`: create a small corpus of real-looking but synthetic MC body-map outputs and test whether users can distinguish reflection, metaphor, fact, inference, uncertainty, and clinical boundary. If users misread symbolic maps as medical interpretation, the body-map module must be redesigned before expansion.

## Bottom line

Body mapping remains a promising MC interface for organizing embodied experience, but its evidentiary status is reflective and communicative, not clinical. Stronger proof is needed before MC can claim body maps improve health decisions, nervous-system outcomes, or treatment direction.
