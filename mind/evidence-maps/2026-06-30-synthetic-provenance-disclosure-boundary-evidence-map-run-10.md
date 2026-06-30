# Evidence Map Run 10 — Synthetic Provenance Disclosure Boundary

Date: 2026-06-30  
Status: evidence map + evaluation criterion + falsification checklist  
Claim area: Mirror Cartographer public artifacts / AI opportunity proof packets / GitHub mind provenance

## Claim tested

**C-SYNTH-PROV-01:** Mirror Cartographer needs an explicit synthetic/provenance disclosure boundary for AI-generated, AI-transformed, and co-created artifacts before those artifacts are used as public proof, hiring evidence, research evidence, or externally reviewable MC outputs.

## Why this weak point was selected

MC already contains provenance, authorship, reviewability, negative-result, and opportunity-proof structures. A remaining weak point is that a polished artifact can blur four materially different things:

1. user-originated content;
2. AI-originated content;
3. AI-transformed user content;
4. co-created interpretation or synthesis.

That blur matters because MC artifacts may be used as evidence of skill, system value, research claims, or public-facing symbolic/reflection work. If origin and transformation are not disclosed, reviewers may over-credit, misattribute, or misunderstand what the artifact proves.

## Source set

### Primary / high-quality sources consulted

1. **NIST AI Risk Management Framework 1.0 / NIST AI RMF page**  
   URL: https://www.nist.gov/itl/ai-risk-management-framework  
   Relevant fact: NIST frames AI risk management as lifecycle work intended to improve the ability to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems. NIST also maintains an AI RMF Playbook and released a Generative AI Profile in 2024.

2. **OECD AI Principles overview**  
   URL: https://oecd.ai/en/ai-principles  
   Relevant fact: OECD's AI Principles include transparency and explainability, robustness/security/safety, accountability, human rights, democratic values, fairness, and privacy. The principles were initially adopted in 2019 and updated in May 2024.

3. **ISO/IEC 42001:2023 AI management system page**  
   URL: https://www.iso.org/standard/81230.html  
   Relevant fact: ISO/IEC 42001 specifies requirements for establishing, implementing, maintaining, and continually improving an artificial intelligence management system. The public ISO page confirms the standard is for AI management systems; secondary descriptions indicate it emphasizes documented information, lifecycle processes, impact assessment, and data governance.

4. **Model Cards for Model Reporting**  
   Citation target: Mitchell et al., FAT* 2019.  
   URL: https://doi.org/10.1145/3287560.3287596  
   Relevant fact: Model cards were proposed to standardize documentation of model details, intended uses, performance, limitations, and ethical considerations so downstream users can make more informed decisions.

5. **Partnership on AI Responsible Practices for Synthetic Media**  
   URL: https://partnershiponai.org/responsible-practices-for-synthetic-media/  
   Relevant fact: PAI's synthetic-media work addresses disclosure, consent, provenance, and responsible creation/distribution norms for AI-generated or AI-altered media. The site was not fully accessible in this run, so it is used only as a directional high-quality source category, not as a quoted authority.

## Fact / inference separation

### Facts supported by sources

- NIST treats AI risk management as a lifecycle practice, not a one-time artifact check.
- NIST explicitly positions the AI RMF as a way to incorporate trustworthiness into design, development, use, and evaluation.
- OECD's AI principles include transparency, explainability, accountability, human-rights alignment, robustness, safety, fairness, and privacy.
- ISO/IEC 42001 exists as an AI management-system standard for organizations developing, providing, or using AI systems.
- Model cards are a recognized documentation pattern for communicating system purpose, intended use, limitations, and evaluation context.
- Synthetic-media governance work treats disclosure/provenance as important when generated or altered content may affect interpretation, trust, attribution, consent, or accountability.

### MC-specific inferences

- If MC produces polished artifacts without origin/transformation labels, reviewers may confuse AI writing skill, user insight, system architecture, and external evidence strength.
- Authorship ambiguity is especially risky for AI opportunity work because a hiring or funding reviewer may need to distinguish demonstrated user skill from AI-assisted packaging.
- A provenance disclosure boundary should apply before claim upgrades, public use, job-application use, or safety-sensitive symbolic/health/relational use.
- Disclosure alone is not enough. The label must say what changed: drafted, edited, summarized, inferred, transformed, designed, evaluated, or source-grounded.

### What this evidence does not prove

- It does not prove MC artifacts are misleading today.
- It does not prove MC's proposed disclosure boundary will improve reviewer understanding.
- It does not prove a single disclosure format is sufficient across symbolic reflection, AI governance, animal-health organization, job applications, and public websites.
- It does not prove legal compliance with any jurisdiction's AI disclosure rules.

## Claim-status update

**Previous implied status:** provenance/authorship boundary recognized, but synthetic/co-created disclosure not separately gated.  
**New status:** C-SYNTH-PROV-01 becomes **supported governance-design requirement; implementation unvalidated**.

Confidence: **moderate for the need; low for the specific MC implementation until tested.**

## Evaluation criterion: SYNTH-PROV-GATE-01

Before an MC artifact can be used as public proof, hiring evidence, external research evidence, or a claim-upgrade source, it must include a disclosure block answering:

1. **Origin:** What parts came from the user, AI, external sources, or prior repo artifacts?
2. **Transformation:** What did AI do: draft, summarize, classify, infer, reframe, design, evaluate, or generate?
3. **Evidence basis:** Which statements are source-grounded, internally inferred, symbolic, speculative, or untested?
4. **Attribution:** What skill, insight, or decision should be attributed to the user, the AI, the system architecture, or external sources?
5. **Use boundary:** What may this artifact be used to prove, and what may it not be used to prove?
6. **Reviewer reconstruction:** Could a reviewer explain the artifact's origin and evidence chain without reading the chat history?

## Pass / fail rule

An artifact passes SYNTH-PROV-GATE-01 only if a reviewer can correctly answer all six questions above from the artifact itself.

An artifact fails if any of the following are true:

- It implies user-only authorship for AI-generated or AI-transformed material.
- It implies AI-only authorship for user-provided insight, taste, goals, or constraints.
- It uses polished writing as evidence of truth.
- It uses symbolic resonance as evidence of factual accuracy.
- It uses a GitHub commit as evidence of validation.
- It cannot separate source-grounded claims from internal inference.
- It is intended for hiring or public proof but does not say what the user personally demonstrated.

## Falsification checklist

C-SYNTH-PROV-01 should be downgraded or revised if testing shows that:

1. reviewers already reconstruct origin and transformation accurately without the disclosure block;
2. disclosure blocks reduce clarity without improving attribution accuracy;
3. the format creates bureaucratic overhead without changing claim status, reviewer confidence, or artifact misuse;
4. reviewers still misattribute authorship after reading the disclosure;
5. the same label structure cannot survive across at least three MC artifact types.

## Proposed test plan

### TEST: SYNTH-PROV-REVIEW-01

Sample:

- 5 public-facing MC artifacts;
- 5 opportunity-proof artifacts;
- 5 symbolic/reflection artifacts;
- 5 evidence maps or claim-registry artifacts.

Procedure:

1. Reviewers first inspect each artifact without a disclosure block.
2. Reviewers answer attribution questions: user contribution, AI contribution, source contribution, claim strength, and use boundary.
3. Add a SYNTH-PROV-GATE-01 disclosure block.
4. Reviewers answer the same questions again.
5. Measure whether attribution accuracy and claim-boundary accuracy improve.

Pass threshold:

- At least 80% reviewer agreement on origin and transformation after disclosure.
- At least 70% reduction in unsupported claim upgrades caused by authorship/provenance confusion.
- No more than 20% of reviewers report that the block makes the artifact harder to understand.

## Immediate implementation recommendation

Add a short provenance disclosure block to every new external-use artifact:

- **User contribution:** goals, constraints, taste, lived-context inputs, acceptance/rejection decisions.
- **AI contribution:** drafting, synthesis, structure, source research, inference, formatting.
- **External sources:** cited source list and what they support.
- **Untested claim:** what the artifact does not yet prove.
- **Allowed use:** what the artifact may reasonably be used as evidence for.

## Next proof needed

Run SYNTH-PROV-REVIEW-01 on 20 existing MC artifacts. The next upgrade requires measured improvement in reviewer attribution accuracy, not just the existence of disclosure language.
