# Boundary Regression Testing for Public-Safe Mirror Cartographer Artifacts

## Source Status
- Private-context influence: architecture-only, not quoted and not exposed.
- File-library influence: public-safe snippets from Mirror Cartographer specification and implementation materials.
- GitHub influence: prior public `mind/` pattern inferred from existing automation outputs and current repository target.
- External research influence: 2026 work on trustworthy memory search, memory poisoning, privacy-preserving agent memory, and AI-agent security incidents.

## Claim Status
- Confirmed from MC materials: Mirror Cartographer is a recursive symbolic cognition interface using `ENTRY -> FIELD -> RECURSION -> RETURN`, session memory, exportable artifacts, uncertainty boundaries, and explicit non-authority framing.
- Confirmed from current research: persistent memory is a trust boundary, not a neutral utility layer; contextually inappropriate memory can produce cross-domain leakage, sycophancy, tool drift, or memory-induced jailbreak behavior.
- Product inference: MC needs a boundary regression test suite that checks whether later artifacts accidentally reintroduce private, overclaiming, or authority-crossing content after earlier public-safety passes.
- Speculative design direction: boundary regression tests should become a pre-release CI gate for public-facing artifacts.

## Privacy Status
- Public-safe: yes.
- Contains personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details: no.
- Uses private context only to identify architectural pressure: yes.
- Publishes only abstracted method, evaluation criteria, and implementation planning: yes.

## Missingness
- No full repository tree was available through code search indexing.
- No automated CI implementation was inspected in this run.
- No raw private transcript was published or used as evidence.
- External sources are research/search summaries, not a full systematic literature review.

## Revision Reason
Prior runs created gates and ledgers for context admission, release readiness, claim transport, influence, redaction fidelity, and source-boundary materials. The missing layer is regression: proving the boundary still holds after new artifacts, edits, automation turns, or future contributors modify the system.

## Core Finding
Public-safe systems can regress. A safe artifact today can become unsafe tomorrow if later edits add excessive specificity, authority claims, unscoped memory influence, private-source residue, or unsupported certainty. MC therefore needs **Boundary Regression Testing**: repeatable tests that inspect outputs for boundary failure after every meaningful artifact change.

## Boundary Regression Classes

### 1. Privacy Regression
Checks whether public artifacts contain protected source classes, raw transcript traces, personal identifiers, intimate context, care details, credentials, or localizing details.

### 2. Claim Regression
Checks whether a bounded reflection becomes a factual, diagnostic, therapeutic, legal, financial, veterinary, medical, or objective-truth claim.

### 3. Source-Boundary Regression
Checks whether a public artifact implies access to a private source without labeling its source boundary, admissibility, influence, or missingness.

### 4. Resonance/Proof Regression
Checks whether emotional fit, symbolic resonance, recurrence, or user validation is presented as proof.

### 5. Agency Regression
Checks whether the system tells the user what they are, what must be true, what they must do, or what reality means without preserving contestability.

### 6. Continuity Regression
Checks whether memory continuity is treated as permission to reuse private context across domains, audiences, or release surfaces.

### 7. Flattening Regression
Checks whether public-safe abstraction removes so much structure that the method becomes generic, untestable, or no longer recognizably MC.

## Proposed Test Object
Every public artifact should generate a `BoundaryRegressionRecord` with:

- artifact path
- artifact type
- intended audience
- source classes admitted
- source classes excluded
- privacy-risk scan result
- authority-risk scan result
- claim-mode scan result
- source-boundary scan result
- missingness scan result
- contestability scan result
- representational-fidelity scan result
- regression verdict
- required revision reason

## Product Requirement
Boundary regression testing should run after artifact generation and before publication. It should not rely on the model simply promising privacy. It should force an artifact to pass explicit checks for leakage, authority creep, missing labels, overcertainty, and flattening.

## Evaluation Criteria
A public artifact passes only if it:

1. exposes no protected source detail;
2. labels source status, claim status, privacy status, missingness, and revision reason;
3. separates fact, inference, symbolic interpretation, and speculation;
4. preserves user contestability;
5. avoids diagnostic or authority claims;
6. identifies what context was excluded;
7. preserves enough structural signal to remain useful;
8. states when GitHub write or publication is inappropriate;
9. names any unresolved uncertainty;
10. remains readable outside the originating private conversation.

## Research Questions
- How can MC test privacy safety without preserving the sensitive material it is testing against?
- What is the minimum public boundary metadata needed for an artifact to be inspectable?
- Can synthetic fixtures adequately simulate boundary failures without using real private content?
- How should MC distinguish meaningful structural fidelity from unsafe source specificity?
- What failures should block publication versus require only a warning label?

## Implementation Plan
1. Define a `boundary-regression-record-v0` schema.
2. Build synthetic fixture cases for each regression class.
3. Add a scorecard with pass/fail and severity levels.
4. Require every public artifact to include a boundary block.
5. Add a release gate that fails if boundary metadata is absent.
6. Keep private-source evidence out of public fixtures by using synthetic examples only.

## Key Phrase
**A boundary that is not retested becomes decoration.**
