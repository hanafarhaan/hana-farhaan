// Gold line drawings used inside photo placeholders until real photos arrive.

export type LineArtKind = "dress" | "suit" | "chandelier" | "monogram";

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

export default function LineArt({ kind, monogram }: { kind: LineArtKind; monogram?: string }) {
  if (kind === "monogram") {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
        <circle cx="60" cy="60" r="44" {...common} opacity="0.7" />
        <circle cx="60" cy="60" r="39" {...common} strokeDasharray="0.6 3.2" opacity="0.6" />
        <text x="60" y="71" textAnchor="middle" fontFamily="'Pinyon Script', cursive" fontSize="34" fill="currentColor">
          {monogram}
        </text>
      </svg>
    );
  }
  if (kind === "chandelier") {
    return (
      <svg viewBox="0 0 120 140" aria-hidden="true" focusable="false">
        <g {...common}>
          <path d="M60 0 V26" />
          <circle cx="60" cy="31" r="5" />
          <path d="M60 36 V50" />
          <path d="M22 60 Q60 86 98 60" />
          <path d="M34 54 Q60 70 86 54" />
          <path d="M22 60 V48 M98 60 V48 M41 70 V52 M79 70 V52 M60 76 V50" />
          <path d="M22 44 q-3 -5 0 -9 q3 4 0 9Z M98 44 q-3 -5 0 -9 q3 4 0 9Z M41 48 q-3 -5 0 -9 q3 4 0 9Z M79 48 q-3 -5 0 -9 q3 4 0 9Z M60 46 q-3 -5 0 -9 q3 4 0 9Z" />
          <path d="M60 76 Q54 88 60 98 Q66 88 60 76Z" />
          <path d="M30 66 l-2 10 l2 4 l2 -4Z M90 66 l-2 10 l2 4 l2 -4Z M46 74 l-2 9 l2 4 l2 -4Z M74 74 l-2 9 l2 4 l2 -4Z" />
          <path d="M14 128 H106" opacity="0.5" />
          <path d="M26 134 H94" opacity="0.35" />
        </g>
      </svg>
    );
  }
  if (kind === "dress") {
    return (
      <svg viewBox="0 0 100 150" aria-hidden="true" focusable="false">
        <g {...common}>
          <path d="M50 6 V12" opacity="0.6" />
          <path d="M36 20 Q50 30 64 20" />
          <path d="M36 20 L38 12 Q50 16 62 12 L64 20" />
          <path d="M36 20 Q32 36 39 52" />
          <path d="M64 20 Q68 36 61 52" />
          <path d="M39 52 Q50 56 61 52" />
          <path d="M39 52 Q30 92 16 142" />
          <path d="M61 52 Q70 92 84 142" />
          <path d="M16 142 Q50 150 84 142" />
          <path d="M46 56 Q42 98 34 144" opacity="0.6" />
          <path d="M54 56 Q60 100 68 145" opacity="0.6" />
          <path d="M50 57 V146" opacity="0.35" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 150" aria-hidden="true" focusable="false">
      <g {...common}>
        <path d="M50 6 V12" opacity="0.6" />
        <path d="M20 34 Q50 16 80 34" />
        <path d="M42 20 L50 58 L58 20" />
        <path d="M42 20 L33 44 L50 58 M58 20 L67 44 L50 58" />
        <path d="M46 24 L50 28 L54 24 L54 31 L50 28 L46 31 Z" />
        <path d="M20 34 L16 126 M80 34 L84 126" />
        <path d="M16 126 Q50 133 84 126" />
        <path d="M50 58 V129" />
        <circle cx="50" cy="74" r="1.6" />
        <circle cx="50" cy="90" r="1.6" />
        <path d="M62 48 l9 -2 l1.5 6 l-10 1.4Z" />
        <path d="M27 94 H41 M59 94 H73" opacity="0.6" />
      </g>
    </svg>
  );
}
