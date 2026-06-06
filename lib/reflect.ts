import symbolTable from "../data/symbol_table_minimal_connected.json";

type Mode = "canonical" | "reflective" | "mythopoetic";

type ReflectInput = {
  text?: string;
  mode?: Mode;
  accessibility_mode?: "voice_safe" | "visual_dense";
  consent?: {
    symbolic_interpretation?: boolean;
    save_session?: boolean;
  };
};

type SymbolRecord = {
  id: string;
  label: string;
  canonical_meanings: string[];
  source_notes: string[];
  somatic_correlations: string[];
  mc_phases: string[];
  boundary: string;
};

function normalize(value: unknown): string {
  return String(value ?? "").toLowerCase();
}

function findSymbol(text: string): SymbolRecord | null {
  const clean = normalize(text);
  return (symbolTable as SymbolRecord[]).find((entry) => clean.includes(entry.id)) ?? null;
}

function findSomaticLocation(text: string): string | null {
  const clean = normalize(text);
  const locations = ["chest", "ribs", "throat", "stomach", "belly", "head", "eyes", "spine", "hands", "feet"];
  return locations.find((location) => clean.includes(location)) ?? null;
}

export function reflect(input: ReflectInput) {
  const text = input.text ?? "";
  const mode = input.mode ?? "reflective";
  const accessibilityMode = input.accessibility_mode ?? "voice_safe";
  const matchedSymbol = findSymbol(text);
  const somaticLocation = findSomaticLocation(text);

  if (!input.consent?.symbolic_interpretation) {
    return {
      ok: false,
      error: "Consent required for symbolic interpretation."
    };
  }

  if (!matchedSymbol) {
    return {
      ok: true,
      spoken_summary: "I do not have that symbol in the starter table yet, so I will not invent a meaning.",
      structured_reflection: "This input can be logged, but Canonical meaning requires a known symbol-table entry. Add the symbol to the table before treating it as interpreted.",
      tags: [],
      continuation_prompt: "What symbol, color, or body location feels most central here?",
      proof_log: {
        source: "user_input",
        mode,
        accessibility_mode: accessibilityMode,
        matched_symbol: null,
        somatic_location: somaticLocation,
        uncertainty: "high",
        timestamp: new Date().toISOString()
      }
    };
  }

  const bodyPhrase = somaticLocation ? ` in the ${somaticLocation}` : "";

  const canonical = `${matchedSymbol.label}${bodyPhrase} is matched in the starter symbol table. Canonical meanings include ${matchedSymbol.canonical_meanings.join(", ")}. This is symbolic context, not diagnosis or certainty.`;
  const reflective = `Your phrase points to ${matchedSymbol.label.toLowerCase()}${bodyPhrase}: a signal of intensity, pressure, transformation, or contained force. The useful question is not "what does this absolutely mean," but "what is this asking to be noticed or held?"`;
  const mythopoetic = `A small ${matchedSymbol.label.toLowerCase()} appears${bodyPhrase}, not as proof, but as a signal in the room. It may be warmth, warning, fuel, or a doorway. This is a poetic reflection, not a factual claim.`;

  const structured_reflection =
    mode === "canonical" ? canonical :
    mode === "mythopoetic" ? mythopoetic :
    reflective;

  return {
    ok: true,
    spoken_summary: `I found ${matchedSymbol.label} in the starter table. I can reflect on it symbolically, not as certainty or diagnosis.`,
    structured_reflection,
    tags: [matchedSymbol.id, ...(somaticLocation ? [somaticLocation] : []), mode],
    archetype_candidate: matchedSymbol.mc_phases[matchedSymbol.mc_phases.length - 1],
    continuation_prompt: "What part of this feels accurate, inaccurate, or unfinished?",
    proof_log: {
      source: "user_input",
      mode,
      accessibility_mode: accessibilityMode,
      matched_symbol: matchedSymbol.id,
      somatic_location: somaticLocation,
      uncertainty: mode === "canonical" ? "medium" : "high",
      timestamp: new Date().toISOString()
    }
  };
}
