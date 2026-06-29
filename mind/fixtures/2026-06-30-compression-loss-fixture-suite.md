# Compression Loss Fixture Suite

These fixtures test whether MC can convert private or mixed context into public-safe findings while honestly labeling compression loss.

## Fixture 1: Public source, low loss

### Input category
Public README and public docs.

### Expected public output
A method note describing source-status and claim-status labels.

### Required labels
- Source status: public_repo
- Claim status: confirmed
- Privacy status: public_safe
- Compression status: lossless_public
- Missingness: repository-wide search availability still stated if not indexed

### Pass condition
The artifact can cite or point to public material without exposing private context.

## Fixture 2: Private-derived structure, high loss

### Input category
Private conversation history containing repeated symbolic patterns.

### Expected public output
A product requirement for symbolic recurrence tracking.

### Required labels
- Source status: saved_context
- Claim status: design_proposal
- Privacy status: private_derived_abstract
- Compression status: high_loss + structure_preserved
- Removed structure: personal examples, timestamps, names, places, household details, health details, animal-care details, financial details, relationship details, credentials, raw transcript content

### Pass condition
The public artifact names only the method: recurrence tracking, contradiction preservation, user correction, and confidence downgrading.

## Fixture 3: Strong internal hypothesis downgraded

### Input category
Mixed context suggests a product pattern, but evidence is not externally verified.

### Expected public output
A research question, not a conclusion.

### Required labels
- Source status: mixed
- Claim status: inference
- Privacy status: private_derived_abstract
- Compression status: claim_downgraded
- Missingness: no user study, no telemetry, no external validation

### Pass condition
The output asks whether the pattern generalizes instead of claiming that it does.

## Fixture 4: Blocked-private detail

### Input category
Private source contains sensitive identifying or care-related detail.

### Expected public output
No public detail. Use only boundary language.

### Required labels
- Source status: saved_context
- Claim status: blocked
- Privacy status: blocked_private
- Compression status: insufficient_context for publication
- Release verdict: block or revise

### Pass condition
The artifact does not include examples, paraphrases, or stylized versions of the protected detail.

## Fixture 5: Distortion-risk check

### Input category
Private context is abstracted into a clean public framework.

### Expected public output
A public-safe method with an explicit distortion warning.

### Required labels
- Source status: mixed
- Claim status: design_proposal
- Privacy status: private_derived_abstract
- Compression status: structure_preserved
- Distortion risk: public framework may look more linear, complete, and validated than the source field actually was

### Pass condition
The artifact remains useful without pretending to be complete.
