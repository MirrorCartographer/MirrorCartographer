# Contradiction-to-Action Resolver

## Core finding

Mirror Cartographer needs a **Contradiction-to-Action Resolver**: a public-safe mechanism for turning unresolved loops, user corrections, tool failures, and conflicting interpretations into explicit next actions instead of letting them accumulate as vague symbolic tension.

Operating line:

> A contradiction is not a failure of the map. It is a request for routing.

## Source status

- **Saved-context source:** used only to understand repeated MC architecture requirements and workflow pressure points; not quoted or exposed.
- **File-library/source-memory status:** used only at the abstract architecture level where available; no private transcript content published.
- **GitHub source:** public README reviewed for current framing. The repository describes MC as a continuity atlas for preserving relationships between fragments, explicitly tracking contradictions, unresolved loops, evidence boundaries, source status, claim status, user correction, grounded next steps, outcome feedback, and public/private boundaries.
- **Raw transcript status:** not used for publication and not exposed.

## Claim status

- **Claim type:** product requirement / evaluation method / implementation plan.
- **Evidence level:** architecture-derived synthesis, not empirical validation.
- **Allowed public claim:** MC should route contradictions into visible resolution paths, such as correction, split, evidence request, user-contestation, external verification, implementation task, or retirement.
- **Not allowed public claim:** the presence of contradiction proves symbolic depth, factual truth, psychological meaning, medical relevance, or causal structure.

## Privacy status

- Public-safe.
- Contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.
- Does not quote private chats.
- Does not expose source-specific personal facts.

## Missingness

- No repository-wide contradiction inventory was completed in this pass.
- No UI control exists yet that forces every contradiction into a route.
- No empirical evaluation has tested whether users trust contradiction routing more than normal chat-style revision.
- No public demo currently shows a contradiction moving through the full lifecycle from detection to action to outcome feedback.

## Revision reason

Prior notes established source custody, missingness, claim taxonomy, revision reasons, provenance packets, mode handoff, consent gradients, public export gating, and dual-lane continuity. This note adds the next missing operational step: when MC detects conflict or unresolved loops, it needs a resolver that converts ambiguity into an inspectable action path.

## Method

Every durable contradiction should be assigned a route before it is carried forward.

Suggested contradiction routes:

1. **Correction route**
   - Use when the user, source, or later evidence directly corrects the prior map.
   - Required output: what changed, why, and which prior claim is superseded.

2. **Split route**
   - Use when two meanings are both useful but belong to different authority lanes.
   - Required output: separated claims, separated source status, separated validation path.

3. **Evidence route**
   - Use when a claim cannot move forward without outside verification.
   - Required output: what evidence would change the claim status.

4. **Contestation route**
   - Use when a reflection is rejected, marked wrong-mode, too private, incomplete, or emotionally inaccurate.
   - Required output: contestation label and rule for whether the contested item may persist.

5. **Implementation route**
   - Use when the contradiction is really a missing product feature, workflow, data field, or UI affordance.
   - Required output: product requirement or issue-ready task.

6. **Retirement route**
   - Use when a claim, metaphor, artifact, or assumption should no longer be carried forward.
   - Required output: retirement reason and whether an archive pointer remains.

## Product requirement

Add a `contradiction_route` field to durable MC artifacts when conflict, uncertainty, correction, or unresolved looping is present.

Suggested schema:

- `contradiction_id`
- `detected_from`
- `conflict_summary`
- `source_status`
- `claim_status`
- `privacy_status`
- `authority_lane`
- `route`
- `required_next_action`
- `missingness`
- `revision_reason`
- `retirement_condition`
- `outcome_feedback_status`

## Evaluation criteria

A contradiction-handling artifact passes if an outside reviewer can tell:

1. what is in conflict;
2. whether the conflict is factual, symbolic, procedural, evidentiary, privacy-related, or implementation-related;
3. what route was chosen;
4. what action follows;
5. what would revise, split, retire, or validate the item.

It fails if contradiction becomes aesthetic atmosphere without routing, proof, correction, or action.

## Public-safe index tags

- contradiction routing
- unresolved loops
- user correction
- outcome feedback
- provenance
- source boundary
- claim status
- implementation requirement
- evaluation criteria
- continuity architecture
