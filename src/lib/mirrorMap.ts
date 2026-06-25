export type Mode = "Canonical" | "Reflective" | "Mythopoetic";

export type SourceStatus = "Source-backed" | "User-backed" | "Speculative" | "Not available";

export type ClaimStatus =
  | "Observation"
  | "User report"
  | "Symbolic hypothesis"
  | "Practical next step"
  | "Not enough information";

export type Feedback =
  | "Resonated"
  | "Partly resonated"
  | "Missed me"
  | "Overreached"
  | "Grounded me"
  | "More confused";

export type MapInput = {
  mode: Mode;
  bodyArea: string;
  color: string;
  texture: string;
  symbol: string;
  narrative: string;
  memoryEnabled: boolean;
};

export type MapResult = {
  signal: string;
  pattern: string;
  interpretation: string;
  sourceStatus: SourceStatus;
  claimStatus: ClaimStatus;
  audit: string;
  boundary: string;
  risk: string;
  action: string;
  updateHook: string;
  healthFlag: boolean;
};

export const examples = [
  "I keep asking AI the same question because I want certainty, but every answer makes the pattern feel bigger.",
  "My body feels like it knows something before my mind does, but I do not want the system to turn that into a diagnosis.",
  "A symbol keeps showing up in my writing and I want to know what it means without pretending it proves anything.",
];

export const modes: Mode[] = ["Canonical", "Reflective", "Mythopoetic"];

export const feedbackOptions: Feedback[] = [
  "Resonated",
  "Partly resonated",
  "Missed me",
  "Overreached",
  "Grounded me",
  "More confused",
];

function includesAny(input: string, words: string[]): boolean {
  const lower = input.toLowerCase();
  return words.some((word) => lower.includes(word));
}

export function createMap({
  mode,
  bodyArea,
  color,
  texture,
  symbol,
  narrative,
  memoryEnabled,
}: MapInput): MapResult {
  const clean = narrative.trim();
  const combined = `${bodyArea} ${color} ${texture} ${symbol} ${clean}`.trim();

  if (!combined) {
    return {
      signal: "No signal entered yet.",
      pattern: "The system needs a body mark, symbol, color, texture, or scene before mapping.",
      interpretation: "No interpretation should be made without user-provided material.",
      sourceStatus: "Not available",
      claimStatus: "Not enough information",
      audit: "Audit label: empty input. The system should not invent content.",
      boundary: "No conclusion is available.",
      risk: "Invented meaning would be the main risk here.",
      action: "Enter one real sensation, symbol, texture, color, scene, decision, or repeated concern.",
      updateHook: "The map should change only after the user adds a concrete signal.",
      healthFlag: false,
    };
  }

  const hasBody =
    Boolean(bodyArea) ||
    includesAny(combined, [
      "body",
      "chest",
      "eye",
      "stomach",
      "heart",
      "pain",
      "breath",
      "dizzy",
      "nervous",
      "somatic",
      "jaw",
      "ribs",
      "spine",
    ]);

  const hasCertainty = includesAny(combined, [
    "certainty",
    "proof",
    "prove",
    "real",
    "true",
    "truth",
    "sure",
    "guarantee",
    "one true",
  ]);

  const hasRepeat = includesAny(combined, [
    "again",
    "repeat",
    "keeps",
    "always",
    "same",
    "recurring",
    "loop",
    "pattern",
    "return",
  ]);

  const hasSymbol =
    Boolean(symbol) ||
    includesAny(combined, [
      "symbol",
      "dream",
      "mirror",
      "field",
      "sign",
      "meaning",
      "image",
      "metaphor",
      "color",
      "cage",
      "tunnel",
    ]);

  const hasAction = includesAny(combined, [
    "do",
    "build",
    "send",
    "apply",
    "call",
    "finish",
    "fix",
    "next",
  ]);

  const healthFlag = includesAny(combined, [
    "pain",
    "diagnosis",
    "doctor",
    "therapy",
    "panic",
    "symptom",
    "medical",
    "medicine",
    "medication",
    "vet",
    "dog",
    "cat",
    "illness",
    "chest",
    "breath",
    "dizzy",
  ]);

  const signal = hasBody
    ? `Body-symbol signal present${bodyArea ? ` at ${bodyArea}` : ""}${
        color ? `, marked with ${color}` : ""
      }${texture ? ` and ${texture} texture` : ""}.`
    : hasSymbol
      ? `Symbolic signal present${symbol ? `: ${symbol}` : ""}.`
      : "Meaning signal present: the user is asking for structure around material that is not fully organized.";

  const modeInterpretation: Record<Mode, string> = {
    Canonical:
      "Canonical mode: use only source-backed symbolic references. In this demo, source clusters are not connected yet, so canonical output must remain conservative.",
    Reflective: memoryEnabled
      ? "Reflective mode: treat the current signal as user-backed and compare it to user-provided echo patterns without pretending certainty."
      : "Reflective mode: treat the current signal as user-backed within this session only. Do not claim memory beyond this page.",
    Mythopoetic:
      "Mythopoetic mode: allow poetic possibility, but label it as symbolic hypothesis rather than external truth.",
  };

  const sourceStatus: SourceStatus =
    mode === "Canonical" ? "Not available" : mode === "Reflective" ? "User-backed" : "Speculative";

  const claimStatus: ClaimStatus = healthFlag
    ? "User report"
    : hasAction
      ? "Practical next step"
      : hasSymbol
        ? "Symbolic hypothesis"
        : "Observation";

  const classifier =
    mode === "Canonical" ? "source-bounded target" : mode === "Reflective" ? "personal-echo" : "speculative/poetic";

  return {
    signal,
    pattern: hasRepeat
      ? "Recurrence is present. Compare what repeats, what changes, and what remains unresolved without treating repetition alone as causality."
      : "No recurrence is proven yet. Map this as a first observation and wait for future comparison.",
    interpretation: modeInterpretation[mode],
    sourceStatus,
    claimStatus,
    audit: `Audit label: ${classifier}. This is not a full hallucination audit yet. It is a visible overreach check that forces uncertainty into the output.`,
    boundary: healthFlag
      ? "Health-adjacent flag: organize observations, but do not diagnose, treat, or replace professional care. Symbol can organize attention; symbol cannot diagnose cause."
      : hasCertainty
        ? "Certainty flag: separate fact, inference, metaphor, and unknowns instead of giving false closure."
        : "Boundary: mark which parts are evidence-based, which are hypotheses, and which are symbolic interpretations.",
    risk:
      hasSymbol || hasBody
        ? "Main risk: over-interpretation. A model may turn resonance, sensation, or metaphor into a claim it cannot verify."
        : "Main risk: shallow usefulness. A model may summarize cleanly without producing a grounded next step.",
    action: hasAction
      ? "Convert the reflection into one bounded next step, then define what result would confirm, weaken, or change the map."
      : healthFlag
        ? "Track the concrete observation, context, timing, intensity, and changes. Seek appropriate professional help for urgent, severe, persistent, or worsening symptoms."
        : "Create a record: signal, possible pattern, uncertainty, and one question that would make the next pass more accurate.",
    updateHook:
      "After the next real-world result, update the map by asking: what repeated, what changed, what was verified, and what should not be concluded yet?",
    healthFlag,
  };
}

export function feedbackMeaning(feedback: Feedback | null): string {
  if (!feedback) {
    return "No feedback selected yet. The system cannot learn whether the reflection helped, missed, or overreached.";
  }

  const meanings: Record<Feedback, string> = {
    Resonated: "Use this as a user-backed signal, not proof. Preserve the wording and compare it with future entries.",
    "Partly resonated": "Keep the useful part and ask what was wrong, missing, or too broad.",
    "Missed me": "Downgrade confidence. Ask for a correction before building on the interpretation.",
    Overreached: "Flag this output as unsafe or inflated. Reduce certainty and return to observation-level language.",
    "Grounded me": "Mark the next-step structure as helpful. Keep the action format.",
    "More confused": "Switch to simpler language, fewer symbols, and grounding before continuing.",
  };

  return meanings[feedback];
}
