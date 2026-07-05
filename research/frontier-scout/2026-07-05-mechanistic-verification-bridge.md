# Frontier Scout: Mechanistic Verification Bridge

## Actionable design implication

Mirror Cartographer should add a **Mechanistic Verification Bridge** between hypothesis generation and discovery-memory admission.

A generated hypothesis should not be routed directly into long-term discovery memory only because it is novel, plausible, or textually supported. It should first be converted into a bridge packet that requires:

1. a mechanistic object of interest,
2. at least one measurable variable,
3. at least one verification modality,
4. a falsification route,
5. a privacy/public-safety boundary,
6. source-status separation from claim-status,
7. an explicit missingness field.

This converts frontier scientific-AI work into an MC rule: **hypotheses become useful only when they are attached to measurable mechanistic probes and verifiable evidence routes.**

---

## Frontier source map

| Source | Source status | Relevant signal | MC design consequence |
|---|---|---|---|
| Google / Nature Co-Scientist, 2026 | peer-reviewed research article | AI co-scientist systems generate and refine research hypotheses using tools, grounding, and scientist feedback | MC should treat generated hypotheses as draft objects requiring external grounding and review, not conclusions |
| ProjectionBench, 2026 | arXiv preprint; caveat: not peer reviewed | progressive disclosure evaluates whether a model can infer hypotheses before seeing full conclusions | MC should preserve stage-of-disclosure metadata and penalize late-context conclusion copying |
| OpenScientist, 2026 | medRxiv/PubMed indexed preprint; caveat: clinical research claims require external validation | open agentic co-scientist workflows emphasize auditable biomedical hypothesis generation | MC should prefer open, inspectable hypothesis packets with provenance and reviewer-facing logs |
| Royal Society verification paper, 2026 | peer-reviewed/institutional journal source | AI-driven scientific discovery requires verification rather than unchecked automation | MC should require falsification and verification routes before promotion |
| Biohub AI models / ESM protein-world-model release, 2026 | research institution / open model release | biological foundation models increasingly target mechanistic design and virtual testing before wet-lab experiments | MC should distinguish computational/mechanistic plausibility from real-world validation |
| Nature synthetic clinical data collection | journal collection / call for reproducible submissions | trustworthy health AI requires synthetic data, privacy guarantees, provenance, utility and privacy evaluation | MC should store public-safe synthetic fixtures separately from private longitudinal records |

---

## Bridge packet schema sketch

```json
{
  "schema_version": "1.0",
  "record_type": "mechanistic_verification_bridge",
  "id": "mvb.synthetic.example.001",
  "hypothesis_id": "string",
  "hypothesis_text_public_safe": "string",
  "mechanistic_object": {
    "domain": "biology|neuroscience|scientific_ai|medical_ai|animal_health_research|hci|privacy_memory|symbolic_translation",
    "entity": "string",
    "proposed_mechanism": "string"
  },
  "source_status": "primary|preprint|institutional|benchmark|dataset|synthetic|unknown",
  "claim_status": "candidate|mechanistic_model|prediction|supported|contradicted|inconclusive",
  "privacy_status": "public_safe|synthetic_only|deidentified_required|private_blocked",
  "evidence_strength": "none|low|moderate|high",
  "missingness": ["string"],
  "revision_reason": "string",
  "implementation_status": "planned|specified|implemented|validated",
  "measurable_variables": [
    {
      "name": "string",
      "unit_or_scale": "string",
      "measurement_route": "string"
    }
  ],
  "verification_modalities": [
    "literature_crosswalk",
    "synthetic_fixture",
    "benchmark_eval",
    "simulation",
    "external_dataset",
    "expert_review"
  ],
  "falsification_route": "string",
  "next_executable_action": "string"
}
```

---

## Acceptance criteria

A packet passes only if all conditions are true:

1. `privacy_status` is not `private_blocked`.
2. `claim_status` is not more advanced than the supporting `evidence_strength` allows.
3. At least one measurable variable is present.
4. At least one verification modality is present.
5. A falsification route is explicit and testable.
6. Missingness is recorded even when empty.
7. Computational evidence is not labeled as biological, clinical, or real-world validation unless the source explicitly supports that status.
8. Medical and animal-health records remain research-organization artifacts only; no diagnosis, treatment, or veterinary advice may be emitted.

---

## Synthetic examples

### Pass example

```json
{
  "schema_version": "1.0",
  "record_type": "mechanistic_verification_bridge",
  "id": "mvb.synthetic.pass.001",
  "hypothesis_id": "hyp.synthetic.early_signal_routing",
  "hypothesis_text_public_safe": "Stage-aware hypothesis systems reduce unsupported discovery-memory promotions compared with single-pass hypothesis generation.",
  "mechanistic_object": {
    "domain": "scientific_ai",
    "entity": "hypothesis-routing pipeline",
    "proposed_mechanism": "progressive disclosure plus verification gating separates early inference from late recall and overclaiming"
  },
  "source_status": "preprint",
  "claim_status": "candidate",
  "privacy_status": "public_safe",
  "evidence_strength": "low",
  "missingness": ["no MC-specific benchmark run yet", "no human reviewer labels yet"],
  "revision_reason": "convert frontier scout signal into executable gate requirement",
  "implementation_status": "specified",
  "measurable_variables": [
    {
      "name": "unsupported_promotion_rate",
      "unit_or_scale": "fraction 0-1",
      "measurement_route": "count promoted hypotheses lacking verification route divided by all promoted hypotheses"
    },
    {
      "name": "late_context_copy_score",
      "unit_or_scale": "fraction 0-1",
      "measurement_route": "overlap between generated hypothesis and withheld conclusion at each disclosure stage"
    }
  ],
  "verification_modalities": ["synthetic_fixture", "benchmark_eval", "expert_review"],
  "falsification_route": "If the bridge gate does not reduce unsupported promotions or only blocks useful hypotheses without improving verification completeness, revise or remove the gate.",
  "next_executable_action": "Implement tools/mechanistic_verification_bridge/validate_bridge_packet.py with pass/fail fixtures."
}
```

### Reject example

```json
{
  "schema_version": "1.0",
  "record_type": "mechanistic_verification_bridge",
  "id": "mvb.synthetic.reject.001",
  "hypothesis_id": "hyp.synthetic.overclaim",
  "hypothesis_text_public_safe": "A model output proves a cure pathway.",
  "mechanistic_object": {
    "domain": "medical_ai",
    "entity": "unspecified",
    "proposed_mechanism": "unspecified"
  },
  "source_status": "unknown",
  "claim_status": "supported",
  "privacy_status": "public_safe",
  "evidence_strength": "none",
  "missingness": [],
  "revision_reason": "none",
  "implementation_status": "planned",
  "measurable_variables": [],
  "verification_modalities": [],
  "falsification_route": "",
  "next_executable_action": "reject"
}
```

Expected rejection reasons:

- unsupported promotion to `supported`
- no measurable variables
- no verification modality
- empty falsification route
- no specific mechanism
- cure overclaim

---

## Labels

- **Source status:** public frontier source synthesis; mostly primary, institutional, peer-reviewed, or preprint sources with caveats.
- **Claim status:** infrastructure design implication, not a medical/veterinary/scientific conclusion.
- **Privacy status:** public-safe abstraction only; synthetic examples only.
- **Missingness:** no validator code yet; no real benchmark run; no reviewer agreement data.
- **Revision reason:** current MC gates evaluate source, privacy, symbolic translation, progressive disclosure, and dual-source grounding, but do not yet require a mechanistic verification bridge before discovery-memory promotion.
- **Implementation status:** implementation-ready specification committed.
- **Evidence strength:** moderate for infrastructure direction; low for MC-specific effectiveness until tested.
- **Falsification route:** reject or revise this bridge if it fails to reduce unsupported promotions, blocks useful verified hypotheses disproportionately, or cannot represent real discovery workflows without ambiguous fields.
- **Next executable action:** build `tools/mechanistic_verification_bridge/validate_bridge_packet.py`, `fixtures.synthetic.json`, and `test_validate_bridge_packet.py`.
