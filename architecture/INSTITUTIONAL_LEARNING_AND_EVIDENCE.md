# Institutional Learning and Evidence Boundaries

**Status:** Design guidance. This document does not claim military, government, or historical expertise has been operationally validated in this codebase.

## Purpose

Government, military, historical, and educational institutions face a shared systems problem: information must pass from observation to interpretation, decision, action, record, review, and revised practice. At each transition, provenance can be lost, uncertainty can be hidden, and an explanation can be mistaken for an observed fact.

This is a structural analogy, not a claim that these institutions are interchangeable or that their standards of authority and evidence are identical.

## Separate the evidence states

Do not collapse the following into a single status such as "known" or "fixed":

1. **Recorded:** a person, system, or source made a record.
2. **Source inspected:** the underlying source was actually accessible and examined.
3. **Claim assessed:** the claim was compared with scope, counterevidence, and alternative explanations.
4. **Tested:** a reproducible check ran under documented conditions.
5. **Corrected:** a code, process, or policy change was made.
6. **Regression-tested:** a check targets the previously observed failure.
7. **Deployed:** a specific artifact was released to a named environment.
8. **Operationally observed:** the deployed artifact's behavior was independently checked.
9. **Learning demonstrated:** later cases show that the correction generalizes and the original failure is less likely to recur.

Evidence for one state does not automatically establish the next. A document that says a task was completed is not an execution receipt. A passing test is not deployment evidence. A deployment badge is not proof of correct user-visible behavior.

## Lessons from historical and military review practices

- Preserve the original report and its context; append corrections rather than silently rewriting history.
- Distinguish the plan, order, observation, interpretation, decision, action, and after-action assessment.
- Record dissent and minority explanations with their evidence and assumptions.
- Identify the specific observation that would distinguish competing explanations.
- Convert a lesson into an owned change and a test; then verify the change under relevant conditions.
- Track repeated failures across versions. Repeated documentation without a changed outcome is not demonstrated learning.
- Treat an official or high-authority source as important evidence, not infallible evidence. Authority, access, scope, and corroboration are separate attributes.

These practices are engineering guidance inspired by institutional review patterns; specific historical or doctrinal claims require their own primary sources and citations before being presented as research findings.

## Cross-repository application

- **MirrorCartographer (evidence/research):** preserve source provenance, competing claims, counterevidence, uncertainty, revision history, and falsification routes.
- **mirror-cartographer-ui (experience/implementation):** expose claim status, source availability, corrections, and downstream effects without forcing users to resolve uncertainty.
- **Foundation Intelligence Architecture:** govern transitions between perception, interpretation, memory, planning, execution, reflection, and learning.
- **Release/hosting layer:** connect exact commit and artifact identity to build results, deployment environment, health checks, and recovery evidence.

The evidence repository must not treat the UI repository's assertion as independent corroboration of the same assertion. Independence requires a distinct source, test, or observation.

## Constraint review

For each material constraint, record its type (safety, privacy, legal, product, resource, provider, implementation, or assumption), intended failure prevented, scope, owner, supporting evidence, counterexamples, review trigger, reversible alternative, and rollback condition.

A constraint may be overbroad or stale; inconvenience alone does not prove that it is wrong. Provider limitations are facts only within a particular observed configuration and time. A workaround must be evaluated for authorization, security, privacy, and operational reliability before adoption.

## Required synthetic exercise

Use synthetic data to trace one case end to end:

1. Preserve a source with conflicting observations.
2. Create two interpretations with different explicit assumptions.
3. Mark one source unavailable and ensure it is not treated as inspected evidence.
4. Correct one interpretation while retaining its prior version.
5. Trace the correction into summaries, memory candidates, decisions, and public export.
6. Reconstruct the state in a fresh session and compare it with the versioned history.
7. Test the built artifact and record exact commit, environment, result, and limitations.

## Non-goals

This architecture is not a military intelligence system, operational command system, personnel evaluation system, or tool for covertly profiling people. Do not import sensitive government, military, health, or personal records into public fixtures. Use synthetic or explicitly authorized, privacy-reviewed evidence.

## Open questions

- What source types and provenance fields are required for each claim class?
- How will independent corroboration be distinguished from repeated copies of one source?
- Which component owns the authority to approve a correction, and how can that decision be appealed?
- How are deletion and privacy obligations reconciled with immutable audit history?
- What evidence is sufficient to say a learning loop improved outcomes rather than merely increasing test coverage?
- How will the system prove that a public export excludes private data after a correction or rollback?
