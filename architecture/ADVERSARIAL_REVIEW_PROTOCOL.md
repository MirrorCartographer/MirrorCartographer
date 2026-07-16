# Adversarial Review Protocol

**Status:** Operational protocol v0.1  
**Applies to:** Foundation Intelligence Architecture, Mirror Cartographer, public demonstrations, research artifacts, interfaces, automations, and deployment changes

## Purpose

Adversarial review is a bounded attempt to make a design fail before reality does.

It is not generalized pessimism, aesthetic criticism, or unstructured debate. It is a scheduled verification activity that searches for contradictions, architecture drift, hidden assumptions, weak evidence, duplicate work, edge cases, misuse scenarios, rollback failures, and counterexamples.

Each phase must end with a durable record of:

1. findings,
2. repairs made,
3. remaining uncertainty,
4. evidence produced,
5. whether the design became stronger.

## Safety boundary

Adversarial review may intentionally fail only inside a reversible test boundary.

It must never intentionally destabilize:

- automation schedules or the automation platform,
- shared-state integrity,
- production credentials or secrets,
- irreversible user data,
- public records without a rollback path,
- external systems outside the authorized scope,
- privacy, consent, or deletion controls.

When a realistic destructive test cannot be made safe, use simulation, fixtures, a disposable branch, a local environment, a mock service, a synthetic dataset, or a documented thought experiment.

## Required checkpoints

### Gate A — Design challenge

**When:** Before implementation begins or before a material architecture decision is accepted.

**Attack goals:**

- identify the actual claim being made,
- expose hidden assumptions,
- find counterexamples,
- distinguish requirements from preferences,
- detect duplicate or unnecessary components,
- test whether the proposal violates FIA invariants,
- identify simpler competing designs,
- specify rollback before state changes occur.

**Exit condition:** The design has explicit invariants, evidence requirements, failure modes, and a reversible implementation path.

### Gate B — Implementation challenge

**When:** After implementation but before publishing, merging, deploying, or treating the result as complete.

**Attack goals:**

- compare implementation against the accepted design,
- detect architecture drift,
- exercise invalid, absent, extreme, malformed, delayed, and contradictory inputs,
- test misuse and permission boundaries,
- verify observability and error reporting,
- run rollback or restoration procedures,
- check that failure is contained rather than silently propagated.

**Exit condition:** Critical failures are repaired or explicitly block release. Noncritical failures have owners, scope, and evidence-backed acceptance rationale.

### Gate C — Publication challenge

**When:** Immediately before a public artifact, deployment, announcement, demonstration, or externally consumable claim is released.

**Attack goals:**

- challenge every public claim against its evidence state,
- verify provenance and attribution,
- check privacy and public/private boundaries,
- detect stale links, broken routes, inaccessible content, and host dependence,
- test the artifact from an unauthenticated outsider perspective,
- identify language that overstates certainty or capability,
- verify fallback behavior and rollback readiness.

**Exit condition:** The public surface is reachable, claims are supportable, provenance is visible, and rollback is possible.

### Gate D — Consequence challenge

**When:** After implementation or publication has produced observable behavior.

**Attack goals:**

- compare expected and actual consequences,
- search for regressions, emergent misuse, unexpected interpretation, and operational burden,
- test whether the design still serves its original objective,
- detect evidence that invalidates prior assumptions,
- determine whether a repair, rollback, redesign, or retirement is warranted.

**Exit condition:** Observed consequences have been incorporated into the decision and evidence graphs; unresolved risks are visible rather than silently normalized.

### Gate E — Verification challenge

**When:** During final verification and at defined recurring review intervals for long-lived systems.

**Attack goals:**

- attempt to falsify the success claim,
- rerun unchanged evaluations,
- verify that repairs did not merely move the failure,
- check for duplicate fixes and conflicting sources of truth,
- perform rollback rehearsal where safe,
- identify what remains untested and why.

**Exit condition:** The completion claim is bounded by evidence, remaining uncertainty is documented, and the system has a known response to failure.

## Review roles

A review may be performed by a person, model, deterministic test suite, simulation, or mixed team. The role must be distinct from the implementation role long enough to challenge its assumptions.

Recommended roles:

- **Builder:** states intent, invariants, and expected behavior.
- **Adversary:** attempts falsification and searches for omitted failure modes.
- **Verifier:** confirms that evidence supports the final disposition.
- **Recorder:** preserves findings, repairs, uncertainty, and provenance.

One actor may perform multiple roles, but the role transition must be explicit.

## Attack catalogue

Every material review should sample from the following classes:

| Class | Core question |
|---|---|
| Contradiction | What two accepted statements cannot both be true? |
| Architecture drift | Where did implementation diverge from governing architecture? |
| Hidden assumption | What must be true for this to work but has not been verified? |
| Weak evidence | Which claim is supported only by inference, repetition, or convenience? |
| Duplication | Are two components solving the same problem or creating competing truth sources? |
| Edge case | What happens at zero, maximum, missing, malformed, delayed, reordered, or conflicting input? |
| Misuse | How could an authorized or unauthorized actor use this outside intended purpose? |
| Rollback failure | Can the prior safe state actually be restored? |
| Counterexample | What plausible case disproves the general rule? |
| Silent failure | How can this appear successful while being wrong? |
| Context collapse | What meaning disappears when representations are compressed or translated? |
| Identity discontinuity | Does change preserve the mapping between what the system is, remembers, and expresses? |

## Reversible failure experiments

Safe experiments may include:

- corrupting synthetic fixtures,
- removing required fields in a test packet,
- injecting contradictory evidence states,
- simulating unavailable models or external services,
- testing stale and broken URLs,
- denying permissions in a sandbox,
- replaying events out of order,
- testing duplicate submissions,
- restoring from a disposable backup,
- deploying to a preview branch and forcing rollback,
- replacing a model with a deterministic stub to expose hidden dependency.

Every experiment must define:

1. hypothesis,
2. test boundary,
3. expected failure,
4. containment mechanism,
5. rollback procedure,
6. evidence captured,
7. actual result.

## Severity and disposition

- **Critical:** threatens safety, privacy, consent, data integrity, identity continuity, or truthful public claims. Blocks release.
- **High:** defeats a core objective or makes rollback unreliable. Blocks release unless explicitly contained.
- **Medium:** materially degrades quality, accessibility, provenance, or maintainability. Repair or record a bounded acceptance decision.
- **Low:** localized weakness with limited consequence. Record and prioritize normally.
- **Informational:** no defect demonstrated, but an assumption or future test is now visible.

Allowed dispositions:

- repaired,
- mitigated,
- accepted with rationale,
- deferred with trigger,
- invalidated,
- superseded,
- blocked,
- unresolved.

## Required review record

```yaml
review_id: AR-YYYYMMDD-NNN
artifact: path-or-system-name
checkpoint: design | implementation | publication | consequence | verification
scope: concise boundary
invariants:
  - invariant
attacks:
  - class: hidden-assumption
    test: description
    result: result
findings:
  - severity: high
    statement: finding
    evidence: reference
repairs:
  - change: repair
    verification: evidence
remaining_uncertainty:
  - uncertainty
rollback_status: verified | simulated | documented | unavailable
strengthened: true | false | indeterminate
strength_statement: why
reviewer_roles:
  builder: identity
  adversary: identity
  verifier: identity
provenance:
  commits: []
  tests: []
  sources: []
```

## Completion rule

No adversarial phase is complete merely because attacks were attempted.

It is complete only when findings, repairs, uncertainty, rollback status, and the resulting strength assessment are recorded. A review that discovers no defects must still state what was tested, what was not tested, and why the absence of discovered failure is not proof of correctness.

## Integration with FIA

Adversarial review feeds:

- findings into the evidence graph,
- accepted changes into the decision graph,
- failures into the failure taxonomy,
- repairs into the evolution timeline,
- reusable tests into evaluations,
- unresolved risks into project memory.

The protocol operationalizes FIA constructive destabilization without compromising continuity, user control, or shared-state integrity.
