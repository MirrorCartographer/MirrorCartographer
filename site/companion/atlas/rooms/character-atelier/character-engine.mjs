/**
 * Public-safe derivative of the canonical private Character Engine source.
 * Authorship: Charity Alessandra Sturgell.
 * Mirror Cartographer character customization and opt-in evolution.
 *
 * Character appearance is an expressive artifact, not a psychological profile.
 * Suggestions never mutate a character; the user must explicitly accept them.
 */
export const CHARACTER_PALETTES = Object.freeze({
  ember: Object.freeze(["#38232b", "#c66b4e", "#e9c28e"]),
  tide: Object.freeze(["#142f3a", "#4e8790", "#c4d8cf"]),
  glass: Object.freeze(["#252638", "#8c91a8", "#e4d9c6"]),
  moss: Object.freeze(["#26352b", "#71836a", "#d6c49c"]),
  dusk: Object.freeze(["#30243d", "#8a6d91", "#d8b9a7"])
});

const MOTIFS = Object.freeze({
  ember: "spark",
  tide: "current",
  glass: "prism",
  moss: "frond",
  dusk: "orbit"
});

const isRecord = value => value !== null && typeof value === "object" && !Array.isArray(value);
const clean = (value, max = 80) => typeof value === "string" ? value.trim().slice(0, max) : "";

function paletteFor(seedSymbol) {
  const value = clean(seedSymbol, 120).toLocaleLowerCase();
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Object.keys(CHARACTER_PALETTES)[(hash >>> 0) % Object.keys(CHARACTER_PALETTES).length];
}

function validateProfile(profile) {
  if (!isRecord(profile) || profile.schema !== "mc-character" || profile.version !== 1) {
    throw new TypeError("Expected a version 1 Mirror Cartographer character.");
  }
}

export function createCharacter({ id, name, seedSymbol, palette = null } = {}) {
  const characterId = clean(id, 120);
  const characterName = clean(name, 80);
  const symbol = clean(seedSymbol, 120);
  if (!characterId || !characterName || !symbol) {
    throw new TypeError("id, name, and a user-selected seedSymbol are required.");
  }
  const selectedPalette = Object.hasOwn(CHARACTER_PALETTES, palette) ? palette : paletteFor(symbol);
  return {
    schema: "mc-character",
    version: 1,
    id: characterId,
    name: characterName,
    seedSymbol: symbol,
    appearance: {
      palette: selectedPalette,
      colors: [...CHARACTER_PALETTES[selectedPalette]],
      motif: MOTIFS[selectedPalette],
      texture: "soft-grain"
    },
    traits: [],
    collectedSymbols: [symbol],
    revision: 1,
    evolution: [],
    controls: {
      userOwnsAllAppearanceChoices: true,
      suggestionsEnabled: true,
      autoApplySuggestions: false
    },
    boundary: "An expressive character design. It is not a diagnosis, personality test, emotional measurement, or identity claim."
  };
}

export function customizeCharacter(profile, changes = {}) {
  validateProfile(profile);
  if (!isRecord(changes)) throw new TypeError("changes must be an object.");
  const next = structuredClone(profile);
  if (typeof changes.name === "string" && changes.name.trim()) next.name = clean(changes.name, 80);
  if (typeof changes.palette === "string" && Object.hasOwn(CHARACTER_PALETTES, changes.palette)) {
    next.appearance.palette = changes.palette;
    next.appearance.colors = [...CHARACTER_PALETTES[changes.palette]];
    next.appearance.motif = MOTIFS[changes.palette];
  }
  if (typeof changes.motif === "string" && changes.motif.trim()) next.appearance.motif = clean(changes.motif, 80);
  if (typeof changes.texture === "string" && changes.texture.trim()) next.appearance.texture = clean(changes.texture, 80);
  if (Array.isArray(changes.traits)) {
    next.traits = [...new Set(changes.traits.map(item => clean(item, 80)).filter(Boolean))].slice(0, 24);
  }
  if (typeof changes.suggestionsEnabled === "boolean") next.controls.suggestionsEnabled = changes.suggestionsEnabled;
  next.revision += 1;
  return next;
}

/**
 * Suggest a visual evolution from a saved, user-selected artifact.
 * No profile mutation occurs until acceptCharacterEvolution is called.
 */
export function proposeCharacterEvolution(profile, artifact = {}) {
  validateProfile(profile);
  if (!profile.controls.suggestionsEnabled) return null;
  if (!isRecord(artifact)) throw new TypeError("artifact must be an object.");
  const symbol = clean(artifact.symbol, 120);
  if (!symbol) return null;
  const sourceRef = clean(artifact.sourceRef, 500) || null;
  const palette = paletteFor(symbol);
  return Object.freeze({
    schema: "mc-character-suggestion",
    version: 1,
    basedOn: sourceRef,
    symbol,
    suggestion: {
      palette,
      colors: [...CHARACTER_PALETTES[palette]],
      motif: MOTIFS[palette],
      trait: clean(artifact.userChosenTrait, 80) || null
    },
    requiresExplicitAcceptance: true,
    mutatesProfile: false,
    boundary: "A creative suggestion derived from a user-selected symbol, not an inference about the user."
  });
}

export function acceptCharacterEvolution(profile, suggestion, { acceptedAt = new Date().toISOString() } = {}) {
  validateProfile(profile);
  if (!isRecord(suggestion) || suggestion.schema !== "mc-character-suggestion" ||
      suggestion.version !== 1 || suggestion.requiresExplicitAcceptance !== true) {
    throw new TypeError("A valid, explicitly accepted character suggestion is required.");
  }
  const timestamp = new Date(acceptedAt);
  if (!Number.isFinite(timestamp.getTime())) throw new TypeError("acceptedAt must be a valid date.");
  const next = structuredClone(profile);
  const symbol = clean(suggestion.symbol, 120);
  if (symbol && !next.collectedSymbols.includes(symbol)) next.collectedSymbols.push(symbol);
  const palette = suggestion.suggestion?.palette;
  if (Object.hasOwn(CHARACTER_PALETTES, palette)) {
    next.appearance.palette = palette;
    next.appearance.colors = [...CHARACTER_PALETTES[palette]];
    next.appearance.motif = MOTIFS[palette];
  }
  const trait = clean(suggestion.suggestion?.trait, 80);
  if (trait && !next.traits.includes(trait)) next.traits.push(trait);
  next.evolution.push({
    symbol,
    sourceRef: clean(suggestion.basedOn, 500) || null,
    acceptedAt: timestamp.toISOString(),
    change: { palette: next.appearance.palette, motif: next.appearance.motif, trait: trait || null }
  });
  next.revision += 1;
  return next;
}
