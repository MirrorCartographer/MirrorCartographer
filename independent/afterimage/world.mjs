const PALETTES = [
  ['#08070d', '#f3b6ff', '#7be7ff', '#ffd27a'],
  ['#090b12', '#ff8fa3', '#8ef0c9', '#c6a7ff'],
  ['#07100f', '#ffe08a', '#79d9ff', '#ff9fcf'],
  ['#10080b', '#b9ffea', '#ffb36b', '#9fa8ff']
];

export function mulberry32(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function traceFor(forms = [], maxSegments = 28) {
  if (!Array.isArray(forms)) throw new TypeError('forms must be an array');
  if (!Number.isInteger(maxSegments) || maxSegments < 0) throw new TypeError('maxSegments must be a non-negative integer');
  if (forms.length < 2 || maxSegments === 0) return [];
  const ordered = [...forms].sort((a, b) => a.id.localeCompare(b.id));
  const available = ordered.slice(1);
  const segments = [];
  let current = ordered[0];
  while (available.length && segments.length < maxSegments) {
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < available.length; index += 1) {
      const candidate = available[index];
      const distance = (candidate.x - current.x) ** 2 + (candidate.y - current.y) ** 2;
      if (distance < nearestDistance || (distance === nearestDistance && candidate.id.localeCompare(available[nearestIndex].id) < 0)) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    }
    const next = available.splice(nearestIndex, 1)[0];
    segments.push({ from: current.id, to: next.id });
    current = next;
  }
  return segments;
}

export function sceneFor(seed = 1, width = 1280, height = 720) {
  if (!Number.isInteger(seed) || seed < 0) throw new TypeError('seed must be a non-negative integer');
  if (!(width > 0) || !(height > 0)) throw new TypeError('dimensions must be positive');
  const random = mulberry32(seed || 1);
  const palette = PALETTES[seed % PALETTES.length];
  const count = Math.max(18, Math.min(72, Math.round((width * height) / 24000)));
  const forms = Array.from({ length: count }, (_, index) => ({
    id: `${seed}-${index}`,
    x: Number((random() * width).toFixed(3)),
    y: Number((random() * height).toFixed(3)),
    radius: Number((8 + random() * Math.min(width, height) * 0.11).toFixed(3)),
    drift: Number((-0.45 + random() * 0.9).toFixed(4)),
    phase: Number((random() * Math.PI * 2).toFixed(4)),
    color: palette[1 + (index % (palette.length - 1))]
  }));
  return {
    version: 'afterimage-scene/2',
    seed,
    width,
    height,
    background: palette[0],
    forms,
    trace: traceFor(forms),
    tone: {
      baseHz: 110 + (seed % 7) * 13.75,
      interval: [1, 1.25, 1.5, 2][seed % 4],
      durationMs: 900
    }
  };
}
