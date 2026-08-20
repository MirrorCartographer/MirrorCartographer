# Veteran Commons

Veteran Commons is a public navigation and planning layer for Veterans, service members, military families and caregivers.

## Purpose

The system translates a person's lived post-service situation into navigable pathways across:

- VA benefits and disability
- health care and readjustment
- claims/evidence organization
- transition and separation
- VR&E and civilian employment
- education and training
- entrepreneurship
- housing and accessibility
- homelessness prevention
- family, caregivers and survivors
- military/VA records
- life insurance, pension and memorialization
- personal planning and outcome tracking

## Core model

`DESIRED LIFE → CONSTRAINTS → CAPACITY → EVIDENCE → INSTITUTIONAL PATHWAYS → ACTION → OUTCOME → FEEDBACK`

The model intentionally starts with the person's desired life rather than with a government form. The purpose is translation, not conformity.

## MC role

MC may:

- organize user-provided information;
- preserve chronology and provenance;
- distinguish fact, source, inference and hypothesis;
- identify missing information;
- map capabilities and environmental conditions;
- surface official resources;
- create checklists and preparation packets;
- compare possible pathways;
- track outcomes and user corrections;
- help the user express goals to institutions.

MC must not autonomously:

- assign disability ratings;
- determine VA eligibility or entitlement;
- decide housing eligibility;
- determine monetary worth of a Veteran;
- fabricate evidence or medical history;
- diagnose a medical condition;
- provide legal representation;
- impersonate a VA employee, clinician, attorney or accredited representative;
- make irreversible consequential decisions for the person.

## Privacy model

The first prototype is local-first. Personal planning fields are stored in browser local storage and exported only by explicit user action. A production version should add explicit consent scopes, encryption, audit logs, source provenance, deletion controls and role-based sharing.

## Public routes

- `/veterans/` — Veteran Commons
- `/games/veteran-mission/` — Veteran Mission: Rebuild the Map

## Official resource domains

Primary navigation should prefer authoritative sources, especially VA.gov, VetCenter.VA.gov, Department of Labor VETS, SBA and official state/local Veteran agencies. Program eligibility and rules must be rechecked at the point of use because they can change.

## Future modules

1. Veteran onboarding / service profile
2. Records index
3. Claim evidence graph
4. Benefits pathway graph
5. Health/readjustment resource map
6. VR&E/career pathway planner
7. Education/GI Bill planner
8. Housing-fit and accessibility map
9. Family/caregiver graph
10. Veteran-owned business pathway
11. State/local resource discovery
12. Accredited-representative routing
13. Personal MC integration
14. Consent and sharing controls
15. Outcome and longitudinal feedback engine
16. Veteran peer/community contribution network
17. Public opportunity exchange, with safeguards against exploitation

## Safety principle

Veteran Commons is a translation layer between a person and existing institutions. It is not an institution that adjudicates the person.
