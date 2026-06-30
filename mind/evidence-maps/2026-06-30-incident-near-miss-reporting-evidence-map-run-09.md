# Evidence Map — Incident and Near-Miss Reporting for MC Governance

Date: 2026-06-30  
Run: Evidence Engine 09  
Status: evidence map + evaluation criterion + falsification checklist  
Claim ID: C-INCIDENT-01

## Claim tested

Mirror Cartographer's GitHub mind needs a first-class incident / near-miss reporting loop, not only positive proof packets, evidence maps, claim registries, and negative-result ledgers.

## Why this weak point was selected

Current MC governance has multiple structures for claims, tests, fossils, provenance, and negative results. The weak point is whether actual harm signals, risky outputs, user confusion events, overreliance moments, source failures, or near misses are forced into a structured review path. Without that loop, MC can look audit-ready while still missing the events that should change its boundaries.

## Source evidence reviewed

### NIST AI RMF / AIRC

Fact: NIST frames AI risk management as lifecycle-oriented and socio-technical. It emphasizes trustworthiness characteristics including validity/reliability, safety, security/resilience, accountability/transparency, explainability/interpretablity, privacy, and fairness. NIST states that ongoing testing or monitoring is used to assess validity and reliability for deployed AI systems and that some failures can cause greater harm.

Source: https://www.nist.gov/itl/ai-risk-management-framework  
Source: https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/

MC inference: Incident and near-miss logging is a practical mechanism for lifecycle monitoring, especially when the system is used in symbolic, emotional, health-adjacent, career, or governance contexts.

Limit: NIST does not validate MC's specific incident format.

### OECD AI Incidents and Hazards Monitor

Fact: OECD's AIM is an automated monitor of incidents and hazards from public sources. OECD states that effective AI policymaking needs evidence, foresight, and international cooperation, and that documenting incidents and hazards helps policymakers, practitioners, and stakeholders understand AI risks and harms.

Source: https://oecd.ai/en/incidents

MC inference: A smaller project-level analogue should track not only proven harms but hazards and near misses, because early weak signals may reveal boundary failures before validated harm occurs.

Limit: OECD's public monitor is policy-oriented and media-source-based; it does not prove a single-user/project GitHub incident ledger will improve MC decisions.

### AI Incident Database

Fact: The AI Incident Database indexes harms or near harms realized in the real world by deployed AI systems and explicitly models itself after databases in aviation and computer security, aiming to learn from experience to prevent or mitigate bad outcomes.

Source: https://incidentdatabase.ai/

MC inference: MC should treat near misses as evidence objects, not embarrassing anomalies or chat residue. A near miss should be eligible to change claim status, review gates, safety language, and artifact retirement.

Limit: AIID is a public incident database; MC's setting is smaller, more interpretive, and less externally validated.

### MITRE ATLAS

Fact: MITRE ATLAS is a knowledge base of adversary tactics, techniques, and case studies for AI-enabled systems.

Source: https://atlas.mitre.org/

MC inference: MC's risk ledger should include manipulation, prompt-injection-like instruction conflicts, provenance failure, source laundering, tool misuse, and agency erosion as incident classes, even when no external attacker is present.

Limit: ATLAS is security-focused; MC also needs psychological, symbolic, relational, and epistemic classes not covered by security taxonomies.

## Fact / inference separation

| Item | Status | Notes |
|---|---|---|
| AI risk management should include lifecycle monitoring and risk controls. | Fact, externally supported | Supported by NIST AI RMF / AIRC. |
| AI incidents and hazards are useful evidence for understanding risk patterns. | Fact, externally supported | Supported by OECD AIM and AIID. |
| Near harms can be recorded to help prevent or mitigate bad outcomes. | Fact, externally supported | Supported by AIID's stated purpose. |
| MC currently needs a first-class incident ledger. | Inference | Based on gap analysis against existing MC artifacts. |
| MC's incident ledger will improve safety or decisions. | Unproven | Requires testing. |
| Incident logs should downgrade claims when repeated risk patterns appear. | Governance design inference | Plausible, but must be operationally tested. |

## New evaluation criterion: INCIDENT-GATE-01

An MC artifact or output must be routed to the incident / near-miss ledger if any of the following appear:

1. The output makes a health, legal, financial, employment, safety, memory, relational, or identity-adjacent claim stronger than the evidence allows.
2. The user could reasonably mistake symbolic interpretation for factual authority.
3. The output relies on a source path that cannot be reconstructed.
4. The output creates, reinforces, or hides overreliance on AI judgment.
5. The output produces action pressure without a rejection, revision, or escalation path.
6. The output changes a claim status without a corresponding source/evidence update.
7. The output contains a tool-use failure that affects evidence quality, authorship, deployment, or public claims.
8. A later review finds that a prior artifact looked rigorous but measured the wrong construct.

## Incident severity scale

| Level | Label | Definition | Required action |
|---|---|---|---|
| I-0 | Observation | Weak signal, ambiguity, or discomfort without clear failure. | Log if repeated. |
| I-1 | Near miss | Error or risk caught before it shaped a decision or public artifact. | Log and add prevention note. |
| I-2 | Contained incident | Risky output/artifact existed but was bounded or corrected. | Log, update affected claim, add test. |
| I-3 | Active incident | Risky output/artifact could mislead action, memory, identity, health, money, relationship, or public representation. | Freeze related claim upgrades until reviewed. |
| I-4 | Critical incident | Credible risk of serious harm, coercion, medical/legal/financial misinformation, or deceptive public evidence. | Retire or quarantine artifact; require external review before reuse. |

## Required incident record schema

Each incident / near-miss record should include:

- Incident ID:
- Date discovered:
- Artifact or output affected:
- Triggering gate item:
- Severity level:
- Context of use:
- What happened:
- What could have happened:
- Evidence source:
- Fact / inference boundary:
- User agency impact:
- Provenance impact:
- Claim status impact:
- Immediate containment:
- Long-term prevention:
- Review owner / reviewer type:
- Reopen condition:
- Closure condition:

## Claim-status update

C-INCIDENT-01: MC needs a first-class incident / near-miss reporting loop.

Previous status: implied but not separately evidenced.  
New status: supported governance-design requirement; implementation unvalidated.

Upgrade rationale: NIST supports lifecycle monitoring and risk management; OECD AIM and AIID support incident/hazard tracking as evidence for learning from AI failures; MITRE ATLAS supports structured classification of AI-system threat events.

Upgrade limit: The external sources justify the need for a logging/review loop. They do not prove MC's proposed severity scale, schema, or gate improves outcomes.

## Falsification checklist

This claim should be downgraded if testing shows any of the following:

1. INCIDENT-GATE-01 captures mostly harmless noise and does not change any artifact, claim, or decision.
2. Reviewers cannot consistently distinguish I-0, I-1, I-2, I-3, and I-4 events.
3. Incident logging duplicates the Negative Result Ledger without adding new safety or governance value.
4. The incident process discourages preserving weak signals because it feels punitive or too heavy.
5. The ledger becomes symbolic archive prose instead of a trigger for claim-status changes, containment, or prevention.
6. No downstream MC artifact changes after three credible incidents or near misses.

## Next proof needed

Run INCIDENT-GATE-01 across 20 existing MC artifacts and 10 recent AI-opportunity artifacts. Record all triggered events using the schema above. The incident loop should not be considered operational unless at least two reviewers can apply the severity scale with usable agreement and at least three logged events produce concrete downstream changes: claim downgrade, artifact quarantine, test addition, boundary-language revision, or provenance repair.
