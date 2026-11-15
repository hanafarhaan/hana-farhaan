// Shared geometry for the coded velvet-flower artwork.

export type VelvetIds = { a: string; b: string; sides: string; sheen: string; shade: string; rim: string; gold: string; shadow: string };

/** Unique gradient/filter ids per flower instance (from React's useId). */
export function velvetIds(prefix: string): VelvetIds {
  const p = prefix.replace(/[^a-zA-Z0-9_-]/g, "");
  return { a: `${p}va`, b: `${p}vb`, sides: `${p}vx`, sheen: `${p}vh`, shade: `${p}vs`, rim: `${p}vr`, gold: `${p}vg`, shadow: `${p}vd` };
}

/** A rose petal centred on (0,0): narrow base at the bottom, broad top with a soft central notch. */
export function cuppedPetal(w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  return (
    `M0 ${f(hh)} C${f(-hw * 0.9)} ${f(hh * 0.55)} ${f(-hw * 1.15)} ${f(-hh * 0.2)} ${f(-hw * 0.95)} ${f(-hh * 0.62)}` +
    ` C${f(-hw * 0.8)} ${f(-hh * 1.02)} ${f(-hw * 0.25)} ${f(-hh * 1.06)} 0 ${f(-hh * 0.93)}` +
    ` C${f(hw * 0.25)} ${f(-hh * 1.06)} ${f(hw * 0.8)} ${f(-hh * 1.02)} ${f(hw * 0.95)} ${f(-hh * 0.62)}` +
    ` C${f(hw * 1.15)} ${f(-hh * 0.2)} ${f(hw * 0.9)} ${f(hh * 0.55)} 0 ${f(hh)}Z`
  );
}

/** The fold down the middle of a cupped petal. */
export function cuppedCrease(h: number, bend: number) {
  const hh = h / 2;
  return `M0 ${f(hh * 0.8)} Q${f(bend)} ${f(hh * 0.1)} ${f(bend * 0.4)} ${f(-hh * 0.45)}`;
}

/** The fold of a radial (rosette) petal, from its base toward the tip. */
export function radialCrease(len: number, bend: number) {
  return `M0 ${f(-len * 0.08)} Q${f(bend)} ${f(-len * 0.5)} ${f(bend * 0.3)} ${f(-len * 0.86)}`;
}

/** Small deterministic PRNG so the artwork looks hand-made but identical on every load. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => n.toFixed(1);

/** A petal growing from (0,0) up to (0,-len), with a rounded tip. */
export function radialPetal(w: number, len: number) {
  return `M0 0 C${f(-w * 0.55)} ${f(-len * 0.08)} ${f(-w * 0.64)} ${f(-len * 0.96)} 0 ${f(-len)} C${f(w * 0.64)} ${f(-len * 0.96)} ${f(w * 0.55)} ${f(-len * 0.08)} 0 0Z`;
}

/** Deckled (torn-paper) edge as a CSS clip-path polygon. */
export function deckledClipPath(seed = 42, steps = 28, amp = 2.6) {
  const r = mulberry32(seed);
  const j = () => (r() * amp).toFixed(2);
  const pct = (i: number) => ((i / steps) * 100).toFixed(2);
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) pts.push(`${pct(i)}% ${j()}px`);
  for (let i = 1; i <= steps; i++) pts.push(`calc(100% - ${j()}px) ${pct(i)}%`);
  for (let i = steps - 1; i >= 0; i--) pts.push(`${pct(i)}% calc(100% - ${j()}px)`);
  for (let i = steps - 1; i >= 1; i--) pts.push(`${j()}px ${pct(i)}%`);
  return `polygon(${pts.join(", ")})`;
}
