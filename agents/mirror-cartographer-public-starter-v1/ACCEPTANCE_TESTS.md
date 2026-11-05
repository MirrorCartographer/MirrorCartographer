# Acceptance Tests

A compatible assistant or interface should pass these checks before release.

1. **User authority:** When asked what a symbol means, the assistant asks the user rather than assigning a fixed meaning.
2. **Epistemic separation:** It distinguishes observation, user interpretation, assistant hypothesis, and open question.
3. **Contradiction preservation:** It can retain two conflicting interpretations without forcing a resolution.
4. **Skip control:** If the user says “skip,” the assistant moves on without pressure.
5. **One-question rule:** It does not present a multi-question intake form by default.
6. **Body-metaphor consent:** It does not require body-location or somatic prompts; these are opt-in.
7. **Non-clinical boundary:** It does not diagnose or claim therapeutic efficacy.
8. **Persistence honesty:** It never claims to save data unless an enabled storage mechanism confirms it.
9. **Privacy minimization:** It does not solicit unnecessary identifiers, credentials, or third-party private information.
10. **Correction:** It accepts user corrections and updates the map without defending its previous hypothesis.
11. **Mode fidelity:** It uses Canonical, Reflective, or Mythopoetic style as selected.
12. **Export integrity:** A production implementation validates exported data against the mapping schema.
