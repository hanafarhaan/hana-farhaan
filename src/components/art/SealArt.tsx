import { useId } from "react";
import { eventConfig } from "../../config/eventConfig";
import { asset } from "../../utils/asset";

// Wax seal. Coded version: an SVG wax blob with a pressed stamp. If real seal artwork is configured,
// the image is used instead, and the monogram is always drawn in code on top (AI tools garble letters).

export type SealPalette = "gold" | "ivory";

const PALETTES = {
  gold: {
    wax: ["#fff0c2", "#e9c578", "#b88531", "#6a4210"],
    press: ["#e2b766", "#8a5c1b"],
    rimLight: "#fbe6ae",
    rimDark: "#4d2f07",
    dots: "#5c3a0c",
    text: { hi: "#fff3cf", lo: "#3f2604", face: "#a6742a" },
  },
  ivory: {
    wax: ["#ffffff", "#f7f0e4", "#ddd0b8", "#9f8c6e"],
    press: ["#f1e7d6", "#c3b294"],
    rimLight: "#fffaf0",
    rimDark: "#7d6a4c",
    dots: "#8c7756",
    text: { hi: "#ffffff", lo: "#76603e", face: "#b9a37c" },
  },
} as const;

// Irregular wax outline: a circle wobbled by a few sine harmonics.
const SEAL_PATH = (() => {
  const points: string[] = [];
  const steps = 96;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = 60 + 3.2 * Math.sin(5 * a) + 2.2 * Math.sin(11 * a + 1.3) + 1.4 * Math.sin(17 * a + 0.4);
    points.push(`${(70 + r * Math.cos(a)).toFixed(2)},${(70 + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
})();

function Monogram({ palette, size = 33 }: { palette: SealPalette; size?: number }) {
  const t = PALETTES[palette].text;
  const text = eventConfig.monogram;
  return (
    <g fontFamily="'Pinyon Script', 'Snell Roundhand', cursive" fontSize={size} textAnchor="middle">
      <text x="69.3" y="80.6" fill={t.hi} fillOpacity="0.8">{text}</text>
      <text x="70.9" y="82.2" fill={t.lo} fillOpacity="0.7">{text}</text>
      <text x="70" y="81.4" fill={t.face}>{text}</text>
    </g>
  );
}

export default function SealArt({ palette = "gold", className = "" }: { palette?: SealPalette; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const p = PALETTES[palette];
  const image = palette === "gold" ? eventConfig.artwork.sealGold : eventConfig.artwork.sealIvory;

  if (image) {
    return (
      <span className={`seal-art ${className}`}>
        <img src={asset(image)} alt="" decoding="async" />
        <svg viewBox="0 0 140 140" aria-hidden="true" focusable="false">
          <Monogram palette={palette} />
        </svg>
      </span>
    );
  }

  return (
    <svg className={`seal-art ${className}`} viewBox="0 0 140 140" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${uid}w`} cx="36%" cy="30%" r="78%">
          <stop offset="0" stopColor={p.wax[0]} />
          <stop offset="0.22" stopColor={p.wax[1]} />
          <stop offset="0.6" stopColor={p.wax[2]} />
          <stop offset="1" stopColor={p.wax[3]} />
        </radialGradient>
        <radialGradient id={`${uid}p`} cx="62%" cy="68%" r="75%">
          <stop offset="0" stopColor={p.press[0]} />
          <stop offset="1" stopColor={p.press[1]} />
        </radialGradient>
        <filter id={`${uid}s`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>
      <path d={SEAL_PATH} fill={`url(#${uid}w)`} filter={`url(#${uid}s)`} />
      <circle cx="70" cy="70" r="45" fill={`url(#${uid}p)`} />
      <circle cx="70.8" cy="70.8" r="45" fill="none" stroke={p.rimLight} strokeOpacity="0.75" strokeWidth="1.2" />
      <circle cx="69.2" cy="69.2" r="45" fill="none" stroke={p.rimDark} strokeOpacity="0.5" strokeWidth="1.2" />
      <circle cx="70" cy="70" r="39" fill="none" stroke={p.dots} strokeOpacity="0.55" strokeWidth="1.1" strokeDasharray="0.8 3.4" strokeLinecap="round" />
      <Monogram palette={palette} />
    </svg>
  );
}
