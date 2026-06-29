# Negative Result Ledger Evidence Map

Date: 2026-06-29
Status: Supported design principle; MC-specific effect unproven

## Claim tested

Mirror Cartographer's Evidence Engine needs a first-class Negative Result Ledger so failed, null, contradictory, or inconclusive tests are preserved instead of being silently excluded from the GitHub mind.

This tests a weak point in the current evidence workflow: evidence maps are being added mostly when a claim can be improved, clarified, or partially supported. That creates a risk that the repository becomes a positive-results archive rather than an honest epistemic record.

## Claim status update

Previous status: implicit gap / unexamined process risk.

Updated status: supported as a methodological safeguard by metascience, reporting-bias literature, AI risk-management guidance, and incident-learning practice; not yet validated for Mirror Cartographer.

Confidence: moderate for the general principle; low for the claim that the proposed MC-specific ledger will improve decisions or architecture quality.

## Evidence found

### Fact: selective reporting can distort accumulated evidence

Publication bias and selective reporting are established problems in science. A large meta-research literature shows that positive results are more likely to become visible than null, negative, or failed results. This can cause a body of evidence to look stronger than the underlying tests justify.

Source examples:
- Nissen, Magidson, Gross, and Bergstrom, "Publication bias and the canonization of false facts" (eLife / arXiv), 2016: positive-result publication bias can allow false claims to become accepted when negative results are underreported.
  URL: https://arxiv.org/abs/1609.00494
- Bartoš et al., "Footprint of publication selection bias on meta-analyses in medicine, environmental sciences, psychology, and economics," 2022: publication selection bias can substantially change estimated effects and confidence across fields.
  URL: https://arxiv.org/abs/2208.12334
- Ingre, "Recent reproducibility estimates indicate that negative evidence is observed over 30 times before publication," 2016: estimates suggest negative evidence may be observed many times before a negative result becomes visible.
  URL: https://arxiv.org/abs/1605.06414

### Fact: preregistration and Registered Reports exist partly to prevent result-dependent reporting

Registered Reports move review of the question and method before results are known. The point is not that every project needs formal academic preregistration, but that the credibility of a claim improves when the test plan is recorded before the outcome and results are reported regardless of direction.

Source examples:
- Nosek and Lakens, "Registered Reports: A Method to Increase the Credibility of Published Results," Social Psychology, 2014.
  URL: https://doi.org/10.1027/1864-9335/a000192
- Center for Open Science / Registered Reports resources.
  URL: https://www.cos.io/initiatives/registered-reports

### Fact: AI risk management treats evaluation and monitoring as lifecycle activities

NIST's AI RMF and companion Playbook frame AI risk management as ongoing governance across design, development, deployment, and use. The RMF is not a negative-result ledger, but its lifecycle logic supports recording failures, incidents, limitations, drift, and observed mismatch rather than only successful evaluations.

Source examples:
- NIST AI Risk Management Framework overview: AI RMF is intended to improve incorporation of trustworthiness considerations into design, development, use, and evaluation of AI systems.
  URL: https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI RMF Playbook: includes suggested actions, references, and related guidance for Govern, Map, Measure, and Manage functions; updated as guidance evolves.
  URL: https://www.nist.gov/itl/ai-risk-management-framework/nist-ai-rmf-playbook

### Fact: incident-learning systems preserve failures to prevent recurrence

Engineering and reliability practice treats incidents, near misses, and postmortems as inputs to learning. The same idea should not be imported uncritically into MC, but it supports the broader principle that failure records are valuable design data.

Source example:
- Google SRE Workbook, Postmortem Culture: postmortems are used to learn from incidents and reduce recurrence.
  URL: https://sre.google/workbook/postmortem-culture/

## Fact vs inference

### Facts

- Selective visibility of positive results can make a claim appear better-supported than it is.
- Negative, failed, null, and inconclusive results are epistemically useful because they constrain what can honestly be claimed.
- Precommitted reporting structures reduce opportunities to upgrade claims only after favorable outcomes.
- AI governance frameworks emphasize lifecycle evaluation, monitoring, and documentation, not one-time proof.

### Inferences

- MC's evidence engine should treat failed tests as architecture assets, not clutter.
- A Negative Result Ledger should be separate from the Fossil Record. Fossils preserve failed ideas; negative-result records preserve failed or inconclusive evidence tests.
- The ledger should reduce overclaiming, repeated tests, and artificial certainty if it is actually used.
- The ledger could also become dead paperwork, so it must be tested for utility rather than assumed useful.

## Requirement added

### R-NEG-RESULT-01

Every MC evidence test that is planned, attempted, or used to change claim status must produce one of these explicit outcomes:

- Supported
- Partially supported
- Inconclusive
- Contradicted
- Failed test design
- Failed implementation
- Abandoned with reason

If the outcome is anything other than Supported or Partially supported, it must be logged in `mind/evidence-maps/negative-result-ledger.md` or an equivalent indexed location.

## Evaluation criterion added

### NEG-RESULT-01

An independent reviewer should be able to inspect the Evidence Engine and determine:

1. Which claims were tested and did not improve.
2. Which tests failed because the claim was weak.
3. Which tests failed because the evaluation design was bad.
4. Which claims were abandoned, downgraded, or left uncertain.
5. Whether current claim confidence reflects both positive and negative evidence.

Passing this criterion requires visible negative or inconclusive records, not merely successful evidence maps.

## Proposed ledger schema

Each negative-result entry should include:

- Claim tested
- Date
- Test type
- Intended evaluation criterion
- Outcome category
- What failed
- What was learned
- Whether the claim status changed
- Whether retesting is justified
- Next proof needed, if any
- Link to related positive evidence map, if one exists

## Falsification checklist

Reject or revise the Negative Result Ledger if:

- It becomes a graveyard no one reads.
- It records failure without changing future decisions.
- It slows evidence work without improving claim calibration.
- Failed tests are logged vaguely enough that they cannot constrain future claims.
- Positive evidence maps continue to upgrade claim status without checking the negative ledger.
- The ledger makes the repo look more rigorous without making it more honest.

## Minimal test plan

1. Select 10 recent MC evidence maps.
2. For each map, infer what negative or inconclusive result would have prevented the claim from being upgraded.
3. Create 3 synthetic negative-result records from real weak points in those maps.
4. Re-score claim confidence with and without those negative records visible.
5. Record whether the ledger changes any requirement, test plan, or claim status.

## Decision rule

The Negative Result Ledger should become permanent only if it changes at least one future decision: downgrading a claim, preventing repeated weak tests, refining an evaluation criterion, or exposing overclaiming.

If it merely stores failure aesthetically, it should be removed or merged into the broader evidence-reporting standard.

## Next proof needed

Create the first `negative-result-ledger.md` with three actual records:

1. one failed evidence search,
2. one inconclusive MC feature test,
3. one abandoned claim that sounded good but lacked operational measurement.

Then test whether those records alter the next five claim-status updates.