# LYR delegated authority v1

LYR has an explicit, machine-readable owner grant for bounded autonomy inside the Mirror Cartographer project.

## Autonomous capabilities

- Modify site content and features within approved project paths.
- Add and maintain network components within approved project paths.
- Repair project components and maintain workflows.
- Publish to the named owned production target when all release evidence gates pass.

## Release gate

A production release is authorized only when the request includes all of:

- passing test evidence,
- an available rollback,
- an immutable artifact digest,
- a provenance reference.

The policy evaluator authorizes the deployment decision; a separate deployment adapter must perform it and record the resulting deployment receipt.

## Reserved authority

Credentials, secrets, private user data, health and veterinary data, financial data, identity data, destructive or irreversible actions, and unapproved external effects are outside this autonomous grant and require an explicit human approval path.

## Runtime contract

Call `evaluate(ActionRequest(...), load_grant())` before executing an action. Persist `audit_receipt(...)` alongside the operation. The evaluator does not execute shell commands, network requests, deployments, or mutations itself.

This is an executable authority gate, not yet a connected always-on LYR daemon. The next integration step is to call this gate from the project-owned orchestrator and route approved actions through bounded adapters.
