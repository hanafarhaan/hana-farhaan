import { useId } from "react";
import { cuppedCrease, cuppedPetal, mulberry32, velvetIds } from "./petals";
import { VelvetDefs, VelvetPetal } from "./VelvetDefs";

// Coded fallback for envelope-flower.png: an arch-shaped mass of cupped velvet petals.
// Rendered as two stacked layers (back rows / front rows) so the letter can slide between them.

type Layer = "back" | "front";
type Petal = { x: number; y: number; w: number; h: number; rot: number; bend: number; bright: boolean; gilded: boolean };

const CX = 200;
const CY = 182; // centre of the dome's semicircular top
const R = 168;
const BOTTOM = 334;
const BACK_ROWS_BELOW = 132; // rows centred above this sit behind the letter

const halfWidth = (y: number) => (y < CY ? Math.sqrt(Math.max(0, R * R - (CY - y) ** 2)) : R);

const ROWS: { layer: Layer; petals: Petal[] }[] = (() => {
  const rand = mulberry32(11);
  const jitter = (amp: number) => (rand() - 0.5) * 2 * amp;
  const rows: { layer: Layer; petals: Petal[] }[] = [];
  let row = 0;
  for (let y = 40; y <= BOTTOM - 4; y += 27, row++) {
    const hw = halfWidth(y) - 26;
    if (hw < 14) continue;
    const step = 42;
    const n = Math.max(1, Math.round((hw * 2) / step));
    const petals: Petal[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = CX - hw + hw * 2 * t + (row % 2 ? step * 0.22 : -step * 0.22) + jitter(7);
      if (Math.abs(x - CX) > hw + 10) continue;
      const w = 66 + rand() * 24;
      const dx = (x - CX) / R;
      petals.push({
        x,
        y: y + jitter(6),
        w,
        h: w * (0.98 + rand() * 0.14),
        rot: dx * 30 + jitter(20),
        bend: jitter(7),
        bright: rand() > 0.5,
        gilded: rand() > 0.72,
      });
    }
    // Draw outer petals first so the centre ones overlap them, like a real bloom.
    petals.sort((a, b) => Math.abs(b.x - CX) - Math.abs(a.x - CX));
    rows.push({ layer: y < BACK_ROWS_BELOW ? "back" : "front", petals });
  }
  return rows;
})();

export default function EnvelopeFlower({ layer, className = "" }: { layer: Layer; className?: string }) {
  const ids = velvetIds(useId());
  const clip = `${ids.a}clip`;
  return (
    <svg className={className} viewBox="0 0 400 340" aria-hidden="true" focusable="false">
      <VelvetDefs ids={ids} />
      <defs>
        <clipPath id={clip}>
          <rect x="-30" y="-30" width="460" height={BOTTOM + 30} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {layer === "back" && (
          <path
            d={`M60 ${BOTTOM} L60 ${CY} A140 140 0 0 1 340 ${CY} L340 ${BOTTOM} Z`}
            fill="#0d0106"
          />
        )}
        {ROWS.filter((r) => r.layer === layer).map((row, ri) => (
          <g key={ri} filter={`url(#${ids.shadow})`}>
            {row.petals.map((p, pi) => (
              <g key={pi} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.rot.toFixed(1)})`}>
                <VelvetPetal
                  d={cuppedPetal(p.w, p.h)}
                  crease={cuppedCrease(p.h, p.bend)}
                  ids={ids}
                  bright={p.bright}
                  gilded={p.gilded}
                />
              </g>
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}
