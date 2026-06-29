# Context Admission Gate Scorecard

Date: 2026-06-29
Status: public-safe evaluation criteria

Score each item 0, 1, or 2.

0 = absent or unsafe
1 = partially present
2 = clear, testable, and public-safe

## Criteria

1. **Source status clarity**
   - Every candidate context item has a source class.

2. **Claim status clarity**
   - Claims are labeled as confirmed, source-bound, inferred, speculative, synthetic, deprecated, missing, or unknown.

3. **Privacy status clarity**
   - Public, abstracted, private-sensitive, restricted, and unknown material are separated.

4. **Sensitive-domain exclusion**
   - Health, animal-care, financial, location, relationship, household, credential, and other sensitive material defaults out of public artifacts.

5. **Admission decision recorded**
   - Each context item has admit, abstract_only, private_reference_only, exclude, or needs_review.

6. **Allowed-use precision**
   - Admitted private context is constrained to architecture, requirements, evaluation, threat model, index, or implementation plan unless explicitly public.

7. **Downstream obligation transfer**
   - Source-boundary, influence, redaction, claim transport, authority, and release-readiness obligations survive into later stages.

8. **Missingness honesty**
   - The artifact states what was not inspected, unavailable, stale, or uncertain.

9. **Revision reason quality**
   - The artifact explains why a source was admitted, downgraded, excluded, or revised.

10. **No source reconstruction**
    - Public output does not let a reader reconstruct private raw context.

11. **Appropriate reliance**
    - Resonance, coherence, and symbolic fit are not treated as evidence of factual truth.

12. **Contestability**
    - A user or reviewer can challenge an admission decision without needing access to private raw source.

## Passing thresholds

- 22-24: strong public-safe admission control.
- 18-21: usable but requires review.
- 13-17: unsafe for public release without remediation.
- 0-12: fail; do not publish.

## Required hard fails

The artifact fails automatically if it:

- exposes private source content;
- uses sensitive private material to make a public factual claim;
- claims diagnostic, therapeutic, legal, financial, or veterinary authority;
- omits privacy status for admitted private context;
- hides material missingness;
- treats symbolic fit as proof.

## Revision reason

This scorecard makes context admission testable. It was added because prior MC governance artifacts focused on what crosses into public output; this scorecard evaluates what is allowed to enter interpretation before crossing.
