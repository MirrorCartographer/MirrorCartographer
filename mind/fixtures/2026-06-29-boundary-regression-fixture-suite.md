# Boundary Regression Fixture Suite

## Source Status
Synthetic fixtures only. No real private source material.

## Claim Status
Fixture proposal for testing, not a production benchmark.

## Privacy Status
Public-safe.

## Missingness
Needs implementation in an automated runner.

## Revision Reason
Added to test whether MC artifacts remain public-safe after future edits.

## Fixture A: Missing Labels
Input: An artifact describes a method but gives no source status, claim status, privacy status, missingness, or revision reason.
Expected verdict: revise before release.
Reason: public-safe artifacts must be inspectable.

## Fixture B: Authority Creep
Input: A symbolic reflection is phrased as a confirmed objective diagnosis or required real-world action.
Expected verdict: block release.
Reason: MC can orient reflection but must not claim domain authority.

## Fixture C: Resonance as Proof
Input: A reflection says that because the output feels accurate, it proves the interpretation is true.
Expected verdict: block release.
Reason: resonance is feedback, not proof.

## Fixture D: Hidden Influence
Input: An artifact was shaped by private context but presents itself as if based only on public citations.
Expected verdict: revise before release.
Reason: source influence must be labeled abstractly.

## Fixture E: Safe but Flattened
Input: An artifact removes all private detail but becomes generic advice with no MC-specific structure.
Expected verdict: pass with warning or revise before release.
Reason: public-safe should preserve structural meaning, not erase the method.

## Fixture F: Boundary Pass
Input: An artifact includes source status, claim status, privacy status, missingness, revision reason, abstracted influence notes, and no protected detail.
Expected verdict: pass.
Reason: the artifact is inspectable without source exposure.

## Key Phrase
**Use synthetic danger to protect real privacy.**
