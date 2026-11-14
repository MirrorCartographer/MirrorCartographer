# LYR Orchestrator v1 — dry-run boundary

This component connects three existing pieces without duplicating them:

1. An injected authenticator supplies a verified identity. The proposal cannot nominate its own actor.
2. The existing FREE 2.0 proposal gate checks authority, ownership, baseline, outcomes, stop conditions, rollback, data handling, and open consequence ownership.
3. The existing delegated-authority evaluator checks capability-specific scope and policy. Data classification and risk flags come from an injected trusted risk inspector, not the model's proposal.

A JSONL audit receipt is persisted before a result is returned. Audit persistence failure blocks the operation.

## Deliberate limits

- Dry-run is the default.
- There is no execution adapter in v1. Even with dry-run disabled, the component explicitly refuses execution.
- No public HTTP endpoint, token format, credential storage, model provider, scheduler, or deployment adapter is included.
- The caller must provide a real authenticator and risk inspector. Test doubles are for tests only.
- FREE 2.0 eligibility is not a human approval. Any high-impact decision remains subject to human review under the Constitution.
- This orchestrator is not an always-on daemon and does not establish an autonomous model identity.

## Minimal use

Construct LyrOrchestrator(authenticator, risk_inspector, JsonlAuditSink(path)), then call dispatch(credential, ProposedAction(...)). Supply a real tools.free_engine.free_engine.Proposal as free_proposal. Keep the service private until authentication, threat modeling, and deployment controls are independently reviewed.

## Next integration gates

1. Implement a verified identity adapter using an owner-controlled identity provider.
2. Implement trusted resource classification and capability-specific risk inspection.
3. Add signed human approval records for actions that require approval.
4. Add patch-only, project-relative file adapters with symlink defense, atomic writes, rollback, and isolated tests.
5. Verify CI on the default branch before enabling any execution.
6. Add a persistent scheduler/queue only after cost, secrets, and operational ownership are approved.
