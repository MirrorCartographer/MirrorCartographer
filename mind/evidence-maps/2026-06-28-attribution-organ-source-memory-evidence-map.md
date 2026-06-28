# Evidence Map — Attribution Organ vs Source-Memory Collapse

Date: 2026-06-28
Status: claim narrowed; risk supported; MC mitigation unproven
Public-safe: yes. No private user/person material included.

## Claim tested

Original working claim:

> Mirror Cartographer needs an Attribution Organ because human-AI co-creation can blur whether a thought, phrase, interpretation, or artifact originated from the user, the AI, or the collaboration.

Safer claim after review:

> Human memory is vulnerable to source-attribution errors, and human-AI co-creation creates new attribution decisions around contribution, disclosure, and ownership. MC should preserve attribution metadata and visible authorship lineage, but it must not claim that provenance UI alone prevents source-memory errors or resolves authorship disputes.

## Why this matters for MC

MC produces interpretations, symbolic maps, revisions, and public artifacts. If the system cannot show how an idea moved from user phrase → AI interpretation → user correction → revised object, then the user may later lose track of origin, agency, and responsibility. The risk is not only privacy; it is authorship truth, self-trust, and public claim hygiene.

## Evidence reviewed

### 1. Source monitoring is a known cognitive vulnerability

Fact: The Source Monitoring Framework describes how people attribute memories, beliefs, perceptions, inferences, and imagined events to sources. Source errors arise when mental representations from different sources have similar qualitative features or when judgment criteria are weak.

Source: Johnson, Hashtroudi, & Lindsay, “Source Monitoring,” Psychological Bulletin, 1993. DOI: 10.1037/0033-2909.114.1.3.

Use for MC: Treat origin recall as fallible by default. Do not rely on the user remembering whether an interpretation was self-generated, AI-generated, imported, or jointly revised.

### 2. Cryptomnesia / inadvertent plagiarism shows idea-origin confusion can happen without intent

Fact: Experimental work on cryptomnesia shows people can reproduce earlier ideas while misattributing them as novel or self-generated.

Sources:
- Brown & Murphy, “Cryptomnesia: Delineating inadvertent plagiarism,” Journal of Experimental Psychology: Learning, Memory, and Cognition, 1989.
- Marsh, Landau, & Hicks, “Contributions of inadequate source monitoring to unconscious plagiarism during idea generation,” Journal of Experimental Psychology: Learning, Memory, and Cognition, 1997.

Use for MC: Idea-origin loss should be treated as a normal cognitive failure mode, not a moral accusation.

### 3. Human-AI co-creation produces contested attribution judgments

Fact: A 2025 survey study of knowledge workers found that people assign different levels of credit depending on contribution type, amount, and initiative; participants considered disclosure important, but judgments varied by values and technology beliefs.

Source: Jessica He, Stephanie Houde, Justin D. Weisz, “Which Contributions Deserve Credit? Perceptions of Attribution in Human-AI Co-Creation,” arXiv:2502.18357, 2025.

Use for MC: A single binary label such as “AI-assisted” is too weak. MC needs contribution-type lineage: introduced, transformed, selected, rejected, corrected, approved, published.

### 4. Provenance / watermarking helps but is incomplete

Fact: SynthID-style watermarking and C2PA-style content provenance are active approaches for identifying AI-generated or transformed content. However, watermarking can be weakened by paraphrase, transformation, translation, copy-paste modification, platform loss, or non-participating tools.

Sources:
- Google DeepMind / SynthID-Text reporting and public coverage, 2024.
- Han et al., “Robustness Assessment and Enhancement of Text Watermarking for Google's SynthID,” arXiv:2508.20228, 2025.
- C2PA / Content Credentials public standard and provenance ecosystem.

Use for MC: MC should not depend only on external watermarking or post-hoc detection. The system should keep its own local lineage ledger at the object level.

### 5. Legal and public-facing authorship rules increase the need for documentation

Fact: Current U.S. copyright guidance and court treatment continue to emphasize human authorship for copyrightable works, and legal commentary in 2026 treats documentation of human contribution as important for AI-generated or AI-assisted outputs.

Source: Reuters legal analysis, “Eight legal questions for your AI company,” 2026-06-05; discussion of Thaler v. Perlmutter and U.S. Copyright Office human-authorship requirement.

Use for MC: Public artifacts should preserve human contribution evidence separately from internal symbolic meaning.

## Fact vs inference

### Facts supported by sources

- Human source monitoring is fallible.
- People can misattribute externally encountered ideas as self-generated.
- Human-AI co-creation creates nontrivial attribution judgments.
- Binary AI-disclosure labels are too coarse for many contribution questions.
- Watermarking and provenance systems are useful but incomplete and vulnerable to transformation or ecosystem gaps.
- Public-facing AI-assisted work benefits from documentation of human contribution.

### MC-specific inferences

- MC likely needs an Attribution Organ if it generates durable interpretations or public artifacts.
- Attribution should be stored at object-transition level, not only session level.
- The most important unit is not “AI used: yes/no” but “who/what introduced, transformed, selected, approved, and exported this claim.”
- Attribution controls may strengthen user agency, but this has not been proven.

### Unsupported / not yet claimed

- MC attribution UI prevents source-memory errors.
- MC attribution logs make copyright or ownership determinations automatically valid.
- Users will understand lineage records without training.
- More attribution metadata always improves trust.

## Claim-status update

Status: PARTIALLY SUPPORTED.

Supported:
- The underlying risk is real enough to justify design work.
- Existing provenance/disclosure approaches suggest a direction.

Not yet supported:
- That MC’s proposed Attribution Organ improves recall, authorship clarity, agency, or public trust in practice.

## Evaluation criterion: ATTRIBUTION-01

An MC interpretation or artifact passes Attribution-01 only if a later reviewer can answer the following without reconstructing the whole conversation:

1. What was the original user-supplied material?
2. What did the AI add, infer, compress, translate, or rename?
3. What did the user explicitly accept, reject, or revise?
4. What claims remain uncertain or inferred?
5. What version was exported or published?
6. What should not be attributed solely to the user?
7. What should not be attributed solely to the AI?

Passing threshold for prototype test:
- At least 80% correct source classification across artifact components.
- No high-impact claim loses its source label.
- User can identify at least one AI-added inference and one user-approved revision.

## Minimal test plan

Create five versions of the same symbolic interpretation workflow:

1. No attribution record.
2. Simple “AI-assisted” label.
3. Timestamped transcript only.
4. Object-level attribution ledger.
5. Visual Attribution Organ with source, transformation, approval, uncertainty, and export state.

Test after delay:
- Immediate review.
- 24-hour review.
- 7-day review if possible.

Measure:
- Correct origin recall.
- Detection of AI-added inferences.
- Detection of user-authored material.
- Confidence calibration.
- Felt agency.
- Friction / annoyance.
- Public-readiness judgment.

## Falsification checklist

The Attribution Organ should be weakened, redesigned, or demoted if:

- Users perform no better than transcript-only control.
- Users trust AI-added inferences more because they look formally documented.
- Attribution records become paperwork users ignore.
- The visual system makes users less willing to revise or contest interpretations.
- Object lineage creates false certainty about legal authorship or ownership.
- The feature protects the system’s accountability more than the user’s agency.

## Design requirement: R-ATTRIBUTION-01

Every durable MC Interpretation Object must store a compact attribution ledger with:

- source fragment
- contributor class: user / AI / external source / mixed / unknown
- transformation type: quote / paraphrase / inference / synthesis / rename / compression / expansion / correction
- approval state: unreviewed / user-accepted / user-rejected / user-corrected / superseded
- uncertainty state: fact / inference / metaphor / hypothesis / unknown
- export state: private / shared / public / removed
- revision parent
- timestamp

## Next proof needed

Build a tiny Attribution Organ prototype around one artifact moving through four states:

user phrase → AI interpretation → user correction → public-safe artifact

Then compare it against transcript-only and AI-assisted-label controls. The next proof is not more theory; it is whether users can still tell what came from whom after time passes, without the interface becoming legal paperwork.
