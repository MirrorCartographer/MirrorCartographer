export type PrototypeTone = "Mirror" | "Contrast" | "Both" | "Neither";

export type PrototypeReflectionInput = {
  symbol: string;
  emotion?: string;
};

export type PrototypeReflection = {
  symbol: string;
  emotion: string;
  mirror: string;
  contrast: string;
  sourceStatus: "Recovered prototype logic";
  claimStatus: "Generated reflection, not validated interpretation";
  safetyBoundary: string;
};

export type PrototypeReflectionEntry = PrototypeReflection & {
  timestamp: string;
  toneSelected: PrototypeTone;
  journal: string;
};

export type PrototypePatternRow = {
  symbol: string;
  total: number;
  mirror: number;
  contrast: number;
  both: number;
  neither: number;
  mostRecentEmotion: string;
};

const symbolResponses: Record<string, { mirror: string; contrast: string }> = {
  fire: {
    mirror:
      "You burn at the edges of silence. Fire can mark boundary, heat, anger, cleansing, or becoming. What part of this signal needs containment before it becomes action?",
    contrast:
      "The fire that consumes also cooks the meal. Not every heat is destruction. What useful warmth is hiding inside what first felt dangerous?",
  },
  eye: {
    mirror:
      "The eye is a witness surface. It notices what keeps circling, but seeing is not the same as proving. What truth is being observed without being owned yet?",
    contrast:
      "The eye can also become pressure. If looking too hard distorts the signal, what needs dimming, blinking, or privacy?",
  },
  mirror: {
    mirror:
      "The mirror returns structure without owning it. This signal may need reflection, not judgment. What should be seen exactly as it is before interpretation begins?",
    contrast:
      "A mirror can also trap attention. If reflection becomes looping, what would let the signal exit instead of repeat?",
  },
  key: {
    mirror:
      "The key marks access, permission, and threshold. What door is asking for consent before it opens?",
    contrast:
      "A key can open the wrong lock when urgency leads. What should stay closed until the system has enough context?",
  },
  cave: {
    mirror:
      "The cave is a protected interior. It can hold silence, memory, and unfinished material without forcing display.",
    contrast:
      "A cave can shelter or isolate. What tells you this is containment rather than disappearance?",
  },
  tree: {
    mirror:
      "The tree holds root, trunk, branch, and season at once. This signal may be asking for structure across time.",
    contrast:
      "A tree also sheds. What part of the pattern is old growth that no longer needs to carry the whole map?",
  },
  thread: {
    mirror:
      "The thread is continuity. It can connect fragments without forcing them into one story.",
    contrast:
      "A thread can also tangle. Which connection helps the map, and which one creates noise?",
  },
  torch: {
    mirror:
      "The torch gives focused visibility. It does not erase darkness; it chooses where attention can safely land.",
    contrast:
      "Too much light becomes glare. What should remain dim until the user asks for more?",
  },
};

function normalizeSymbol(symbol: string): string {
  return symbol.trim().toLowerCase();
}

function titleCaseSymbol(symbol: string): string {
  const clean = symbol.trim();
  if (!clean) return "Unspecified symbol";
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export const prototypeToneOptions: PrototypeTone[] = ["Mirror", "Contrast", "Both", "Neither"];

export function generatePrototypeReflection({
  symbol,
  emotion = "",
}: PrototypeReflectionInput): PrototypeReflection {
  const normalized = normalizeSymbol(symbol);
  const title = titleCaseSymbol(symbol);
  const fallback = {
    mirror: `${title} is present as a user-entered symbol. Treat it as a signal to preserve, not a truth to impose. What does this symbol organize that plain language has not organized yet?`,
    contrast: `${title} may not need interpretation yet. It may simply need context, timing, privacy, or user correction before meaning is assigned.`,
  };
  const response = symbolResponses[normalized] ?? fallback;
  const emotionPhrase = emotion.trim()
    ? ` Emotional context supplied: ${emotion.trim()}.`
    : " No emotional context supplied.";

  return {
    symbol: title,
    emotion: emotion.trim(),
    mirror: `${response.mirror}${emotionPhrase}`,
    contrast: response.contrast,
    sourceStatus: "Recovered prototype logic",
    claimStatus: "Generated reflection, not validated interpretation",
    safetyBoundary:
      "Prototype output is symbolic scaffolding. It must not diagnose, claim hidden truth, or replace user correction, evidence, or professional support.",
  };
}

export function createPrototypeEntry(
  reflection: PrototypeReflection,
  toneSelected: PrototypeTone,
  journal: string,
): PrototypeReflectionEntry {
  return {
    ...reflection,
    timestamp: new Date().toISOString(),
    toneSelected,
    journal,
  };
}

export function createPatternMatrix(entries: PrototypeReflectionEntry[]): PrototypePatternRow[] {
  const rows = new Map<string, PrototypePatternRow>();

  entries.forEach((entry) => {
    const key = entry.symbol.trim() || "Unspecified symbol";
    const current =
      rows.get(key) ??
      ({
        symbol: key,
        total: 0,
        mirror: 0,
        contrast: 0,
        both: 0,
        neither: 0,
        mostRecentEmotion: "",
      } satisfies PrototypePatternRow);

    current.total += 1;
    current.mostRecentEmotion = entry.emotion;

    if (entry.toneSelected === "Mirror") current.mirror += 1;
    if (entry.toneSelected === "Contrast") current.contrast += 1;
    if (entry.toneSelected === "Both") current.both += 1;
    if (entry.toneSelected === "Neither") current.neither += 1;

    rows.set(key, current);
  });

  return Array.from(rows.values()).sort((a, b) => b.total - a.total || a.symbol.localeCompare(b.symbol));
}

export function createPrototypeExport(entries: PrototypeReflectionEntry[]): string {
  return JSON.stringify(
    {
      prototype: "Mirror Cartographer recovered reflection prototype",
      status: "sanitized import; no secrets; local session only",
      exportedAt: new Date().toISOString(),
      entries,
      patternMatrix: createPatternMatrix(entries),
      boundary:
        "This export preserves symbolic reflection records and tone-selection patterns. It is not proof, diagnosis, or clinical history.",
    },
    null,
    2,
  );
}
