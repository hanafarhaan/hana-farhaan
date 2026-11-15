// SVG <defs> shared by the coded velvet flowers: velvet "fresnel" fills (edges catch the light,
// centres sink into shadow), a tuck shadow toward the base, a crimson rim light, a gold hairline
// and a soft row shadow.
import type { VelvetIds } from "./petals";

export function VelvetDefs({ ids }: { ids: VelvetIds }) {
  return (
    <defs>
      {/* Lit at the tip, sinking into shadow toward the base. */}
      <linearGradient id={ids.a} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6c1225" />
        <stop offset="0.24" stopColor="#4c0a19" />
        <stop offset="0.58" stopColor="#2c040f" />
        <stop offset="1" stopColor="#0b0005" />
      </linearGradient>
      <linearGradient id={ids.b} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8a1c31" />
        <stop offset="0.24" stopColor="#5f0f21" />
        <stop offset="0.58" stopColor="#370611" />
        <stop offset="1" stopColor="#10010a" />
      </linearGradient>
      {/* Cupped sides: darker at the left and right edges. */}
      <linearGradient id={ids.sides} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#050002" stopOpacity="0.55" />
        <stop offset="0.3" stopColor="#050002" stopOpacity="0" />
        <stop offset="0.7" stopColor="#050002" stopOpacity="0" />
        <stop offset="1" stopColor="#050002" stopOpacity="0.55" />
      </linearGradient>
      {/* Soft sheen where the pile catches the light. */}
      <radialGradient id={ids.sheen} cx="50%" cy="20%" r="46%">
        <stop offset="0" stopColor="#f39aaa" stopOpacity="0.2" />
        <stop offset="1" stopColor="#f39aaa" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={ids.shade} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0" />
        <stop offset="0.62" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#060002" stopOpacity="0.5" />
      </linearGradient>
      <linearGradient id={ids.rim} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ef8295" stopOpacity="0.95" />
        <stop offset="0.16" stopColor="#c8475d" stopOpacity="0.6" />
        <stop offset="0.42" stopColor="#8e1a30" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={ids.gold} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f0d9a6" stopOpacity="0.85" />
        <stop offset="0.24" stopColor="#d9bf8a" stopOpacity="0" />
      </linearGradient>
      <filter id={ids.shadow} x="-25%" y="-25%" width="150%" height="170%" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#070002" floodOpacity="0.75" />
      </filter>
    </defs>
  );
}

/** One velvet petal: fresnel fill, base shadow, centre fold, crimson rim and optional gold edge. */
export function VelvetPetal({ d, crease, ids, bright, gilded }: { d: string; crease: string; ids: VelvetIds; bright: boolean; gilded: boolean }) {
  return (
    <>
      <path d={d} fill={`url(#${bright ? ids.b : ids.a})`} />
      <path d={d} fill={`url(#${ids.sides})`} />
      <path d={d} fill={`url(#${ids.sheen})`} />
      <path d={d} fill={`url(#${ids.shade})`} />
      <path d={crease} fill="none" stroke="#050002" strokeOpacity="0.2" strokeWidth="1" strokeLinecap="round" />
      <path d={d} fill="none" stroke={`url(#${ids.rim})`} strokeWidth="1.7" />
      {gilded && <path d={d} fill="none" stroke={`url(#${ids.gold})`} strokeWidth="0.8" />}
    </>
  );
}
