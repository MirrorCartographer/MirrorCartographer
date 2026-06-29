# Evidence Map — Fossil Record for Failed Ideas

Date: 2026-06-29
Status: Design principle supported; MC-specific benefit unproven
Scope: Mirror Cartographer / GitHub mind architecture

## Claim tested

Mirror Cartographer should preserve failed, retired, contradicted, or abandoned ideas as structured "fossils" instead of deleting them or letting them vanish into chat history.

Narrowed claim:

> A structured Fossil Record may improve MC's long-term learning by retaining the context, failure mode, and reusable fragments of ideas that did not survive, but this must be tested against the risk of clutter, false legitimacy, and cognitive drag.

## Why this weak point matters

The GitHub mind currently favors evidence maps, requirements, and successful architectural upgrades. That creates a survivorship-bias risk: future readers may see the polished lineage but lose access to why alternatives died. If failed ideas are not preserved with status labels, MC may repeatedly rediscover rejected paths or overstate the coherence of its own history.

## Evidence found

### Supported facts

1. Blameless postmortem practice in SRE treats failures as learning objects, not as material to hide. Google's SRE guidance says blameless postmortems focus on contributing causes and assume people acted with good intentions given the information available at the time.

2. Architecture Decision Records are a known software practice for preserving significant design decisions along with context and consequences. The public ADR repository defines an ADR as a document capturing an important architectural decision, its context, and consequences.

3. Research on psychological safety and team learning supports the general idea that learning environments improve when people can surface mistakes, uncertainty, and interpersonal risk. Edmondson's 1999 field study introduced psychological safety as a shared belief that a team is safe for interpersonal risk-taking and modeled its relationship to learning behavior and performance.

4. Software architecture traceability research reports that design decisions are often poorly documented, implicit, or inadequately updated, leading to maintainability problems, rework, and cost overruns.

### Limitations and cautions

1. These sources support learning from failure and documenting rationale; they do not prove that MC's symbolic/AI co-creation system will benefit from a Fossil Record.

2. A fossilized failed idea can accidentally gain authority if the interface does not clearly mark its status.

3. Too much retained failure material can create search noise, emotional drag, or decision paralysis.

4. Blameless postmortems are designed for incidents in organizations, not for reflective AI architecture. The analogy is useful but imperfect.

## Fact vs inference

### Fact

- High-quality engineering practice treats incidents and architectural decisions as records worth preserving when they improve future learning.
- Existing software-architecture literature identifies missing or implicit decision rationale as a maintainability problem.
- Psychological safety research supports the value of environments where errors and uncertainty can be surfaced.

### Inference

- MC should preserve failed ideas as first-class artifacts because its design history is interpretive, recursive, and easy to distort after the fact.
- A Fossil Record may reduce survivorship bias in the GitHub mind.
- The useful object is not simply "a failed idea" but a failed idea with context, cause of death, surviving fragments, and revival conditions.

## Claim-status update

Previous status: implied design preference.

New status: externally supported as a design direction by engineering and organizational-learning evidence, but unvalidated in MC.

Confidence: moderate for the general principle; low-to-moderate for MC-specific impact.

## Requirement added

### R-FOSSIL-01 — Preserve failed ideas with status and revival conditions

Any MC concept that is rejected, retired, contradicted, or paused after meaningful exploration should be preserved as a Fossil Record entry if it meets at least one condition:

- It consumed significant design effort.
- It shaped a later surviving feature.
- It failed for a reason likely to recur.
- It contains a fragment that may become useful under different constraints.
- It represents a tempting but unsafe interpretation path.

Each Fossil Record entry must include:

- Original claim or idea.
- Why it seemed promising.
- What broke it.
- Evidence or test that weakened it.
- Surviving fragments.
- Current status: rejected, dormant, superseded, unsafe, incomplete, or revived.
- Revival conditions.
- Links to descendants or replacements.

## Evaluation criterion

### FOSSIL-01 — Failure preservation improves future reasoning

Given a later MC design question, a reviewer should be able to use the Fossil Record to identify at least one previously rejected path, understand why it failed, and decide whether the current situation changes the failure condition.

Success indicators:

- Prevents repeating a known weak path.
- Reveals a reusable fragment from an abandoned idea.
- Makes the history of a surviving feature more legible.
- Clearly marks failed material as non-authoritative.

Failure indicators:

- Users mistake fossil entries for active recommendations.
- Fossils clutter search results without improving decisions.
- Fossils preserve embarrassing or private details without need.
- Fossils become a museum instead of a learning tool.

## Minimal test plan

Create five Fossil Record entries from existing MC history:

1. A feature that was rejected because it overreached.
2. A metaphor that became misleading.
3. A research direction that produced no useful evidence.
4. A visual/interface idea that was pretty but unusable.
5. A safety rule that became too restrictive and was replaced.

Then run one new architecture problem twice:

- Condition A: use only current evidence maps and active requirements.
- Condition B: use active requirements plus Fossil Record entries.

Compare:

- Does Condition B avoid a repeated mistake?
- Does it generate a more precise design constraint?
- Does it add unnecessary burden?
- Does it make uncertainty clearer or murkier?

## Falsification checklist

This claim weakens if:

- Fossil entries are rarely consulted.
- Fossil entries are consulted but do not change decisions.
- The record makes weak ideas look more credible by preserving them.
- Search quality worsens because dead concepts appear beside active ones.
- Emotional or symbolic material is preserved beyond public-safe necessity.
- A simpler ADR/status label system provides the same benefit with less clutter.

## Implementation note

Recommended directory:

`mind/fossil-record/`

Recommended starter files:

- `README.md` — rules for fossilizing ideas
- `template.md` — fossil entry template
- `index.md` — active/dormant/rejected/superseded table
- `revival-log.md` — cases where a fossil became useful again

## Sources

- Google SRE Book, "Blameless Postmortem Culture": https://sre.google/sre-book/postmortem-culture/
- Architecture Decision Records repository: https://github.com/architecture-decision-record/architecture-decision-record
- Edmondson, A. C. (1999). "Psychological Safety and Learning Behavior in Work Teams." Administrative Science Quarterly. https://journals.sagepub.com/doi/10.2307/2666999
- Hyun, S. et al. (2023). "Traceability of Architectural Design Decisions and Software Artifacts: A Systematic Mapping Study." https://reference-global.com/article/10.2478/fcds-2023-0018

## Next proof needed

Build the first five Fossil Record entries from actual MC history and test whether they improve one new design decision. The strongest next proof is behavioral, not documentary: show that a fossil entry changes a future architecture choice in a way that avoids a known failure without creating extra noise.
