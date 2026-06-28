# 03 — Smaller / Focused Company Audits

Date: 2026-06-28
Privacy: PUBLIC-SAFE
Revision: v0.1
Scope: Cursor / Anysphere, Harvey, Continue.dev
Claim boundary: Public evidence only.

---

# Cursor / Anysphere

## Executive assessment

Cursor is one of the clearest near-term proof targets for Mirror Cartographer because coding agents produce concrete transformations: diffs, tests, dependencies, commands, errors, rollbacks, and production impact. This makes AI transformation auditing measurable.

## Public strengths

- SOURCE / HIGH: Cursor is an AI coding environment used for software development workflows.
- INFERENCE / HIGH: Developer workflow adoption suggests strong product-market fit among AI-forward engineers.
- INFERENCE / HIGH: Coding work is unusually auditable because changes can be inspected through commits, tests, reviews, and runtime behavior.

## Exposed surfaces

- INFERENCE / HIGH: The more agentic coding tools become, the more they require permission boundaries, provenance, test discipline, and rollback paths.
- HYPOTHESIS / MEDIUM: Cursor-like tools need independent audit trails that are more structured than raw git history.
- UNKNOWN: Internal incident rates, evals, and enterprise governance controls.

## Buyer-grade audit opportunities

1. AI code-change audit: map prompt → plan → changed files → tests → risk → reviewer decision.
2. Agent autonomy boundary report: identify which commands/tools/files the agent could access.
3. Dependency provenance audit: identify generated code paths that introduce package, license, or security risk.
4. Production-readiness evidence pack: compress diff, test, and risk information for engineering managers.

## Contradictions / tensions

- Speed versus review quality.
- Autonomous code generation versus human accountability.
- Developer delight versus enterprise compliance.
- Model/vendor abstraction versus provenance clarity.

## Recommended experiments

- Run MC on a real open-source pull request and produce a transformation audit card.
- Create a Cursor enterprise add-on concept: “AI Change Ledger.”
- Build a before/after report showing what normal code review misses that MC flags.

---

# Harvey

## Executive assessment

Harvey is a strong MC-adjacent target because legal work already values provenance, citation, privilege, review, and careful language. The wedge is not “AI lawyer.” The wedge is audited legal work-product transformation.

## Public strengths

- SOURCE / HIGH: Harvey serves legal and professional-services workflows.
- INFERENCE / HIGH: Legal buyers understand the value of audit trails and review discipline.
- INFERENCE / MEDIUM: Domain-specific legal AI can command higher willingness to pay than generic productivity AI.

## Exposed surfaces

- INFERENCE / HIGH: Legal hallucination, citation reliability, jurisdiction mismatch, privilege, and confidentiality are core risk surfaces.
- INFERENCE / HIGH: Token and model-cost pressure matters when legal workflows scale to large document volumes.
- UNKNOWN: Internal hallucination rates, customer review processes, and model-routing economics.

## Buyer-grade audit opportunities

1. Legal claim provenance audit: every legal assertion gets source, jurisdiction, confidence, and reviewer status.
2. Contract transformation log: clause changed, reason, evidence, risk, fallback language.
3. Litigation document map: claim, exhibit, testimony, contradiction, missing evidence.
4. ROI/token audit: identify which legal tasks justify expensive reasoning models versus cheaper summarization.

## Contradictions / tensions

- Automation speed versus professional responsibility.
- Enterprise customization versus standardized evidence quality.
- Confidentiality requirements versus model/tool complexity.
- AI work-product convenience versus lawyer duty of review.

## Recommended experiments

- Produce a mock contract-review audit using public template contracts.
- Build a legal hallucination labeling standard.
- Create a “do not cite unless verified” evidence gate.

---

# Continue.dev

## Executive assessment

Continue.dev is strategically important because it sits closer to open-source, local, and self-hosted AI development workflows. Its MC opportunity is less about selling a black-box audit to enterprises and more about creating transparent governance and evaluation layers developers can adopt.

## Public strengths

- SOURCE / HIGH: Continue.dev is associated with open-source AI coding assistant workflows.
- INFERENCE / HIGH: Open-source positioning creates trust and extensibility advantages.
- INFERENCE / MEDIUM: Local/self-hosted or customizable workflows may matter for teams that cannot send code to closed services.

## Exposed surfaces

- INFERENCE / MEDIUM: Open ecosystems can fragment quality, model behavior, and security assumptions.
- INFERENCE / MEDIUM: Enterprise buyers still need support, compliance, and predictable governance.
- UNKNOWN: Long-term monetization, enterprise adoption depth, incident rates.

## Buyer-grade audit opportunities

1. Open-source governance audit: maintainers, licenses, release process, security reporting, dependency health.
2. Model-routing transparency report: which model was used for which task and why.
3. Local-agent risk map: what data stays local, what leaves, what tools execute.
4. Team evaluation harness: repeatable tests for code generation, refactoring, documentation, and safety.

## Contradictions / tensions

- Openness versus support burden.
- Flexibility versus consistent quality.
- Local control versus configuration complexity.
- Developer autonomy versus organizational governance.

## Recommended experiments

- Create an MC plugin/report format for open-source AI coding workflows.
- Build a repository-level AI usage disclosure standard.
- Create public benchmark examples for documentation, refactoring, and test generation.

---

# Smaller-company synthesis

The smaller-company opportunity is sharper than the frontier-lab opportunity because the work products are closer to the buyer: code, contracts, documents, tickets, and workflows. MC should sell structured transformation audits before selling the full symbolic cognition system.