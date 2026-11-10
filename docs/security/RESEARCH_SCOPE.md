# Mirror Cartographer Security Research Scope

## Authorized target

Initial scope is limited to:
- source code in this repository;
- locally executed copies of the project;
- project-owned GitHub Pages routes under `mirrorcartographer.github.io/MirrorCartographer`;
- project-owned test accounts and synthetic data created specifically for validation.

Any additional domain, service, API, provider, or account must be explicitly added to scope by its owner before testing.

## Permitted methods

- static source review;
- dependency and configuration review;
- local dynamic testing;
- automated tests against local builds;
- non-destructive checks against project-owned public pages;
- verification of access control using accounts created for the test;
- responsible reporting and remediation tracking.

## Prohibited methods

- testing third-party systems without written authorization;
- credential stuffing, phishing, social engineering, or password spraying;
- destructive or denial-of-service tests;
- accessing or retaining other users' private data;
- bypassing payment, authentication, or access controls on services outside the project scope;
- publishing exploit details before coordinated disclosure.

## Evidence record

Every finding must record the finding ID and date, exact target and scope authorization, affected version/commit, reproducible steps, impact and severity rationale, evidence with secrets and personal data removed, remediation and retest result, and disclosure decision.

## Credential boundaries

Security research on this project can demonstrate secure development and responsible disclosure practices. It does not automatically qualify the researcher for GitHub's Security Bug Bounty Hunter badge or Security Advisory credit. Those recognitions depend on GitHub's own eligibility and accepted submissions.
