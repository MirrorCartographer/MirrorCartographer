# Evidence Map: Attribution Trace Ledger Needs Proof

Date: 2026-06-28
Status: claim narrowed; test required before treating as validated architecture
Public-safety note: this artifact abstracts all personal/private material. It treats Mirror Cartographer as a general reflective AI / symbolic cognition interface.

## Claim tested

Mirror Cartographer should use an Attribution Trace Ledger to reduce authorship confusion and preserve user agency in human-AI symbolic reflection.

## Why this claim matters

Recent MC architecture work added or implied several process-history layers:

- Memory Agency
- Map Delta
- Symbolic Relevance Mask
- Reflective Control Plane
- Attribution Trace Ledger

These all depend on one deeper assumption: if MC records source, edits, AI inference, memory influence, and rollback paths, users will better understand what came from them, what came from AI, and what changed over time.

That assumption is plausible, but not proven.

## Evidence found

### Fact: mixed human-AI work can impair source memory

High-quality HCI evidence reports an "AI Memory Gap": after AI involvement, users are less able to correctly remember whether ideas/text came from themselves or AI, with the steepest attribution decline in mixed human-AI workflows.

Implication for MC: symbolic reflection is often mixed human-AI work. MC should assume source-memory confusion is a real risk, especially when the system elaborates, reframes, names, or stores interpretations.

Claim support level: strong for risk existence; not yet proof of ledger effectiveness.

### Fact: attribution judgments in human-AI co-creation are socially and cognitively complex

Research on credit in human-AI co-creation shows people do care about AI disclosure and use several criteria to judge credit: contribution quality, user values, and technology role.

Implication for MC: a binary label such as "AI-assisted" is too shallow. MC needs provenance fields that separate input, inference, transformation, storage, and later reuse.

Claim support level: moderate for richer attribution design; still indirect for MC.

### Fact: AI risk frameworks treat transparency, provenance, redress, and human-AI interaction as governance concerns

NIST AI RMF emphasizes that transparency can be necessary for redress when AI outputs are wrong or harmful, and that transparency should account for human-AI interaction and post-deployment decisions.

Implication for MC: a trace ledger can be framed as a redress and audit mechanism: the user should be able to inspect, contest, revise, or roll back interpretations.

Claim support level: strong for governance rationale; indirect for UX design.

### Fact: content provenance systems record origin/edit history, but provenance is not truth

C2PA / Content Credentials provide technical standards for origin and edit-history assertions. However, even official explainers and recent provenance research stress that provenance does not itself prove authenticity, truth, safety, or meaning.

Implication for MC: a ledger must not be presented as proof that an interpretation is correct. It only records process state and claimed source relations.

Claim support level: strong caution against overclaiming.

## Fact vs inference

### Facts supported by current sources

1. Human-AI collaboration can produce source-memory confusion.
2. Mixed human-AI workflows appear especially vulnerable to attribution errors.
3. Users care about disclosure and credit in co-created work.
4. Provenance/transparency are recognized AI governance concerns.
5. Provenance metadata does not prove truth or authenticity by itself.

### Inferences for MC

1. MC symbolic interpretations are likely vulnerable to source-memory confusion because they blend user symbols, AI inference, memory, and later revision.
2. A process ledger may help users preserve authorship boundaries.
3. The ledger should track more than final output: source input, AI inference, user edit, memory influence, confidence change, scope, and rollback.
4. The ledger may create cognitive burden if it is too dense, legalistic, or visually heavy.
5. The right design is probably a layered trace: simple visible attribution by default, expandable audit detail on demand.

## Claim status update

Previous phrasing to avoid:

"The Attribution Trace Ledger preserves authorship."

Safer current phrasing:

"The Attribution Trace Ledger is a plausible mitigation for source-memory confusion in MC, but it must be tested. It should be treated as an inspectable process record, not as proof of interpretation truth or authorship certainty."

## Evaluation criterion added

### Attribution Clarity Criterion

For any saved or reused MC interpretation, a user should be able to answer these questions without needing to reconstruct the whole chat:

1. What was the original user-provided material?
2. What did the AI infer, rename, summarize, or add?
3. What did the user accept, reject, edit, or leave unresolved?
4. What memory, prior map state, or relevance mask influenced the interpretation?
5. What changed since the previous version?
6. What confidence or uncertainty changed?
7. What is stored now, and where will it be reused?
8. How can the user weaken, delete, quarantine, or roll back the interpretation?

Pass condition: at least 80% of test users can correctly answer 6 of 8 questions for medium-impact interpretations after a delay.

Fail condition: users over-trust the ledger, treat it as truth certification, or cannot tell user-originated material from AI-originated inference.

## Falsification checklist

The Attribution Trace Ledger claim weakens if testing shows any of the following:

- Users still misattribute AI-originated interpretations to themselves after review.
- Users still misattribute their own ideas to AI after review.
- The ledger increases perceived authority of weak interpretations.
- The ledger makes MC feel surveillant, clinical, legalistic, or exhausting.
- Users ignore the ledger because it is too dense.
- Users cannot reverse memory influence after seeing the trace.
- The ledger improves auditability for developers but not agency for users.

## Test plan: attribution-ledger-testset-v0.1

Create 48 synthetic public-safe MC sessions.

### Case distribution

- 12 low-impact symbolic interpretations
- 12 medium-impact identity-adjacent interpretations
- 8 memory-influenced reinterpretations
- 8 relevance-mask edited interpretations
- 4 user-originated ideas that AI only restates
- 4 AI-originated frames that users may falsely adopt as their own

### Experimental comparison

Compare three interface variants:

A. No trace ledger: final interpretation only
B. Minimal ledger: user / AI / memory tags only
C. Layered ledger: visible attribution summary plus expandable process trace and rollback controls

### Measures

- Source-attribution accuracy immediately
- Source-attribution accuracy after delay
- User confidence calibration
- Perceived agency
- Perceived surveillance/burden
- Ability to reverse or constrain memory influence
- Flow preservation during symbolic work

## Design requirement produced by this evidence map

The ledger must be:

- contestable, not authoritative
- process-based, not just label-based
- layered, not always fully expanded
- reversible, not merely informational
- visually symbolic where possible, not compliance-dashboard style
- scoped to future influence, not only past authorship

## Next proof needed

Build `attribution-ledger-testset-v0.1` and run a small controlled evaluation comparing no ledger, minimal tags, and layered ledger. The key proof is not whether the ledger is accurate internally; it is whether users can accurately perceive authorship, memory influence, uncertainty, and rollback options without losing symbolic flow.
