# Open Badges 3.0 Issuance Implementation

## Standard requirements

Mirror Cartographer will use the 1EdTech Open Badges 3.0 specification and the W3C Verifiable Credentials Data Model 2.0 conventions. A badge definition is not itself an issued credential.

Every issued OpenBadgeCredential must identify:
- a single credential subject;
- the issuer and achievement;
- criteria and supporting evidence;
- issuance and validity information as required;
- a supported cryptographic proof that binds the issuer identity to the credential;
- a status/revocation mechanism where implemented by the issuer.

Official specification: https://standards.1edtech.org/open-badges/specifications/standards/v3p0  
Conformance guide: https://www.imsglobal.org/spec/ob/v3p0/cert/

## Issuer architecture

The intended issuer identifier is a stable `did:web` identifier hosted under the Mirror Cartographer GitHub Pages domain. The issuer document must publish a verification method whose public key matches the private key used to sign credentials.

The private signing key must never be committed to the repository, placed in public Pages assets, or pasted into a chat. It must be held in a protected secret store with restricted access and rotation/revocation procedures.

## Issuance pipeline

1. Validate the achievement definition against the current Open Badges 3.0 data model and conformance suite.
2. Validate recipient identity and consent to the chosen identifier.
3. Confirm assessment outcome and issuer authority.
4. Construct the OpenBadgeCredential using the current OB 3.0 JSON-LD context and achievement definition.
5. Sign using a proof mechanism supported by the 1EdTech conformance suite.
6. Validate the signature and schema independently.
7. Publish the credential at a stable URL and provide a downloadable JSON-LD file.
8. Provide a public verification/status endpoint and documented correction/revocation process.

## Current implementation status

- Achievement definition for MC-OR-001: drafted.
- Human-readable founder recognition: issued as a project record.
- Issuer DID and public verification method: not yet deployed.
- Protected signing key: not provisioned.
- Credential signing and verification: not implemented.
- Open Badges 3.0 conformance: not tested or certified.
- Portable signed credential: not yet issued.

Do not label the achievement definition or a draft JSON file as a signed OpenBadgeCredential. Do not claim Open Badges platform conformance or certification until the implementation passes the relevant conformance requirements.
