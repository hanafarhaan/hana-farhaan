import { forwardRef } from "react";

// Irregular wax-blob outline: a circle wobbled by a few sine harmonics.
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

type WaxSealProps = {
  monogram: string;
  broken: boolean;
  onBreak: () => void;
};

const WaxSeal = forwardRef<HTMLButtonElement, WaxSealProps>(function WaxSeal(
  { monogram, broken, onBreak },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={`seal${broken ? " is-broken" : ""}`}
      onClick={onBreak}
      aria-label="Break the seal to open the invitation"
      disabled={broken}
    >
      <svg viewBox="0 0 140 140" aria-hidden="true">
        <defs>
          <radialGradient id="seal-wax" cx="36%" cy="30%" r="78%">
            <stop offset="0" stopColor="#fff0c2" />
            <stop offset="0.22" stopColor="#e9c578" />
            <stop offset="0.6" stopColor="#b88531" />
            <stop offset="1" stopColor="#6a4210" />
          </radialGradient>
          <radialGradient id="seal-press" cx="62%" cy="68%" r="75%">
            <stop offset="0" stopColor="#e2b766" />
            <stop offset="1" stopColor="#8a5c1b" />
          </radialGradient>
          <filter id="seal-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.65" />
          </filter>
        </defs>

        <path d={SEAL_PATH} fill="url(#seal-wax)" filter="url(#seal-shadow)" />
        {/* Pressed stamp area with a bevelled rim */}
        <circle cx="70" cy="70" r="45" fill="url(#seal-press)" />
        <circle cx="70.8" cy="70.8" r="45" fill="none" stroke="#fbe6ae" strokeOpacity="0.7" strokeWidth="1.2" />
        <circle cx="69.2" cy="69.2" r="45" fill="none" stroke="#4d2f07" strokeOpacity="0.55" strokeWidth="1.2" />
        <circle cx="70" cy="70" r="39" fill="none" stroke="#5c3a0c" strokeOpacity="0.55" strokeWidth="1.1" strokeDasharray="0.8 3.4" strokeLinecap="round" />

        {/* Embossed monogram: highlight, shadow, then face */}
        <g fontFamily="'Great Vibes', cursive" fontSize="34" textAnchor="middle">
          <text x="69.3" y="80.3" fill="#fff3cf" fillOpacity="0.75">{monogram}</text>
          <text x="70.9" y="81.9" fill="#3f2604" fillOpacity="0.7">{monogram}</text>
          <text x="70" y="81" fill="#a6742a">{monogram}</text>
        </g>
      </svg>
    </button>
  );
});

export default WaxSeal;
