# Control, Contested Claims, Language, and Public Benefit

**Status:** Proposed design and research agenda. Not a finding that any particular current conspiracy allegation is true. Not legal advice or a substitute for primary-source investigation.

## Why this document exists

A system can apply consistent evidence rules while reproducing the assumptions of its designers. It can dismiss a credible warning because it arrives through an unfamiliar channel, treat an official statement as conclusive, confuse absence of evidence with evidence of absence, or turn a pattern into a certainty too quickly.

The phrase *conspiracy theory* is not itself an evidence assessment. Assess the specific proposition, its scope, sources, counterevidence, and falsifiability. Historical cases demonstrate that covert coordination and institutional abuse have occurred; that fact does not establish unrelated allegations. Conversely, lack of access to records may leave a claim unresolved rather than disproven.

The U.S. Senate's Church Committee documented intelligence abuses, including surveillance and disruption of political and civil-rights activity. The FBI's own historical account acknowledges COINTELPRO and its later criticism. The National Archives describes FOIA access to executive-branch records, subject to statutory exemptions. These are starting points for primary-source study, not permission to infer that every contemporary allegation is true.
- Senate Church Committee: https://www.senate.gov/about/powers-procedures/investigations/church-committee.htm
- FBI history of COINTELPRO: https://www.fbi.gov/history/history-of-the-fbi/and-justice-for-all
- National Archives FOIA guide: https://www.archives.gov/foia
- GAO, data handling and civil rights/civil liberties: https://www.gao.gov/products/gao-25-106057
- GAO, AI accountability framework: https://www.gao.gov/products/gao-21-519sp

## Vocabulary discipline: words that must not do hidden work

Use these terms with explicit definitions and scope.

- **Fact:** A proposition supported to a stated evidentiary standard within a defined scope. Prefer “documented,” “corroborated,” or “observed under conditions X” when that is what the evidence actually supports.
- **Official:** Issued or recognized by an authorized institution. This describes provenance or authority, not automatic truth.
- **Evidence:** Information that bears on a proposition. Evidence can be incomplete, dependent, misleading, authentic but misinterpreted, or strong without being conclusive.
- **Proof:** A conclusion meeting a specified standard in a specified domain (for example, a legal standard, a mathematical proof, or a reproducible engineering test). Do not use as a generic synonym for “some support.”
- **Theory:** In science, a structured explanatory framework; in casual speech, sometimes a conjecture. State which meaning is intended.
- **Conspiracy:** An agreement by multiple actors to pursue an unlawful or secret purpose; the existence of a conspiracy requires evidence of coordination, not merely similar outcomes.
- **Conspiracy theory:** A claim that secret coordination explains events. The label says nothing by itself about the claim's truth. Score its evidence independently.
- **Control:** A family of distinct mechanisms, not a single property. It can mean legitimate coordination, a technical constraint, economic leverage, surveillance, coercion, agenda-setting, manipulation, or a person's practical ability to change an outcome.
- **Power:** The capacity to shape choices, resources, rules, or outcomes. Identify the actor, mechanism, target, scope, and evidence.
- **Manipulation:** Influence that materially bypasses or deceives a person's informed agency. Do not use merely because persuasion occurred.
- **Bias:** A systematic deviation or asymmetry, not simply an outcome someone dislikes. State the reference baseline, group, direction, magnitude, and uncertainty.
- **Censorship:** Suppression or restriction of expression by a defined actor or mechanism. Distinguish state action, private moderation, editorial choice, and algorithmic ranking.
- **Surveillance:** Collection or monitoring of information about people or activities. Distinguish targeted from bulk, overt from covert, authorized from unauthorized, and collection from subsequent use.
- **Transparency:** Visibility of relevant process and evidence. Publishing large quantities of data is not meaningful transparency if people cannot interpret or challenge it.
- **Accountability:** An identifiable duty to explain, correct, remedy, and face review—not just a report or dashboard.
- **Learning:** A change in a model, process, or institution that improves performance on relevant later cases. Storing a lesson or passing a test is not sufficient by itself.
- **Unknown / unverified / unsupported / contradicted / false:** Different states. Unknown means insufficient information; unverified means verification has not been established; unsupported means currently inadequate support; contradicted means credible evidence conflicts with the claim; false should be reserved for cases where evidence justifies that conclusion within stated scope.
- **Absence of evidence:** Meaningful only when the evidence was reasonably expected to exist, the search was capable of finding it, and access and retention limitations are known.
- **Independent corroboration:** Support from a source or method not merely copied from, or dependent on, the original source. Repetition is not independence.
- **Risk / threat / safety:** Define the possible harm, likelihood, severity, affected parties, time horizon, uncertainty, and trade-offs. Do not turn “risk” into an unreviewable reason to prohibit all action.

## Claim assessment protocol

Every contested claim should carry:

1. Exact proposition, actor, action, place, time window, and scope.
2. Claim type: direct observation, document-authenticated statement, inference, hypothesis, symbolic interpretation, or allegation.
3. Source provenance: creator, date, access path, source context, authenticity checks, transformations, and relevant incentives or limitations.
4. Evidence for and against, including credible counterexamples and missing records.
5. Dependency graph: whether sources are independent or repeat a shared origin.
6. Alternative explanations and their distinct predictions.
7. Verification state, confidence rationale, and what evidence would change the assessment.
8. Review date or trigger, correction history, and responsible reviewer.
9. Privacy and safety assessment before publishing details that could identify or endanger people.
10. Clear separation between “the source says X,” “we infer Y,” and “we recommend Z.”

Never treat a user's report of lived experience as disposable merely because it does not independently establish a broader causal explanation. Preserve the experience and investigate the cause separately. Likewise, do not convert emotional certainty, institutional rank, social popularity, or model fluency into factual corroboration.

## A control taxonomy for people and institutions

For each control mechanism, ask:
- Who has the capability and who is affected?
- Is it explicit, implicit, contractual, economic, technical, legal, social, or coercive?
- Is it visible to the affected person?
- Can the person understand the decision, correct the input, refuse, opt out, appeal, or exit?
- Who audits it and who can change the rules?
- What happens when the control is wrong?
- Are there asymmetric burdens, lock-in, retaliation risks, or inaccessible procedures?
- What evidence would show the mechanism is not operating as claimed?

Control is not automatically malicious: standards, accessibility protections, safety interlocks, and public-health coordination can preserve agency. It becomes dangerous when authority is opaque, disproportionate, unreviewable, or insulated from the consequences of error.

## Proposed public-benefit innovations

These are proposed design combinations, not claims of absolute historical novelty. Their value must be demonstrated in pilots with public participation and independent evaluation.

### 1. A personal decision and data receipt

For consequential public or commercial decisions, give the affected person a readable receipt: what decision was made, what inputs materially contributed, which rules and versions were used, which information was missing, who owns the decision, how to correct records, how to appeal, and the deadline or next step. Avoid exposing sensitive security details or other people's private data.

**Potential impact:** fewer opaque denials, faster corrections, better trust calibration, and more usable appeal rights.

### 2. A public-benefits error recovery navigator

A privacy-preserving guide that maps a person's goal (food, housing, health coverage, disability support, employment, education) to eligibility questions, official application channels, required documents, deadlines, appeal routes, and human assistance. It should explain uncertainty, support offline/low-bandwidth use, and never promise eligibility or replace a qualified caseworker.

**Potential impact:** reduce administrative burden and prevent eligible people from losing support because instructions are fragmented. Pilot with community organizations and measure completion, time, error rates, and disparate impacts.

### 3. A civic claim and policy lineage map

For a public policy claim, connect primary documents, versions, datasets, assumptions, counterevidence, funding or decision authority where documented, and the exact chain from evidence to recommendation. Distinguish independent sources from syndicated copies. Enable corrections without erasing prior versions.

**Potential impact:** improve civic literacy, journalism, oversight, and public debate without asking people to accept an institution's summary on faith.

### 4. A service failure and remedy ledger

Let people report failures in public services (lost applications, inaccessible forms, inconsistent notices, missed deadlines, broken portals) with privacy protection. Aggregate patterns without exposing individuals; attach an accountable service owner, severity, time-to-response, fix, appeal route, and verification that the fix worked.

**Potential impact:** shift performance measurement from “tickets closed” to “harm repaired and recurrence reduced.”

### 5. A constraint and power audit

For each consequential rule or automated decision, publish the purpose, authority, scope, expected benefit, who bears costs, exception path, appeal process, review date, and evidence that the rule works. Track whether temporary emergency controls persist after their justification expires.

**Potential impact:** make institutional power legible and contestable while preserving legitimate security and privacy boundaries.

### 6. A community-defined outcome dashboard

Measure what people say improves life—stable housing, time to receive benefits, avoidable debt, access to healthcare, accessible education, ability to challenge errors, and recovery from service failure—not merely agency throughput. Disaggregate carefully to detect unequal outcomes without exposing small groups.

**Potential impact:** make public systems answerable to lived outcomes rather than only internal efficiency metrics.

### 7. A low-friction rights and records toolkit

Provide plain-language workflows to request records, preserve a timeline, identify the right agency, track deadlines, and understand exemptions or appeal routes. FOIA applies to executive-branch records subject to exemptions; it is not a universal right to every government record. The toolkit should make that limitation explicit and support referrals to appropriate legal or advocacy help.

**Potential impact:** reduce the expertise and time required for ordinary people to seek accountability.

## Novelty and evaluation

Do not claim an idea is novel simply because its pieces are familiar under new names. Establish novelty through a documented prior-art scan, stakeholder interviews, and comparison against existing public services and civic-tech projects.

Evaluate pilots against a baseline using:
- task completion and time-to-resolution;
- successful correction and appeal rates;
- repeat-failure rates;
- user understanding of why a decision occurred;
- accessibility and low-bandwidth performance;
- distribution of benefits and burdens across groups;
- privacy incidents, false positives, and unintended chilling effects;
- independent audits and public reporting of failures.

Pre-register intended outcomes and failure criteria. A system should be allowed to show that its intervention did not help.

## Cross-repository implementation

- **MirrorCartographer/MirrorCartographer:** own this claim protocol, vocabulary registry, control taxonomy, evidence lineage model, and pilot evaluation design.
- **MirrorCartographer/mirror-cartographer-ui:** expose provenance, uncertainty, correction, appeal, and privacy boundaries in the experience. Do not pressure users to settle unresolved questions.
- **Foundation Intelligence Architecture:** enforce typed transitions between observation, interpretation, decision, action, and learning. Do not let an inference silently become a fact through summarization.
- **Deployment and hosting:** record exact artifact identity, environment, access boundary, and observed behavior. Do not claim a feature exists because a design document describes it.

Keep synthetic examples in public fixtures. Do not commit personal case files, private health records, credentials, protected government information, or allegations about identifiable private individuals without an appropriate lawful and privacy-reviewed basis.

## Open questions

1. Which decisions deserve a mandatory human appeal, and what response time is realistic?
2. How can an audit preserve meaningful accountability while meeting data minimization, retention, and deletion obligations?
3. How should conflicting sources be weighted without encoding institutional prestige as truth?
4. How can the system distinguish deliberate coordination from common incentives, structural causes, or coincidence?
5. How can public users challenge a model's framing without being forced to reveal more personal data?
6. Who governs the vocabulary and evidence thresholds, and how can affected communities change them?
7. What evidence is sufficient to establish that a pilot improves real outcomes and does not merely shift burden elsewhere?

## Sources and research limits

This document uses official U.S. government sources as starting points for selected historical and policy facts. Official sources can be incomplete and should be compared with primary documents, independent scholarship, and credible counterevidence. This is a design agenda, not a comprehensive survey of conspiracy allegations, current law, or all existing public-benefit programs.
