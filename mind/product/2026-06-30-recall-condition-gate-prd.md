# PRD: Recall Condition Gate

## Product problem

Mirror Cartographer retrieves and reasons over symbolic, reflective, product, research, implementation, and evaluation material. Semantic similarity is not enough to decide whether a source should shape the current answer.

A source can be relevant but inadmissible.

## Product goal

Add a recall-condition gate that sits between retrieval and output generation. The gate requires the system to label what a source is allowed to do before the system uses it.

## Non-goals

- Do not expose private source content.
- Do not convert symbolic reflection into diagnosis, therapy, medical, legal, veterinary, or financial authority.
- Do not claim implementation status unless verified from current code/runtime evidence.
- Do not treat all saved context as public evidence.

## Users

- Public reader: needs bounded claims and no private leakage.
- Builder/reviewer: needs traceable requirements and evaluation criteria.
- System evaluator: needs to inspect whether retrieval caused overreach.
- User/creator: needs private context to inform architecture without becoming public artifact.

## Core interaction

1. Retrieve possible source material.
2. For each source, generate a recall condition record.
3. Decide allowed influence lane.
4. Use only the permitted abstraction level.
5. Emit source status, claim status, privacy status, missingness, and revision reason when publishing public-safe outputs.

## Required UI/API fields

- Source title or stable ID
- Source type
- Source status
- Claim status
- Privacy status
- Recall conditions
- Invalid conditions
- Allowed influence
- Missingness
- Revision reason

## Acceptance criteria

- The system can explain why a retrieved source was admitted, downgraded, quarantined, or excluded.
- Private context can inform architecture only through abstracted requirements, methods, indexes, evaluation criteria, or implementation plans.
- Historical files cannot be used as current implementation proof without verification.
- Reflective/Mythopoetic material cannot be used as Canonical evidence without relabeling.
- Every public-safe GitHub artifact includes source status, claim status, privacy status, missingness, and revision reason.

## Release checklist

- [ ] Add schema support for recall condition records.
- [ ] Add evaluator prompts that test semantic relevance versus admissibility.
- [ ] Add fixture cases for stale source, private source, mythopoetic source, public README source, and external research source.
- [ ] Add public-safe output template.
- [ ] Add rejection path for sources that are relevant but inadmissible.

## Open research questions

1. How compact can recall receipts become before they lose audit value?
2. Should invalid conditions be model-generated, rule-generated, or both?
3. How should later corrections supersede older source records?
4. Can user feedback downgrade an interpretation without deleting the historical record?
5. What is the difference between a source being safe to cite and safe to use?
