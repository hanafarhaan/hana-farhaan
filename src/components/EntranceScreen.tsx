import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { eventConfig as event } from "../config/eventConfig";
import { useGlitter } from "../hooks/useGlitter";
import { dissolveCurtain } from "../utils/dissolveCurtain";
import WaxSeal from "./WaxSeal";
import "../styles/entrance.css";

const CURTAIN_GLITTER = ["#e0475a", "#f2a9a0", "#ffd2c4", "#f5cf7f", "#ffffff", "#a5122a"] as const;
const GOLD_DUST = ["#ffd98a", "#ffe9c4", "#ff9a7a"] as const;

/** closed → seal breaking → curtain dissolving into glitter → open */
type Phase = "closed" | "breaking" | "dissolving" | "open";

export default function EntranceScreen({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const reduceMotion = useReducedMotion();

  const curtainRef = useRef<HTMLDivElement>(null);
  const curtainGlitterRef = useRef<HTMLCanvasElement>(null);
  const burstRef = useRef<HTMLCanvasElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const cancelDissolve = useRef<(() => void) | null>(null);

  useGlitter(curtainGlitterRef, { density: 130, colors: CURTAIN_GLITTER });
  useGlitter(dustRef, { density: 4, colors: GOLD_DUST, drift: true, maxSize: 1.8 });

  // Lock page scroll while the entrance is on screen; stop any running animation on unmount.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      cancelDissolve.current?.();
    };
  }, []);

  const breakSeal = () => {
    if (phase !== "closed") return;

    if (reduceMotion) {
      setPhase("open");
      return;
    }

    setPhase("breaking");
    const rect = sealRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    window.setTimeout(() => {
      if (!curtainRef.current || !burstRef.current) return;
      setPhase("dissolving");
      cancelDissolve.current = dissolveCurtain({
        curtain: curtainRef.current,
        canvas: burstRef.current,
        cx,
        cy,
        onComplete: () => setPhase("open"),
      });
    }, 420);
  };

  const revealed = phase === "dissolving" || phase === "open";

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: reduceMotion ? 0.2 : 0.9,
        staggerChildren: reduceMotion ? 0.05 : 0.28,
      },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18, filter: reduceMotion ? "none" : "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
  };

  const monogram = `${event.bride.charAt(0)}&${event.groom.charAt(0)}`;

  return (
    <motion.div
      className="entrance"
      data-phase={phase}
      data-revealed={revealed}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <div className="stage" aria-hidden="true">
        <div className="stage__spot" />
        <div className="stage__floor" />
        <canvas ref={dustRef} className="stage__dust" />
      </div>

      <motion.section
        className="reveal"
        aria-label="Invitation"
        inert={!revealed}
        variants={container}
        initial="hidden"
        animate={revealed ? "show" : "hidden"}
      >
        <motion.p className="reveal__bismillah" variants={item} lang="ar">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </motion.p>

        <motion.h1 className="reveal__names" variants={item}>
          <span>{event.bride}</span>
          <span className="reveal__amp">&amp;</span>
          <span>{event.groom}</span>
        </motion.h1>

        <motion.p className="reveal__line" variants={item}>
          together with their families,
          <br />
          request your presence
        </motion.p>

        <motion.div className="reveal__rule" variants={item} aria-hidden="true">
          <span>✦</span>
        </motion.div>

        <motion.p className="reveal__date" variants={item}>
          {event.day} · {event.dateDisplay}
        </motion.p>
        <motion.p className="reveal__place" variants={item}>
          {event.city}
        </motion.p>

        <motion.button type="button" className="reveal__enter" variants={item} onClick={onEnter}>
          Enter the celebration
        </motion.button>
      </motion.section>

      {phase !== "open" && (
        <div ref={curtainRef} className="curtain" aria-hidden="true">
          <div className="curtain__folds" />
          <canvas ref={curtainGlitterRef} className="curtain__glitter" />
          <div className="curtain__sheen" />
        </div>
      )}

      <canvas ref={burstRef} className="entrance__burst" aria-hidden="true" />

      {(phase === "closed" || phase === "breaking") && (
        <div className="entrance__hint">
          <p className="entrance__teaser">An evening of celebration awaits</p>
          <WaxSeal ref={sealRef} monogram={monogram} broken={phase === "breaking"} onBreak={breakSeal} />
          <p className="entrance__cue">Break the seal</p>
        </div>
      )}
    </motion.div>
  );
}
