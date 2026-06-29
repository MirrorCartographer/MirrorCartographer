# Product Requirement — Symbolic Translucence Layer

Status labels

- Source status: derived from MC public-safe architecture and current transparency/interface-literacy research.
- Claim status: product requirement proposal.
- Privacy status: public-safe; no private source content.
- Missingness: no UI implementation, no usability testing, no accessibility review yet.
- Revision reason: added to prevent symbolic outputs from becoming persuasive black boxes.

## Problem

MC outputs can be meaningful, aesthetic, and emotionally resonant.

That creates value.

It also creates risk.

Users need to know whether an output is a fact, inference, symbolic interpretation, speculation, requirement, or research question.

They also need to know what kind of source material influenced the output without seeing private content.

## Product goal

Add an interface layer that makes each major output inspectable through public-safe labels and user controls.

## Primary user need

I want the system to show me what kind of map it made, what lens it used, what it does not know, and how I can disagree with it.

## Core UI elements

### 1. Claim Mode Badge

Displays one of:

- Fact
- Inference
- Symbolic Interpretation
- Speculation
- Product Requirement
- Evaluation Criterion
- Research Question
- Implementation Plan

### 2. Lens Route Strip

Shows the active lens path.

Example:

`Entry Signal -> Symbolic Lens -> Privacy Boundary -> Product Requirement`

### 3. Boundary Bill Drawer

Lists source classes that were blocked from publication.

It should say classes, not details.

Example:

- Personal details blocked
- Health details blocked
- Raw transcript blocked
- Location details blocked

### 4. Missingness Panel

Shows what is unknown, unavailable, untested, or intentionally withheld.

### 5. Agency Controls

Controls should include:

- Accept
- Reject
- Rename
- Split
- Merge
- Colder view
- More symbolic view
- Show source-boundary view
- Mark unresolved

### 6. Resonance/Proof Divider

Separates:

- why this might feel useful
- what evidence actually supports it
- what would falsify or shrink it

## Accessibility requirements

- No critical information should exist only in visual color.
- Labels must be readable by screen readers.
- Avoid code-only presentation for core meaning.
- Symbolic diagrams require text equivalents.
- User controls must be keyboard reachable.

## Privacy requirements

The layer may reveal:

- source class
- claim mode
- transformation type
- missingness
- release state

The layer must not reveal:

- raw private text
- personal details
- health or animal-care details
- household or location details
- financial details
- relationship details
- credential details

## Acceptance criteria

A user can inspect any major output and answer:

1. What kind of claim is this?
2. Which lens produced it?
3. What evidence lane is allowed?
4. What private material was blocked?
5. What is missing?
6. How can I contest or revise it?

## Non-goal

The layer does not explain hidden chain-of-thought or model internals.

It explains the public-safe interpretive scaffold.

## Key phrase

The interface should make interpretation legible without making private memory visible.
