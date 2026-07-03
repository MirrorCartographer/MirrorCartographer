# Evidence Map — Symbolic Reflection Trust Calibration Boundary

Run: 95  
Date: 2026-07-03  
Lane: `mind/safety-boundaries/`  
Status: evidence map + claim-status update + test plan

## Claim tested

> Mirror Cartographer can safely use symbolic reflection, mirror-language, and emotionally resonant AI responses as long as the product states that it is not medical, clinical, or diagnostic.

## Why this claim needed stronger evidence

This is a high-leverage weak point because MC intentionally uses symbolic, reflective, and emotionally meaningful language. A disclaimer may reduce legal or interpretive risk, but it does not prove that users actually maintain calibrated trust, understand the difference between reflection and evidence, or avoid over-reliance.

## Evidence found

### Source 1 — NIST AI 600-1, Generative AI Profile, July 2024

NIST identifies **Human-AI Configuration** as a generative AI risk category. It specifically includes arrangements or interactions where a human may anthropomorphize GAI systems or experience algorithmic aversion, automation bias, over-reliance, or emotional entanglement with GAI systems.

NIST also identifies **Information Integrity** risk where generated content may fail to distinguish fact from opinion or fiction or fail to acknowledge uncertainty.

NIST further treats confabulation as confidently presented erroneous or false content that can mislead users when they believe it because of the confident presentation.

Citation: NIST AI 600-1, *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*, July 2024. DOI: https://doi.org/10.6028/NIST.AI.600-1

### Source 2 — Microsoft Research / CHI 2019, Guidelines for Human-AI Interaction

The Microsoft Research human-AI interaction guidelines frame safe AI interaction as an interaction-design problem, not only a policy statement problem. The guidelines include principles such as making clear what the system can do, how well it can do it, when it is uncertain, how users can recover from errors, and how feedback or correction should work over time.

Citation: Amershi et al., *Guidelines for Human-AI Interaction*, CHI 2019 / Microsoft Research.

### Source 3 — Human-AI trust calibration research

Human-AI collaboration research indicates that uncalibrated AI confidence can cause both misuse of overconfident AI and disuse of underconfident AI. Trust-calibration support can help users detect uncertainty, but calibration interventions can also create tradeoffs and require empirical testing.

Citation: Li et al., *Overconfident and Unconfident AI Hinder Human-AI Collaboration*, 2024.

## Fact / inference separation

### Facts

- NIST explicitly recognizes human-AI configuration risks, including anthropomorphization, automation bias, over-reliance, and emotional entanglement.
- NIST treats information integrity as requiring distinction between fact, opinion, fiction, and uncertainty.
- NIST treats confident false generation as a risk because users may believe and act on it.
- Human-AI interaction guidance treats safe interaction as a matter of interface behavior, user understanding, uncertainty communication, correction, feedback, and recovery.
- Research on trust calibration shows that AI confidence presentation can change human use, misuse, and disuse behavior.

### Inferences

- MC's symbolic reflection mode should not be treated as safety-neutral just because it is not clinical or diagnostic.
- A disclaimer is necessary but insufficient evidence of safe use.
- MC needs product-level trust-calibration tests that measure whether users can distinguish symbolic resonance from factual evidence.
- MC should treat emotionally resonant AI outputs as higher-risk than neutral informational outputs because resonance may increase perceived authority even when factual support is weak.

## Claim-status update

### Previous implied claim

> Nonclinical symbolic reflection is safe if MC states that it is not medical, clinical, or diagnostic.

### Updated bounded claim

> Nonclinical symbolic reflection may be usable in MC, but it is not safety-validated unless users can demonstrably distinguish reflection from fact, inference, advice, memory, diagnosis, and evidence under realistic interaction conditions.

### Current status

**Downgrade: design assumption → unvalidated safety hypothesis.**

## Evaluation criterion

### MC-SYMBOLIC-TRUST-CALIBRATION-01

MC symbolic reflection should not be described as safety-validated unless a user test demonstrates that participants can accurately identify:

1. factual statement;
2. inference;
3. symbolic metaphor;
4. emotional reflection;
5. clinical/medical boundary;
6. unsupported claim;
7. AI uncertainty;
8. user-authored memory versus AI-generated reconstruction;
9. advice versus option framing;
10. when to seek human or professional support.

Suggested minimum pass condition for an initial pilot:

- 80% or higher correct classification across the ten categories;
- no critical failures in clinical, crisis, legal, or safety-boundary categories;
- participant-reported trust does not exceed demonstrated accuracy;
- participants can explain in their own words what MC can and cannot know.

These thresholds are provisional and should be revised after pilot data.

## Test plan

### MC-SYMBOLIC-TRUST-PILOT-01

1. Select 20 representative MC outputs:
   - 5 symbolic reflections;
   - 5 factual explanations;
   - 5 mixed fact/inference outputs;
   - 5 safety-boundary outputs.
2. Recruit 5 to 10 initial reviewers.
3. Ask reviewers to label each sentence or paragraph by category:
   - fact;
   - inference;
   - metaphor;
   - advice;
   - unsupported;
   - uncertainty;
   - boundary/referral.
4. Ask reviewers what they would do after reading the output.
5. Compare intended category against reviewer interpretation.
6. Record failures where symbolic language was mistaken for evidence, memory, diagnosis, or instruction.
7. Revise MC language patterns and UI labels before expanding the test.

## Falsification checklist

This claim should be downgraded further if:

- users treat symbolic reflection as factual discovery;
- users treat AI-generated memory reconstruction as verified memory;
- users interpret nonclinical body/somatic language as medical explanation;
- users over-trust MC because the output feels emotionally accurate;
- disclaimers are skipped or not understood;
- users cannot identify uncertainty markers;
- crisis or medical boundaries are missed;
- reviewers disagree strongly on whether an output is metaphor, inference, or claim.

## Next proof needed

Run `MC-SYMBOLIC-TRUST-PILOT-01` on a small sample of MC-style outputs and measure user classification accuracy, over-trust, and boundary recognition.

Until that pilot is run, MC should use the narrower claim:

> Symbolic reflection is a design mode with explicit boundaries, not a validated safety feature.
