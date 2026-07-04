# Evidence Map: Automation Volume Is Not Evidence Quality

Date: 2026-07-03
Run ID: Evidence Engine run 100
Status: claim narrowed / quality gate added

## Claim tested

> Repeated automated Evidence Engine runs that research and write GitHub artifacts will, by themselves, improve the Mirror Cartographer knowledge substrate.

## Claim status update

**Previous implicit assumption:** More recurring evidence artifacts = stronger knowledge substrate.

**Updated claim:** Recurring evidence artifacts can improve the knowledge substrate only when each artifact passes explicit quality gates for source relevance, claim boundedness, provenance, contradiction handling, and next-test definition. Volume alone is not evidence quality.

## Why this weak point matters

Mirror Cartographer now has many governance/evidence artifacts. The main risk is no longer lack of written material. The risk is artifact inflation: many plausible documents that create an appearance of rigor without independently improving truth, auditability, or decision quality.

## Evidence found

### Fact: AI risk management is lifecycle-based, not one-time or volume-based

NIST AI RMF 1.0 is intended to help incorporate trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems. NIST describes AI risk management as improving the ability to manage risks to individuals, organizations, and society, not as simply producing more documentation.

Source: NIST AI Risk Management Framework page, lines 155-162. https://www.nist.gov/itl/ai-risk-management-framework

### Fact: AI risk management should be integrated into organizational activities and context

ISO/IEC 23894:2023 provides guidance for organizations that develop, produce, deploy, or use AI systems to manage AI-specific risk. ISO says the guidance aims to integrate risk management into AI-related activities and functions and can be customized to organizational context.

Source: ISO/IEC 23894:2023 abstract, lines 142-145. https://www.iso.org/standard/77304.html

### Fact: OECD expects transparency, traceability, accountability, and ongoing risk management

OECD AI Principles state that AI actors should provide meaningful information about capabilities, limitations, data/input sources, factors, processes, or logic where feasible and useful. OECD also says AI actors should ensure traceability across datasets, processes, and decisions, and apply systematic risk management across each phase of the AI system lifecycle on an ongoing basis.

Source: OECD AI Principles, lines 3731-3753. https://www.oecd.org/en/topics/ai-principles.html

## Fact vs inference

### Facts

- NIST frames AI trustworthiness and risk management across the design, development, use, and evaluation lifecycle.
- ISO/IEC 23894 frames AI risk management as an integrated organizational process, not a document-count target.
- OECD requires transparency, traceability, accountability, and ongoing lifecycle risk management.

### Inferences for Mirror Cartographer

- An automated evidence artifact should not be treated as a completed proof unit unless it makes the tested claim narrower, more falsifiable, or more operational.
- A run that only adds another plausible document without changing claim status, testability, or provenance should be counted as low-value or possibly harmful noise.
- The Evidence Engine needs a quality gate and falsification checklist before further run count is treated as progress.

## Evaluation criterion added

### MC-EVIDENCE-AUTOMATION-QG-01

An automated evidence update counts as a valid Evidence Engine contribution only if it satisfies all required gates below.

Required gates:

1. **Claim specificity** — identifies one concrete claim, assumption, or weak point.
2. **Status change** — updates the claim status, scope, confidence, or falsification condition.
3. **Source role clarity** — separates primary standards, empirical evidence, legal/regulatory evidence, journalism, and inference.
4. **Fact/inference separation** — explicitly states what the sources establish and what MC is inferring.
5. **Contradiction scan** — looks for at least one source or reasoning path that could weaken the claim.
6. **Operational output** — creates one of: evidence map, criterion, claim-status update, test plan, or falsification checklist.
7. **Next proof** — defines the next test with observable pass/fail or review criteria.
8. **Non-duplication** — states how the artifact differs from prior evidence maps or why revisiting the claim is justified.
9. **Auditability** — includes source URLs, source roles, date, run ID, and the precise repository path.
10. **No certainty inflation** — avoids treating governance standards as direct proof of product safety, market value, clinical validity, or measurement validity.

## Falsification checklist

The assumption that automated Evidence Engine runs improve the knowledge substrate should be rejected or paused if three or more of the following occur across any 10 consecutive runs:

- The artifact repeats an already-tested claim without adding new evidence or a stricter test.
- The artifact cites a framework but does not explain the framework's evidential role.
- The artifact says "validated," "proven," or "safe" without an empirical test.
- The artifact produces no claim-status change.
- The artifact creates no next proof.
- The artifact cannot be used by a reviewer to decide what should be done next.
- The artifact increases document count but not auditability.
- The artifact confuses symbolic usefulness with empirical validation.
- The artifact treats GitHub commit history as enough provenance.
- The artifact makes a high-stakes claim without field-specific evidence.

## Test plan

### MC-EVIDENCE-AUTOMATION-AUDIT-01

Audit 20 recent Evidence Engine artifacts using MC-EVIDENCE-AUTOMATION-QG-01.

For each artifact, score:

- claim specificity: pass/fail
- status change: pass/fail
- source role clarity: 0-2
- fact/inference separation: 0-2
- contradiction scan: pass/fail
- operational output: pass/fail
- next proof: pass/fail
- non-duplication: pass/fail
- auditability: 0-2
- certainty control: 0-2

Minimum acceptance threshold:

- No high-stakes artifact may pass without fact/inference separation and next proof.
- At least 80% of reviewed artifacts must produce a real claim-status change.
- At least 80% must include an observable next proof.
- Repeated-claim artifacts must explicitly justify why the repeat was necessary.

## Current conclusion

The Evidence Engine should be treated as a potentially useful governance workflow, not as self-validating proof. Its value depends on whether automated runs make claims more bounded, testable, traceable, and reviewable. Documentation volume is not progress unless it improves decision quality.

## Next proof needed

Run **MC-EVIDENCE-AUTOMATION-AUDIT-01** on the last 20 Evidence Engine files and report the pass/fail rate. If fewer than 80% produce concrete claim-status changes and observable next proofs, pause new evidence-map creation and refactor the automation into a review-and-consolidation mode.
