# Public Proof Provenance Boundary — Run 93

Date: 2026-07-03  
Status: evidence map + claim-status boundary + falsification checklist added  
Claim tested: Mirror Cartographer can use AI-generated public proof artifacts as trustworthy evidence of project value if they are compelling, detailed, or visually persuasive.

## Result

The claim is downgraded.

Mirror Cartographer can use AI-generated public artifacts as demonstrations, communication objects, prototypes, or examples of system behavior. It should not treat them as independent proof of truth, market value, safety, authorship, real-world implementation, or user impact unless provenance, process history, source lineage, and validation evidence are separately documented.

A beautiful or persuasive artifact can increase attention. It does not automatically increase evidential confidence.

## Evidence found

### High-quality / primary sources

1. NIST AI Risk Management Framework 1.0  
   Source: https://airc.nist.gov/airmf-resources/airmf/  
   Relevant finding: NIST frames AI trustworthiness as something that must be incorporated into design, development, use, and evaluation. It operationalizes AI risk management through Govern, Map, Measure, and Manage functions. This supports the need for process controls and evaluation rather than relying on artifact persuasiveness alone.

2. C2PA Specifications 2.2  
   Source: https://spec.c2pa.org/specifications/specifications/2.2/index.html  
   Relevant finding: C2PA exists to certify the source and history, or provenance, of media content through technical standards. This supports the idea that media artifacts need provenance metadata/history if they are being used as trust-bearing objects.

3. Partnership on AI Responsible Practices for Synthetic Media  
   Source: https://syntheticmedia.partnershiponai.org/  
   Relevant finding: PAI treats synthetic media governance as a matter of consent, disclosure, and transparency. It explicitly states the framework is guidance, a living document, and that PAI is not auditing or certifying organizations. This supports transparency requirements while warning against treating voluntary guidance as certification.

4. Independent security analysis of C2PA  
   Source: https://arxiv.org/abs/2604.24890  
   Relevant finding: The paper argues that current C2PA specifications should not be relied upon prematurely for high-stakes uses such as legal evidence, journalism, or financial disclosures. This does not invalidate provenance systems, but it limits overclaiming from provenance metadata alone.

5. Washington Post reporting on C2PA metadata loss across platforms  
   Source: https://www.washingtonpost.com/technology/2025/10/22/ai-deepfake-sora-platforms-c2pa/  
   Relevant finding: In a platform test, most social platforms did not preserve or surface AI-content provenance metadata. This supports a practical risk: provenance can disappear during distribution, so MC should not assume public platforms preserve proof metadata.

## Fact vs. inference

### Facts

- C2PA is a technical provenance standard intended to certify source/history information for media content.
- NIST AI RMF treats trustworthy AI as requiring lifecycle governance, mapping, measurement, and management.
- PAI’s synthetic media framework emphasizes disclosure and transparency, but does not function as an audit or certification scheme.
- Recent independent research and reporting identify limitations in provenance systems, including possible specification weaknesses and metadata loss during distribution.
- AI-generated media may be compelling while still lacking independent validation.

### Inference

Mirror Cartographer should treat AI-generated public proof artifacts as communication artifacts unless they are paired with explicit provenance and validation records.

A public proof artifact can support claims such as:

- “MC can generate this kind of artifact.”
- “MC can communicate this concept in this form.”
- “This is a candidate demo for external review.”

It should not, by itself, support claims such as:

- “MC is validated.”
- “MC has market demand.”
- “MC is safe for vulnerable users.”
- “MC is effective.”
- “This artifact proves user impact.”
- “The artifact’s polish proves the underlying system works.”

## Claim-status update

### Previous implied claim

Public proof artifacts can serve as evidence of Mirror Cartographer’s value if they are persuasive, detailed, original, or visually strong.

### Updated claim

Public proof artifacts can serve as demonstrations of expression, interface, concept, or workflow. They become evidence only to the degree that their provenance, source lineage, generation process, validation context, and external evaluation are documented.

Status: supported as a governance boundary; not yet validated as a public-proof system.

## Evidence role classification

| Source | Role | Directness | Notes |
|---|---|---|---|
| NIST AI RMF | Governance authority | Partial/direct for lifecycle evaluation requirement | Supports need for evaluation and risk controls, not MC-specific proof |
| C2PA Specifications | Technical provenance standard | Direct for provenance mechanism existence | Does not prove sufficiency for all high-stakes proof contexts |
| PAI Synthetic Media Framework | Normative guidance | Direct for disclosure/transparency norms | Explicitly not certification or audit |
| Independent C2PA security analysis | Contradiction/limitation source | Direct for boundary-setting | Challenges overreliance on provenance systems |
| Washington Post platform test | Practical distribution-risk source | Partial/direct | Shows metadata may not survive platform distribution |

## Evaluation criterion: PUBLIC-PROOF-PROVENANCE-01

A Mirror Cartographer public proof artifact may be used as evidence only if it includes a provenance packet with:

1. artifact title and version;
2. date created;
3. author/contributor roles, including AI contribution;
4. generation or production method;
5. source materials used;
6. claim(s) the artifact is intended to support;
7. claim(s) the artifact does not support;
8. validation status;
9. known limitations;
10. distribution path and whether metadata/provenance survives that path;
11. external reviewer notes, if any;
12. whether the artifact is demonstration, evidence, marketing, or tested proof.

## Falsification checklist

Downgrade or reject a public proof claim if any of the following occur:

- The artifact is AI-generated but not disclosed as such.
- The artifact is persuasive but has no source lineage.
- The artifact claims external impact without external review or user data.
- The artifact is used to imply safety without safety testing.
- The artifact is used to imply market value without buyer/employer/user response data.
- Metadata or provenance is stripped in distribution and no alternate record is preserved.
- A synthetic media standard is treated as certification when it is only guidance or technical infrastructure.
- The artifact’s aesthetic quality is used as a proxy for implementation quality.

## Test plan: MC-PUBLIC-PROOF-PROVENANCE-PILOT-01

Select 10 existing or new MC public artifacts.

For each artifact, create a provenance packet and score:

- source lineage completeness;
- AI contribution disclosure;
- claim-to-artifact fit;
- validation status;
- reviewer clarity;
- distribution metadata survival;
- risk of overclaim;
- audience misunderstanding risk.

Then have at least three reviewers answer:

1. What does this artifact prove?
2. What does it merely demonstrate?
3. What claim does it tempt the reader to overbelieve?
4. What additional evidence would be needed before public use?

## Next proof needed

Run MC-PUBLIC-PROOF-PROVENANCE-PILOT-01.

The next proof is not another visual artifact. It is a sidecar provenance packet attached to at least 10 public artifacts, followed by reviewer testing to see whether readers can distinguish demonstration from evidence.

If reviewers consistently understand what each artifact does and does not prove, MC can claim it has an emerging public-proof provenance discipline. Until then, public proof should remain a design ambition, not a validated evidence layer.
