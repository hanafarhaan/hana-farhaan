type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  decay: number;
  color: string;
};

const SPARK_COLORS = ["#ffe7b0", "#f5cf7f", "#ffffff", "#ff9d9d", "#e0475a", "#ffc2b0"];
const MAX_SPARKS = 2200;

type DissolveOptions = {
  curtain: HTMLElement;
  canvas: HTMLCanvasElement;
  /** Viewport point the dissolve radiates from (the seal). */
  cx: number;
  cy: number;
  duration?: number;
  onComplete: () => void;
};

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

function spark(x: number, y: number, angle: number, speed: number): Spark {
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.4,
    size: 0.6 + Math.random() ** 2 * 2.4,
    life: 1,
    decay: 0.008 + Math.random() * 0.018,
    color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
  };
}

/**
 * Dissolves the curtain into glitter: a radial mask hole grows from (cx, cy)
 * while sparks are shed along its edge and drift upward.
 * Returns a cancel function.
 */
export function dissolveCurtain({ curtain, canvas, cx, cy, duration = 2600, onComplete }: DissolveOptions) {
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

  const feather = Math.max(70, Math.min(width, height) * 0.22);
  const maxRadius = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy)) + feather;

  curtain.style.setProperty("--cx", `${cx}px`);
  curtain.style.setProperty("--cy", `${cy}px`);
  curtain.style.setProperty("--feather", `${feather}px`);

  // The seal shatters first.
  const sparks: Spark[] = [];
  for (let i = 0; i < 160; i++) {
    sparks.push(spark(cx, cy, Math.random() * Math.PI * 2, 1 + Math.random() * 5));
  }

  const start = performance.now();
  let frame = 0;
  let finished = false;

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const radius = easeInOutSine(t) * maxRadius;
    curtain.style.setProperty("--r", `${radius}px`);

    // Shed glitter from the dissolving edge.
    if (t < 1) {
      const emit = Math.min(90, 20 + radius / 6);
      for (let i = 0; i < emit && sparks.length < MAX_SPARKS; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = radius - Math.random() * feather;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (x < -10 || x > width + 10 || y < -10 || y > height + 10) continue;
        sparks.push(spark(x, y, angle, 0.2 + Math.random() * 1.2));
      }
    }

    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.97;
        s.vy = s.vy * 0.97 - 0.02; // float upward like shimmer
        s.life -= s.decay;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const alpha = s.life * (0.55 + 0.45 * Math.sin(now * 0.02 + i));
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = s.color;
        if (s.size > 1.8) {
          ctx.fillRect(s.x - s.size * 2.5, s.y - 0.4, s.size * 5, 0.8);
          ctx.fillRect(s.x - 0.4, s.y - s.size * 2.5, 0.8, s.size * 5);
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    if (t >= 1 && !finished) {
      finished = true;
      onComplete();
    }
    if (t < 1 || sparks.length > 0) frame = requestAnimationFrame(step);
  };

  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}
