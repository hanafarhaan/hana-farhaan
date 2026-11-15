import { useId } from "react";
import { mulberry32, radialCrease, radialPetal, velvetIds } from "./petals";
import { VelvetDefs, VelvetPetal } from "./VelvetDefs";

// Coded fallback for closing-flower.png: a velvet rosette, rings of cupped petals around a dark core.

const RINGS = [
  { n: 9, len: 172, w: 132, rot: 0 },
  { n: 8, len: 142, w: 116, rot: 22 },
  { n: 7, len: 112, w: 98, rot: 6 },
  { n: 6, len: 84, w: 80, rot: 32 },
  { n: 5, len: 58, w: 62, rot: 14 },
  { n: 5, len: 34, w: 42, rot: 50 },
];

const PETALS = (() => {
  const rand = mulberry32(19);
  const jitter = (amp: number) => (rand() - 0.5) * 2 * amp;
  return RINGS.map((ring, ri) =>
    Array.from({ length: ring.n }, (_, i) => ({
      angle: ring.rot + (i * 360) / ring.n + jitter(5),
      len: ring.len * (0.94 + rand() * 0.1),
      w: ring.w * (0.94 + rand() * 0.1),
      bend: jitter(6),
      bright: ri >= 2 ? rand() > 0.35 : rand() > 0.6,
      gilded: ri >= 3 && rand() > 0.4,
    })),
  );
})();

const STAMENS = Array.from({ length: 7 }, (_, i) => {
  const a = (i / 7) * Math.PI * 2 + 0.4;
  return { x: Math.cos(a) * 8, y: Math.sin(a) * 8 };
});

export default function VelvetFlower({ className = "" }: { className?: string }) {
  const ids = velvetIds(useId());
  const core = `${ids.a}core`;
  return (
    <svg className={className} viewBox="0 0 420 420" aria-hidden="true" focusable="false">
      <VelvetDefs ids={ids} />
      <defs>
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#050002" />
          <stop offset="0.7" stopColor="#1d020a" />
          <stop offset="1" stopColor="#3a0612" />
        </radialGradient>
      </defs>
      <g transform="translate(210 214) scale(1 0.94)">
        {PETALS.map((ring, ri) => (
          <g key={ri} filter={`url(#${ids.shadow})`}>
            {ring.map((p, pi) => (
              <g key={pi} transform={`rotate(${p.angle.toFixed(1)})`}>
                <VelvetPetal d={radialPetal(p.w, p.len)} crease={radialCrease(p.len, p.bend)} ids={ids} bright={p.bright} gilded={p.gilded} />
              </g>
            ))}
          </g>
        ))}
        <circle r="15" fill={`url(#${core})`} />
        {STAMENS.map((s, i) => (
          <circle key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r="1.6" fill="#d9bf8a" opacity="0.85" />
        ))}
      </g>
    </svg>
  );
}
