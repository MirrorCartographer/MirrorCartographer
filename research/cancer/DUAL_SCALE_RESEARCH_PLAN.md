# Cancer Research: Dual-Scale Program

**Status:** Research architecture and computational discovery plan  
**Parent brief:** `research/CANCER_RESEARCH_FRONTIER.md`  
**Principle:** Study cancers as distinct diseases while testing whether their mechanisms reveal shared, context-dependent vulnerabilities.

## 1. Strategic decision

The program will run two linked tracks, not choose between them.

### Track A — Cross-cancer mechanism discovery

Search across tumor types for recurring dependencies and failure modes:
- replication stress and DNA-damage response;
- apoptosis resistance and alternative cell-death programs;
- lineage plasticity and cell-state transitions;
- immune recognition, suppression, and escape;
- metabolic dependencies and nutrient-stress adaptation;
- stromal, vascular, and immune microenvironment dependencies;
- dormancy, minimal residual disease, and metastatic competence.

A cross-cancer signal is a **candidate pattern**, not a universal target. Its prevalence, direction, and therapeutic window must be measured by tissue, genotype, cell state, treatment history, and normal-tissue expression.

### Track B — Disease-specific investigations

Select individual cancer types and define their own:
- clinical problem and unmet need;
- molecular and histologic subtypes;
- natural history and treatment context;
- model systems and their limitations;
- known resistance and recurrence routes;
- relevant patient-derived and population datasets.

Do not pool diseases merely because they share a label or pathway. Preserve disease identity and subtype metadata through every analysis.

### The bridge

Every disease-specific finding is tested for:
1. **Local validity:** does it reproduce within the disease and subtype?
2. **Context boundary:** in which molecular, tissue, treatment, and microenvironment contexts does it hold?
3. **Cross-disease transfer:** does the same mechanism recur elsewhere?
4. **Selectivity:** is the proposed intervention more damaging to malignant than essential normal cells?
5. **Evolutionary durability:** can resistant subclones or alternate cell states bypass it?

The result is a map of conditional vulnerabilities—not a claim that one treatment will cure every cancer.

## 2. First research cycle: choose a tractable question

Do not start by downloading every cancer dataset. First define a falsifiable question and a small, auditable cohort.

Candidate starting questions:

| Candidate | Core question | Main evidence needed | Key failure mode |
|---|---|---|---|
| Shared dependency under stress | Which dependencies become essential across otherwise distinct tumors under a defined stress? | CRISPR dependency screens, expression, genotype, stress context | Cell-line artifacts; normal-cell selectivity unknown |
| Cell-state escape | Which state transitions allow tumors to survive targeted treatment? | Longitudinal or perturbation single-cell data, treatment annotations | Cross-sectional data mistaken for temporal causality |
| Residual disease and dormancy | What distinguishes persisting cells from cells eliminated by therapy? | Paired pre/post-treatment samples, lineage or single-cell evidence | Sparse sampling and confounded treatment histories |
| Immune escape | Which tumor-intrinsic changes repeatedly reduce immune recognition? | Tumor/immune multi-omics, functional immune assays | Immune context absent from many model systems |
| Metastatic adaptation | Which dependencies emerge during dissemination or colonization? | Matched primary/metastatic samples and functional models | Site and treatment effects confused with metastatic biology |

**Initial priority:** build a reproducible dependency-analysis pipeline, then select one disease-specific case study and one cross-cancer comparison from the same mechanism family. This gives the two tracks a shared analytical foundation without pretending they are the same question.

## 3. Data-source registry

These are starting points, not interchangeable datasets. Each download must record release, access tier, license/terms, cohort definition, model type, and citation.

| Resource | Primary use | Important limitation | Entry point |
|---|---|---|---|
| DepMap | Cancer-cell-line dependencies, CRISPR screens, molecular features, drug response | In-vitro models do not establish patient benefit or normal-tissue safety; releases change | https://depmap.org/portal/data_page/ |
| NCI Genomic Data Commons (GDC) | Harmonized tumor genomics, clinical and biospecimen data; TCGA and other studies | Some data are controlled-access; clinical completeness varies | https://portal.gdc.cancer.gov/ |
| CPTAC / Proteomic Data Commons | Proteogenomics and protein-level tumor biology | Cohorts and assays vary; genomic and proteomic portals differ | https://proteomic.datacommons.cancer.gov/ |
| NCI Cancer Research Data Commons | Discovery of NCI-supported multi-modal data commons and cloud resources | Data are distributed across constituent commons | https://datacommons.cancer.gov/explore |
| GEO | Published functional genomics and expression studies | Study design, processing, and metadata are heterogeneous | https://www.ncbi.nlm.nih.gov/geo/ |
| cBioPortal | Exploration of molecular profiles and selected clinical annotations | Study coverage and harmonization vary; not a substitute for source data | https://www.cbioportal.org/ |

**Access rule:** start with openly available, de-identified, research-authorized data. Controlled data require the applicable approvals and agreements; never attempt to bypass access controls. GDC describes dbGaP authorization for controlled data.

## 4. Evidence model

Every substantive statement must be represented as a traceable chain:

`Observation → Measurement → Dataset/Specimen → Analysis → Claim → Hypothesis → Proposed test`

Record at minimum:
- stable record ID and version;
- source URL, DOI/accession, release and retrieval date;
- cancer type, histology, subtype, stage, treatment context;
- specimen/model type and sample count;
- assay, platform, preprocessing and quality controls;
- analysis code/commit, parameters and random seeds where relevant;
- effect size, uncertainty, statistical method and multiple-testing correction;
- evidence class: observational, perturbational, mechanistic, clinical;
- replication status and contradictory evidence;
- known confounders, missingness and selection bias;
- claim status: unreviewed, supported, contested, refuted, or unresolved.

Never collapse “correlated with,” “required in a model,” “causes tumor regression,” and “improves patient survival” into one evidence category.

## 5. Analysis sequence

1. **Cohort definition:** define inclusion/exclusion rules before inspecting outcome patterns.
2. **Data audit:** inspect missingness, batch effects, model identity, sample duplication, and annotation quality.
3. **Baseline characterization:** describe subtype, genotype, lineage, treatment, and relevant microenvironment features.
4. **Within-disease analysis:** test the candidate mechanism within the chosen disease and subtype.
5. **Independent validation:** reproduce using a separate cohort, platform, or model where possible.
6. **Cross-cancer comparison:** test transfer only after disease-specific validity is established.
7. **Normal-tissue selectivity:** compare candidate dependency against relevant normal-cell/tissue evidence.
8. **Evolutionary stress test:** examine bypass routes, resistant states, and treatment-induced selection.
9. **Translation assessment:** identify the experiment required before any clinical inference is justified.

## 6. Minimum validation ladder

- **Level 0 — Signal:** computational association or descriptive pattern.
- **Level 1 — Replication:** independent dataset or cohort reproduces the signal.
- **Level 2 — Perturbation:** controlled intervention changes the predicted phenotype in a relevant model.
- **Level 3 — Mechanism:** rescue/epistasis or orthogonal assays support causal mechanism.
- **Level 4 — Selectivity and durability:** therapeutic window, normal-tissue effects, and resistance routes are assessed.
- **Level 5 — Translational evidence:** appropriately designed preclinical and clinical studies support safety and patient benefit.

A result cannot skip levels by being statistically significant or visually compelling. Clinical recommendations require clinical evidence and qualified medical oversight.

## 7. First deliverables

- [ ] Dataset registry with exact releases and access tiers.
- [ ] Evidence ledger populated with foundational claims and contradictory findings.
- [ ] One disease-specific case-study protocol.
- [ ] One cross-cancer comparison protocol using the same mechanism.
- [ ] Reproducible preprocessing and quality-control notebook.
- [ ] Analysis report that includes negative results and failed replications.
- [ ] Research questions ranked by significance, testability, selectivity, and evidence availability.

## 8. Prioritization score

Score each candidate from 0–5 on:
- clinical importance;
- mechanistic plausibility;
- quality and availability of evidence;
- independent testability;
- likelihood of tumor selectivity;
- relevance to recurrence or treatment resistance;
- feasibility of a decisive next experiment.

Keep scores and rationales visible. A high score prioritizes investigation; it does not imply the hypothesis is true.

## 9. Stop conditions

Pause or redesign a line of work when:
- the signal disappears under reasonable cohort or preprocessing choices;
- independent datasets contradict it without an explainable context boundary;
- the apparent effect is driven by batch, purity, lineage, or treatment confounding;
- the dependency is similarly essential to relevant normal cells;
- the proposed mechanism has no discriminating experiment;
- the model cannot represent the biological context required by the claim.

## 10. Immediate next step

Build the dataset registry and evidence ledger first. Then choose a disease/mechanism pair based on the available data and the strongest decisive experiment—not on which cancer is most familiar or which result looks most dramatic.

This is a research program, not a treatment protocol. No unvalidated intervention should be self-administered or presented as a cure.
