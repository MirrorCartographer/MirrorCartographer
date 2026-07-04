# Graph Backend Auditability Boundary — Evidence Map

Run: 98  
Status: claim narrowed / implementation criterion added  
Area: Mirror Cartographer knowledge substrate, GitHub mind, future Obsidian or graph-database integration

## Claim tested

> Connecting Mirror Cartographer to Obsidian, a graph database, or graph visualization will make the knowledge substrate more accurate and auditable.

## Result

Downgraded and narrowed.

A graph backend or visual graph can make relationships easier to inspect, query, and validate, but it does not itself make the system accurate, trustworthy, or auditable.

The supported claim is narrower:

> A graph-based representation can improve MC's auditability only when claims, evidence, source roles, provenance, confidence changes, contradictions, and validation constraints are explicitly modeled and tested.

## Evidence found

### Source 1 — W3C RDF 1.1 Concepts and Abstract Syntax

Source type: primary technical standard.  
Role: supports graph representation as a formal model, not truth validation.

Relevant facts:

- RDF is a W3C Recommendation dated 25 February 2014.
- RDF graphs are built from subject-predicate-object triples.
- RDF can represent statements and relationships between resources.
- RDF graphs are static snapshots unless change over time is represented with appropriate vocabulary.
- RDF itself does not guarantee that modeled statements are true; it provides a data model for expressing statements.

Implication for MC:

RDF-style graph modeling could represent MC claims and evidence relationships more explicitly than loose Markdown links. However, graph representation is not equivalent to truth, reliability, or audit completeness.

### Source 2 — W3C SHACL Shapes Constraint Language

Source type: primary technical standard.  
Role: supports machine-checkable structural validation.

Relevant facts:

- SHACL is a W3C language for validating RDF graphs against specified conditions.
- Conditions are expressed as shapes.
- A SHACL shapes graph validates a data graph and can support validation, data integration, code generation, and user-interface building.

Implication for MC:

If MC moves toward a graph model, SHACL-like constraints could enforce minimum requirements such as:

- every claim must have a status;
- every evidence edge must have a role;
- every source must have source class, date, and directness;
- every confidence upgrade must cite a test, not only a source;
- every high-risk claim must have a falsification criterion.

Without constraints, a graph can become visually impressive but semantically weak.

### Source 3 — W3C PROV-O

Source type: primary provenance standard.  
Role: supports interoperable provenance modeling.

Relevant facts:

- PROV-O provides classes, properties, and restrictions for representing and interchanging provenance across systems and contexts.
- Its basic classes include Entity, Activity, and Agent.
- PROV-O can be specialized for application-specific provenance details.

Implication for MC:

MC should not treat GitHub commits, Obsidian links, or graph nodes as sufficient provenance. A provenance layer should represent:

- what entity was created or changed;
- what activity produced the change;
- what source entities were used;
- what agent or tool performed the activity;
- when the activity happened;
- what claim-status change resulted;
- what uncertainty remains.

## Fact / inference separation

### Facts supported by sources

- RDF is a formal graph data model for representing information as triples.
- SHACL can validate RDF graphs against explicit conditions.
- PROV-O is a W3C provenance ontology for representing provenance across systems.
- These standards support graph representation, validation, and provenance exchange.

### MC-specific inferences

- MC would likely benefit from a graph layer because its core objects are already relational: claims, evidence, contradictions, sources, tests, agents, artifacts, and status changes.
- Obsidian is useful as a human thinking interface, but it should not be treated as the canonical evidence engine.
- A graph database is useful only if MC first defines a claim ontology and validation constraints.
- Visual graph density is not evidence quality.

## Updated claim status

Previous loose assumption:

> Graph tooling will make MC more accurate and auditable.

Updated claim:

> Graph tooling may improve MC auditability if paired with a formal claim schema, provenance model, and validation constraints. It does not independently prove accuracy or trustworthiness.

Confidence: moderate for the architecture boundary; low for MC-specific benefit until piloted.

## Evaluation criterion added

### MC-GRAPH-AUDIT-01

Before any graph backend is described as improving MC auditability, it must pass this criterion:

1. Claims have stable IDs.
2. Every claim has a current status.
3. Every evidence relation has a role: direct support, indirect support, context, contradiction, mechanism, validation, or navigation.
4. Every source has source class, publication date, retrieval date, directness, independence, and freshness.
5. Every confidence change has a reason and provenance record.
6. Every contradiction has a disposition: unresolved, resolved, scope-limited, or retired.
7. Every high-stakes claim has a falsification condition.
8. The graph can answer at least these queries:
   - Which claims have no direct evidence?
   - Which claims rely on stale evidence?
   - Which claims rely on Wikipedia or news as final evidence?
   - Which confidence upgrades lack tests?
   - Which claims have unresolved contradictions?
9. A reviewer can reconstruct why a claim holds its current status without reading unrelated documents.
10. Validation rules detect missing required fields.

## Falsification checklist

The graph-backend claim fails if:

- graph nodes exist but do not distinguish claim, source, evidence, test, contradiction, and artifact;
- visual links exist but edge types are undefined;
- provenance is only a Git commit or file timestamp;
- graph queries cannot identify unsupported claims;
- confidence changes are not tied to source or test evidence;
- reviewers cannot reconstruct claim status from the graph;
- validation rules are absent;
- graph visualization increases perceived rigor without improving audit accuracy.

## Recommended implementation path

Phase 1: Define MC claim ontology in Markdown/YAML first.

Minimum object types:

- Claim
- Source
- EvidenceMap
- TestPlan
- Evaluation
- Contradiction
- Artifact
- Agent
- Activity
- StatusChange

Phase 2: Add structured frontmatter to new evidence maps.

Phase 3: Add validation script that checks required fields.

Phase 4: Export graph to RDF-like triples or JSON-LD.

Phase 5: Add Obsidian for human navigation.

Phase 6: Add graph database only after the schema proves useful.

## Next proof needed

MC-GRAPH-PILOT-01:

Convert 20 existing MC artifacts into structured graph records with typed nodes and typed edges. Then test whether the graph can automatically identify:

- unsupported claims;
- stale sources;
- derivative source clusters;
- missing provenance;
- unresolved contradictions;
- confidence upgrades without tests.

Success condition:

An independent reviewer should be able to select any one of the 20 claims and reconstruct its evidence basis, status history, uncertainty, and next proof needed in under 10 minutes.

## Sources

- W3C, RDF 1.1 Concepts and Abstract Syntax, W3C Recommendation, 25 February 2014: https://www.w3.org/TR/rdf11-concepts/
- W3C, SHACL Shapes Constraint Language, W3C Recommendation: https://www.w3.org/TR/shacl/
- W3C, PROV-O: The PROV Ontology, W3C Recommendation: https://www.w3.org/TR/prov-o/
