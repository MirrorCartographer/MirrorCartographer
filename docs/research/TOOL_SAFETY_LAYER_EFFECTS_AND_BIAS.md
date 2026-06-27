# Tool Safety Layer Effects and Bias

Revision note:

- Status: public-safe research and workflow analysis.
- Reason: created after the user asked for a full explanation of the OpenAI tool-use safety layer around the GitHub connector, including positive effects, negative effects, and possible bias.
- Source: observed blocked GitHub write attempts, successful narrower write attempts, existing execution-hub boundaries, and current Mirror Cartographer publication-friction work.
- Boundary: this file describes observed behavior and research implications. It does not reveal internal classifier logic or claim access to hidden OpenAI safety rules.

## What the layer is

The observed tool-safety layer is a guardrail around external tool use.

In this case, the external tool was the GitHub connector.

When the assistant tried to write a file to GitHub, the write was checked before reaching the repository.

If the check blocks the action, the file is not created and GitHub is not changed.

## What it is not

It is not a GitHub permission error.

It is not a Vercel deployment error.

It is not proof that the idea is forbidden.

It is not proof that the repo is unsafe.

It is not a detailed explanation of which exact words were rejected.

## Why it exists

A tool-use safety layer exists because writing to external systems can have consequences beyond the chat.

External tool actions can:

- publish content
- modify repositories
- send messages
- create records
- expose private details
- change shared artifacts
- affect future readers

The layer helps prevent some harmful or irreversible actions before they happen.

## Positive effects on research

### 1. It creates a publication pause

The block forces the assistant to stop and ask whether the content should be abstracted more carefully.

Research benefit:

The pause can improve privacy and reduce reckless public export.

### 2. It reveals boundary needs

A blocked write shows that public publication is not just content generation.

It is a boundary event.

Research benefit:

Mirror Cartographer can treat publication friction as data for designing safer public/private workflows.

### 3. It encourages smaller, clearer artifacts

When a broad policy write is blocked, a narrower note may succeed.

Research benefit:

The repo may become cleaner because files are more focused and less overloaded.

### 4. It protects against accidental exposure

If the assistant accidentally includes sensitive or over-specific material, the layer may stop the outbound action.

Research benefit:

It adds a second check beyond assistant judgment.

### 5. It strengthens audit culture

A blocked write can be documented as a workflow event.

Research benefit:

The system becomes more honest about what happened, what did not happen, and what route was used instead.

## Negative effects on research

### 1. It can interrupt momentum

A useful artifact may fail to publish even when the user explicitly wants research organized.

Research cost:

The work may fragment or require multiple attempts.

### 2. It can hide the exact cause

The assistant usually sees only that the write was blocked, not the internal classifier rule.

Research cost:

The system cannot precisely explain why a particular payload failed.

### 3. It may push toward vagueness

To avoid blocks, the assistant may over-abstract.

Research cost:

Public artifacts may become safer but less vivid, less specific, or less useful.

### 4. It may bias what gets preserved

Material that is easy to write publicly may appear more represented than material that triggers safeguards.

Research cost:

The repository may overrepresent neutral methods and underrepresent sensitive origin contexts.

### 5. It may privilege clean language over messy truth

A safety layer may be more likely to allow polished generalities than intense, raw, or borderline material.

Research cost:

Mirror Cartographer must avoid mistaking what is publishable for what is important.

## Possible bias introduced

### Publication bias

Findings that pass the write layer appear in GitHub.

Findings that are blocked, private, or too sensitive may disappear unless separately documented.

Correction:

Keep a missingness/source-boundary register.

### Retrieval bias

Available files and searchable snippets shape what the assistant can find.

Correction:

Label sources as available, partial, memory-backed, redacted, or unavailable.

### Sanitization bias

Public-safe abstraction may strip away the emotional or conversational force that created the idea.

Correction:

Preserve interaction-level patterns without publishing identifying specifics.

### Safety-over-specificity bias

The assistant may avoid concrete examples even when concrete examples would clarify the method.

Correction:

Use anonymized examples and explicit boundary labels.

### Assistant-self-protection bias

The assistant may become too cautious after a block and stop attempting useful public-safe work.

Correction:

Use staged writes, smaller artifacts, and clear publication checks instead of giving up.

## How to use this positively

Mirror Cartographer should treat tool-safety friction as part of the research architecture.

The workflow should become:

1. Research deeply.
2. Identify private or sensitive load.
3. Abstract to public method.
4. Label source and claim status.
5. Check publication risk.
6. Attempt the write.
7. If blocked, document the boundary and try a narrower public-safe artifact.

## What the assistant should not do

Do not treat a safety block as proof that the idea is bad.

Do not pretend to know the exact internal rule.

Do not force a blocked write by making the content less honest.

Do not publish private specifics to prove vividness.

Do not abandon the finding just because the first write failed.

## What this means for MC

The safety layer can make Mirror Cartographer better if the project treats it as a boundary signal.

It can make Mirror Cartographer worse if the project lets it erase important but sensitive findings.

The right answer is not total publication or total silence.

The right answer is routed publication:

private source -> public-safe abstraction -> labeled claim -> labeled source -> boundary -> reviewable artifact

## Search terms

tool safety layer, GitHub connector, publication bias, sanitization bias, safety-over-specificity, public-safe abstraction, publication friction, external tool write, Mirror Cartographer research bias.