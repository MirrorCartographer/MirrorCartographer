# Evidence Map Run 12 — Data Quality / Source Coverage Boundary

Date: 2026-06-30

## Claim tested

**C-DATA-QUALITY-01:** Mirror Cartographer evidence maps can be treated as stronger evidence if they cite high-quality sources.

## Why this was selected

The GitHub mind now has many evidence maps. A weak point is that citation quality alone can create a false sense of rigor. A map can cite NIST, OECD, model cards, or academic papers and still have weak source coverage, hidden selection bias, stale assumptions, or poor fit to the actual MC claim being tested.

## Status before this run

- Claim status: **implicit / under-specified**
- Risk: evidence maps may look audit-ready because they contain citations, while failing to document search strategy, inclusion/exclusion logic, source limits, data provenance, or coverage gaps.

## Primary / high-quality sources checked

### 1. NIST AI RMF and NIST Generative AI Profile

Source:
- NIST AI Risk Management Framework page: https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI 600-1, *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*, July 2024: https://doi.org/10.6028/NIST.AI.600-1

Relevant facts:

- NIST states the AI RMF is intended to improve incorporation of trustworthiness considerations into the design, development, use, and evaluation of AI systems.
- The NIST Generative AI Profile frames risk management across lifecycle stages.
- NIST recommends documenting model details including assumptions and limitations, data collection methodologies, data provenance, data quality, evaluation data, ethical considerations, and legal/regulatory requirements.
- NIST recommends documenting training data curation policies where possible.
- NIST recommends policies for collection, retention, and minimum data quality, including attention to training-data imbalance, dangerous content, PII leakage, and other risk classes.
- NIST recommends reviewing, documenting, and measuring sources of bias in training and TEVV data, including completeness, representativeness, balance, demographic coverage, proxy variables, digital-divide representativeness, filtering effects, and prevalence of AI-generated data.

Interpretation for MC:

NIST supports a data-quality and provenance boundary for AI evidence work. It does not prove that MC evidence maps are high quality. It supports the need to make source coverage, data limits, and evaluation-data quality explicit before upgrading claims.

### 2. Datasheets for Datasets

Source:
- Timnit Gebru et al., *Datasheets for Datasets*, Communications of the ACM, 2021: https://doi.org/10.1145/3458723

Relevant facts:

- The datasheets framework proposes structured documentation for datasets.
- It emphasizes documenting motivation, composition, collection process, preprocessing, distribution, maintenance, recommended uses, and limitations.
- Its rationale is that dataset documentation can support transparency, accountability, reproducibility, and better judgment about fitness for use.

Interpretation for MC:

MC evidence maps are not datasets in the strict ML sense, but they function as small evidence corpora. The datasheet logic transfers as a design analogy: every evidence map should document how its evidence corpus was assembled and what the corpus cannot support.

### 3. Data Cards

Source:
- Pushkarna, Zaldivar, and Kjartansson, *Data Cards: Purposeful and Transparent Dataset Documentation for Responsible AI*, 2022: https://arxiv.org/abs/2204.01075

Relevant facts:

- Data Cards are structured summaries of essential dataset facts across the lifecycle.
- The paper emphasizes dataset origins, development, intent, ethical considerations, evolution, collection and annotation methods, intended use, and performance-relevant decisions.
- It frames documentation as a user-centered product, not merely an internal record.

Interpretation for MC:

MC evidence maps need user-centered source documentation: a future reviewer should know what was searched, what was included, what was excluded, what source classes are missing, and what decision the evidence map can and cannot justify.

### 4. Empirical dataset-card documentation research

Source:
- Yang, Liang, and Zou, *Navigating Dataset Documentations in AI: A Large-Scale Analysis of Dataset Cards on Hugging Face*, 2024: https://arxiv.org/abs/2401.13822

Relevant facts:

- The authors analyzed 7,433 dataset documentations on Hugging Face.
- They found documentation completeness varies substantially.
- They report that sections about considerations for using data tend to receive less content than descriptive and structural sections.
- Human annotation indicated comprehensive content affects perceived documentation quality.

Interpretation for MC:

Documentation frameworks can fail in practice when important limitation sections remain thin. For MC, a template alone is insufficient. The required test is whether source limitations and use restrictions are actually filled in with decision-relevant detail.

## Fact / inference separation

### Facts supported by sources

1. AI governance sources recommend documenting assumptions, limitations, data provenance, data quality, evaluation data, and risks.
2. NIST specifically connects data collection, minimum quality, imbalance, PII exposure, representativeness, and bias to generative-AI risk management.
3. Dataset documentation frameworks exist to improve transparency, accountability, reproducibility, and fitness-for-use judgment.
4. Empirical review of dataset cards shows documentation completeness is uneven, especially around considerations for use.

### Inferences for MC

1. MC evidence maps should be treated as evidence corpora that require source-coverage documentation.
2. A citation to a high-quality institution is not enough to justify a claim upgrade.
3. Evidence maps should not upgrade claims unless they record search scope, inclusion criteria, exclusion criteria, source-class coverage, missing evidence, and freshness limits.
4. MC needs a separate evidence-quality gate before any evidence map can raise claim status.

### Unsupported or not yet proven

1. That MC’s current evidence maps are complete.
2. That MC’s source selection is unbiased.
3. That the proposed gate improves real reviewer decisions.
4. That a small number of high-quality sources is enough for every MC claim.

## Claim-status update

**C-DATA-QUALITY-01 revised claim:**

MC evidence maps may support claim upgrades only when citation quality is paired with explicit source-corpus documentation: search scope, inclusion/exclusion criteria, source-class coverage, missing evidence, freshness limits, and decision boundary.

**New status:** supported evidence-governance requirement; MC implementation unvalidated.

Confidence: **moderate** for the governance requirement; **low** for current MC implementation effectiveness.

## Evaluation criterion added

### DATA-COVERAGE-GATE-01

Before any MC evidence map can upgrade a claim, it must answer all of the following:

1. What exact claim is being tested?
2. What source classes were searched? Examples: standards body, peer-reviewed research, regulatory guidance, incident database, product documentation, legal text, clinical guideline, internal MC artifact.
3. Which source classes were intentionally excluded, and why?
4. What search terms or retrieval path were used?
5. What inclusion criteria determined which sources counted?
6. What exclusion criteria removed sources from consideration?
7. What source class is missing but would materially change confidence?
8. What is the newest source used, and what is the oldest source used?
9. Which facts are directly supported by sources?
10. Which statements are MC-specific inferences?
11. What claim upgrade is prohibited by the current evidence?
12. What next test would convert the evidence map from documentation into validated implementation evidence?

## Falsification checklist

Downgrade an evidence map if any of the following are true:

- It cites high-status sources but does not explain why those sources fit the tested MC claim.
- It lacks search/retrieval terms or inclusion criteria.
- It omits source limitations.
- It treats governance-framework support as proof that MC implementation works.
- It cannot name the source class most likely to contradict or weaken the claim.
- It upgrades a claim based only on plausibility, resonance, or institutional citation density.
- It fails to distinguish direct facts from MC-specific inference.

## Immediate implementation effect

No previous MC effectiveness claim is upgraded by this run.

Instead, this run adds a stricter precondition: future evidence maps must pass **DATA-COVERAGE-GATE-01** before their citations can justify stronger claim status.

## Next proof needed

Run DATA-COVERAGE-GATE-01 against the last 12 Evidence Engine maps and score each map:

- 0 = missing source-corpus documentation
- 1 = partial source-corpus documentation
- 2 = complete source-corpus documentation

Pass condition: at least 10 of 12 maps score 2, and any map below 2 receives a concrete retrofit note before it is allowed to support a claim upgrade.
