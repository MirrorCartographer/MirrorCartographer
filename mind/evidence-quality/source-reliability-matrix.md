# Source Reliability Matrix

Purpose: give humans and agents a shared way to compare information sources without pretending any source class is automatically true or false.

## Core principle

A source should be judged by its role in the claim.

A Wikipedia page can be good for orientation and locating references. It should not usually be the final evidence for a medical, legal, AI-safety, hiring, or technical claim.

A peer-reviewed paper can be strong evidence for a narrow empirical claim but weak evidence for a broad product claim if the context does not match.

A standard such as NIST or ISO can be strong evidence for governance requirements but not direct evidence that MC works.

## Source classes

| Class | Examples | Good for | Weak for | Default use |
|---|---|---|---|---|
| Systematic review / meta-analysis | Cochrane, Campbell, peer-reviewed meta-analysis | Synthesized empirical evidence | Fast-moving technical claims if outdated | Strong evidence if current and relevant |
| Consensus standard / governance framework | NIST, ISO, W3C, OECD, WHO | Process, governance, risk, interoperability, accessibility | Product efficacy or MC-specific outcomes | Strong design/governance source |
| Peer-reviewed primary research | Journal articles, conference papers | Mechanism, measured effect, empirical support | Broad generalization beyond study context | Strong if direct and replicated |
| Government data / official statistics | BLS, CDC, FDA, Census, O*NET | Official factual baselines | Interpretation beyond scope | Strong factual baseline |
| Professional guidance | APA, AMA, veterinary boards, SIOP | Practice norms and role boundaries | Proving MC implementation works | Moderate-to-strong boundary source |
| Academic center report | University labs, institutes | Expert synthesis | Direct validation | Moderate source |
| Technical docs | OpenAI docs, Google docs, GitHub docs | Platform behavior and implementation details | General truth, safety, or outcome claims | Strong for that platform only |
| Company white paper / blog | Vendor reports, product blogs | Product claims, implementation clues | Independent validation | Use with conflict/interest flag |
| News | Reuters, AP, major outlets | Current events, public signals | Deep technical/clinical proof | Useful signal, usually not final proof |
| Wikipedia | Wikipedia | Orientation, terminology, source discovery | Primary evidence | Navigation source only by default |
| Personal blog / social media | Individual posts | First-person reports, weak signals, edge cases | Generalizable evidence | Low-confidence signal unless directly relevant |

## Required metadata for every source

- Source title
- Source URL or citation
- Source class
- Author / institution
- Publication date
- Access date
- Claim supported
- Directness: direct / partial / indirect / background / contradicts / not relevant
- Independence: independent / derivative / unknown
- Freshness: current / aging / stale / unknown
- Conflict-of-interest risk: low / medium / high / unknown
- Use role: navigation / context / mechanism / direct support / contradiction / validation

## Agent instruction

When an agent adds a source, it must not only cite it. It must classify how the source functions in the claim.

Preferred wording:

“This source directly supports the governance requirement but does not validate MC’s implementation.”

Avoid:

“This source proves MC works.”

## Human instruction

When reviewing a claim, ask:

- Is this source actually saying the thing the claim says?
- Is this source being used inside its proper scope?
- Is the source current enough?
- Is the source independent or just repeating another source?
- What source would be stronger?
