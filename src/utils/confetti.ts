// Shared, imperative confetti + gold flake effects drawn on one fixed canvas (see ui/Confetti.tsx).

type Shape = "rect" | "dot" | "star";
type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  life: number;
  decay: number;
  color: string;
  shape: Shape;
  flutter: number;
  gravity: number;
};

export const GOLDS = ["#f3e2b3", "#e9d29c", "#d9bf8a", "#b8955b", "#9c7a40", "#fff4d6"];
export const CELEBRATION = [...GOLDS, "#6d1023", "#9b1428", "#f6eee7"];

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let pieces: Piece[] = [];
let frame = 0;
let dpr = 1;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

function resize() {
  if (!canvas || !ctx) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function attachConfettiCanvas(el: HTMLCanvasElement | null) {
  if (!el) {
    window.removeEventListener("resize", resize);
    cancelAnimationFrame(frame);
    canvas = ctx = null;
    pieces = [];
    return;
  }
  canvas = el;
  ctx = el.getContext("2d");
  resize();
  window.addEventListener("resize", resize);
}

function drawStar(c: CanvasRenderingContext2D, r: number) {
  c.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const len = i % 2 === 0 ? r : r * 0.32;
    c.lineTo(Math.cos(a) * len, Math.sin(a) * len);
  }
  c.closePath();
  c.fill();
}

function tick() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = pieces.length - 1; i >= 0; i--) {
    const p = pieces[i];
    p.vx *= 0.985;
    p.vy = p.vy * 0.985 + p.gravity;
    p.x += p.vx + Math.sin(p.life * 12 + p.flutter) * 0.6;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= p.decay;
    if (p.life <= 0 || p.y > window.innerHeight + 40) {
      pieces.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.min(1, p.life * 1.6);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.shape === "rect") {
      // Fake 3D tumble by squashing one axis.
      ctx.scale(1, Math.cos(p.life * 18 + p.flutter));
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else if (p.shape === "dot") {
      ctx.beginPath();
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      drawStar(ctx, p.w);
    }
    ctx.restore();
  }
  frame = pieces.length ? requestAnimationFrame(tick) : 0;
}

function run() {
  if (!frame) frame = requestAnimationFrame(tick);
}

/** A celebratory burst from a point (viewport coordinates). */
export function burst(x: number, y: number, opts: { count?: number; colors?: string[]; power?: number; up?: boolean } = {}) {
  if (!ctx || reduced()) return;
  const { count = 90, colors = CELEBRATION, power = 9, up = true } = opts;
  for (let i = 0; i < count; i++) {
    const angle = up ? rand(-Math.PI * 0.95, -Math.PI * 0.05) : rand(0, Math.PI * 2);
    const speed = rand(power * 0.35, power);
    const shape: Shape = Math.random() < 0.6 ? "rect" : Math.random() < 0.5 ? "dot" : "star";
    pieces.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.2, 0.2),
      w: shape === "rect" ? rand(5, 9) : shape === "star" ? rand(3, 5.5) : rand(3, 5),
      h: rand(8, 14),
      life: 1,
      decay: rand(0.006, 0.011),
      color: pick(colors),
      shape,
      flutter: rand(0, 6),
      gravity: 0.16,
    });
  }
  run();
}

/** A few drifting gold flakes, e.g. while brushing the scratch card. */
export function flakes(x: number, y: number, count = 3) {
  if (!ctx || reduced()) return;
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: x + rand(-8, 8),
      y: y + rand(-8, 8),
      vx: rand(-1.4, 1.4),
      vy: rand(-2.2, -0.4),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.25, 0.25),
      w: rand(2.5, 5),
      h: rand(2, 4),
      life: 1,
      decay: rand(0.018, 0.03),
      color: pick(GOLDS),
      shape: Math.random() < 0.8 ? "rect" : "star",
      flutter: rand(0, 6),
      gravity: 0.09,
    });
  }
  run();
}

/** Gold sparks radiating from a point (the seal breaking). */
export function sparks(x: number, y: number, count = 70) {
  burst(x, y, { count, colors: GOLDS, power: 7, up: false });
}
