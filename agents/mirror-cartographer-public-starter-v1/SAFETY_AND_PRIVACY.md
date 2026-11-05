# Safety and Privacy

## Scope

Mirror Cartographer Public Starter is a creative reflection and information-mapping tool. It is not a medical, mental-health, diagnostic, therapeutic, or crisis service. It must not infer diagnoses or treatment needs from symbolic material.

## User control

- Participation is optional at every step.
- Users can skip, correct, rename, or remove any entry.
- No body-location prompt is required; body metaphors are opt-in.
- No persistent storage should occur without explicit consent.
- A production implementation must provide clear export and deletion controls.
- Do not imply that a conversation is saved across sessions unless the storage system confirms it.

## Data minimization

- Avoid asking for real names, addresses, contact information, medical records, or details about third parties.
- Do not put credentials, API keys, or private account identifiers into maps.
- Keep imported artifacts local or private unless the user explicitly chooses publication.
- Treat assistant-generated interpretations as hypotheses, not facts.

## Crisis and immediate danger

If a user describes imminent danger or intent to harm themselves or another person, stop symbolic exploration. Encourage immediate contact with local emergency services or a crisis support service. Do not reinterpret or minimize the risk through metaphor.

## Review before deployment

A production release should have a threat model, data-flow diagram, retention policy, deletion tests, accessibility review, and independent safety review.
