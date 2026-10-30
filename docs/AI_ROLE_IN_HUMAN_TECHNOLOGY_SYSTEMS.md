# What AI Brings to the Table
## A capability map, not a claim that AI is magic

**Mirror Cartographer — research and architecture note**  
**Originating project:** Charity Sturgell  
**Status:** Working specification  
**Version:** 1.0 · 30 October 2026

---

## 1. Start with the distinction

AI is not electricity, a sensor, a nervous system, a robot, or a source of ground truth.

- **Electricity and physical systems** provide energy and carry signals.
- **Sensors and transducers** convert physical phenomena into measurable signals.
- **Networks and computing hardware** move and process data.
- **Algorithms** transform signals according to defined procedures.
- **AI models** learn statistical patterns and generate classifications, predictions, representations, or candidate actions.
- **People and institutions** supply goals, context, values, authority, consent, and accountability.

AI's contribution is not that it makes a device electrical or makes a body readable. Its contribution is that it can help a system interpret complexity and coordinate a response when explicit rules alone are insufficient.

## 2. Six useful capabilities

### 1. Pattern extraction
Find recurring structure in large, noisy, nonlinear, or high-dimensional data. Example: identify a candidate muscle-activation pattern in EMG data.

### 2. Translation
Convert information between forms: speech and text, language and structured records, selected biosignal patterns and assistive commands, or technical evidence and accessible explanations.

### 3. Multimodal integration
Combine information from several sources while tracking what each source contributes. A model should not silently treat missing data as normal data or confuse correlated signals with independent confirmation.

### 4. Personal adaptation
Model an individual's baseline and changing context rather than impose a single population average. Adaptation requires safeguards against drift, overfitting, and learning a harmful pattern.

### 5. Prediction and planning
Estimate likely outcomes or generate candidate next steps. Prediction is not causation; a forecast is not a decision; a generated plan is not proof that the plan is safe or appropriate.

### 6. Feedback coordination
Help manage a loop in which a system senses, interprets, proposes or performs an action, then checks the result. High-consequence actions require constrained authority, monitoring, and human override.

## 3. What AI cannot legitimately claim

- It does not directly know what a person feels or intends from a sensor stream.
- It does not turn correlation into causation.
- It does not make poor sensors reliable by being more sophisticated.
- It does not eliminate the need for domain expertise, consent, validation, or accountability.
- It does not make a medical, legal, or public-service decision legitimate merely because it is consistent.
- It does not guarantee fairness, explainability, privacy, or safety.
- It should not silently convert uncertain interpretation into action.

## 4. A layered architecture

| Layer | Function | Example | Required control |
|---|---|---|---|
| Physical | Energy, tissue, environment, machinery | Electrical stimulation, movement, temperature | Engineering and safety limits |
| Sensing | Capture measurable signals | EEG, EMG, microphone, camera, pressure sensor | Consent, calibration, signal-quality checks |
| Data | Store, synchronize, transmit | Time series, event records, metadata | Minimization, access, retention, security |
| Signal processing | Filter and extract features | Artifact removal, spectral features | Reproducible methods and quality metrics |
| AI interpretation | Classify, predict, translate, generate candidates | Intent estimate, anomaly candidate | Validation, uncertainty, abstention |
| Decision | Decide whether and how to act | User confirmation, policy gate | Authority, reversibility, appeal |
| Action | Produce an output or intervention | Audio cue, cursor, robot, service referral | Safety, monitoring, stop mechanism |
| Feedback | Compare expected and actual result | User correction, task outcome | Learning without coercive surveillance |
| Governance | Define rights and responsibility | Consent, audit, redress | Independent accountability |

## 5. The MC principle: AI should increase legibility and agency

For every AI-enabled feature, ask:

1. What is the actual input?
2. What is directly measured, and what is inferred?
3. What does the model add over a simpler baseline?
4. How does it handle missing, noisy, or contradictory data?
5. Can the person inspect and correct the result?
6. What happens when the model is uncertain?
7. Who authorizes the action?
8. How can the person stop, appeal, or reverse it?
9. Who benefits and who bears the risk?
10. What evidence would show that the AI layer is unnecessary?

If a simpler rule-based system performs as well with lower cost and risk, use the simpler system.

## 6. Research propositions

- **P1:** AI may improve interpretation of multimodal signals when the task is well-defined and the data are sufficiently representative.
- **P2:** Personal calibration may improve performance for some tasks but can increase burden and privacy risk.
- **P3:** Closed-loop systems may provide more useful interaction than one-way sensing when feedback is meaningful, timely, and safe.
- **P4:** Explanations, uncertainty display, and user correction may improve trust calibration and error recovery.
- **P5:** The public value of AI depends on distribution of capability, not only benchmark performance.

Each proposition requires a task-specific comparison and should be allowed to fail.

## 7. Evaluation framework

Compare AI-assisted systems against a transparent baseline and, where appropriate, the current human workflow.

Measure:
- task completion and quality;
- false positives and false negatives;
- latency and reliability;
- calibration time and frequency;
- performance across users and contexts;
- robustness to noise and missing signals;
- user comprehension and correction;
- privacy and data exposure;
- cost, maintenance, and accessibility;
- distribution of benefit and harm.

Report subgroup performance only when the data and sample sizes support it. Do not infer demographic causes from unexplained differences.

## 8. Research references

- Eldawlatly (2024), “On the role of generative artificial intelligence in the development of brain-computer interfaces,” *BMC Biomedical Engineering*. https://doi.org/10.1186/s42490-024-00080-2
- Lee et al. (2025), “A review of hybrid EEG-based multimodal human-computer interfaces using deep learning,” *Biomedical Engineering Letters*. https://doi.org/10.1007/s13534-025-00469-5
- Wan et al. (2025), “AI-Enhanced Wearable Technology for Human Physiological Signal Detection: Challenges and Future Directions,” *Small*. https://doi.org/10.1002/smll.202504078
- Edelman et al. (2025), “Non-Invasive Brain-Computer Interfaces: State of the Art and Trends,” *IEEE Reviews in Biomedical Engineering*. https://doi.org/10.1109/RBME.2024.3449790

## 9. The central question

AI's most important contribution may not be a more convincing answer on a screen. It may be the ability to help systems coordinate across signals, people, environments, and institutions—while keeping uncertainty visible and authority accountable.

**AI should make more forms of human capability possible, not make human beings more dependent on AI.**
