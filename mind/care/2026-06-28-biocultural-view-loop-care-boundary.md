# Care Lane — Biocultural View Loop Boundary

## Source status
- Internal MC source: synthesized from public-safe architecture direction.
- External source: public research reviewed on patient-generated health data, ambient clinical documentation, dynamic consent, privacy-preserving health data transformation, and health-data leakage risks.

## Claim status
- Boundary artifact.
- Supports communication, observation organization, and question preparation.
- Does not diagnose, treat, triage, prescribe, prognose, or replace licensed medical, veterinary, mental-health, emergency, legal, or social-care judgment.

## Privacy status
- Public-safe.
- No private case details.
- Uses only abstract roles and workflow categories.

## Missingness
- Needs review by clinicians, veterinarians, social workers, privacy specialists, and patient/caregiver advocates before real-world deployment.
- Needs emergency escalation policy.
- Needs consent model for multiple people or animals represented in one record.

## Revision reason
Recent MC direction has moved from private/public split toward permissioned views. This boundary defines how that can apply to care-adjacent support without making unsupported health claims.

## Principle
MC may support care by improving the **quality of handoff**, not by claiming authority over the body.

## Allowed functions
- Turn private observations into neutral timelines.
- Convert interpretations into questions.
- Separate observed facts from hypotheses.
- Mark missing information.
- Preserve uncertainty.
- Prepare professional-view summaries.
- Track what changed after a reviewed action.
- Maintain consent and privacy labels.

## Disallowed functions
- Diagnosis.
- Treatment instruction.
- Medication changes.
- Emergency triage.
- Claims of biological causation without evidence.
- Replacing professional examination.
- Sharing third-party sensitive data without consent.
- Presenting symbolic meaning as clinical proof.

## Care-adjacent workflow

1. **Private capture**
   - broad, symbolic, emotional, sensory, messy, user-owned.

2. **Observation extraction**
   - time, intensity, recurrence, functional impact, triggers, response to previous actions, uncertainty.

3. **Question compiler**
   - converts causal certainty into reviewable questions.

4. **Professional view**
   - audience-specific packet for clinician, veterinarian, therapist, social worker, advocate, or support worker.

5. **Reviewed action record**
   - only records what a qualified party actually recommends or what an official source supports.

6. **Outcome update**
   - tracks what happened after action without overassigning causality.

7. **ViewDiff**
   - shows what was retained, omitted, generalized, transformed, or added.

## Evidence-based opportunity areas to monitor
- Patient-generated health-data summarization.
- Ambient clinical documentation and consent rights.
- Dynamic consent for data sharing.
- Privacy-preserving health data transformation.
- Social prescribing and community referral infrastructure.
- Caregiver-facing observation tools.
- Veterinary record fragmentation and longitudinal observation gaps.

## Evaluation checklist
A care-adjacent MC output passes only if:

- it improves clarity;
- it reduces unsupported claims;
- it preserves missingness;
- it shows privacy boundaries;
- it makes professional review easier;
- it does not create false confidence;
- it can be read without access to private context.

## Public-safe phrase
**The care value is not authority. The care value is better passage between lived observation and reviewed support.**