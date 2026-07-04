# Evidence Engine Run 108 — Opportunity Map Validation Boundary

Date: 2026-07-04
Area: AI opportunity work / commercial proof / GitHub mind evidence quality
Status: Claim narrowed; not falsified, but evidence threshold raised.

## Claim tested

AI opportunity research and documentation can be treated as business value once the opportunity map is detailed, plausible, and well sourced.

## Updated claim status

Previous implicit claim:

> A detailed AI opportunity map is evidence of commercial value.

Updated bounded claim:

> A detailed AI opportunity map is evidence of structured thinking and opportunity plausibility only. It becomes evidence of commercial value only after stakeholder discovery, adoption signals, willingness-to-pay or equivalent commitment signals, operational feasibility testing, and risk/compliance review.

Confidence: moderate for the boundary; low for any specific opportunity until tested.

## Why this weak point matters

Mirror Cartographer and related AI opportunity work can produce many strong-looking artifacts: market scans, company audits, workflow maps, automation ideas, and product concepts. Those artifacts may look valuable, but they can create false confidence if they are not connected to real users, buyers, operators, constraints, and measurable outcomes.

The risk is not that opportunity maps are useless. The risk is treating them as proof before they have been validated.

## Evidence found

### Facts

1. NIST AI RMF frames trustworthy AI as lifecycle risk management across design, development, use, and evaluation. It is meant to improve incorporation of trustworthiness considerations into AI products, services, and systems, not merely document ideas.
Source: NIST AI Risk Management Framework, https://www.nist.gov/itl/ai-risk-management-framework

2. ISO/IEC 42001:2023 specifies requirements for establishing, implementing, maintaining, and continually improving an Artificial Intelligence Management System. ISO describes it as a structured way to manage AI risks and opportunities, including governance, transparency, and continuous learning.
Source: ISO/IEC 42001:2023, https://www.iso.org/standard/42001

3. NSF I-Corps is explicitly designed to reduce the risk of translating technologies from lab to marketplace through experiential training. NSF describes I-Corps as moving researchers beyond the lab toward commercialization and reducing translation risk. It reports participation by more than 2,500 teams and nearly 1,400 startups with $3.16B in subsequent funding raised.
Source: NSF I-Corps, https://www.nsf.gov/funding/initiatives/i-corps

4. OECD AI Principles require AI actors to be accountable for AI systems and to provide transparency and responsible disclosure so people can understand when they are engaging with AI and can challenge outcomes where appropriate.
Source: OECD AI Principles, https://oecd.ai/en/ai-principles

5. The lean startup / customer-development literature treats early ventures as collections of hypotheses that must be tested with customers, experiments, and iteration. This source is high-quality but not a standard; use it as entrepreneurship-method support, not regulatory authority.
Source: Steve Blank, Harvard Business Review, “Why the Lean Start-Up Changes Everything,” https://hbr.org/2013/05/why-the-lean-start-up-changes-everything

### Inferences

1. An AI-generated opportunity map can be an input to validation, but it is not validation itself.

2. Commercial value requires evidence from outside the artifact: stakeholder interviews, pilot usage, budget ownership, willingness to pay, procurement feasibility, operational fit, retention/continued use, or measurable cost/revenue/risk impact.

3. For Mirror Cartographer, the strongest near-term proof is not “more opportunity reports.” It is a small validation loop showing that a defined user group understands the artifact, finds it useful, uses it to make a decision, and would trade something scarce for it: time, money, access, data, attention, or a concrete commitment.

## Evaluation criterion added

### MC-OPPORTUNITY-VALIDATION-01

Any AI opportunity artifact should be labeled by validation stage:

0. Idea only — no external evidence.
1. Desk research — sources support plausibility, market context, or risk context.
2. Stakeholder discovery — direct conversations or equivalent primary input from target users/buyers/operators.
3. Problem validation — repeated evidence that the problem is real, costly, current, and owned by someone.
4. Solution validation — prototype or demo produces useful outcome for target user.
5. Commitment signal — user/buyer offers money, signed pilot, LOI, data access, distribution access, implementation time, or repeated use.
6. Operational validation — workflow, compliance, risk, support, and maintenance constraints have been tested.
7. Outcome validation — measurable improvement in time, cost, revenue, quality, safety, access, or decision accuracy.

Rule: stages 0–1 may support “plausible opportunity.” Stages 2–4 may support “validated problem/solution direction.” Stages 5–7 are required before claiming business value.

## Falsification checklist

This opportunity claim should be downgraded or rejected if:

- Target users cannot explain what problem the opportunity solves.
- Stakeholder interviews reveal the problem is interesting but not urgent.
- No buyer, operator, or sponsor owns the problem.
- Users like the artifact but will not spend time, money, access, data, or reputation on it.
- The workflow requires permissions, integrations, or data access that cannot be obtained.
- Legal, privacy, accessibility, safety, or platform rules block realistic deployment.
- A cheaper existing tool already solves the problem well enough.
- The artifact cannot produce a measurable outcome beyond “interesting.”

## Test plan

### OPPORTUNITY-VALIDATION-PILOT-01

Goal: determine whether AI opportunity maps produce validated business signal, not just convincing documentation.

Sample:

- 10 AI opportunity maps from the current GitHub mind.
- 3 target stakeholders per map where possible: one user, one buyer/sponsor, one operator/implementer.

Procedure:

1. For each opportunity map, write the narrowest claim it makes.
2. Identify target user, buyer, operator, and deployment context.
3. Conduct or simulate structured discovery until real stakeholders can be used.
4. Record evidence by validation stage using MC-OPPORTUNITY-VALIDATION-01.
5. Require at least one commitment signal before upgrading any opportunity to “business value candidate.”
6. Track contradictions, blockers, and unsupported assumptions.

Metrics:

- Percent of maps with clear user/buyer/operator.
- Percent with validated problem evidence.
- Percent with solution-use evidence.
- Percent with commitment signals.
- Percent blocked by data/privacy/accessibility/platform constraints.
- Median number of unsupported assumptions per map.

## Claim-status update

- Detailed opportunity research: useful, but not proof.
- GitHub documentation: traceability, not validation.
- AI-generated company audits: hypothesis generation, not market proof.
- Commercial opportunity: requires external stakeholder and outcome evidence.

## Next proof needed

OPPORTUNITY-VALIDATION-PILOT-01: select 10 existing AI opportunity maps and score each against MC-OPPORTUNITY-VALIDATION-01. The first pass can use available artifacts and inferred target stakeholders, but any upgrade beyond stage 1 requires direct external evidence.
