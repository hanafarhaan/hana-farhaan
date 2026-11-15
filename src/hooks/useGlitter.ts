import { useEffect, type RefObject } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  color: string;
  phase: number;
  speed: number;
  vx: number;
  vy: number;
};

type GlitterOptions = {
  /** Particles per 10,000 px² of canvas area. */
  density: number;
  colors: readonly string[];
  /** Slowly float particles upward (gold dust) instead of twinkling in place. */
  drift?: boolean;
  maxSize?: number;
};

const MAX_PARTICLES = 2600;

/**
 * Draws twinkling glitter onto a canvas. Sized to the canvas's layout box,
 * capped at 2x device pixel ratio, and drawn once (static) for reduced-motion users.
 */
export function useGlitter(
  ref: RefObject<HTMLCanvasElement | null>,
  { density, colors, drift = false, maxSize = 1.6 }: GlitterOptions,
) {
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;

    const seed = () => {
      // offsetWidth ignores CSS transforms, so scaling the curtain doesn't re-seed.
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(MAX_PARTICLES, Math.round(((width * height) / 10_000) * density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() ** 3 * maxSize + 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 2.4,
        vx: drift ? (Math.random() - 0.5) * 0.15 : 0,
        vy: drift ? -(0.08 + Math.random() * 0.35) : 0,
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (drift && !reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -4) {
            p.y = height + 4;
            p.x = Math.random() * width;
          }
        }
        const twinkle = Math.max(0, Math.sin(time * 0.001 * p.speed + p.phase)) ** 3;
        const alpha = reduceMotion ? 0.7 : 0.25 + 0.75 * twinkle;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        if (p.r < 0.9) {
          ctx.fillRect(p.x, p.y, p.r * 2, p.r * 2);
          continue;
        }
        // Brightest larger flecks get a four-point star flare.
        if (p.r > 1.3 && alpha > 0.65) {
          ctx.fillRect(p.x - p.r * 3, p.y - 0.35, p.r * 6, 0.7);
          ctx.fillRect(p.x - 0.35, p.y - p.r * 3, 0.7, p.r * 6);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      frame = requestAnimationFrame(loop);
    };

    seed();
    if (reduceMotion) draw(1000);
    else frame = requestAnimationFrame(loop);

    const observer = new ResizeObserver(() => {
      seed();
      if (reduceMotion) draw(1000);
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [ref, density, colors, drift, maxSize]);
}
