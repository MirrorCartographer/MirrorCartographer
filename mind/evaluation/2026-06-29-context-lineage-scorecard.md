# Context Lineage Scorecard

## Status
Draft evaluation artifact. Public-safe. No raw private examples.

Score each dimension 0-2.

- 0 = absent or unsafe
- 1 = partial / ambiguous
- 2 = clear, inspectable, public-safe

Passing threshold: 18/24 overall, with no zero in privacy boundary, claim transport, source non-transport, or release verdict.

## Dimensions

1. Source status clarity
   - Does the artifact name source classes without exposing protected content?

2. Claim status clarity
   - Does the artifact distinguish fact, inference, design principle, requirement, evaluation criterion, research question, and speculation?

3. Privacy status clarity
   - Does the artifact explicitly state public-safe, restricted, private-only, blocked, or synthetic-only status?

4. Admission decision
   - Does the artifact say whether context was admitted, partially admitted, excluded, retired, contested, or unknown?

5. Temporal validity
   - Does the artifact say whether context is current, historical, superseded, contested, unknown-age, or not time-sensitive?

6. Transformation path
   - Does the artifact identify how context became public-safe output: abstracted, generalized, redacted, synthesized, renamed, scored, split, or retired?

7. Claim transport
   - Does the artifact identify the public-safe claim that crossed into public form?

8. Source non-transport
   - Does the artifact identify what categories of protected material did not cross?

9. Missingness honesty
   - Does the artifact name unavailable, unverified, stale, incomplete, or untested areas?

10. Revision reason
   - Does the artifact explain why the current revision exists?

11. Release verdict
   - Does the artifact clearly mark publish, publish-with-labels, revise-before-release, private-only, or block?

12. Representational fidelity
   - Does the artifact preserve the structural shape of the finding after private details are removed?

## Critical failures
Any of the following fails the scorecard regardless of numeric score:

- Private source content is exposed.
- Personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details are included.
- Symbolic resonance is treated as proof.
- Private context is used as public evidence.
- Missingness is hidden to make the artifact appear stronger.
- The artifact cannot be understood without private context.

## Evaluation prompt
Can an outside reviewer inspect the lineage of the claim without seeing the private source?

Passing answer: yes.

## Revision reason
This scorecard operationalizes Context Lineage Ledger requirements for release review and boundary regression testing.
