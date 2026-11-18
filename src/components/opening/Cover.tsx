import { useEffect, useRef, useState } from "react";
import { eventConfig as c } from "../../config/eventConfig";
import { sparks } from "../../utils/confetti";
import { Ornament } from "../ui/SectionHeader";
import WaxSeal, { type SealState } from "./WaxSeal";

type Props = { state: SealState; onOpen: () => void };

/** Full-screen cover: draped oxblood satin with the wax seal to tap. */
export default function Cover({ state, onOpen }: Props) {
  const seal = useRef<HTMLButtonElement>(null);
  const [gone, setGone] = useState(false);

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
      <div className="cover__fabric" aria-hidden="true" />
      <div className="cover__sheen" aria-hidden="true" />
      <div className="cover__inner">
        <WaxSeal ref={seal} state={state} onBreak={onOpen} />
        <p className="cover__names">
          {c.bride} <span>&amp;</span> {c.groom}
        </p>
        <Ornament className="cover__orn" />
        <p className="cover__cta">{state === "loading" ? "Opening…" : "Tap the seal to open your invitation"}</p>
      </div>
    </div>
  );
}
