# Kannapolis Pilot 001 — Rider Transit Trip Clarity
Version: 1.0.0-draft
Status: proposed research pilot; no agency endorsement or participant recruitment has occurred.

## Why this problem
Kannapolis residents depend on Rider Transit to reach work, school, healthcare, groceries, and other essential destinations. In June 2026, Kannapolis and Concord announced an agreement preserving all routes, stops, and weekend service for FY 2026–27. Rider Transit publishes route schedules, service changes, accessibility information, fares, and a real-time tracking app. The opportunity is not to assume the transit service is failing; it is to test whether residents can reliably find and interpret the information needed to use the existing service.

## Narrow problem statement
A resident planning an essential trip may need to locate the correct route, stop, direction, time, fare, transfer rule, accessibility information, and service alert across several information surfaces. Whether this creates measurable confusion or avoidable planning errors in Kannapolis has not yet been established. The pilot first measures the baseline, then tests a plain-language, source-linked trip-planning aid.

## Intervention
Build a non-authoritative, mobile-first Rider Transit information navigator that:
- uses only current official Rider Transit and city sources;
- displays source, last-checked time, and a direct official link for each instruction;
- explains route direction, scheduled stop time, fares, transfer limitations, service alerts, and accessibility options in plain language;
- never invents real-time arrivals or guarantees a connection;
- clearly distinguishes scheduled timetable data from live vehicle tracking;
- provides a phone/print-friendly alternative;
- collects no names, precise home addresses, health information, or trip histories by default;
- directs riders to Rider Transit for service confirmation and official decisions.

The prototype must not scrape or republish restricted feeds, impersonate the agency, change official schedules, or claim agency endorsement.

## Discovery before build
1. Request a meeting with Rider Transit and the relevant city/county transit contacts.
2. Ask whether they have public rider feedback, call-center categories, complaint themes, accessibility requests, or existing rider education materials that can be shared lawfully.
3. Conduct 8–12 compensated or otherwise ethically approved listening sessions only after an appropriate partner/review pathway is established.
4. Ask participants to complete realistic synthetic trip-planning tasks using current official materials.
5. Record observed errors and friction without collecting identifiable trip histories.
6. If no measurable information-navigation problem is found, stop this pilot and publish the null result.

## Study design
- Baseline: task completion using current official Rider Transit information.
- Intervention: same class of tasks using the prototype; counterbalance task order where practical to reduce learning effects.
- Participants: target 12–20 adult volunteer riders or prospective riders, subject to partner approval and a documented consent process. This is a usability pilot, not a population-representative survey.
- Tasks: find a specified route/stop, determine direction, interpret a timetable, identify fare/pass information, find an accessibility resource, and detect a service alert.
- No eligibility, medical, legal, or financial decisions are made.

## Primary measures
1. Correct task completion rate.
2. Critical planning error rate (wrong route, direction, stop, or missed service constraint).
3. Time to correct answer.
4. Source verification rate (participant can identify the official source).
5. Confidence calibration (confidence compared with actual correctness).

## Secondary measures
- Accessibility task completion, including keyboard/screen-reader review.
- Comprehension of scheduled versus real-time information.
- Participant-reported clarity and perceived control.
- Error distribution by task, device, and prior transit familiarity, without unnecessary demographic collection.

## Predeclared success criteria
Proceed to a larger, partner-reviewed pilot only if:
- critical planning errors decrease by at least 30% relative to baseline in the tested task set;
- overall correct task completion improves by at least 20 percentage points or reaches at least 90%;
- median completion time improves by at least 20% without reducing correctness;
- no critical accessibility regression is identified;
- every instruction is traceable to a current official source;
- no material privacy, safety, or misinformation incident occurs.

These are pilot decision thresholds, not claims of statistical significance or guaranteed real-world transit outcomes. Report sample size, task-level counts, uncertainty, and all adverse/null findings.

## Stop conditions
Pause immediately if schedules are stale or contradictory, a prototype instruction could cause a rider to miss an essential service, accessibility information is misleading, the agency requests suspension, consent is inadequate, or privacy/security is compromised. Roll back to direct official links.

## Governance and authority
The pilot does not control transit operations. Rider Transit and public agencies retain authority over routes, fares, schedules, accessibility determinations, and service changes. Obtain written permission before using agency marks, nonpublic data, or presenting the tool as an official partner product.

## FREE 2.0 follow-through
Track direct impacts, downstream consequences, errors, corrections, and participant feedback. Each material issue receives an owner, severity, monitoring method, and closure evidence. Do not declare success from engagement or positive comments alone.

## Public outputs
- Baseline report and task protocol.
- Versioned prototype and source manifest.
- Privacy and accessibility statement.
- Predeclared metric report, including null/adverse results.
- Partner review and correction log.
- Decision: continue, modify, pause, reverse, or reject.

## Verified public context
- Kannapolis transportation information: https://www.kannapolisnc.gov/Community/Transportation
- June 16, 2026 route-preservation announcement: https://www.kannapolisnc.gov/news/ID/399/Kannapolis-/-Concord-Reach-Agreement-to-Maintain-Current-Rider-Transit-Routes-and-Schedules
- Rider Transit official portal: https://ckrider.com/
- Official route schedules and service resources: https://ckrider.com/maps-and-schedules/
- This context establishes the existence and importance of the service, not the prevalence of rider confusion. That is what discovery must test.
