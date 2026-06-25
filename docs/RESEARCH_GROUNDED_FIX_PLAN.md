# Research-Grounded Fix Plan

This document converts the hard critique into implementation requirements.

## External standards used

### NIST AI Risk Management Framework

NIST describes the AI RMF as a voluntary framework for incorporating trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems.

Mirror Cartographer should use this as a product discipline standard: trustworthiness is not a vibe. It needs design, evaluation, and evidence.

Implementation translation:

- define risks
- measure failures
- test outputs
- log feedback
- revise the system from evidence

### WHO AI for health ethics guidance

WHO guidance on AI for health says ethics and human rights must be at the heart of design, deployment, and use. It identifies risks and recommends governance so stakeholders remain accountable to healthcare workers, communities, and individuals affected by the technology.

Mirror Cartographer touches body sensation, health-adjacent reflection, and emotional vulnerability, so it must treat health-adjacent output as high risk even when it is not a medical product.

Implementation translation:

- health-adjacent prompts need prominent boundaries
- the system must not diagnose or recommend treatment
- users should be directed toward professional care when symptoms are urgent, risky, or persistent
- symbolic reflection must not replace material evidence

### Human-AI interaction guidance

Human-AI interaction work emphasizes user control, feedback, uncertainty handling, expectation setting, and graceful correction.

Implementation translation:

- the system must let users reject interpretations
- the system must ask for correction
- the system must label uncertainty
- the system must avoid pretending it has hidden access
- the system must preserve user agency

### Recent health-AI disclaimer failures

Public investigations into AI-generated medical summaries show that weak or hidden disclaimers can create misplaced trust when users receive health-like guidance quickly and confidently.

Implementation translation:

- disclaimers cannot be buried
- high-risk boundaries must appear before or inside the output, not after the user has already trusted it
- medical, psychological, veterinary, legal, and financial contexts must be explicitly flagged

## Immediate fix layer

### Fix 1: Replace mystical public language with bounded product language

Public front door should say:

Mirror Cartographer is a bounded symbolic reflection interface for mapping body sensation, metaphor, color, symbol, and repeated emotional patterns into reviewable AI-assisted reflections.

It should not lead with:

- sacred
- prophetic
- oracle
- decoding
- cognitive-symbolic OS
- global symbolic topology

These can exist only in optional Mythopoetic Mode, creative docs, or internal language.

### Fix 2: Rename fake audits

Current demo label: hallucination audit.

Corrected label until there is a real audit engine:

- audit prompt
- audit label
- overreach check
- claim-boundary tag

Future true audit requires rule checks, scoring, and logged failures.

### Fix 3: Add user feedback controls

Every reflection should include:

- resonated
- partly resonated
- missed me
- overreached
- grounded me
- made me more confused

The feedback output should explicitly say what will change:

- resonance updates personal echo tracking
- overreach downgrades confidence
- confusion triggers grounding and simpler language
- missed me asks for correction

### Fix 4: Add explicit health-adjacent flag

If the user mentions symptoms, pain, illness, medication, animal health, diagnosis, panic, self-harm, or urgent risk, the system should switch into boundary-first mode.

Boundary-first output structure:

1. I can help organize what you are noticing.
2. I cannot diagnose or replace professional care.
3. Here is the observation record.
4. Here is the symbolic layer.
5. Here is what to track.
6. Here is when to seek professional help.
7. Here is what not to conclude from symbols.

### Fix 5: Add source status

Every symbolic output should show one of three statuses:

- Source-backed: tied to a defined symbol table or cited source cluster.
- User-backed: based on the user's own stated associations.
- Speculative: mythopoetic possibility only.

### Fix 6: Add claim status

Every output should classify claims as:

- observation
- user report
- symbolic hypothesis
- evidence-based fact
- practical next step
- not enough information

### Fix 7: Add data ethics before memory

Do not launch persistent memory until there is a basic data policy.

Minimum policy:

- user owns entries
- user can delete entries
- user can export entries
- sensitive content is marked private
- no sharing without consent
- no training or research use without opt-in consent

### Fix 8: Replace broad promises with evidence gates

Bad:

Mirror Cartographer supports trauma recovery.

Better:

Mirror Cartographer is being tested as a reflective support tool for symbolic expression. It is not a treatment and does not claim clinical outcome improvement.

Bad:

Mirror Cartographer regulates users.

Better:

The system can prompt grounding and user-rated reflection. Whether it helps regulation must be tested.

## Product test gates

### Gate 1: Meaning preservation

Can a reviewer identify the user's original concern from the output?

### Gate 2: Boundary quality

Does the output clearly separate symbol, evidence, hypothesis, and action?

### Gate 3: User correction

Can the user reject the interpretation and correct it?

### Gate 4: Health-adjacent safety

Does the system avoid diagnosis and suggest real-world care when appropriate?

### Gate 5: Non-generic value

Does the output do something different from a normal chatbot summary?

### Gate 6: Longitudinal value

Does tracking over time reveal a change the user can review?

## Updated build priority

1. Feedback controls in demo.
2. Health-adjacent risk flag.
3. Source status and claim status labels.
4. Exportable session record.
5. Clickable body map.
6. Symbol table MVP.
7. User-owned archive.
8. Reviewer scoring UI.
9. External review.

## Current decision

Mirror Cartographer should stop trying to look complete.

It should become obviously testable.

The strongest artifact is not a big whitepaper. It is a demo that shows:

input -> bounded reflection -> user feedback -> correction -> safer next output -> saved trace.