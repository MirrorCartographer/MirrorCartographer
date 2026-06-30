# Weather: Claim Portability and Runtime Reuse Risk

## Status
Weather artifact. Public-safe.

## Attractor
Discovery.

## Weather summary
Current AI governance work is converging on a repeated risk: claims, outputs, summaries, and tool-mediated decisions are no longer staying inside the context where they were created.

Agentic systems plan, call tools, maintain state, and coordinate across services. Healthcare agents may move information across clinical documentation, early-warning monitoring, administrative workflows, and vendor systems. Social-care transcription and summarization tools show how an AI-generated record can become harmful when inaccurate content travels into official care documentation.

The weather pattern is therefore **portable claim risk**: AI-assisted claims become dangerous when their source, uncertainty, authority, privacy status, and action boundary fail to travel with them.

## Source signals

### Agentic AI runtime governance
Christopher Koch's 2026 runtime guardrails paper distinguishes governance objectives, technical controls, runtime guardrails, and assurance evidence. The key relevance for MC is that governance must be translated into enforceable control placement, not left as a general policy statement.

### Trace-based agentic assurance
Paduraru, Bouruc, and Stefanescu's 2026 trace-based assurance framework instruments agent executions as Message-Action Traces with step and trace contracts. It highlights failures such as propagation of unsupported claims, role drift, external side effects, and attacks through untrusted context.

### Healthcare agent lifecycle management
Prakash, Lind, and Sisodia's 2026 healthcare lifecycle blueprint identifies agent sprawl, unclear accountability, permissions that persist beyond the original use case, PHI-bounded context and memory, runtime policy enforcement, kill-switch triggers, credential revocation, and audit logging.

### Medical AI ethics
Bisson and colleagues' 2026 medical AI ethics paper proposes explicit human override conditions, auditable ethical reasoning, patient preference profiles, oversight tools, benchmarking repositories, and regulatory sandboxes.

### Social-care documentation risk
The Guardian's 2026 reporting on Ada Lovelace Institute research describes harmful transcription and summarization errors entering official care records, including hallucinated or nonsensical content. The central MC relevance is that a flawed AI summary becomes more harmful when it becomes portable documentation.

### Audit accountability
The Financial Times reported in 2026 that the UK Financial Reporting Council warned auditors they remain accountable for AI-assisted work and cannot deflect blame onto AI systems.

## Implication for GitHub Mind
The existing GitHub Mind already has Context Lease, Handoff Integrity, Sequence Risk Ledger, Trace Sufficiency, and Exit Authority. The missing weather response is a reusable test for whether a claim may move from one context to another.

## Labels

- Source: Current public reporting and 2026 research on runtime guardrails, trace assurance, healthcare agent lifecycle management, medical AI ethics, social-care documentation errors, and audit accountability.
- Claim: The dominant weather pattern is portable claim risk across contexts.
- Privacy: Public-safe. No private user details included.
- Missingness: This scan is not exhaustive and should be revised as stronger regulatory or clinical guidance appears.
- Revision: Initial weather note.
- Confidence: Medium-high.
- Evidence maturity: Multi-source public synthesis.
- Action authority: Observation and repository orientation only.
