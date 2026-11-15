import { useEffect, useRef, useState } from "react";
import { eventConfig as c } from "../../config/eventConfig";
import { useGlitter } from "../../hooks/useGlitter";
import { asset } from "../../utils/asset";
import { sparks } from "../../utils/confetti";
import WaxSeal, { type SealState } from "./WaxSeal";

type Props = { state: SealState; onOpen: () => void };

const SPARKLE = ["#ffffff", "#ffe2d6", "#f5cf7f", "#ff9aa6"] as const;

/** Full-screen cover: the film's first frame (ruby glitter) with the wax seal to tap. */
export default function Cover({ state, onOpen }: Props) {
  const seal = useRef<HTMLButtonElement>(null);
  const glitter = useRef<HTMLCanvasElement>(null);
  const [gone, setGone] = useState(false);

  useGlitter(glitter, { density: 1.4, colors: SPARKLE, maxSize: 1.9, active: !gone });

  // Seal breaks into gold sparks, then the cover dissolves into the film beneath.
  useEffect(() => {
    if (state !== "opening") return;
    const r = seal.current?.getBoundingClientRect();
    if (r) sparks(r.left + r.width / 2, r.top + r.height / 2, 80);
    const t = window.setTimeout(() => setGone(true), 1400);
    return () => window.clearTimeout(t);
  }, [state]);

  if (gone) return null;

  return (
    <div className={`cover ${state === "opening" ? "is-leaving" : ""}`} role="dialog" aria-modal="true" aria-label="Invitation">
      <img className="cover__bg" src={asset(c.media.openingPoster)} alt="" fetchPriority="high" decoding="async" />
      <canvas ref={glitter} className="cover__glitter" aria-hidden="true" />
      <div className="cover__inner">
        <WaxSeal ref={seal} state={state} onBreak={onOpen} />
        <p className="cover__names">
          {c.bride} <span>&amp;</span> {c.groom}
        </p>
        <p className="cover__cta">{state === "loading" ? "Opening…" : "Tap the seal to open your invitation"}</p>
      </div>
    </div>
  );
}
