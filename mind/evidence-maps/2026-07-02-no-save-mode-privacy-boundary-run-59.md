# Evidence Map: No-Save Mode Privacy Boundary

Date: 2026-07-02
Run: Evidence Engine 59
Status: claim narrowed; implementation unvalidated

## Claim tested

C-NO-SAVE-MODE-PRIVACY-01: Mirror Cartographer can protect user privacy by offering a no-save/private ritual mode.

## Why this claim is weak

A user-facing no-save label can reduce expectation mismatch, but it does not by itself prove privacy protection. Privacy depends on the full data lifecycle: collection, processing, retention, deletion, access control, logging, analytics, third-party sharing, incident handling, and whether sensitive inputs are excluded from training or downstream reuse.

## Sources reviewed

1. NIST Privacy Framework
   - URL: https://www.nist.gov/privacy-framework
   - Key point: NIST describes the Privacy Framework as a tool to help organizations identify and manage privacy risk while protecting individuals' privacy.
   - Source quality: Primary / government framework.

2. NIST AI Risk Management Framework
   - URL: https://www.nist.gov/itl/ai-risk-management-framework
   - Key point: NIST says the AI RMF is intended to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems.
   - Source quality: Primary / government framework.

3. OECD AI Principles overview
   - URL: https://oecd.ai/en/ai-principles
   - Key point: OECD principles include transparency and explainability, robustness/security/safety, and accountability as values-based principles for trustworthy AI.
   - Source quality: Primary / intergovernmental standard.

4. Biega et al., Operationalizing the Legal Principle of Data Minimization for Personalization
   - URL: https://arxiv.org/abs/2005.13718
   - Key point: Data minimization requires data to be adequate, relevant, and limited to what is necessary for the processing purpose; applying this to personalization is technically nontrivial.
   - Source quality: Research paper; useful for mechanism and limits.

5. FTC 2024 social media/video surveillance reporting, as summarized by high-quality news coverage
   - URL: https://www.reuters.com/technology/artificial-intelligence/social-media-users-lack-control-over-data-used-by-ai-us-ftc-says-2024-09-19/
   - Key point: Reported FTC findings emphasized inadequate data management/retention, limited user control, and privacy risks from large-scale data collection.
   - Source quality: High-quality secondary source for regulatory report; primary report should be retrieved in a later audit.

## Fact vs inference

### Supported by evidence

- Privacy protection should be managed as a risk-management and governance problem, not only a product-copy problem.
- Trustworthy AI guidance expects transparency, accountability, robustness/security/safety, and lifecycle evaluation.
- Data minimization is a recognized privacy principle, but operationalizing it in personalized systems is difficult and must be tested.
- User control claims require evidence of backend behavior: retention limits, deletion behavior, logging boundaries, third-party boundaries, and access controls.

### Inference, not yet demonstrated for Mirror Cartographer

- MC currently implements no-save mode as true non-retention rather than UI-only labeling.
- MC excludes no-save session content from analytics, logs, backups, model-training paths, local storage, browser storage, and third-party monitoring tools.
- MC can prove deletion or non-retention after a private/no-save session.
- MC can explain privacy behavior in language users understand without implying more protection than exists.

## Claim-status update

C-NO-SAVE-MODE-PRIVACY-01 is retired and replaced with:

C-NO-SAVE-MODE-PRIVACY-GOVERNANCE-01R: No-save/private mode is a privacy-intent feature, not proof of privacy. It is only supportable after MC documents and tests the full data lifecycle: collection, processing, retention, deletion, logging, analytics, third-party transfer, backups, access control, and incident response. MC implementation remains unvalidated.

## Evidence quality grade

- Source quality: moderate-high.
- Directness to MC: partial. Sources support governance requirements and data-minimization boundaries, not MC-specific privacy performance.
- Certainty: medium for the boundary principle; low for MC implementation status.

## Evaluation criterion: PRIVACY-MODE-LIFECYCLE-GATE-01

A Mirror Cartographer no-save/private session passes only if all criteria below are documented and independently checked:

1. Collection map
   - Every data element collected during the session is listed.
   - Each element has a stated purpose.
   - Each element is marked required, optional, avoidable, or prohibited.

2. Storage map
   - Server storage, database storage, browser local/session storage, cookies, cache, and temporary files are checked.
   - No-save data is absent after session end, or any temporary retention is explicitly disclosed with duration and purpose.

3. Logging map
   - Application logs, error logs, observability traces, analytics events, and security logs are checked.
   - Sensitive symbolic/body/emotional content is not stored in logs unless explicitly justified and disclosed.

4. Third-party map
   - All third-party processors are listed.
   - For each processor, data sent, purpose, retention, and deletion mechanism are documented.

5. Backup/deletion map
   - Backup behavior is documented.
   - Deletion/non-retention is tested against backups or clearly bounded if backups cannot be selectively purged.

6. User-facing copy test
   - Copy must not say or imply “private,” “not saved,” or “safe” beyond what the implementation proves.
   - Copy must distinguish local no-save, server no-save, analytics/logging exclusions, and third-party processing.

7. Failure disclosure
   - If any category is untested, no-save mode must be labeled “privacy mode in development” rather than “not saved.”

## Falsification checklist

The privacy claim fails if any of the following are true:

- No-save session content appears in server logs, analytics, crash reports, database records, local storage, or backups without explicit disclosure.
- Third-party services receive session content and retention/deletion terms are unknown.
- The UI promises no-save behavior but there is no reproducible test proving non-retention.
- Sensitive body/emotional/symbolic entries are retained by default without purpose limitation.
- Users cannot distinguish persistent mode, one-off mode, local-only behavior, and true non-retention.

## Test plan

Test name: MC-NO-SAVE-PRIVACY-AUDIT-01

Procedure:

1. Create a synthetic no-save session using a unique marker string.
2. Submit symbolic, emotional, body-map, and crisis-adjacent benign content.
3. End the session.
4. Search all accessible storage surfaces for the unique marker:
   - database tables,
   - server logs,
   - client local/session storage,
   - cookies,
   - analytics events,
   - error/crash logs,
   - observability traces,
   - backups where accessible.
5. Repeat with persistent mode to confirm the test can detect intentionally retained data.
6. Record every hit, retention duration, and deletion path.
7. Update user-facing copy to match actual behavior.

## Next proof needed

Run MC-NO-SAVE-PRIVACY-AUDIT-01 on the live UI and repository implementation, then publish a privacy lifecycle ledger separating:

- not collected,
- processed but not retained,
- temporarily retained,
- persistently retained,
- sent to third parties,
- logged accidentally,
- unknown / untested.

Until that ledger exists, no-save mode should be treated as an unvalidated design requirement, not a proven privacy feature.
