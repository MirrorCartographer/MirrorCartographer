# Candidate Assessment Plan

**Program version:** MC Credential Program 1.0  
**Candidate:** project founder / program designer  
**Status:** scheduled for assessment; no result recorded  
**Evidence source:** Mirror Cartographer public repository plus private source-workspace evidence where access is appropriate.

## Candidate evidence boundaries

The portfolio can support assessment of:

- originating concept, problem framing, product direction, requirements and prioritization;
- systems-level reasoning and the ability to connect research, interaction, ethics, and implementation;
- interaction design decisions, experience architecture, accessibility requirements and iterative critique;
- governance principles for separating evidence, inference, uncertainty, provenance and AI-generated material;
- collaborative software project direction, review and acceptance decisions.

The portfolio does not by itself prove:

- independent authorship of every line of source code;
- independent programming proficiency;
- production reliability or successful deployment;
- accessibility conformance without testing;
- operational readiness of shared services;
- external certification or accredited training.

## Initial assessment sequence

### Assessment A — Systems Design & Architecture (MC-SD-01)

**Candidate task**
1. Draw and explain the architecture of one Mirror Cartographer experience from user action to interface response and persistence.
2. Identify local-only state, server-backed state, external dependencies, trust boundaries and failure modes.
3. Explain two design alternatives considered and why the selected design was retained.
4. Propose a minimal change that improves reliability without expanding scope.

**Evidence**
- architecture diagram or written data-flow map;
- live walkthrough or recorded equivalent;
- answers to assessor questions;
- one written trade-off analysis.

**Critical failures**
- treating browser-local state as server-synchronized;
- claiming an unverified deployment or service is operational;
- inability to distinguish observed behavior from assumptions.

### Assessment B — Human-Centered Interactive Systems (MC-HC-01)

**Candidate task**
1. Select one interactive room or expedition.
2. Define a user task and measurable success condition.
3. Walk through keyboard and touch use, error recovery, sensory load, and accessible alternatives.
4. Review the experience against a short usability checklist and prioritize three changes.
5. Explain how a user with limited speech, motor ability, or sensory tolerance could still participate.

**Evidence**
- task flow;
- usability/accessibility review;
- prioritized findings;
- revised interaction specification or tested change.

**Critical failures**
- presenting accessibility as established without validation;
- ignoring consent, privacy, or a meaningful non-sensory alternative.

### Assessment C — Evidence Governance & Responsible AI (MC-EG-01)

**Candidate task**
1. Select five project claims from different evidence types.
2. Trace each claim to source material and label it observed, reported, inferred, proposed, or unknown.
3. Identify uncertainty, missing evidence, conflicts and correction history.
4. Review an AI-assisted artifact and separate user-originated decisions from generated implementation.
5. Draft a short public-facing statement that does not overclaim.

**Evidence**
- claim/evidence ledger;
- provenance map;
- uncertainty and correction notes;
- final public statement.

**Critical failures**
- fabricating sources or evidence;
- presenting inference as confirmed fact;
- obscuring AI assistance or claiming unperformed independent work.

### Assessment D — Applied Digital Systems Delivery (MC-AD-01)

This assessment is separate and should occur after the initial three.

**Candidate task**
- create a branch, make a bounded change, open a pull request, respond to review, run tests, diagnose one deliberately introduced defect, and document release status.

**Evidence**
- candidate-performed Git/GitHub actions;
- code or configuration change;
- test output;
- defect diagnosis;
- review response and release note.

**Critical failures**
- merging unverified changes into production;
- exposing secrets;
- misrepresenting failing or missing CI as passing.

## Scoring rubric

Each assessment has five dimensions scored 0–4:

1. Conceptual understanding
2. Evidence quality and traceability
3. Practical execution
4. Reasoning and trade-off analysis
5. Safety, accessibility, privacy and integrity

Score conversion: sum the five dimension scores (maximum 20), then multiply by 5 to produce a score out of 100. The assessor must include narrative evidence for every score.

- **0:** no valid evidence / unsafe or incorrect.
- **1:** recognizes basic concepts; substantial prompting required.
- **2:** completes a bounded task with guidance.
- **3:** completes and explains the task independently.
- **4:** handles complex constraints, evaluates alternatives and improves the system.

**Pass threshold:** 75/100 overall, with no dimension below 2 and no critical failure.  
**Level mapping:** 1 = 25–49; 2 = 50–74; 3 = 75–89; 4 = 90–100, subject to the practical independence conditions above. A score below 25 is not yet awardable.

## Assessor model: AI and human tracks

Mirror Cartographer accepts AI as an assessor when the assessment record names the AI system and model (when known), records the assessment date and rubric version, links every scored claim to inspectable evidence, and discloses that the AI assessor is not an independent human professional or accrediting body.

Two credential tracks are available:

- **AI-assessed project credential:** an AI reviewer evaluates the submitted portfolio and candidate responses against the published rubric. The credential title and LinkedIn description must say “AI-assessed” and “project-issued.” The record must disclose that the candidate is the project founder and that the project is the issuer. The assessment must include evidence links, dimension scores, rationales, limitations, and a reproducible review prompt/version.
- **Human-reviewed project credential:** a named human assessor independently evaluates the evidence and practical task, declares conflicts, and signs the decision. A second reviewer is required for Level 4. This track is optional and is not a prerequisite for an AI-assessed credential.

AI assessment is a valid project assessment method, not independent human verification, vendor certification, professional licensure, or accreditation. A credential must never imply otherwise. The AI assessor must not invent candidate actions, infer hands-on programming from project direction, or award practical execution points without direct evidence.

## Review and appeal

- Candidate receives the rubric and task in advance.
- Assessment records document the evidence set, model/assessor identity, prompt or method version, accommodations, limitations, and date.
- Candidate may request one reassessment after receiving specific feedback.
- Candidate may appeal factual errors, unsupported inferences, inaccessible assessment conditions or inconsistent rubric application.
- Assessment records preserve the original result and any corrected or superseding result.

## Review and appeal

- Candidate receives the rubric and task in advance.
- Assessor records task conditions, permitted references/tools, time, accommodations and any interruptions.
- Candidate may request one reassessment after receiving specific feedback.
- Candidate may appeal factual errors, conflicts of interest, inaccessible assessment conditions or inconsistent rubric application.
- Assessment records must preserve the original result and any corrected or superseding result.

## First practical checkpoint

Begin with Assessment C (Evidence Governance) using a small sample of public project claims. This is the most immediately assessable domain and creates the evidence ledger needed by the other assessments. Do not issue MC-EG-01 until the task is completed and scored.
