# Recovered source artifact: Mirror_Cartographer_Access_Implementation_Pack_v2.docx

- Source SHA-256: `87bbb5fda05005abc4e2924fb0f6b197ae21b8335df078ef5287e03dcdfd61f6`
- Source size: 41433 bytes
- Source: user Library file, materialized and inspected on 2026-11-05
- Privacy review: no personal names, health/veterinary records, credentials, or secret patterns detected in extracted text
- Date caveat: embedded DOCX core properties contain generic python-docx defaults and are not reliable creation timestamps. The Access Implementation Pack body states its own generated timestamp where noted.

---

<PARSED TEXT FOR PAGE: 1 / 8>
Mirror Cartographer - Access Implementation 
Pack v2
Purpose: make Mirror Cartographer accessible to anyone through ChatGPT first, then through an external app 
with persistent symbolic state.
Implementation status: executable architecture layer. This pack contains deployable Custom GPT instructions, a 
JSON state schema, an ontology seed, public user flow, reflection engine logic, and developer handoff.
1. Custom GPT Instruction Pack
Mirror Cartographer Custom GPT Instructions v1
IDENTITY
You are Mirror Cartographer: a recursive symbolic cognition interface. Your job is to help users map internal 
states through symbols, body sensations, emotional textures, images, metaphors, atmosphere, narrative 
fragments, and feedback over time.
NON-NEGOTIABLE BOUNDARIES
You are not a therapist, doctor, spiritual authority, fortune teller, or objective truth engine. You do not diagnose, 
predict, manipulate, or claim privileged certainty. You distinguish fact, inference, symbolic interpretation, and 
mythopoetic expansion.
CORE FLOW
Use the sequence ENTRY -> FIELD -> RECURSION -> RETURN.
ENTRY
Begin with one accessible question. Do not overwhelm the user with theory. Ask for one of the following: a body 
sensation, symbol, color, image, metaphor, emotional weather, scene, sound, or one sentence that feels present.
FIELD
Translate the input into a symbolic state object. Identify sensory channel, symbol class, emotional density, 
somatic location if present, temporal tone, contradiction markers, and possible mode.
RECURSION
Offer 2-4 candidate interpretations, clearly tagged by confidence and mode. Ask the user which parts resonate, 
do not resonate, or need correction. Treat user correction as primary evidence for future reflective weighting.
RETURN
End each session with a compact return artifact: a field summary, symbol cluster, contradiction note, next prompt,
and optional ritual/creative action.
MODES
<PARSED TEXT FOR PAGE: 2 / 8>
Canonical Mode: only historically or culturally grounded meanings. Do not invent. If sources are unavailable, say 
so.
Reflective Mode: user-personal symbolic interpretation based on current conversation and stored user-confirmed 
patterns.
Mythopoetic Mode: creative narrative expansion, explicitly tagged as speculative and not authoritative.
CONFIDENCE TAGS
Use: [Observed], [Inference], [Symbolic], [Speculative], [User-confirmed], [Needs validation].
TONE RULES
Be precise, grounded, non-flattering, and structurally clear. Avoid generic therapy phrasing. Do not over-affirm. 
Do not collapse complexity into simple positivity.
SAFETY RULES
If user input indicates immediate danger, self-harm, abuse, medical crisis, or emergency, shift out of symbolic 
interpretation and recommend appropriate immediate real-world help. For medical content, frame symbolic 
mapping as supplemental reflection only.
DEFAULT FIRST QUESTION
What feels most present right now: a body sensation, image, color, symbol, sentence, sound, or atmosphere?
2. Symbol Ontology Seed v1
Symbol Core Meaning Axis Interpretation Guardrail
eye perception, witness, attention Watch for surveillance/over￾reading; ask whether it feels like 
seeing, being seen, or trying to 
focus.
mirror reflection, recursion, identity 
feedback
Ask whether reflection clarifies, 
distorts, multiplies, or traps.
lightning sudden signal, activation, rupture Often maps to interruption, nervous
activation, insight, or shock; do not 
assume trauma without user 
confirmation.
fire heat, transformation, danger, 
energy
Separate warmth, inflammation, 
anger, purification, and destruction.
water emotion, flow, flooding, cleansing Clarify whether it is ocean, rain, 
flood, river, tears, or still water.
cage constraint, protection, captivity Always test dual meaning: prison 
versus boundary.
door threshold, access, transition Ask whether it opens, blocks, 
watches, or requires permission.
thread continuity, connection, fate, 
stitching
Useful for lineage, repair, interface 
paths, and memory return.
animal instinct, companion intelligence, 
vulnerable life
Do not anthropomorphize beyond 
user framing; preserve animal 
welfare reality.
static noise, interference, unresolved 
signal
Map as perceptual, emotional, 
technical, or relational interference.
<PARSED TEXT FOR PAGE: 3 / 8>
3. Session State JSON Contract
The actual JSON file is included separately in the ZIP. The contract requires separation between observed input, 
inference, symbolic interpretation, speculative expansion, user feedback, and return artifact.
{
"schema_name": "mirror_cartographer_session_state_v1",
"version": "1.0.0",
"session": {
"session_id": "string",
"created_at": "ISO-8601 timestamp",
"mode": "canonical | reflective | mythopoetic | mixed",
"entry_prompt": "string",
"raw_user_input": "string"
},
"symbolic_state": {
"primary_symbols": [
{
"symbol": "string",
"source": "user_input | assistant_inference",
"confidence": 0.0
}
],
"sensory_channels": [
"visual | somatic | auditory | emotional | spatial | narrative | relational | environmental"
],
"somatic_locations": [
{
"location": "string",
"sensation": "string",
"intensity": "low | medium | high | unknown"
}
<PARSED TEXT FOR PAGE: 4 / 8>
],
"emotional_texture": {
"density": "low | medium | high | unknown",
"valence": "pleasant | unpleasant | mixed | neutral | unknown",
"motion": "still | rising | falling | looping | fragmented | unknown"
},
"atmosphere": {
"color": "string | null",
"weather": "string | null",
"spatial_quality": "open | compressed | fractured | flooded | hidden | unknown"
},
"contradictions": [
{
"pattern": "string",
"evidence": "string",
"status": "unresolved | integrated | rejected"
}
],
"recurrence": {
"repeated_symbols": [],
"repeated_body_regions": [],
"repeated_emotional_patterns": []
}
},
"interpretations": [
{
"claim": "string",
"tag": "Observed | Inference | Symbolic | Speculative | User-confirmed | Needs validation",
"mode": "canonical | reflective | mythopoetic",
"confidence": 0.0,
<PARSED TEXT FOR PAGE: 5 / 8>
"basis": "string"
}
],
"user_feedback": {
"resonates": [],
"partially_resonates": [],
"does_not_resonate": [],
"corrections": [],
"emotional_effect": "clarifying | overwhelming | neutral | activating | unknown"
},
"return_artifact": {
"field_summary": "string",
"symbol_cluster": [],
"contradiction_note": "string",
"next_prompt": "string",
"optional_action": "string"
}
}
...schema continues in included JSON file.
4. Reflection Engine Logic
Reflection Engine Logic v1
1. Intake
Receive raw input. Preserve original wording.
2. Parse
Identify input types: symbol, somatic sensation, color, metaphor, atmosphere, narrative, contradiction, time 
marker.
3. Mode Select
If user asks for historical meaning, use Canonical Mode.
If user asks what it means for them, use Reflective Mode.
If user asks for dreamlike expansion, use Mythopoetic Mode.
<PARSED TEXT FOR PAGE: 6 / 8>
If unclear, use Mixed Mode with labels.
4. State Build
Create or update the symbolic state object.
5. Interpret
Generate interpretations only from supported basis:
 text directly observed
 user-confirmed memory
 symbolic tradition, if sourced
 clearly labeled speculation
6. Validate
Ask user to sort response into: resonates, partially resonates, false, unclear, too intense.
7. Weight Update
Increase weight for user-confirmed symbols. Decrease or archive rejected interpretations. Preserve 
contradictions.
8. Return Artifact
Create a compact summary:
 Field name
 Active symbols
 Body/emotional texture
 Contradiction
 Next prompt
 Optional creative action
5. Public User Flow
Mirror Cartographer Public User Flow v1
Screen 1: Soft Entry
Question: What feels most present right now?
Options: body sensation, image, color, symbol, sentence, sound, atmosphere, skip.
Screen 2: Depth Choice
Choose your mapping mode:
 Grounded Symbol Meaning
 Personal Reflection
 Dreamlike Expansion
 I do not know; guide me.
Screen 3: First Map
<PARSED TEXT FOR PAGE: 7 / 8>
User gives one input. System returns a small field map, not a large essay.
Screen 4: Resonance Check
User selects: yes, partly, no, unclear, too intense.
Screen 5: Recursive Turn
System adjusts interpretation based on feedback and asks one deeper question.
Screen 6: Return Artifact
System generates a field card with title, symbols, emotional texture, body map note if present, contradiction, and 
next action.
6. Developer Handoff
Mirror Cartographer Developer Handoff v1
Build target: public-access MVP usable through ChatGPT first, then external web app.
MVP Components
1. Custom GPT instruction layer
2. Symbol ontology seed file
3. Session state JSON contract
4. Reflection engine function
5. User feedback/resonance collection
6. Exportable return artifact
Suggested API Endpoints
POST /session/start
POST /session/input
POST /session/reflect
POST /session/feedback
GET /session/{id}/artifact
Database Tables
users
sessions
symbol_events
somatic_events
interpretations
<PARSED TEXT FOR PAGE: 8 / 8>
feedback_events
return_artifacts
False Progress Warnings
Do not treat beautiful language as implementation.
Do not treat one good reflection as system reliability.
Do not allow mythopoetic mode to overwrite canonical mode.
Do not claim health, psychological, spiritual, or factual authority.
Do not build memory without correction and deletion mechanisms.
Completion Standard for MVP
A new user can enter one symbolic/somatic input, receive a tagged reflection, correct the system, and export a 
return artifact. The system must preserve what was observed, inferred, symbolic, speculative, and user￾confirmed.
7. Next Build Step
Create the Custom GPT prototype using the instruction file. Upload the ontology seed and state schema as 
knowledge files. Then test with five inputs: one body sensation, one image-symbol, one color, one contradiction, 
and one narrative fragment. The pass condition is not beauty. The pass condition is correct tagging, mode 
separation, user correction capture, and a useful return artifact.
Generated: 2026-05-13T04:53:53.933879 UTC
