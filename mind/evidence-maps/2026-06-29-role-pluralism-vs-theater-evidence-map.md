# Evidence Map: Role Pluralism vs Theater

Date: 2026-06-29
Status: design principle partly supported; MC-specific effect unproven

## Claim tested

Mirror Cartographer and the GitHub mind should use distinct internal roles / organisms / hats — Engineer, Critic, Explorer, Archivist, Child, Comedy Club, etc. — because role-plural structure can improve reasoning, creativity, and design quality.

## Narrowed claim

A safer claim is:

> Role-plural architecture may improve MC design work only when the roles create real cognitive difference, structured dissent, and traceable decision pressure. If roles are decorative, identical, or performative, they may add token cost, false confidence, and theater.

## Why this needed testing

Recent MC language has leaned toward rooms, organisms, and hats. That is creatively useful, but it risks becoming mythic naming without evaluation. The evidence question is not whether the metaphor is beautiful. The question is whether differentiated roles cause better architecture than a single undifferentiated assistant response.

## Evidence found

### 1. Multi-agent debate can improve LLM reasoning and factuality, but the evidence is task-limited

Du et al. proposed multi-agent debate in which multiple language model instances propose and critique answers over rounds. They report improvements in mathematical reasoning, strategic reasoning, and factual validity compared with single-agent baselines.

Source: Yilun Du, Shuang Li, Antonio Torralba, Joshua B. Tenenbaum, Igor Mordatch, "Improving Factuality and Reasoning in Language Models through Multiagent Debate" (2023). https://arxiv.org/abs/2305.14325

Relevance to MC: supports the general idea that multiple interacting perspectives can improve reasoning.

Limit: the tasks are not symbolic reflection, authorship design, privacy-safe memory, or long-term GitHub mind evolution.

### 2. Diversity between agents may matter more than mere multiplicity

Hegazy (2024) reports that multi-agent debate benefits most when the debating models are diverse rather than identical copies. A diverse set of medium-capacity models outperformed a set of same-model agents on reasoning benchmarks.

Source: Mahmood Hegazy, "Diversity of Thought Elicits Stronger Reasoning Capabilities in Multi-Agent Debate Frameworks" (2024). https://arxiv.org/abs/2410.12853

Relevance to MC: supports the requirement that MC roles must have genuinely different priors, questions, standards, and failure modes.

Limit: model diversity is not the same as prompt-role diversity inside one assistant. MC cannot assume naming a role creates real diversity.

### 3. Debate structures can improve efficiency, but unmanaged debate creates cost

GroupDebate research argues that adding agents and debate rounds can improve reasoning, but also raises token cost; grouping and sharing interim results can reduce debate cost while maintaining or improving accuracy.

Source: Tongxuan Liu et al., "GroupDebate: Enhancing the Efficiency of Multi-Agent Debate Using Group Discussion" (2024). https://arxiv.org/abs/2409.14051

Relevance to MC: suggests the GitHub mind should not let every organism speak every time. Role invocation needs gating.

Limit: efficiency gains were measured on benchmark tasks, not creative design evolution.

### 4. Human dissent research supports disagreement, but authentic dissent may be stronger than assigned devil's advocacy

Social psychology and organizational literature distinguish genuine dissent from performative devil's advocacy. Summaries of Charlan Nemeth's work argue that authentic dissent stimulates broader thinking more than role-played disagreement.

Source overview: Charlan Jeanne Nemeth, *In Defense of Troublemakers: The Power of Dissent in Life and Business* (2018); related discussion summarized in Financial Times, "The refreshing power of disagreement" (2026). https://www.ft.com/content/f94c83f6-8d30-49c2-8280-b71af8095b4e

Relevance to MC: supports the idea that a Critic role must be allowed to actually change outcomes, not merely perform skepticism.

Limit: human group dissent findings do not directly prove LLM role prompting improves output.

### 5. Creativity research supports shifting between generative and evaluative modes

Sowden, Pringle, and Gabora review creative cognition through dual-process theory and argue that creativity involves shifting between generative and evaluative modes, not only producing more ideas.

Source: Paul Sowden, Andrew Pringle, Liane Gabora, "The Shifting Sands of Creative Thinking: Connections to Dual Process Theory" (2014). https://arxiv.org/abs/1409.2207

Relevance to MC: supports separating role modes like Explorer / Child / Comedy Club from Engineer / Critic / Archivist.

Limit: this supports mode-shifting generally, not the specific MC organism architecture.

## Fact vs inference

### Facts

- Multi-agent debate has published evidence of improving some LLM reasoning and factuality tasks.
- Evidence suggests agent diversity can matter; identical agents may not provide the same benefit as genuinely different ones.
- More agents and debate rounds can increase computational and attention cost.
- Human dissent literature supports the value of dissent, but warns that performative devil's advocacy may be weaker than authentic disagreement.
- Creativity research supports alternation between generative and evaluative modes.

### Inferences

- MC should preserve role pluralism, but only if roles have distinct decision rights, evidence standards, and failure modes.
- A Comedy Club or Child role is defensible only if it creates candidate reframes that later survive evaluation.
- The Critic role must be able to block, revise, or downgrade claims; otherwise it is theater.
- The GitHub mind should record which role changed what, so role impact can be audited.

## Claim status update

Previous status: attractive architecture metaphor.

Updated status: partially supported as a design principle; unproven as implemented MC practice.

Confidence: moderate for role-plural reasoning as a useful design direction; low-to-moderate for MC-specific effectiveness until tested.

## Requirement added

### R-ROLE-01: Roles must create decision pressure

A named role in MC or the GitHub mind is valid only if it has at least one of the following:

1. A distinct question it is responsible for asking.
2. A distinct failure mode it is responsible for detecting.
3. A distinct permission to block, revise, downgrade, or mutate an artifact.
4. A distinct output format that other roles do not produce.
5. A traceable effect on the final artifact.

If a role has none of these, it should be removed, merged, or moved to the Comedy Club as play rather than architecture.

## Evaluation criterion

### ROLE-PLURAL-01

Given the same MC design problem, compare three conditions:

1. Single-pass undifferentiated assistant response.
2. Named roles with no enforcement.
3. Enforced role-plural workflow with distinct responsibilities and a final synthesis.

The role-plural workflow succeeds only if it produces at least one of the following without excessive burden:

- more explicit assumptions,
- stronger falsification criteria,
- better separation of fact and inference,
- more novel but testable design variants,
- clearer decision trail,
- fewer unsupported claims.

## Minimal test plan

Test problem: design the next version of Influence Scope Card.

Condition A: one normal architecture response.

Condition B: five named roles respond freely: Engineer, Critic, Explorer, Archivist, Child.

Condition C: five enforced roles:

- Explorer: generate three strange variants.
- Engineer: choose one buildable variant and specify data structure.
- Critic: list failure modes and downgrade unsupported claims.
- Archivist: connect to prior GitHub artifacts and evidence maps.
- Child / Comedy Club: produce one absurd reframing that might expose hidden rigidity.

Score outputs on ROLE-PLURAL-01.

## Falsification checklist

Role-plural architecture should be downgraded if:

- named roles produce the same content with different labels,
- role discussion increases length without changing decisions,
- the Critic never changes claim status,
- playful roles produce charm but no testable reframes,
- users cannot tell why roles improved the artifact,
- the workflow becomes too slow for routine MC use,
- role conflict creates fake balance where evidence is actually one-sided.

## Design consequence

The GitHub mind should keep the organism metaphor, but convert it from personality decoration into accountable workflow architecture.

Recommended folder addition:

- `mind/organisms/role-charters/`

Recommended files:

- `engineer.md`
- `critic.md`
- `explorer.md`
- `archivist.md`
- `child.md`
- `comedy-club.md`

Each file should include:

- domain of authority,
- required question,
- blocking power,
- output format,
- known failure mode,
- evidence standard,
- when not to invoke.

## Next proof needed

Run one real MC architecture problem through the three-condition comparison and preserve all outputs. The next proof is not another essay. It is a side-by-side evaluation showing whether enforced role pluralism changes the artifact in ways a reviewer can see.
