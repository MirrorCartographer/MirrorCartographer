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
    version: 'afterimage-scene/1',
    seed,
    width,
    height,
    background: palette[0],
    forms,
    tone: {
      baseHz: 110 + (seed % 7) * 13.75,
      interval: [1, 1.25, 1.5, 2][seed % 4],
      durationMs: 900
    }
  };
}
