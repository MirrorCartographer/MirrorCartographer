# Evidence Map: No-Save Mode vs Privacy Protection

Date: 2026-07-05
Run: Evidence Engine 137
Domain: Mirror Cartographer privacy / safety / product governance
Status: claim narrowed; operational test required

## Claim tested

Mirror Cartographer can offer a "no-save" or one-off session mode that protects user privacy.

## Updated claim status

Previous implied claim:

> A no-save / one-off mode protects privacy because it avoids persistent profile storage.

Updated claim:

> A no-save / one-off mode can reduce persistence risk, but it does not by itself prove privacy protection. Privacy requires verified data-flow limits, retention controls, inference-risk assessment, logging boundaries, deletion behavior, user notice, and periodic audit.

Confidence: moderate for the narrowed claim. The source base strongly supports privacy risk management, data minimization, and AI privacy risk assessment as requirements. It does not specifically evaluate Mirror Cartographer's implementation.

## Evidence found

### Facts from primary or high-quality sources

1. NIST describes the Privacy Framework as a voluntary enterprise risk-management tool intended to help organizations identify and manage privacy risk while protecting individuals' privacy.
   Source: NIST Privacy Framework page, lines 137-139 and 184-190.
   URL: https://www.nist.gov/privacy-framework

2. NIST AI RMF states that privacy safeguards human autonomy, identity, and dignity, and includes limits on intrusion, observation, consent, and control of identity facets such as body, data, and reputation.
   Source: NIST AI RMF 1.0, Privacy-Enhanced section, lines 522-527.
   URL: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

3. NIST AI RMF states that privacy values such as anonymity, confidentiality, and control should guide AI design, development, and deployment, and that AI systems can create privacy risks by inferring individual identity or previously private information.
   Source: NIST AI RMF 1.0, lines 528-533.
   URL: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

4. NIST AI RMF states that privacy-enhancing technologies and data-minimizing methods, including de-identification and aggregation for certain outputs, can support privacy-enhanced AI systems, but can involve tradeoffs under some conditions.
   Source: NIST AI RMF 1.0, lines 534-537.
   URL: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

5. FTC business guidance pages emphasize privacy and security as business responsibilities, with the FTC enforcing consumer-protection law against unfair or deceptive practices.
   Source: FTC Privacy and Security business guidance page, lines 150-159 and 244-247.
   URL: https://www.ftc.gov/business-guidance/privacy-security

6. Machine-learning privacy research argues that data minimization reduces exposure from collection, processing, retention, misuse, unauthorized access, and breach risk, but also warns that practical minimization is difficult and may not fully match privacy expectations without broader risk modeling.
   Source: Ganesh, Tran, Shokri, Fioretto, "The Data Minimization Principle in Machine Learning," 2024.
   URL: https://arxiv.org/abs/2405.19471

7. Additional ML minimization research notes that data minimization can be hard to define technically for complex models and proposes feature reduction/generalization as one path toward reducing the personal data needed for prediction.
   Source: Goldsteen et al., "Data Minimization for GDPR Compliance in Machine Learning Models," 2020.
   URL: https://arxiv.org/abs/2008.04113

8. Large-scale web privacy research found that notice-and-choice implementations often fail to provide effective notice or meaningful choice in practice, including limited disclosure of third-party data collection and high reading burden.
   Source: Libert, "An Automated Approach to Auditing Disclosure of Third-Party Data Collection in Website Privacy Policies," 2018.
   URL: https://arxiv.org/abs/1805.01187

### Inferences specific to Mirror Cartographer

1. "No-save" should be treated as a retention-control feature, not a privacy guarantee.

2. MC privacy risk is not limited to stored session text. It may include telemetry, logs, cache, error reports, model-provider processing, generated summaries, account metadata, third-party analytics, browser storage, screenshots, exports, and inferred sensitive attributes.

3. A symbolic/body-map system has elevated privacy sensitivity because users may enter body, trauma, emotional, relational, medical, identity, and location-adjacent information even when the product is framed as reflection rather than healthcare.

4. A no-save mode is only credible if the implementation can demonstrate what data is collected, where it flows, how long it persists, who can access it, what derived artifacts remain, and how deletion is verified.

## Claim boundary

A no-save mode may reduce:

- long-term profile persistence;
- stored session reconstruction;
- future personalization based on a one-off session;
- some breach exposure if deletion is real and timely.

A no-save mode does not automatically reduce:

- provider-side transient processing;
- logs created before deletion;
- analytics collection;
- browser/local storage;
- screenshots or exports made by the user;
- sensitive inference during the session;
- third-party scripts;
- model hallucination or disclosure risk;
- re-identification risk from unusual symbolic or biographical details.

## New evaluation criterion

ID: MC-PRIVACY-NOSAVE-01
Name: No-save privacy boundary criterion

A no-save session passes only if all required checks pass:

1. Data inventory complete
   - Every input, output, metadata field, log, cache, analytics event, local-storage value, exported artifact, and third-party call is listed.

2. Retention behavior verified
   - The system proves that session content is not written to persistent storage, or documents exactly where it is written and when it is deleted.

3. Derived-data boundary documented
   - Summaries, embeddings, labels, safety flags, analytics events, and error traces are treated as potentially privacy-relevant, not ignored because they are not raw text.

4. User-facing notice matches implementation
   - The UI does not imply stronger privacy than the implementation can prove.

5. Sensitive-context warning present
   - Users are warned that symbolic reflection can involve sensitive personal, health, trauma, relational, location, and identity-adjacent data.

6. Third-party flow checked
   - Model provider calls, hosting logs, analytics scripts, monitoring tools, browser storage, and external APIs are included in the privacy map.

7. Deletion/recovery test performed
   - A test session is created, ended, and then searched for across application DB, logs, analytics, local storage, crash/error logs, and exported artifacts.

8. Inference-risk review performed
   - The system checks whether supposedly non-identifying symbolic entries can still infer sensitive attributes or identity.

9. Failure state defined
   - If any flow cannot be verified, the mode must be labeled "reduced-persistence mode" rather than "private" or "no-save protected."

## Falsification checklist

The claim "MC no-save mode protects privacy" is falsified or must be downgraded if any item is true:

- raw session text persists after the session ends without clear notice;
- session summaries or embeddings persist while the UI suggests no saving;
- third-party analytics receive sensitive session content;
- browser local storage retains session material after logout/close;
- crash logs or server logs contain user-entered symbolic/body/health content;
- deletion cannot be verified by an operator audit;
- the product says "private" while provider-side retention or processing remains unknown;
- no-save mode still updates user memory/profile unless explicitly requested;
- the system cannot explain what derived data remains;
- users are encouraged to enter sensitive health/trauma details without a boundary notice.

## Test plan

ID: MC-NOSAVE-PRIVACY-AUDIT-01

Goal: determine whether MC's no-save mode deserves the label "private," "no-save," "reduced persistence," or "unverified."

Procedure:

1. Create a test no-save session with synthetic sensitive content:
   - body symptom phrase;
   - symbolic phrase;
   - relationship phrase;
   - location-like phrase;
   - unique nonsense token for searchability.

2. End the session normally.

3. Search for the unique token in:
   - application database;
   - server logs;
   - hosting logs;
   - browser local storage/session storage/indexedDB;
   - analytics events;
   - monitoring/error systems;
   - exported files;
   - generated summaries;
   - embeddings/vector stores;
   - user profile/memory layer.

4. Repeat with forced failure:
   - browser crash;
   - network disconnect;
   - server error;
   - user closes tab mid-session.

5. Record every persistence point as:
   - not collected;
   - transient only;
   - persisted then deleted;
   - persisted with retention period;
   - third-party retained;
   - unknown/unverified.

6. Assign status:
   - Verified no-save: no raw or derived session material persists beyond documented transient processing.
   - Reduced-persistence: some data persists, but less than normal mode and clearly disclosed.
   - Misleading: UI claim is stronger than verified behavior.
   - Failed: sensitive content persists in undisclosed or uncontrolled locations.

## Implementation decision

Do not use the term "private session" unless MC can pass MC-NOSAVE-PRIVACY-AUDIT-01.

Preferred wording before audit:

> One-off session: this mode is designed not to build a persistent MC profile from the session. Some technical processing, provider handling, logs, or local browser traces may still occur unless independently verified. Do not enter information you cannot risk being processed.

## Next proof needed

MC-NOSAVE-PRIVACY-AUDIT-01 should be executed against the actual deployed MC stack and the local development stack. The next proof is not another policy citation; it is a data-flow audit with a searchable synthetic token and a written retention result for each storage surface.
