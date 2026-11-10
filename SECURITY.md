# Security and Privacy Policy

Mirror Cartographer handles architecture for continuity, reflection, provenance, and evidence mapping. Public contributions must not expose private source material.

## Reportable concerns

Please report vulnerabilities involving:

- unauthorized access or privilege escalation
- secret, token, or credential exposure
- private-record or conversation leakage
- unsafe export, logging, or persistence behavior
- provenance tampering or evidence substitution
- cross-user data mixing
- dependency or supply-chain compromise

## Public issue boundary

Do not place secrets, personal records, medical details, private conversations, access tokens, exploit payloads, or identifying screenshots in a public issue.

For non-sensitive defects, provide:

1. affected component and version or commit
2. minimal reproduction steps using synthetic data
3. expected and observed behavior
4. impact and scope
5. proposed mitigation, when known

## Design requirements

Security-relevant changes should preserve least privilege, explicit data boundaries, auditable provenance, revocable access, replaceable components, and safe failure behavior.

This repository is experimental. Its outputs must not be treated as medical, veterinary, legal, emergency, or diagnostic authority.


## Responsible disclosure workflow

For a private report, use the repository's **Security** tab and **Report a vulnerability** flow if private vulnerability reporting is enabled. If that option is unavailable, contact the project owner privately before sharing sensitive technical details. Do not publish exploit details in a public issue or discussion.

A report should include the affected repository, URL, version or commit; concise impact; minimal reproduction steps; and evidence with secrets and personal data removed. Testing must remain within systems controlled by Mirror Cartographer or targets for which the researcher has explicit authorization. Do not perform denial-of-service, credential attacks, phishing, social engineering, destructive tests, or tests against third-party services without written authorization.

The project will acknowledge reports when reasonably possible, reproduce them in a controlled environment, assess impact, and coordinate remediation and disclosure. No bounty, payment, response-time guarantee, staffed security team, or external security credential is promised by this policy. Verify that private vulnerability reporting and a monitored contact route are enabled before advertising them as active.
