# Evidence Map: Aesthetic / Symbolic Interface vs. Actual Usability

Date: 2026-07-02
Run: Evidence Engine run 70
Status: claim boundary added; MC-specific validation still missing

## Claim tested

C-AESTHETIC-SYMBOLIC-USABILITY-01R

> Mirror Cartographer's aesthetic, symbolic, emotionally resonant interface makes it easier, more useful, or more usable for users.

## Why this claim matters

Mirror Cartographer repeatedly treats beauty, symbolic density, visual atmosphere, and emotional resonance as part of its value proposition. That may be directionally useful, but it creates a known evidence risk: users may perceive a beautiful or meaningful interface as easier to use even when task success, comprehension, safety, accessibility, or outcome quality have not been demonstrated.

This claim therefore needs a boundary: aesthetic resonance can be a design hypothesis, not a usability proof.

## Evidence reviewed

### 1. NIST AI RMF: trustworthiness must be incorporated into design, development, use, and evaluation

Source: NIST AI Risk Management Framework page, updated 2026-04-07 / 2026-03-27 development page.

Relevant finding:
- NIST describes the AI RMF as a framework for managing risks to individuals, organizations, and society.
- It is intended to improve the ability to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems.
- NIST also released a Generative AI Profile in 2024 for generative-AI-specific risk management.

Boundary implication for MC:
- Trustworthy or useful AI interaction cannot be inferred from design intent, aesthetic presentation, or symbolic fit alone.
- MC needs evaluation evidence attached to its interface claims.

Source URL:
- https://www.nist.gov/itl/ai-risk-management-framework

### 2. ISO 9241 / usability framing: usability depends on specified users, goals, and context of use

Source reviewed through indexed summaries of ISO 9241-11 / 9241-210 definitions and human-centered design references.

Relevant finding:
- Usability is commonly defined around specified users achieving specified goals with effectiveness, efficiency, and satisfaction in a specified context of use.
- User experience includes subjective perceptions and emotional responses, but subjective UX is not identical to objective task performance.

Boundary implication for MC:
- A beautiful symbolic interface can improve satisfaction or perceived approachability, but MC still needs evidence for effectiveness, efficiency, comprehension, accessibility, and safe task completion in its intended contexts.

Source anchors:
- ISO 9241-11 / ISO 9241-210 summaries and human-centered design references.
- Public summary: https://en.wikipedia.org/wiki/Usability
- Public summary: https://en.wikipedia.org/wiki/User_experience

### 3. Aesthetic-usability effect: beauty can increase perceived usability

Source: Kurosu & Kashimura, CHI 1995; Sonderegger & Sauer, Applied Ergonomics 2010; summarized in high-level indexed sources.

Relevant finding:
- Aesthetic interfaces can be perceived as more usable.
- Attractive designs may generate more positive attitudes and greater tolerance of usability issues.
- Perceived usability is therefore vulnerable to aesthetic bias.

Boundary implication for MC:
- If MC users say an interface feels easier, safer, deeper, or more meaningful, that may partly reflect the aesthetic-usability effect.
- Perceived resonance must be separated from task success and comprehension.

Source anchors:
- Kurosu, M. & Kashimura, K. (1995). Apparent usability vs. inherent usability: experimental analysis on the determinants of the apparent usability. CHI '95 companion.
- Sonderegger, A. & Sauer, J. (2010). The influence of design aesthetics in usability testing: Effects on user performance and perceived usability. Applied Ergonomics.
- Public summary: https://en.wikipedia.org/wiki/Aesthetic%E2%80%93usability_effect

### 4. HCI trust research: human-AI trust must be calibrated and context-specific

Source: Bach et al. 2023 systematic literature review of user trust in AI-enabled systems.

Relevant finding:
- User trust in AI systems is influenced by socio-ethical considerations, technical/design features, and user characteristics.
- The review emphasizes calibrating the user-AI relationship rather than simply increasing trust.

Boundary implication for MC:
- Symbolic beauty may increase trust or attachment. That is not automatically good.
- MC must measure whether trust is calibrated: users should understand uncertainty, limits, and the difference between reflection and fact.

Source URL:
- https://arxiv.org/abs/2304.08795

## Fact vs. inference

### Supported by evidence

- Aesthetic design can affect perceived usability and user attitude.
- Perceived usability is not the same as actual usability.
- Usability should be evaluated against specific users, goals, tasks, and contexts.
- Human-AI trust should be calibrated, not merely maximized.
- Trustworthiness requires evaluation, documentation, and risk management, not just appealing design.

### Inference / not yet demonstrated for Mirror Cartographer

- MC's symbolic visual layer improves user comprehension.
- MC's aesthetic interface improves actual task completion.
- MC's emotional resonance improves safe self-reflection.
- MC's symbolic density helps rather than overwhelms users.
- MC's interface increases calibrated trust rather than over-trust.
- MC's design works across accessibility needs, cognitive styles, cultures, and vulnerable states.

## Claim-status update

C-AESTHETIC-SYMBOLIC-USABILITY-01R:

**Partially supported as a design hypothesis; unvalidated as an effectiveness, safety, accessibility, or usability claim.**

Aesthetic-symbolic design may improve perceived usability, approachability, or emotional engagement. However, because aesthetics can bias perceived usability, MC must not treat beauty, resonance, or symbolic richness as evidence that the system is actually clear, safe, accessible, or useful.

## Evaluation criterion added

### MC-AESTHETIC-USABILITY-BOUNDARY-GATE-01

Every major MC interface, glyph system, symbolic page, or reflection flow must separate five dimensions:

1. Aesthetic resonance
   - Does the user find it beautiful, meaningful, atmospheric, or emotionally fitting?

2. Comprehension
   - Can the user accurately explain what the interface element means and what action is expected?

3. Task success
   - Can the user complete the intended action without help?

4. Safety / boundary recognition
   - Does the user understand what MC can and cannot conclude?
   - Does the user understand when the output is reflective rather than factual, diagnostic, or authoritative?

5. Accessibility
   - Can the interface be used with screen readers, keyboard navigation, low vision settings, and non-visual alternatives?

A claim may not move from "design hypothesis" to "supported" unless at least dimensions 2-5 are tested separately from dimension 1.

## Test plan

### MC-AESTHETIC-USABILITY-PILOT-01

Sample:
- 10 to 15 users for first formative pass.
- Include at least 3 users using accessibility tooling or low-visual-load mode.
- Include at least 3 users who have never seen MC before.

Materials:
- 5 MC interface states:
  1. Symbolic landing page.
  2. Body-map entry flow.
  3. Glyph interpretation page.
  4. No-save/private mode explanation.
  5. Safety/limits explanation.

Conditions:
- Aesthetic-rich version.
- Plain/neutral version with the same functional content.

Measures:
- First-click success.
- Task completion rate.
- Time on task.
- Comprehension score.
- Misinterpretation count.
- User confidence score.
- Calibrated-trust check.
- Screen-reader pass/fail notes.
- Emotional resonance rating.

Required comparison:
- If aesthetic-rich version scores higher on resonance but not comprehension/task success, the aesthetic claim remains limited.
- If aesthetic-rich version increases confidence while increasing misinterpretation, it becomes a risk flag.
- If plain version performs better on safety comprehension, symbolic design must be revised.

## Falsification checklist

The claim "MC's aesthetic-symbolic interface improves usability" is weakened or falsified if testing shows any of the following:

- Users like the interface but cannot explain what to do.
- Users report high trust while misunderstanding MC's limits.
- Symbolic pages increase time on task without increasing comprehension.
- Users confuse reflective outputs with factual, diagnostic, or authoritative outputs.
- Accessibility users cannot access the same meaning as visual users.
- Plain-language alternatives outperform symbolic versions on safety comprehension.
- Users remember the atmosphere but not the action, boundary, or meaning.

## Current evidence grade

Design plausibility: Moderate
Direct MC usability evidence: None yet
Risk of overclaim: High
Implementation status: Unvalidated
Recommended public wording: "Designed for emotional-symbolic engagement; usability and accessibility are being tested."
Avoid wording: "The symbolic interface makes MC easier to use" unless supported by pilot results.

## Next proof needed

Run MC-AESTHETIC-USABILITY-PILOT-01 and publish a usability ledger comparing aesthetic-rich and plain versions across comprehension, task success, calibrated trust, safety-boundary recognition, and accessibility.
