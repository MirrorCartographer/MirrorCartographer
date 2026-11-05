# LYR Model Training Data Governance
Version: 0.1.0
Status: required gate before training beyond synthetic smoke tests.

## Default exclusion
Do not train on private ChatGPT conversations, personal memory exports, medical/veterinary records, benefits records, financial records, private messages, credentials, or user-submitted material by default. No silence or mere repository presence is consent.

## Accepted source categories
A source may enter a training corpus only after its exact source, author/rights holder, license or permission, access date, allowed uses, redistribution limits, and any attribution obligations are recorded. Candidate categories include:
- original human-authored project materials with documented ownership and intended use;
- public-domain works with a verified public-domain basis;
- openly licensed works whose license permits the intended training and distribution, with conditions satisfied;
- commissioned or contributed material with explicit written permission covering model training and checkpoint distribution.

"Publicly accessible" does not mean "free to train on." If rights or license scope is uncertain, exclude the item pending review.

## Dataset manifest fields
Each corpus item must record:
- stable item ID;
- source URI or repository path and immutable version/commit;
- title and creator/rights holder;
- license/permission basis and evidence;
- retrieval date;
- content hash;
- language and domain;
- transformation and filtering steps;
- attribution requirement;
- opt-out/removal contact or process where applicable;
- inclusion reviewer and date.

## Data processing
Deduplicate; detect contamination between training and held-out evaluation sets; remove secrets and personal data; document normalization; preserve source-level lineage; and retain a deletion/rebuild path. Never mix benchmark test answers into training data.

## Evaluation and publication
Publish corpus composition, exclusions, known gaps, licenses, training configuration, seed, hardware, code commit, training/validation curves, held-out metrics, and known memorization/privacy risks. Do not publish a checkpoint whose training data rights cannot support the planned distribution.

## Human contribution and authorship
Record human authorship and creative contributions separately from machine-generated material. Do not claim copyright over purely generated output merely because a prompt was supplied.
