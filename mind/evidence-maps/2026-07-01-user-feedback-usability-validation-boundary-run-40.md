# Evidence Map — User Feedback / Usability Validation Boundary

Date: 2026-07-01
Run: Evidence Engine run 40
Claim ID: C-USER-FEEDBACK-VALIDATION-01R

## Claim tested

Weak claim/assumption: **Positive user feedback, resonance, satisfaction, or subjective usability reports are enough to validate Mirror Cartographer's usefulness.**

## Bottom line

**Status: partially supported as usability evidence; not supported as proof of truth, therapeutic benefit, safety, or broad usefulness.**

User feedback can support claims about acceptability, perceived usefulness, friction, satisfaction, comprehension, and subjective fit. It cannot, by itself, validate that MC outputs are accurate, clinically beneficial, safe under stress, generalizable across users, or causally responsible for improved outcomes.

## Evidence found

### High-quality / primary sources

1. **NIST AI RMF 1.0**
   - Supports lifecycle test, evaluation, verification, and validation (TEVV) for AI systems.
   - Treats trustworthy AI as multi-dimensional: validity, reliability, safety, security, accountability, transparency, explainability, privacy, and fairness.
   - Implication: user feedback is one input to measurement, not a substitute for system validation.
   - Source: NIST AI 100-1, *Artificial Intelligence Risk Management Framework (AI RMF 1.0)*, 2023.

2. **NIST AI RMF Generative AI Profile**
   - Recommends structured human feedback exercises using representative AI actors and separating evaluators from developers where possible.
   - Implication: human feedback must be structured, representative, and independence-aware to count as stronger evidence.
   - Source: NIST AI 600-1, *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*, 2024.

3. **NIST SP 1270: Managing Bias in AI**
   - Frames AI risk as socio-technical and emphasizes that human, systemic, and computational bias can enter across the lifecycle.
   - Implication: user satisfaction can itself be biased by framing, authority cues, prior expectations, emotional state, or confirmation loops.
   - Source: NIST SP 1270, *Towards a Standard for Identifying and Managing Bias in Artificial Intelligence*, 2022.

4. **ISO/IEC 25010 software quality model**
   - Defines software quality characteristics including usability and quality-in-use.
   - Usability includes effectiveness, efficiency, and satisfaction in a specified context of use.
   - Implication: satisfaction is a valid quality signal only when paired with defined users, tasks, context, and measurable goals.
   - Source: ISO/IEC 25010:2011, *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models*.

## Fact vs inference

### Supported by evidence

- Subjective feedback can be legitimate evidence for satisfaction, perceived usability, acceptability, and perceived usefulness.
- Stronger evaluation requires defined context of use, representative users, structured tasks, measurable criteria, and lifecycle TEVV.
- Human feedback can be biased and should not be treated as objective validation without safeguards.
- For generative AI systems, structured human feedback is stronger when evaluators are representative of the context of use and not directly responsible for the system being evaluated.

### Inference / not yet demonstrated for MC

- MC currently improves user outcomes beyond subjective resonance.
- MC outputs are accurate because users report that they feel accurate.
- MC is safe for emotionally intense use because a user likes or trusts it.
- MC usefulness generalizes beyond Charity / the originating context.
- MC's symbolic interface produces durable benefit rather than momentary engagement, relief, or narrative coherence.

## Claim-status update

Retire or downgrade:

- **C-USER-FEEDBACK-VALIDATION-01**: "Positive user feedback validates MC usefulness."

Replace with:

- **C-USER-FEEDBACK-VALIDATION-01R**: "User feedback is valid evidence for perceived usability, resonance, satisfaction, and friction detection, but it does not validate truth, safety, therapeutic benefit, causality, or broad product usefulness without structured evaluation and independent outcome evidence."

Confidence: **moderate for the boundary rule; low for MC implementation quality because no structured MC user-feedback dataset has been audited in this artifact.**

## Evaluation criterion: USER-FEEDBACK-EVIDENCE-GATE-01

A user-feedback claim may raise confidence only if it records:

1. **Feedback type**
   - satisfaction
   - perceived usefulness
   - comprehension
   - emotional resonance
   - usability friction
   - task success
   - reported outcome

2. **Context of use**
   - user type
   - task
   - session mode
   - emotional intensity level when known
   - device/accessibility context
   - one-off vs persistent profile

3. **Measurement design**
   - structured question or rubric
   - free-text feedback separated from ratings
   - pre/post distinction if outcome claims are made
   - task success metric if effectiveness is claimed
   - time/friction metric if efficiency is claimed

4. **Bias controls**
   - no leading prompt language
   - source of feedback recorded
   - developer/user role conflict noted
   - confirmation-loop risk noted
   - negative or neutral feedback preserved

5. **Allowed confidence update**
   - feedback may support acceptability/usability claims
   - feedback may identify problems
   - feedback may generate hypotheses
   - feedback may not prove clinical, factual, causal, or generalizable claims

## Falsification checklist

A feedback-based MC claim fails if any item is true:

- It uses "felt true," "resonated," or "helpful" as evidence of factual accuracy.
- It uses a single user's report as evidence of broad product-market or clinical value.
- It lacks context of use.
- It lacks the exact prompt/output being evaluated.
- It omits negative, confused, or contradictory feedback.
- It treats engagement as benefit.
- It treats relief as safety.
- It treats satisfaction as task success.
- It does not separate user-stated meaning from assistant-inferred meaning.
- It raises confidence in a health, therapy, or outcome claim without independent evidence.

## Test plan: USER-FEEDBACK-VALIDATION-GATE-01

Audit 30 prior MC interactions or artifacts.

For each artifact, score:

- exact user feedback present: yes/no
- feedback category: resonance, usability, comprehension, friction, task success, outcome claim
- claim made from feedback
- claim category allowed: yes/no
- unsupported leap present: yes/no
- leading language risk: none/low/medium/high
- missing negative evidence: yes/no/unknown
- confidence change justified: yes/no

Publish a ledger with:

- percentage of feedback claims that stay inside usability/acceptability boundaries
- percentage that overclaim truth, causality, safety, or broad usefulness
- examples of proper confidence updates
- examples requiring downgrade
- revised wording for each overclaim

## Next proof needed

Run **USER-FEEDBACK-VALIDATION-GATE-01** against 30 prior MC outputs and publish a feedback-to-claim ledger. The next proof must show whether MC's repository language actually respects the boundary between subjective feedback and validated usefulness.

Until that audit exists, MC may say: **"users report resonance / perceived usefulness in specific contexts"** only when the supporting feedback exists. It should not say: **"validated," "proven useful," "safe," "accurate," or "therapeutically effective"** based on feedback alone.
