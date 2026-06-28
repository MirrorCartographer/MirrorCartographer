# Evidence Map: Symbolic Visual Authority Risk

Date: 2026-06-28
Status: needs empirical validation
Public-safe scope: this artifact avoids private user details and treats Mirror Cartographer as a general reflective AI / symbolic cognition interface.

## Claim tested

Mirror Cartographer can use symbolic visuals to show memory scope, uncertainty, and future influence without making uncertain or AI-inferred interpretations feel more true, permanent, diagnostic, or identity-defining than they are.

## Why this claim is weak

The current MC architecture assumes symbolic mapping can make memory influence more intuitive than a conventional disclosure dashboard. That may be true, but it is not established. Visual polish, spatial placement, ritual language, emotional salience, and persistent memory labels could increase perceived authority even when the underlying interpretation is uncertain.

## Evidence reviewed

### Stronger evidence / fact-level support

1. NIST AI RMF supports managing AI risk across design, development, use, and evaluation, and frames trustworthiness as something that must be incorporated into the lifecycle rather than asserted by interface language alone.
   Source: https://www.nist.gov/itl/ai-risk-management-framework

2. NIST’s AI RMF Playbook is explicitly a set of suggested actions, not a universal checklist, and it organizes governance around Govern, Map, Measure, and Manage. For MC, this supports treating symbolic memory visualization as a measurable design hypothesis, not a completed safety solution.
   Source: https://airc.nist.gov/airmf-resources/playbook/

3. Human-AI explanation studies show that explanations do not automatically reduce overreliance. Verification cost, task difficulty, and the user’s ability to apply their own intuition matter. This directly weakens any claim that showing “why” MC made an interpretation is enough to preserve agency.
   Source: https://arxiv.org/abs/2212.06823

4. Research on human intuition in AI decision-making found that some explanation styles can increase overreliance when the AI is wrong, while other formats can better support user override. This matters because MC’s symbolic visuals are a form of explanation and could amplify or reduce overreliance depending on format.
   Source: https://arxiv.org/abs/2301.07255

5. Recent provenance research argues that C2PA-style provenance systems are promising but can fall short of their security goals and may mislead users if relied on prematurely in high-stakes settings. This supports a cautionary principle: provenance-style labels in MC should not be presented as proof of truth or authorship certainty.
   Source: https://arxiv.org/abs/2604.24890

6. Research on desynchronized provenance and watermarking demonstrates that independently valid provenance signals can conflict. This supports a design requirement that MC should show conflicting evidence and uncertainty, not collapse all evidence into a single trust badge.
   Source: https://arxiv.org/abs/2603.02378

### Inference-level support

1. If symbolic visuals behave like explanations, then they can create both agency support and authority risk. The literature supports this as a plausible risk, but it does not directly test MC-like symbolic reflective interfaces.

2. If provenance labels can be mistaken for trust guarantees in media systems, then MC memory/provenance labels may also be mistaken for truth guarantees in reflective systems. This is an analogy, not direct evidence.

3. If users already bring strong intuition, emotional salience, or identity concerns into reflective AI use, then beautiful or persistent symbolic map layers may feel more “real” than plain text disclaimers. This is plausible but requires user testing.

## Claim-status update

Previous implicit claim: symbolic visualization can safely communicate memory scope and uncertainty.

Updated claim: symbolic visualization is a promising interface hypothesis, but it carries an authority-risk failure mode. MC must prove that symbolic memory visuals increase user understanding and control without increasing misplaced certainty, identity fixation, or overreliance.

Status label: plausible-but-unproven / safety-critical UI hypothesis.

## Evaluation criterion: Symbolic Authority Calibration Criterion

A symbolic memory or uncertainty visual passes only if users can correctly answer the following after using it:

1. What part came from the user’s original input?
2. What part was AI inference?
3. What part was stored as memory?
4. What future outputs can that memory influence?
5. What is uncertain, contested, or weakly evidenced?
6. How can the user weaken, delete, quarantine, or reverse the memory influence?
7. Whether the visual is a map/proposal rather than a diagnostic, identity label, or objective truth claim.

## Required interface behavior

1. No single “truth badge” for symbolic interpretations.
2. Separate visual channels for source, confidence, persistence, and future influence.
3. Show conflict and uncertainty as first-class map objects, not hidden footnotes.
4. Make user override visible and easy.
5. Memory influence must be inspectable before it affects later interpretations.
6. Visual beauty must not substitute for evidence strength.
7. High-impact or identity-adjacent interpretations need extra friction and reversibility.

## Falsification checklist

The design fails if any of the following occur in user tests:

- Users treat AI-inferred symbols as self-knowledge rather than suggestions.
- Users cannot distinguish memory-derived interpretation from current-session inference.
- Users believe a provenance/source label means the interpretation is true.
- Users feel that deleting or weakening a memory means they are “denying” themselves.
- Users rate confidence higher for the same interpretation when it is shown in a polished symbolic visual than when shown in plain text.
- Users cannot identify how to reverse a memory’s future influence.
- Users defer to MC despite noticing a contradiction in their own experience.

## Test plan: symbolic-authority-calibration-testset-v0.1

### Conditions

A. Plain text disclosure only
B. Dashboard-style memory disclosure
C. Symbolic map visualization only
D. Hybrid symbolic map plus audit drawer

### Test cases

Use 32 public-safe fictional reflective prompts across four classes:

1. Low-stakes symbolic preference
2. Ambiguous emotional interpretation
3. Identity-adjacent interpretation
4. Action-adjacent interpretation

Each case should include:

- one user-originated symbol
- one AI-inferred meaning
- one intentionally uncertain feature
- one possible memory effect
- one contradiction or missing context
- one reversible control

### Measurements

1. Source attribution accuracy
2. Memory influence comprehension
3. Uncertainty recall
4. Override success
5. Overreliance rate when interpretation is intentionally wrong
6. Perceived authority rating
7. Flow cost rating
8. User agency rating

### Minimum pass threshold

Symbolic visualization is not accepted as safer than dashboard disclosure unless it improves comprehension or agency without increasing misplaced certainty. If symbolic visuals raise perceived authority while leaving comprehension unchanged, they must be redesigned or restricted to low-impact contexts.

## Next proof needed

Build and run a comparison between plain disclosure, dashboard disclosure, symbolic map, and hybrid symbolic map plus audit drawer. The decisive question is whether symbolic visualization improves memory-scope comprehension and reversibility without increasing false certainty or identity-fixation.