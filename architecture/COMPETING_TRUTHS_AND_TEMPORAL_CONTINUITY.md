# Competing Truths and Temporal Continuity Protocol

**Status:** Proposed protocol; synthetic validation only until integrated into production routes.  
**Scope:** Claim continuity across Mirror Cartographer, Conversation Parallax, evidence gates, and Foundation Intelligence Architecture.

## Governing question

How can a system maintain continuity when evidence, interpretation, observer, and implementation all change?

The system must preserve multiple versions of a claim without treating every version as equally supported, forcing premature consensus, or erasing the history of correction.

## Why the current constraints can be wrong

A constraint is a model of the world, not the world itself. It may be necessary, but it can also encode a stale assumption, a proxy metric, an accidental platform limit, or a safety rule whose scope was never stated. Treat constraints as versioned hypotheses with owners, scope, evidence, expiry/review conditions, and a falsification route—not as timeless truths.

Challenge a constraint by asking:
1. What failure or harm was it meant to prevent?
2. What evidence supports that causal story?
3. What population, environment, and time interval does it apply to?
4. What capability does it block, and is that block required by a real safety boundary or merely inherited from a tool/provider?
5. What counterexample would show it is too broad or too narrow?
6. Can a reversible experiment test a less restrictive alternative?
7. What evidence would require restoring the prior constraint?

Do not remove safety boundaries just because they are inconvenient. Separate safety constraints, product decisions, provider limitations, resource limits, and unverified assumptions. Give each a different owner and appeal path.

## A claim is not a single mutable value

Represent each claim version as an immutable record with:
- stable claim/version identifier;
- exact proposition and scope;
- kind: observation, interpretation, hypothesis, decision, or symbolic reading;
- status: unreviewed, supported, disputed, refuted, superseded, retracted, or unknown;
- source references and their relation to the claim;
- source availability distinct from source content;
- temporal validity distinct from when the system recorded it;
- perspective/reader and known interpretive limits;
- revision reason and explicit relations to other claims.

New information creates a new version or relation. It does not silently rewrite the old record. A superseded interpretation remains historically inspectable but must not be displayed as current without a clear label.

## Competing versions are not a vote

Two claims may be:
- **compatible** within different scopes or time intervals;
- **alternative interpretations** of the same evidence;
- **contradictory** on a shared proposition and scope;
- **unequally supported** by available evidence;
- **currently undecidable** because a source is missing, inaccessible, redacted, or not collected.

Keep these distinctions visible. Do not average incompatible claims into a synthetic midpoint. Do not use recurrence, fluency, popularity, symbolic resonance, or model confidence alone as a substitute for evidence. A disagreement can be informative even when no resolution is possible.

## Time is two-dimensional

Record at least:
- **valid time:** when the proposition applies in the represented world (possibly unknown or partial);
- **recorded time:** when the system learned or stored the proposition.

Known timestamps must use ISO 8601 with an explicit timezone. Do not silently interpret a timezone-naive value as UTC. A claim marked superseded must have an explicit incoming supersedes relation from a later version.

A later record does not automatically make an earlier claim false. A claim may have been true for its validity interval and later become outdated. A correction to the record is not necessarily a change in the world.

Never collapse these states:
- observed absence;
- no observation collected;
- source unavailable;
- source redacted;
- not applicable;
- unknown.

Unknown is not zero, false, or absent.

## Evidence and provenance

A source reference should say whether the source supports, refutes, qualifies, or merely contextualizes the claim. A source that is unavailable cannot be treated as inspected evidence. A source that was not collected cannot prove absence. Digests identify bytes; they do not establish truth or authority.

Validation can prove that a record follows a schema. It cannot prove that the proposition is true, the source is authentic, the interpretation is fair, or a deployed system consumed the record. Keep structure-valid, evidence-reviewed, human-approved, integrated, and deployed as separate states.

## Constraint and policy ledger

For each material constraint, record:
- constraint ID and version;
- type: safety, privacy, legal, product, resource, provider, implementation, or assumption;
- intended harm/failure prevented;
- scope and owner;
- evidence and counterevidence;
- known false positives and false negatives;
- review trigger or expiry;
- reversible alternative experiment;
- rollback condition and evidence.

Provider/API/plan limitations are operational facts only within the observed environment and time. They should not silently become universal architectural principles. Conversely, the existence of a workaround does not prove it is secure, authorized, or production-ready.

## Y2K as a failure model

Y2K is relevant as an engineering pattern, not as a claim that all systems will crash. Many systems represented years with two digits, embedding an assumption that the century was fixed or irrelevant. The date rollover exposed how a local storage shortcut became a distributed semantic dependency across code, databases, devices, contracts, tests, and operations.

The transferable lessons:
- inspect hidden assumptions at representation boundaries;
- test rollover and boundary conditions, not only ordinary cases;
- inventory dependencies before changing a shared invariant;
- distinguish a local patch from a system-wide repair;
- keep compatibility paths explicit and temporary when possible;
- require evidence across components, not just a passing unit test;
- preserve recovery and rollback paths.

For MC/FIA, analogous hazards include confusing recorded time with valid time, treating missing records as negative facts, silently changing symbol meanings, allowing old memories to overwrite newer evidence, assuming provider behavior is invariant, or declaring a release healthy because its source exists. Temporal and semantic rollover tests should be first-class tests.

## Required tests

Every implementation of this protocol should include synthetic tests for:
1. two competing interpretations with unequal evidence;
2. same proposition valid in different time intervals;
3. a newer record that does not invalidate an earlier valid interval;
4. unavailable and not-collected sources not being treated as evidence of absence;
5. a correction that preserves prior versions and records the reason;
6. supersession cycles and dangling claim references;
7. a constraint challenged by a counterexample but not silently disabled;
8. a valid schema that does not claim factual truth or deployment success.

## Integration contract

- **Main repository:** owns protocol, schema, deterministic validator, synthetic fixtures, and test design.
- **UI repository:** renders versions, sources, temporal scope, unresolved conflicts, correction, and supersession without choosing a winner invisibly.
- **Conversation Parallax:** supplies independent reader views and disagreement records; reader count is not a truth vote.
- **Evidence gates:** decide whether a record may enter a destination; they do not decide that a proposition is objectively true.
- **Foundation Intelligence Architecture:** governs translation, memory, identity, and execution boundaries across providers.
- **Release/deployment layer:** proves what artifact ran, where, under which configuration, and with what health/recovery evidence.

## Acceptance boundary

This protocol is accepted only as a design and synthetic-validation proposal until:
- automated tests run in a trusted environment;
- the UI consumes the claim model;
- gate integration is tested against real destination boundaries using synthetic data;
- correction, export, deletion, and rollback behavior are verified;
- deployed artifact identity and health are independently observed.

No test or document alone establishes those later states.
