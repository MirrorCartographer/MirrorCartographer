# Prosthetic Interface and Emotional Adaptation Model

This document converts the uploaded prosthetics and amputee-emotional-needs images into a Mirror Cartographer product model.

The source material is older and should not be treated as current medical guidance. It is used here as design source material for interface logic, not as clinical authority.

## Core insight

A prosthetic is not only a replacement part.

It is an interface between:

- loss and restored function
- body and tool
- signal and movement
- identity and appearance
- independence and support
- control and maintenance
- physical adaptation and emotional adaptation

Mirror Cartographer should treat symbolic reflection the same way.

It should not merely name what is missing. It should help build a usable bridge between internal signal and external action.

## Source pattern 1: prosthetics as restored control

The uploaded prosthetics article emphasizes that prosthetics can help people regain the ability to walk, use hands, do things for themselves, restore a more normal appearance, and regain control over life.

Design translation:

Mirror Cartographer should not stop at reflection. It should help users regain control over one bounded action.

Product requirement:

Every reflection should ask:

- What function is impaired or unreachable?
- What small control pathway can be restored?
- What action would prove the user has more agency than before?

## Source pattern 2: thought-controlled prosthetics

The prosthetics source describes myoelectric control: a device detects body-generated electrical signals and translates those signals into movement.

Design translation:

Mirror Cartographer should treat body-symbol language as a signal, not as proof.

The signal pathway becomes:

body sensation -> symbolic input -> classifier -> bounded reflection -> user feedback -> correction -> action

Product requirement:

The system must show where signal becomes interpretation and where interpretation stops.

## Source pattern 3: fit matters

A prosthetic must fit the individual body. A poorly fitted prosthetic may technically exist but fail the person using it.

Design translation:

A reflection can be eloquent and still not fit.

Product requirement:

Every output needs fit-feedback:

- resonated
- partly resonated
- missed me
- overreached
- grounded me
- made me more confused

A response that does not fit should be corrected, not defended.

## Source pattern 4: maintenance matters

The prosthetics article mentions cost and maintenance. Function is not a one-time event. It requires ongoing support.

Design translation:

Mirror Cartographer cannot be a one-off beautiful answer machine.

Product requirement:

Every session should be exportable and comparable over time.

Maintenance layer:

- saved trace
- correction history
- symbol evolution
- repeated-loop detection
- review date
- deletion/export controls

## Source pattern 5: emotional needs after limb loss

The amputee emotional-needs article frames the period between 6 and 24 months after amputation as an important window for emotional problems to emerge. It also notes that emotional distress is not universal, meaning support should be targeted rather than assumed.

Design translation:

After a major change, the user may not need meaning immediately. Emotional adaptation may emerge later.

Product requirement:

Mirror Cartographer should support delayed processing:

- timestamped entries
- later review
- changes in language over time
- optional reminders to revisit unresolved loops
- no assumption that distress is universal

## Source pattern 6: upper limb, trauma, tumor, and counseling uptake

The amputee emotional-needs source suggests that emotional need may vary by site, cause, and timing of amputation. It highlights that upper-limb patients and those with trauma or tumor histories may show greater counseling need in the sample.

Design translation:

The type of loss changes the kind of adaptation needed.

Mirror Cartographer should not treat all symbolic loss the same.

Product requirement:

Classify the kind of disruption:

- function loss
- identity loss
- communication loss
- mobility loss
- trust loss
- safety loss
- body confidence loss
- role loss

Then match the reflection style to the disruption type.

## Source pattern 7: support should be offered without making distress mandatory

The amputee emotional-needs source indicates that a substantial minority may need emotional support, but not everyone experiences distress in the same way.

Design translation:

Mirror Cartographer should not dramatize every signal.

Product requirement:

Every high-intensity interpretation needs a de-escalation option:

- This may be important.
- It may also be temporary.
- It may need observation before interpretation.
- The user can choose less symbolic, more practical mode.

## Mirror Cartographer prosthetic model

Mirror Cartographer is a symbolic prosthetic only if it restores usable function.

A reflection is successful when it improves at least one of these:

- agency
- clarity
- next action
- language access
- body-signal tracking
- ability to correct the system
- ability to compare over time

A reflection fails when it only produces atmosphere.

## Product rule

Do not build a mirror that admires the wound.

Build an interface that helps the user regain a control pathway.

## Implementation targets

### 1. Disruption type classifier

Add a classifier for the kind of loss or interruption:

- control
- identity
- function
- trust
- safety
- communication
- body confidence
- action pathway

### 2. Fit-feedback weight

User feedback should not be decorative. It should alter the next reflection.

Example:

If user selects `Overreached`, next output should lower symbolic intensity and return to observation.

### 3. Delayed-review timeline

Add the ability to mark a signal for later review.

Example:

Review this in 7 days, 30 days, or after next real-world result.

### 4. Maintenance record

A session record should include:

- input
- output
- feedback
- correction
- disruption type
- action path
- review date
- what changed

### 5. Prosthetic interface test

A Mirror Cartographer output passes if the user can answer:

- What did I enter?
- What did the system infer?
- What does it not know?
- What action did it give me?
- How do I correct it?
- What would change the map next?

## Boundary

This model is not medical advice and is not about treating amputees.

It uses prosthetics as an interface analogy: signal, fit, control, maintenance, feedback, and adaptation.

Clinical, rehabilitation, disability, prosthetics, psychological, or medical claims require qualified review and current sources.