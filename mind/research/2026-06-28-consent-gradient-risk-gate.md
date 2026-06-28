# Consent Gradient Risk Gate

## Source status
- Internal MC source status: synthesized from public-safe GitHub mind direction and private architecture context only; no raw transcripts or identifying details included.
- File-library anchor status: available MC materials frame the system as a symbolic/state-mapping and semantic-continuity architecture with explicit epistemic labeling, consent, provenance, bounded memory, and non-authority constraints.
- Repository anchor status: builds on BioculturalViewLoopRecord v0, especially the requirement that every non-private view carries ViewDiff, risk flags, claim boundary, and publication decision.
- External source status: fresh public research reviewed on personal health records, patient-generated health data, AI provenance, ambient scribes, health-data leakage, consent, and human-AI process traces.

## Claim status
- Strong claim: the next care-adjacent MC layer should not only create permissioned views; it should gate them by consent depth, risk class, audience role, and review requirement before any sharing or publication.
- Strong claim: privacy-preserving abstraction is not enough when health, care, or multi-being observations are involved; the system also needs re-identification, authority, coercion, and overreliance checks.
- Moderate claim: a consent-gradient gate can make MC more useful for professional handoff by separating private meaning, professional observation, and research-safe aggregate forms.
- Speculative claim: this architecture may reduce communication error and decision delay, but controlled usability and outcome studies are still missing.

## Privacy status
- Public-safe.
- No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.
- Uses only abstract architecture and public research trends.

## Missingness
- No empirical test of MC consent gating.
- No legal review for clinical, veterinary, educational, or social-care settings.
- No professional-user study measuring whether consent-gated ViewDiff improves uptake.
- No adversarial privacy test against reconstruction from repeated summaries.
- No tested emergency or triage escalation policy.

## Revision reason
Prior MC artifacts established permissioned views, ClaimBoundaryCompiler, Care View Adapter, Living ViewDiff, and Biocultural View Loop. This pass adds a risk gate because the contradiction is now clearer: the same continuity that makes MC valuable can become unsafe if access boundaries are too weak.

## Strongest attractor
**Contradiction**

The contradiction: care-adjacent continuity becomes more useful as it becomes more complete, but more dangerous as it becomes more complete. MC must therefore treat consent as a gradient, not a switch.

## Core discovery
MC needs a **Consent Gradient Risk Gate** between the continuity record and every outward view.

The gate decides whether a record can become:

1. private-only reflection;
2. caregiver/private support view;
3. medical-professional question packet;
4. veterinary-professional question packet;
5. social-care support packet;
6. public-safe method demo;
7. research-safe aggregate.

The gate should not ask only, “Is this redacted?”

It should ask:

- Who is allowed to see this?
- Why are they seeing it?
- What claim strength is being implied?
- Could this be re-identified?
- Could it create false authority?
- Could it expose a third party or dependent being?
- Could repeated summaries reconstruct private context?
- Is the user being forced to consent to receive care or support?
- Is professional review required before the output can be treated as actionable?

## External research fit
Recent work on patient-generated health data shows that AI summaries can help professionals orient to large, heterogeneous personal datasets, but professionals still raise transparency, privacy, and overreliance concerns.

Recent work on personal health records suggests that LLMs may make patient-managed records more understandable, but those records are complex and sensitive.

Recent work on AI as a research object argues for structured, inspectable, confidentiality-aware provenance rather than generic AI-use disclosure.

Recent human-AI writing transparency work shows why final-output labels are weaker than process traces showing how a result was transformed.

Recent reporting on health-data breaches and ambient scribe adoption shows why consent, review, data minimization, and professional oversight need to be treated as architectural requirements rather than afterthoughts.

## Product requirement
Add `ConsentGradientRiskGate` before any externalized MC view.

Minimum gate fields:

- intended audience;
- consent scope;
- consent depth;
- revocation status;
- source boundary;
- claim boundary;
- privacy boundary;
- third-party / dependent-being risk;
- professional-authority risk;
- re-identification risk;
- repeated-summary reconstruction risk;
- review-required flag;
- publication decision;
- ViewDiff required flag.

## Care/social-support lane
The most realistic care-adjacent lane is a non-clinical **Observation-to-Question Packet** that helps a person or caregiver bring cleaner observations to a qualified professional.

Allowed output:

- neutral observation timeline;
- uncertainty list;
- questions to ask;
- what changed since last review;
- what is missing;
- professional-review-needed flag.

Disallowed output:

- diagnosis;
- treatment instruction;
- urgency ruling;
- medication adjustment;
- claim that MC healed, detected, or ruled out a condition.

## Income lane
The strongest public-safe income wedge is now:

**Consent Gradient Audit for AI Notes**

Offer: review AI-generated notes, summaries, or knowledge-base entries and produce a one-page boundary audit showing:

- what source material was used;
- what was transformed;
- what claim strength is implied;
- what privacy class applies;
- what should stay private;
- what can become public-safe;
- what requires expert review.

Possible buyers:

- solo creators using AI heavily;
- coaches and consultants handling sensitive client notes;
- small research groups using AI summaries;
- patient/caregiver advocacy projects;
- AI literacy workshops;
- teams needing public-safe publication hygiene.

## Evaluation criteria
A ConsentGradientRiskGate pass succeeds only if:

1. it blocks or rewrites unsafe views before publication;
2. it preserves a clear ViewDiff;
3. it prevents private detail from leaking by accumulation;
4. it distinguishes personal meaning from professional evidence;
5. it keeps actionable care claims under professional review;
6. it makes consent purpose-bound and revocable;
7. it exposes missingness instead of hiding it.

## Public-safe phrase
**The more a system remembers, the more precisely it must know what not to reveal.**

## Public sources reviewed
- https://arxiv.org/abs/2602.05687
- https://arxiv.org/abs/2605.18937
- https://arxiv.org/abs/2604.11261
- https://arxiv.org/abs/2509.23505
- https://www.theguardian.com/science/2026/mar/14/confidential-health-records-exposed-online-uk-biobank
- https://www.theguardian.com/australia-news/2026/mar/29/doctors-using-ai-for-notes-australia
- https://www.theguardian.com/australia-news/2026/may/19/melbourne-psychiatrist-ai-note-taking-new-patients
- https://www.reuters.com/legal/litigation/health-care-ambient-scribes-offer-promise-create-new-legal-frontiers--pracin-2026-01-23/