# Recovered one-page project brief

- Source: `Mirror_Cartographer_One_Page.pdf`
- Source size: 1,979 bytes
- Source SHA-256: `982a6ba438dde6c37d0e67c5094f621833353c4e1457e15651623a92a6713886`
- Privacy review: no personal identifiers or private records detected.

---

<PARSED TEXT FOR PAGE: 1 / 3>
Mirror Cartographer - Implementation Pack v1
Purpose: convert Mirror Cartographer from a high-density conversational field into a reproducible system that can 
be accessed through ChatGPT, a Custom GPT, and later a standalone app.
Status: Prototype architecture. This is not clinical, diagnostic, therapeutic, or authoritative symbolic truth. It is a 
structured reflection system with explicit uncertainty boundaries.
1. Public Definition
Mirror Cartographer is a recursive symbolic cognition interface that helps a user map inner experience using 
symbols, body-sensation language, colors, metaphors, images, atmosphere, and narrative fragments. It returns 
structured reflections, tracks recurring patterns, preserves contradictions, and updates future interpretations 
through user feedback.
Public-safe one-line version: Mirror Cartographer is an AI-assisted symbolic mapping tool for reflection, pattern￾tracking, and meaning-making.
2. Accessible User Flow
Stage User sees System does Output
Entry What feels present right 
now?
Collects simple state 
input without jargon.
Initial symbolic seed
Field Choose body area, color, 
symbol, atmosphere, or 
words.
Builds symbolic state 
object.
Structured field snapshot
Reflection Receives grounded 
interpretation with 
uncertainty labels.
Routes through 
Canonical, Reflective, or 
Mythopoetic mode.
Reflection card
Resonance User marks resonant, 
partial, false, unclear, or 
too intense.
Updates weights and 
contradiction log.
Adjusted map
Return User receives 
summary/map/prompt.
Exports artifact and 
stores trajectory node.
Return artifact
3. Mode Rules
Mode Allowed Forbidden Confidence source
Canonical Use historically grounded 
symbolic meanings and 
cite source category 
when available.
Inventing meanings or 
claiming personal truth.
Source-backed or marked
unknown
Reflective Use user-confirmed 
history, recurring motifs, 
and present context.
Claiming diagnosis, 
destiny, or hidden 
objective truth.
User validation + 
recurrence
Mythopoetic Generate symbolic story, 
archetype, or image￾language as explicitly 
speculative.
Presenting myth as fact 
or manipulating user 
belief.
Creative/speculative label
only
<PARSED TEXT FOR PAGE: 2 / 3>
4. Symbol Ontology v1
Entity Definition Fields
Symbol A discrete image, object, word, 
gesture, animal, element, or motif.
name, aliases, category, 
source_meanings, user_meanings,
polarity, confidence
Somatic Node A body location or physical 
sensation used as symbolic input.
location, sensation_type, intensity, 
laterality, movement, 
medical_boundary_flag
Atmosphere The emotional/environmental field 
surrounding the input.
density, temperature, speed, 
texture, sound, light, weather
Archetype A recurring role-pattern assembled 
from symbols and behavior over 
time.
name, triggers, symbols, shadow, 
resource, confidence
Contradiction A preserved mismatch between 
interpretations, feelings, or signals.
claim_a, claim_b, context, 
unresolved_status
Trajectory Node A timestamped state snapshot. session_id, active_symbols, 
emotional_vector, changes, 
resonance_score
5. Session State Schema Summary
The system needs persistent state. A single session should save raw user input, extracted signals, selected 
mode, generated reflection, user feedback, and updated symbolic weights. The full JSON schema is included as 
a separate file in this pack.
6. Reflection Engine Logic
1. Receive user input.
2. Classify input into symbol, somatic, emotional, narrative, atmosphere, or contradiction signals.
3. Check safety boundaries: medical, crisis, coercion, delusion-risk, privacy, and claims of objective truth.
4. Select mode or ask user to choose mode when needed.
5. Generate candidates with confidence labels.
6. Separate fact, inference, symbolic interpretation, and speculation.
7. Ask for resonance feedback.
8. Update symbolic weights, contradiction log, and trajectory node.
9. Return a concise artifact.
7. Custom GPT Setup
Create a Custom GPT named Mirror Cartographer. Upload this specification, the ontology file, the state schema, 
and the system prompt. Configure it to operate as a symbolic reflection interface with mode selection, uncertainty 
tagging, resonance feedback, and exportable return artifacts.
Starter conversation prompts:
 Map what I am feeling right now.
 Turn this image/sensation into a symbolic field map.
 Use Canonical Mode only.
 Use Reflective Mode and ask me resonance questions.
 Create a return artifact from this session.
<PARSED TEXT FOR PAGE: 3 / 3>
8. MVP Build Blueprint
Component Minimum build Later build
Frontend One-page intake and reflection 
viewer
Full visual field map
Backend /reflect endpoint Session orchestration and state 
graph
Database sessions table + user feedback Symbol graph + vector memory
LLM prompt Mode-controlled system prompt Dynamic routing and retrieval
Export Markdown/PDF session card Visual maps, timelines, 
audio/atmosphere layers
9. False-Progress Checks
 A beautiful reflection is not proof the system works.
 A user resonating once is not longitudinal validation.
 A symbolic meaning without source/mode labeling is drift.
 An app UI without persistent state is not cartography.
 A private conversation architecture must be compressed before it can be public.
10. Next Executable Milestone
Build the Custom GPT prototype first, then mirror the same behavior in an external API. The Custom GPT 
validates user experience; the API validates scalable architecture.
Generated: 2026-05-13T04:48:15.740507 UTC
