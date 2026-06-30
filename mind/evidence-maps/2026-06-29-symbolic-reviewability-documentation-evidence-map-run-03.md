# Evidence Map — Symbolic Reviewability Requires Structured Documentation

Date: 2026-06-29  
Run: Evidence Engine 03  
Claim ID affected: C-REVIEW-01  
Claim tested: MC symbolic outputs can become externally reviewable if they include structured labels separating reported, inferred, symbolic, unsupported, unknown, and contraindicated statements.

## Claim status before this map

Hypothesis / requirement. Review cards existed, but no independent reviewers had tested whether they could classify MC symbolic outputs without full chat history.

## Why this claim needed stronger evidence

MC produces outputs that may be emotionally vivid, metaphorical, body-oriented, memory-adjacent, or relationally resonant. Those outputs can sound coherent even when their source status is mixed. Without a review layer, a reader may not know which parts came from the user, which were AI inference, which were symbolic atmosphere, and which are unsupported.

The weak assumption was: “A review card makes symbolic output reviewable.”

The narrower claim tested here is: “Structured documentation and label discipline are supported by AI-governance evidence as prerequisites for reviewability, but they do not by themselves prove MC reviewability.”

## Sources checked

### 1. NIST AI Risk Management Framework

Source type: primary / government framework  
Relevant fact: NIST states that the AI RMF is intended to improve the ability to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI systems. It was released on 2023-01-26 through a consensus-driven, open, transparent, collaborative process.  
MC relevance: NIST supports treating reviewability as a lifecycle/evaluation property, not as an aesthetic quality of the output.  
Limit: NIST does not validate MC’s specific labels or review-card format.

Source: https://www.nist.gov/itl/ai-risk-management-framework

### 2. OECD AI Principles

Source type: primary / intergovernmental standard  
Relevant fact: OECD states that its AI Principles promote trustworthy AI that respects human rights and democratic values. It identifies transparency, explainability, robustness, safety, and accountability as values-based principles. OECD also defines AI systems as producing outputs such as predictions, content, recommendations, or decisions that can influence physical or virtual environments.  
MC relevance: Symbolic MC outputs are “content” that can influence a user’s virtual or psychological environment. That makes transparency and accountability relevant even when the output is not a formal decision system.  
Limit: OECD principles are high-level. They do not specify how to label symbolic/reflection statements.

Source: https://oecd.ai/en/ai-principles

### 3. WHO Ethics and Governance of AI for Health

Source type: primary / health-governance guidance  
Relevant fact: WHO states that AI for health must put ethics and human rights at the heart of design, deployment, and use. The report identifies ethical challenges and risks, provides six consensus principles, and recommends governance that keeps stakeholders accountable and responsive to workers, communities, and individuals affected by AI use.  
MC relevance: MC is not a health product, but its body-symbol, memory-sensitive, and emotional-reflection outputs can drift toward health or psychological meaning. WHO supports the need for governance around affected individuals and risk boundaries.  
Limit: This source supports caution and governance, not efficacy of MC or use in clinical contexts.

Source: https://www.who.int/publications/i/item/9789240029200

### 4. Model Cards for Model Reporting

Source type: peer-reviewed research / FAccT 2019, Google researchers  
Relevant fact: Mitchell et al. proposed model cards to disclose intended use, out-of-scope use, performance characteristics, evaluation procedures, and relevant limitations for machine-learning models.  
MC relevance: The model-card idea supports the general pattern: an AI artifact should carry enough context for a downstream reader to understand intended use, limits, and evaluation conditions. MC review cards are analogous but aimed at symbolic outputs rather than deployed models.  
Limit: Model cards document models, not individual symbolic artifacts. The analogy is useful but indirect.

Source: https://arxiv.org/abs/1810.03993

## Fact / inference separation

### Facts supported by sources

- AI governance frameworks emphasize trustworthiness, transparency, accountability, evaluation, and risk management.
- OECD explicitly treats AI-generated content as an AI-system output that may influence environments.
- WHO guidance treats ethics, human rights, accountability, and affected individuals as central to AI governance in health-related contexts.
- Model cards show a documented precedent for making AI artifacts more legible by recording intended use, evaluation conditions, and limitations.

### MC-specific inferences

- Because MC outputs are symbolic content that can influence interpretation, structured review labels are a reasonable governance requirement.
- A statement-label system may reduce source confusion by separating user-reported material from AI inference and symbolic elaboration.
- Review cards may improve external reviewability if reviewers can apply them consistently without full chat history.

### What this evidence does not prove

- It does not prove MC outputs are accurate.
- It does not prove MC outputs improve user decisions or emotional processing.
- It does not prove reviewers can classify MC statements reliably.
- It does not prove the current label set is sufficient.
- It does not prove symbolic outputs are safe in clinical, memory-sensitive, or relational contexts.

## Claim-status update

C-REVIEW-01 should be updated from:

“Hypothesis / requirement.”

to:

“Externally supported governance requirement; implementation unvalidated.”

Meaning:

- External evidence supports the need for structured documentation and transparent limitations.
- MC’s specific review-card implementation still needs direct reviewer testing.

## Evaluation criterion added

### REVIEW-GATE-01 — External symbolic reviewability gate

An MC symbolic artifact passes REVIEW-GATE-01 only if an external reviewer, without access to full chat history, can classify at least 80% of key statements into one of these source-status labels:

- Reported;
- Inferred;
- Symbolic;
- Evidence-grounded;
- Unsupported;
- Unknown;
- Contraindicated.

Additional pass requirements:

1. Reviewer can identify the artifact’s intended use.
2. Reviewer can identify at least one out-of-scope use.
3. Reviewer can identify what evidence would be needed to upgrade the artifact’s claim status.
4. Reviewer can identify any statement that risks clinical, memory, or relational overreach.

Fail conditions:

- Reviewer needs full chat history to classify most statements.
- Vivid symbolic wording is mistaken for factual evidence.
- AI inference is treated as user-reported fact.
- User-reported fact is erased or converted into AI-originated material.
- A clinical, diagnostic, treatment, or memory-certainty claim appears without evidence.

## Falsification checklist

C-REVIEW-01 should be downgraded or retired if:

- Three reviewers cannot reach 80% agreement on label families across five artifacts.
- Review labels increase confidence without improving classification accuracy.
- The review process is too burdensome for practical use.
- The label set fails to catch clinical, memory, or relational boundary crossings.
- Reviewers interpret symbolic content as factual reconstruction despite labels.

## Next proof needed

Run a five-artifact reviewability test:

1. Select five existing MC symbolic outputs.
2. Add source-status labels to each key statement.
3. Give each artifact to three reviewers without full chat history.
4. Measure inter-reviewer agreement.
5. Record false-confidence events, boundary misses, and reviewer burden.
6. Update C-REVIEW-01 based on observed reviewer performance.

Minimum useful result:

- 5 artifacts;
- 3 reviewers;
- 80% classification agreement threshold;
- explicit record of disagreements;
- at least one negative-result entry if any artifact fails.

## Bottom line

Structured review cards are justified as a governance requirement. They are not yet validated as an MC capability. The correct claim is not “MC symbolic outputs are reviewable.” The correct claim is: “MC symbolic outputs should not be treated as reviewable until REVIEW-GATE-01 is passed.”
