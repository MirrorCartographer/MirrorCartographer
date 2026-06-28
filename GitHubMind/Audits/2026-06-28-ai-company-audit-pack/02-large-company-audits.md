# 02 — Large Company Audits

Date: 2026-06-28
Privacy: PUBLIC-SAFE
Revision: v0.1
Scope: OpenAI, Anthropic, Google DeepMind
Claim boundary: Public evidence only.

---

# OpenAI

## Executive assessment

OpenAI’s public surface combines frontier model capability, mass consumer distribution, enterprise/API infrastructure, and increasingly agentic tooling. Its central audit problem is not whether the systems are useful. The problem is whether capability claims, safety claims, user experience, and deployment controls remain legible at scale.

## Public strengths

- SOURCE / HIGH: OpenAI has broad product distribution through ChatGPT and API products.
- SOURCE / HIGH: OpenAI publishes safety/system documents such as model behavior guidance and preparedness-style risk frameworks.
- INFERENCE / HIGH: The company has strong developer ecosystem leverage because third parties build on its API and product surfaces.

## Exposed surfaces

- INFERENCE / MEDIUM: Public safety frameworks are difficult for ordinary users, buyers, and policymakers to translate into operational decisions.
- INFERENCE / MEDIUM: Consumer-scale emotional reliance creates a different safety surface than enterprise API misuse.
- HYPOTHESIS / MEDIUM: OpenAI’s largest trust bottleneck is not lack of capability; it is explaining boundary conditions in forms non-specialists can act on.

## Buyer-grade audit opportunities

1. Model-behavior claim map: translate public model behavior promises into testable user-facing expectations.
2. Preparedness-framework affordance audit: map what the framework requires, permits, discourages, or leaves unspecified.
3. User-risk boundary audit: identify where product design may blur tool, companion, therapist, tutor, and authority roles.
4. Enterprise transformation logs: show how AI output changes documents, code, policies, or workflows.

## Contradictions / tensions

- Safety framing versus deployment speed.
- General-purpose assistant identity versus specialized professional liability.
- Personalization and memory value versus privacy and psychological dependence risk.
- Frontier-risk language versus ordinary user comprehension.

## Recommended experiments

- Create a public demo comparing one OpenAI-generated work product before/after MC audit labels.
- Build a claim-to-evidence parser for OpenAI safety documents.
- Produce a user-facing “what this answer is not” annotation layer.

## Missingness

- UNKNOWN: internal evals and red-team data.
- UNKNOWN: incident frequency across consumer emotional-support use.
- UNKNOWN: enterprise audit log adoption rates.

---

# Anthropic

## Executive assessment

Anthropic’s public identity is unusually tied to safety, constitutional AI, Claude, and governance commitments. That makes it a prime target for governance-drift auditing: the important question is whether public commitments remain stable, operational, and understandable as competitive pressure rises.

## Public strengths

- SOURCE / HIGH: Anthropic has published safety and responsible-scaling materials.
- SOURCE / HIGH: Anthropic introduced the Model Context Protocol as a public standard for AI-tool/context integration.
- INFERENCE / HIGH: Anthropic’s brand equity depends heavily on trust, enterprise safety, and responsible deployment.

## Exposed surfaces

- INFERENCE / MEDIUM: Any revision to safety commitments creates interpretation risk even when revisions are reasonable.
- INFERENCE / HIGH: Tool-use and context integration expand the action surface beyond text generation.
- HYPOTHESIS / MEDIUM: Anthropic needs externally legible continuity maps showing how policy revisions preserve, weaken, or replace earlier commitments.

## Buyer-grade audit opportunities

1. Policy revision diff: compare safety-policy versions and label strengthened, weakened, removed, and reframed commitments.
2. MCP trust audit: map how tool connectors create new data, permission, and provenance obligations.
3. Claude enterprise review pack: produce buyer-facing evidence templates for regulated teams.
4. Governance artifact readability audit: translate policy into operational controls.

## Contradictions / tensions

- Safety-leader identity versus competitive frontier race.
- Voluntary governance versus binding accountability.
- Tool ecosystem openness versus connector risk.
- Enterprise usefulness versus strict refusal/safety boundaries.

## Recommended experiments

- Build an RSP/Frontier-policy diff artifact with MC labels.
- Build an MCP connector risk card template.
- Create a public “policy promise survival map” showing which commitments survive revision.

## Missingness

- UNKNOWN: internal governance decision process.
- UNKNOWN: full connector incident history.
- UNKNOWN: buyer comprehension of Anthropic’s safety documents.

---

# Google DeepMind

## Executive assessment

Google DeepMind has exceptional research depth and infrastructure reach, but its audit surface is complicated by integration into Google-scale products. The core issue is translation: how research safety commitments survive deployment across consumer, cloud, enterprise, search, mobile, and workspace surfaces.

## Public strengths

- SOURCE / HIGH: Google DeepMind is a major AI research organization with frontier model and scientific AI work.
- SOURCE / HIGH: Google has broad deployment infrastructure across consumer and enterprise products.
- INFERENCE / HIGH: DeepMind has deep bench strength in evaluation, alignment research, and AI-for-science work.

## Exposed surfaces

- INFERENCE / MEDIUM: Product-scale integration makes safety and accountability hard to track across contexts.
- INFERENCE / MEDIUM: Public safety reporting timing can become a trust issue when deployment precedes detailed disclosure.
- HYPOTHESIS / MEDIUM: Google DeepMind’s strongest audit need is cross-product lineage: where a model appears, what controls apply, and what claims follow it.

## Buyer-grade audit opportunities

1. Deployment lineage map: model-to-product-to-user-context trace.
2. Safety disclosure timing audit: what is known pre-release, at release, and post-release.
3. AI-for-science risk register: distinguish beneficial discovery tools from dual-use capability surfaces.
4. Workspace/enterprise transformation audit: document how AI changes business artifacts.

## Contradictions / tensions

- Research caution versus product integration speed.
- Central model capability versus distributed product responsibility.
- Safety documentation versus user-visible explanation.
- AI-for-science promise versus dual-use scientific risk.

## Recommended experiments

- Produce a Gemini-style model lineage template.
- Build a release-disclosure clock comparing date of release, date of safety document, and date of third-party eval.
- Create buyer-facing “where did this AI touch my work?” logs.

## Missingness

- UNKNOWN: internal safety gate criteria.
- UNKNOWN: cross-product incident logs.
- UNKNOWN: user-level comprehension of product safety boundaries.

---

# Large-company synthesis

The shared pattern is public capability expanding faster than public comprehension. MC’s wedge is not competing with frontier labs. It is making their outputs and policies legible enough for buyers, users, clinicians, lawyers, developers, and caregivers to understand what changed and what remains uncertain.