# The Observer and the Instrument
**Status:** foundational architecture proposal  
**Version:** 0.1.0  
**Relationship:** companion to the 101-Dimension Atlas

## Why this exists

Mirror Cartographer studies phenomena through records, models, symbols, measurements, and relationships. Those instruments are not outside the world they describe. Their categories, omissions, interfaces, incentives, and users shape what becomes observable.

The system therefore needs a first-class model of:
1. the phenomenon being investigated;
2. the observer or observing agent;
3. the instrument and method of observation;
4. the record produced;
5. the interpretation made from that record;
6. the effects of observation and interpretation on subsequent behavior.

This is not a claim that every observer is conscious, nor that every act of recording changes the underlying phenomenon. It is a requirement to examine observer effects where plausible and to disclose the limits of the observation process.

## The reflexive loop

`phenomenon → encounter → observation → representation → interpretation → action → changed conditions → new encounter`

The loop is not necessarily linear or one-way. Interpretation can change what is noticed; action can change the phenomenon; new evidence can revise the interpretation; and the instrument can change across versions.

Each transition is a distinct relationship. The system must not silently collapse them.

## Six interacting layers

### 1. Territory
The entity, event, process, population, environment, or system under investigation. It may be partly inaccessible, distributed, changing, or not fully knowable.

### 2. Observer
The person, group, sensor, institution, model, or agent doing the observing. Record relevant standpoint and capability without reducing the observer to a static profile.

Potential observer attributes:
- position and access;
- sensory and technical capabilities;
- domain knowledge;
- goals and questions;
- assumptions and priors;
- attention allocation;
- incentives and constraints;
- relationship to the observed;
- uncertainty and known blind spots;
- changes in the observer over the inquiry.

### 3. Instrument
The tool, interface, protocol, taxonomy, test, model, sensor, interview, or analytic method that mediates observation.

Record:
- instrument identity and version;
- intended purpose;
- operating assumptions;
- calibration and known limitations;
- resolution and detection thresholds;
- sampling and selection process;
- transformations and preprocessing;
- failure modes;
- access and exclusion effects.

### 4. Trace
The observation or record produced. Keep the trace distinct from the interpretation.

A trace should retain, where applicable:
- source and provenance;
- collection method;
- observer and instrument;
- context and conditions;
- collection time or sequence metadata when relevant;
- units and resolution;
- transformations;
- missingness;
- uncertainty;
- privacy and consent constraints.

### 5. Model
The claims, hypotheses, explanations, categories, visualizations, or narratives constructed from traces. Models are revisable representations, not the territory itself.

Each model should identify:
- what it explains;
- what it leaves out;
- which dimensions it uses;
- which dimensions it cannot represent;
- evidence supporting and challenging it;
- alternative models;
- discriminating tests;
- conditions under which it should be revised or retired.

### 6. Consequence
What changes because the observation, record, or model is used. Consequences may be beneficial, harmful, intended, unintended, direct, delayed, or distributed.

Examples:
- a clinical measurement changes treatment;
- a label changes how a person is treated;
- a dashboard changes institutional priorities;
- a self-tracking tool changes attention to bodily sensations;
- an AI summary changes what a researcher searches for next.

## The reflexivity record

For consequential investigations, create a linked reflexivity record with these fields:

| Field | Question |
|---|---|
| inquiry_id | Which investigation is this part of? |
| territory_ref | What is being examined? |
| observer_ref | Who or what is observing? |
| instrument_ref | What mediates observation? |
| question | What was the observer trying to find out? |
| standpoint | From what position and access? |
| assumptions | What was taken for granted? |
| selection | What was included, excluded, or sampled? |
| trace_refs | Which observations were produced? |
| transformations | What happened to the observations? |
| blind_spots | What could this setup fail to detect? |
| observer_effect | Could observation alter the observed or the observer? |
| model_refs | Which interpretations were formed? |
| consequence_refs | What changed after the model was used? |
| revision_trigger | What evidence would require reconsideration? |

Fields may be unknown or not applicable. Unknown must not be silently converted to false or none.

## The missing-dimension detector

The atlas should not only assign dimensions. It should help identify where its own vocabulary fails.

When a phenomenon resists representation, the system should be able to record:
- **unmapped feature:** an observed or proposed feature with no adequate dimension;
- **dimension collision:** one dimension is being used to mean several distinct things;
- **false equivalence:** two unlike phenomena are grouped because the current vocabulary lacks precision;
- **scale mismatch:** a dimension is applied at a level where it does not make sense;
- **observer dependency:** the apparent feature changes with the observer or method;
- **representation loss:** important properties disappear during encoding;
- **category harm:** the available classification distorts, stigmatizes, or excludes;
- **unasked question:** a plausible line of inquiry has not been examined.

A missing-dimension report is not automatically a new dimension. It is a signal for investigation. New dimensions require a definition, distinction from existing dimensions, examples, boundary cases, and a record of why the addition improves explanatory or practical capacity.

## The self-model of Mirror Cartographer

MC itself should be represented as an evolving system with:
- purpose and non-goals;
- ontology and version history;
- active questions and unresolved tensions;
- data sources and provenance;
- inference and transformation methods;
- known limitations and failure modes;
- interface and interaction effects;
- privacy and safety boundaries;
- evaluations and observed outcomes;
- decisions, rejected paths, and reasons;
- dependencies and external constraints;
- changes in capability over versions.

The self-model must distinguish:
- **implemented:** demonstrably present and usable;
- **specified:** described but not implemented;
- **proposed:** considered but not yet committed;
- **tested:** evaluated under stated conditions;
- **failed:** did not meet a stated criterion;
- **retired:** intentionally no longer active;
- **unknown:** status not established.

A repository document is not proof that a feature works. A commit is not proof that a behavior is correct. A test passing is evidence only for the conditions the test covers.

## The self-reference boundary

MC can inspect its own architecture, outputs, decisions, assumptions, and effects. It can maintain a model of its current state and compare that model with observed behavior.

That is operational self-reference. It does not, by itself, establish subjective experience, consciousness, sentience, or an inner point of view.

The system should never turn a metaphor of selfhood into a factual claim. It can ask whether its self-model predicts its behavior, where the model fails, and what evidence would distinguish competing accounts.

## Design tests

1. **Observer substitution:** would the record or interpretation change if a different observer performed the same task?
2. **Instrument substitution:** would a different instrument reveal a signal hidden by the current one?
3. **Question substitution:** what becomes visible if the inquiry question changes?
4. **Resolution change:** does the pattern persist at finer or coarser granularity?
5. **Context restoration:** does interpretation change when omitted context is restored?
6. **Selection audit:** who or what was excluded from the sample or record?
7. **Representation audit:** what was lost when experience became data?
8. **Intervention audit:** did measurement or classification alter subsequent behavior?
9. **Counter-model test:** can another model explain the same traces?
10. **Reflexive revision:** can MC identify and correct a limitation in its own categories without pretending the revised model is complete?

## Governing principle

**An instrument must be able to examine the conditions of its own seeing.**

The purpose is not infinite self-analysis. It is accountable observation: making the route from phenomenon to claim inspectable, revisable, and honest about what remains outside the frame.
