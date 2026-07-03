# Evidence Map: AI Research Opportunity vs. Market Validation Boundary

Date: 2026-07-03
Status: implemented as evidence map + evaluation criterion + falsification checklist
Claim ID: C-AI-RESEARCH-OPPORTUNITY-MARKET-VALIDATION-01R

## Claim tested

AI opportunity work can identify high-value, monetizable opportunities from public research and reasoning alone.

## Why this needed stronger evidence

The current Mirror Cartographer / AI opportunity workflow can produce many plausible opportunity reports, company audits, business hypotheses, and strategic directions. The weak point is that plausibility can be mistaken for market proof. A well-researched opportunity map may show that a problem exists, but that does not prove willingness to pay, adoption likelihood, urgency, competitive positioning, or whether a specific buyer recognizes the problem as worth solving now.

## Evidence reviewed

### Source 1 — NSF I-Corps

NSF describes I-Corps as an immersive entrepreneurial training program intended to transform invention into impact and accelerate economic and societal benefits from research moving toward commercialization. NSF also states that I-Corps aims to reduce the risk of translating technologies from the laboratory to the marketplace through experiential education.

Implication for MC / AI opportunity work: commercialization risk is not resolved by research alone. Opportunity claims need contact with marketplace reality.

Source: https://www.nsf.gov/funding/initiatives/i-corps

### Source 2 — NIST AI Risk Management Framework

NIST says the AI RMF is intended to improve incorporation of trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems. NIST frames AI risk management as a lifecycle practice involving design, use, and evaluation rather than a one-time document.

Implication for MC / AI opportunity work: an AI-generated opportunity artifact can support mapping and evaluation, but it does not by itself validate usefulness, trustworthiness, or market value.

Source: https://www.nist.gov/itl/ai-risk-management-framework

### Source 3 — OECD AI Principles

OECD states that trustworthy AI should respect human rights and democratic values and identifies transparency, robustness, security, safety, and accountability as core principles. OECD also defines AI systems as systems generating outputs that may influence physical or virtual environments.

Implication for MC / AI opportunity work: opportunity recommendations that influence career, product, funding, or business decisions should be treated as decision-support outputs requiring accountability and uncertainty boundaries.

Source: https://oecd.ai/en/ai-principles

## Fact vs. inference

### Supported by evidence

- Commercialization programs such as NSF I-Corps treat market translation as a risk-reduction process, not as something established by invention or analysis alone.
- AI governance guidance treats evaluation as part of the lifecycle of AI products, services, and systems.
- AI outputs that influence decisions should be governed with transparency, safety, and accountability expectations.
- Public research can support problem discovery and hypothesis formation.

### Inference / not yet demonstrated for MC

- AI-generated opportunity maps predict real buyer demand.
- A company-audit artifact will cause a company, funder, employer, or customer to pay.
- A well-researched opportunity automatically has commercial value.
- Internal confidence or symbolic coherence predicts external adoption.
- A public GitHub evidence map is enough to convert a research artifact into an investable or employable asset.

## Claim-status update

C-AI-RESEARCH-OPPORTUNITY-MARKET-VALIDATION-01R:

AI opportunity research should be treated as hypothesis generation and prioritization, not as market validation. Public research can identify plausible needs, risks, gaps, and strategic openings, but monetizable opportunity remains unvalidated until there is external evidence from target users, buyers, funders, employers, partners, or measurable adoption behavior.

Confidence: moderate for the boundary claim; low for any MC-specific prediction of commercial conversion.

## Evaluation criterion added

### Opportunity Validation Gate

No AI opportunity claim may be labeled "validated," "high-value," "commercially proven," or "buyer-ready" unless it includes at least one of the following external signals:

1. Direct buyer/user interview evidence from the target segment.
2. Written response from a target employer, company, funder, customer, or partner.
3. Measurable demand signal: application response, intro request, waitlist signup, paid pilot, LOI, contract, donation, grant review, interview request, or accepted meeting.
4. Comparative evidence that the same problem already supports spending in the market.
5. Repeatable conversion evidence from a public artifact to a concrete next step.

If none are present, the correct status is:

- Research-supported hypothesis
- Problem-plausible
- Market-unvalidated
- Not yet monetization evidence

## Test plan

Test ID: OPP-RESEARCH-TO-MARKET-VALIDATION-PILOT-01

1. Select 10 AI opportunity artifacts from the GitHub mind.
2. For each artifact, define the target buyer/user/employer/funder segment.
3. Extract the core claim in falsifiable form: "This segment has enough pain/need to take action on X."
4. Send or present the artifact to at least 5 relevant external targets per opportunity where feasible.
5. Track response quality:
   - no response
   - polite interest only
   - critique / correction
   - request for more detail
   - meeting/interview accepted
   - referral made
   - pilot/payment/employment/funding action
6. Record whether the artifact changed a real decision or produced an external next step.
7. Promote, revise, or retire the opportunity claim based on observed evidence.

## Falsification checklist

This claim is weakened or falsified if:

- high internal opportunity scores do not produce external responses;
- target users do not recognize the problem as urgent;
- target buyers agree the issue exists but would not pay or act;
- the proposed solution is already solved adequately by existing alternatives;
- the artifact is admired aesthetically but does not create action;
- external reviewers cannot identify the practical use case;
- opportunity reports repeatedly produce interest without conversion;
- the work requires a different buyer segment than originally assumed.

## Implementation consequence

All future AI opportunity work should separate:

1. Problem evidence
2. Buyer/user evidence
3. Solution evidence
4. Willingness-to-pay or willingness-to-act evidence
5. Delivery capability evidence
6. Conversion evidence

The GitHub mind should stop treating research volume, audit density, or symbolic coherence as proxies for commercial proof.

## Next proof needed

Run OPP-RESEARCH-TO-MARKET-VALIDATION-PILOT-01 on 10 existing AI opportunity artifacts and publish a validation ledger showing which claims produced external action and which remained internally plausible but commercially unproven.
