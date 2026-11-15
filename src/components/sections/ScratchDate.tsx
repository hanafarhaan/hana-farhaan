import { useCallback, useEffect, useRef, useState } from "react";
import { eventConfig as c } from "../../config/eventConfig";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { asset } from "../../utils/asset";
import { burst, flakes, GOLDS } from "../../utils/confetti";
import { dateSpaced, dateWords, time12, timeWords, year } from "../../utils/dates";
import { reveal } from "../../utils/reveal";
import SectionHeader from "../ui/SectionHeader";

const BRUSH = 22;
const REVEAL_AT = 0.55;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Paints the gold foil layer (artwork if supplied, otherwise a coded foil) with the prompt text. */
async function paintFoil(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalCompositeOperation = "source-over";

  let drewArt = false;
  if (c.artwork.goldFoil) {
    try {
      const img = await loadImage(asset(c.artwork.goldFoil));
      const s = Math.max(w / img.width, h / img.height);
      ctx.drawImage(img, (w - img.width * s) / 2, (h - img.height * s) / 2, img.width * s, img.height * s);
      drewArt = true;
    } catch {
      drewArt = false;
    }
  }

  if (!drewArt) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#8a6a35");
    g.addColorStop(0.22, "#e9d29c");
    g.addColorStop(0.42, "#b8955b");
    g.addColorStop(0.62, "#f3e2b3");
    g.addColorStop(0.82, "#a8843f");
    g.addColorStop(1, "#d9bf8a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // Crinkles and brushed grain.
    for (let i = 0; i < 220; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const len = 6 + Math.random() * 26;
      const a = Math.random() * Math.PI;
      ctx.strokeStyle = Math.random() > 0.5 ? "rgba(255,247,222,0.32)" : "rgba(92,62,20,0.22)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.stroke();
    }
    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,250,232,0.18)" : "rgba(80,52,16,0.14)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }
  }

  // Prompt text, letterpressed into the foil.
  try {
    await Promise.all([
      document.fonts.load('italic 400 26px "Bodoni Moda"'),
      document.fonts.load('500 10px "Jost"'),
    ]);
  } catch {
    /* fall back to system fonts */
  }
  const cx = w / 2;
  const cy = h / 2;
  const size = Math.min(27, w / 12);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `italic 400 ${size}px "Bodoni Moda", Georgia, serif`;
  ctx.fillStyle = "rgba(255,246,220,0.55)";
  ctx.fillText("Brush to reveal the date", cx + 0.8, cy - 12 + 0.8);
  ctx.fillStyle = "#4a0d1b";
  ctx.fillText("Brush to reveal the date", cx, cy - 12);

  ctx.strokeStyle = "rgba(74,13,27,0.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 52, cy + 14);
  ctx.lineTo(cx - 9, cy + 14);
  ctx.moveTo(cx + 9, cy + 14);
  ctx.lineTo(cx + 52, cy + 14);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy + 9.5);
  ctx.lineTo(cx + 4.5, cy + 14);
  ctx.lineTo(cx, cy + 18.5);
  ctx.lineTo(cx - 4.5, cy + 14);
  ctx.closePath();
  ctx.stroke();

  ctx.font = `500 10px "Jost", system-ui, sans-serif`;
  if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "3px";
  ctx.fillStyle = "#4a0d1b";
  ctx.fillText("WITH YOUR FINGER", cx + 1.5, cy + 36);
}

export default function ScratchDate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [ready, setReady] = useState(false);
  const revealedRef = useRef(false);
  const readyRef = useRef(false);
  const reduced = useReducedMotion();

  const doReveal = useCallback(
    (celebrate: boolean) => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      setRevealed(true);
      const canvas = canvasRef.current;
      if (celebrate && canvas && !reduced) {
        const r = canvas.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, { count: 70, colors: GOLDS, power: 8 });
      }
    },
    [reduced],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let drawing = false;
    let last: { x: number; y: number } | null = null;
    let lastCheck = 0;
    let moves = 0;

    const paint = async () => {
      if (revealedRef.current) return;
      await paintFoil(canvas);
      readyRef.current = true;
      setReady(true);
    };
    const ro = new ResizeObserver(() => void paint());
    ro.observe(canvas);

    const point = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const coverage = () => {
      const { width, height } = canvas;
      const data = ctx.getImageData(0, 0, width, height).data;
      let clear = 0;
      let total = 0;
      const step = 4 * 9; // sample every 9th pixel
      for (let i = 3; i < data.length; i += step) {
        total++;
        if (data[i] < 128) clear++;
      }
      return total ? clear / total : 0;
    };

    const scratch = (from: { x: number; y: number }, to: { x: number; y: number }) => {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = BRUSH * 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x + 0.01, to.y + 0.01);
      ctx.stroke();
      ctx.restore();
    };

    const onDown = (e: PointerEvent) => {
      if (revealedRef.current || !readyRef.current) return;
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      last = point(e);
      scratch(last, last);
    };
    const onMove = (e: PointerEvent) => {
      if (!drawing || !last || revealedRef.current) return;
      const p = point(e);
      scratch(last, p);
      last = p;
      if (++moves % 3 === 0) flakes(e.clientX, e.clientY, 2);
      const now = performance.now();
      if (now - lastCheck > 140) {
        lastCheck = now;
        if (coverage() >= REVEAL_AT) doReveal(true);
      }
    };
    const onUp = () => {
      drawing = false;
      last = null;
      if (!revealedRef.current && coverage() >= REVEAL_AT) doReveal(true);
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [doReveal]);

  return (
    <section className="sec s-wine scratch-sec" aria-labelledby="save-date-title">
      <div className="sec__in">
        <SectionHeader title="Save the date" id="save-date-title" />
        <div className={`scratch rv ${ready ? "is-ready" : ""} ${revealed ? "is-revealed" : ""}`} ref={reveal}>
          <div className="scratch__panel">
            <div className="scratch__date" aria-hidden={!revealed}>
              <span className="scratch__num">{dateSpaced}</span>
              <span className="scratch__time">at {timeWords(c.startTime)}</span>
            </div>
            <canvas ref={canvasRef} className="scratch__foil" aria-hidden="true" />
          </div>
        </div>
        <p className="sr-only">
          Save the date: {dateWords} {year}, at {time12(c.startTime)}.
        </p>
        <button
          type="button"
          className={`scratch__alt ${revealed ? "is-hidden" : ""}`}
          onClick={() => doReveal(true)}
          tabIndex={revealed ? -1 : 0}
        >
          Show the date without brushing
        </button>
      </div>
    </section>
  );
}
