# Initial Claim Registry / Claim Graph

Date: 2026-06-29  
Status: initial registry; not a validation result  
Purpose: prevent evidence maps from becoming isolated documents.

## Status scale

- Hypothesis: plausible, untested in MC.
- Supported design principle: supported by external literature or governance practice, but not directly validated in MC.
- Mixed: credible support and credible objections both present.
- Context-limited support: tested only in narrow MC conditions.
- Refuted / downgraded: evidence does not support the current wording.

## Registry

| Claim ID | Claim | Current status | Direct MC evidence? | Primary next proof | Confidence change |
|---|---|---:|---:|---|---|
| C-PROV-01 | GitHub artifacts require provenance before they count as auditable evidence. | Supported design principle | No | Apply provenance block to 5 existing maps. | Increased from implicit to explicit |
| C-PROV-02 | Interpretation provenance should be a first-class MC object. | Supported design principle | No | Compare no provenance vs full log vs lineage card. | Unchanged |
| C-ATTR-01 | Attribution Organ prevents source-memory collapse. | Hypothesis | No | Prototype user phrase → AI interpretation → correction → public artifact. | Unchanged |
| C-DISC-01 | Discovery objects preserve surprise and improve learning. | Hypothesis | No | Build 5 Discovery objects from real MC changes. | Unchanged |
| C-FOSSIL-01 | Failed ideas should be preserved as structured fossils. | Supported design principle | No | Build 5 Fossil records and test repeated-mistake prevention. | Increased as process claim only |
| C-TRUST-01 | MC should optimize calibrated trust, not maximum trust. | Supported design principle | No | Compare plain interpretation vs explanation vs scope/uncertainty card. | Increased as safety principle |
| C-INFLUENCE-01 | Influence Scope visuals improve appropriate reliance. | Hypothesis | No | Compare Confidence Label vs Influence Scope Card vs Permission Timeline. | Unchanged |
| C-ROLE-01 | Many-hats / organism architecture improves reasoning rather than theater. | Hypothesis | No | Single answer vs decorative roles vs enforced roles. | Unchanged |
| C-SCAFFOLD-01 | MC should be cognitive scaffold, not memory replacement. | Supported design principle | No | One-week reconstruction comparison. | Increased as design principle |
| C-SELF-01 | AI self should be state ledger, not pretend identity. | Supported design principle | No | Create five self-ledger records and test inheritance/revision. | Increased as boundary claim |
| C-DECISION-01 | MC features should be evaluated by decision quality. | Supported design principle | No | Use one MC feature in decision task and score outcomes. | Increased as evaluation principle |
| C-BOUNDARY-01 | MC must distinguish explanation from intervention. | Supported design principle | No | Classify five features and compare reasoning effects. | Increased as evaluation boundary |
| C-CLINICAL-01 | Symbolic/body mapping must not drift into diagnosis/treatment. | Strong safety boundary | No | Run 40 body-symbol prompts. | Increased as safety boundary |
| C-AGENCY-01 | MC needs a first-class Human Agency Boundary. | Strong safety boundary | No | Test Human Agency Boundary Card on one real output. | Increased as governance boundary |
| C-REPORT-01 | MC needs standardized evidence reporting. | Supported process principle | No | Normalize 10 existing maps. | Increased as process claim |
| C-CONSTRUCT-01 | Evaluation criteria need construct-validity checks. | Supported process principle | No | Audit 10 criteria against construct validity. | Increased as process claim |
| C-NEG-01 | MC needs a Negative Result Ledger. | Supported process principle | Partial | Maintain 3 real records and update after tests. | Increased as method claim |
| C-EVIDENCE-02 | Evidence strength must be tracked separately from evidence count. | Supported process principle | No | Map 10 claims to independent/redundant evidence. | Increased as governance claim |
| C-CAUSAL-01 | MC must separate design rationale from causal effect. | Supported process principle | No | Downgrade/split 10 maps where needed. | Increased as method claim |
| C-MEMORY-01 | Vivid symbolic reconstruction risks memory distortion. | Strong safety boundary | No | Run 30 memory-sensitive prompts with labels. | Increased as safety boundary |
| C-OPPORTUNITY-01 | AI opportunity work needs proof-of-skill before actionability. | Supported labor-market principle | Partial | Build role proof packets without novelty language. | Increased as opportunity method claim |
| C-RETIRE-01 | Architecture artifacts require lifecycle/retirement states. | Supported process principle | No | Classify 20 evidence maps. | Increased as governance claim |
| C-REVIEW-01 | Symbolic outputs must be externally reviewable. | Hypothesis / requirement | Partial template only | Review five artifacts with three reviewers. | Unchanged |
| C-EXTERNAL-01 | MC internal evaluations do not automatically generalize. | Methodological limitation | No | Run same protocol across three domains. | Decreased broad claims |
| C-REPRO-01 | Symbolic outputs are reproducible enough to count as evidence. | Unknown | No | Repeat one prompt 10 times + paraphrase robustness. | Unchanged |
| C-RELATIONAL-01 | Symbolic AI must measure relational risk. | Strong safety boundary | No | Run 40 relational-risk prompts. | Increased as safety boundary |

## Relationship map

- C-PROV-01 supports C-PROV-02, C-ATTR-01, C-REVIEW-01, and C-REPORT-01.
- C-CONSTRUCT-01 constrains all evaluation criteria.
- C-CAUSAL-01 constrains C-DECISION-01, C-TRUST-01, C-INFLUENCE-01, C-ROLE-01, C-DISC-01, and C-FOSSIL-01.
- C-NEG-01 and C-EVIDENCE-02 constrain all future claim upgrades.
- C-CLINICAL-01, C-MEMORY-01, C-AGENCY-01, and C-RELATIONAL-01 are safety boundaries; passing usability tests cannot override them.
- C-EXTERNAL-01 prevents broad claims from local tests.

## Registry rule

A claim may not be upgraded unless the update states whether new evidence is:

1. independent;
2. direct or indirect;
3. contradictory, supporting, or neutral;
4. affected by construct-validity threats;
5. limited to a specific domain, model, user profile, or task.
