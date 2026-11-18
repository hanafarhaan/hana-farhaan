import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { eventConfig as c } from "../../config/eventConfig";
import { useGlitter } from "../../hooks/useGlitter";
import { useInView } from "../../hooks/useInView";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { asset } from "../../utils/asset";
import { music } from "../../utils/music";
import { IconChevronDown } from "../ui/Icons";
import Cover from "./Cover";
import StageText from "./StageText";
import { stageDuration, TEXT_AT_SECONDS } from "./timing";
import type { SealState } from "./WaxSeal";

export type OpeningHandle = { replay: () => void };

/**
 * cover    → waiting for the seal tap
 * loading  → tapped, video buffering (seal shimmers)
 * playing  → curtain film running
 * stage    → film reached the open stage; text lines fading in
 * done     → everything shown, page scroll unlocked
 */
type Phase = "cover" | "loading" | "playing" | "stage" | "done";

type Props = { onStart: () => void; onDone: () => void };

const GOLD_DUST = ["#ffe7b8", "#f3d79c", "#ffd2c4", "#ffffff"] as const;

const OpeningFilm = forwardRef<OpeningHandle, Props>(function OpeningFilm({ onStart, onDone }, ref) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("cover");
  const [fast, setFast] = useState(false);
  const [videoHidden, setVideoHidden] = useState(false);
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const ambient = useRef<HTMLCanvasElement>(null);
  const dust = useRef<HTMLCanvasElement>(null);
  const doneTimer = useRef(0);
  const heroVisible = useInView(section);

  const textOn = phase === "stage" || phase === "done";
  useGlitter(dust, { density: 3, colors: GOLD_DUST, drift: true, maxSize: 1.7, active: textOn && heroVisible });

  const showText = useCallback(
    (quick: boolean) => {
      setFast(quick);
      setPhase("stage");
      window.clearTimeout(doneTimer.current);
      doneTimer.current = window.setTimeout(() => {
        setPhase("done");
        onDone();
      }, stageDuration(quick));
    },
    [onDone],
  );

  useEffect(() => () => window.clearTimeout(doneTimer.current), []);

  const fallBackToStill = useCallback(() => {
    video.current?.pause();
    setVideoHidden(true);
    showText(true);
  }, [showText]);

  const open = () => {
    if (phase !== "cover") return;
    music.start();
    onStart();
    const v = video.current;
    if (reduced || !v) {
      fallBackToStill();
      return;
    }
    setPhase("loading");
    v.currentTime = 0;
    const played = v.play();
    if (played) played.catch(fallBackToStill);
  };

  const skip = () => {
    if (phase === "cover") {
      music.start();
      onStart();
    }
    fallBackToStill();
  };

  useImperativeHandle(
    ref,
    () => ({
      replay() {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        const v = video.current;
        if (reduced || !v) return;
        window.clearTimeout(doneTimer.current);
        onStart();
        setFast(false);
        setVideoHidden(false);
        setPhase("playing");
        v.currentTime = 0;
        v.play().catch(fallBackToStill);
      },
    }),
    [reduced, onStart, fallBackToStill],
  );

  // Soft, blurred copy of the film filling the sides on wide screens.
  useEffect(() => {
    const cv = ambient.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    cv.width = 36;
    cv.height = 64;
    let frame = 0;
    const v = video.current;
    if ((phase === "loading" || phase === "playing") && v && !videoHidden) {
      const loop = () => {
        if (v.readyState >= 2) ctx.drawImage(v, 0, 0, cv.width, cv.height);
        frame = requestAnimationFrame(loop);
      };
      loop();
    } else {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, cv.width, cv.height);
      img.src = asset(c.media.openingStage);
    }
    return () => cancelAnimationFrame(frame);
  }, [phase, videoHidden]);

  const sealState: SealState = phase === "cover" ? "idle" : phase === "loading" ? "loading" : "opening";
  const skippable = phase === "cover" || phase === "loading" || phase === "playing";

  return (
    <>
      <section
        id="top"
        ref={section}
        className="film"
        data-phase={phase}
        aria-label={`${c.bride} and ${c.groom}'s engagement invitation`}
      >
        <canvas ref={ambient} className="film__ambient" aria-hidden="true" />
        <div className="film__frame">
          <img className="film__still" src={asset(c.media.openingStage)} alt="" decoding="async" />
          {!reduced && (
            <video
              ref={video}
              className={`film__video ${videoHidden ? "is-hidden" : ""}`}
              src={asset(c.media.openingVideo)}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              onPlaying={() => setPhase((p) => (p === "loading" ? "playing" : p))}
              onTimeUpdate={(e) => {
                if (phase === "playing" && e.currentTarget.currentTime >= TEXT_AT_SECONDS) showText(false);
              }}
              onEnded={() => setVideoHidden(true)}
              onError={() => {
                if (phase === "loading" || phase === "playing") fallBackToStill();
              }}
            />
          )}
          <canvas ref={dust} className="film__dust" aria-hidden="true" />
          <StageText visible={textOn} fast={fast} />
          <a className={`film__cue ${phase === "done" ? "is-on" : ""}`} href="#after-top" tabIndex={phase === "done" ? 0 : -1}>
            <span>Scroll</span>
            <IconChevronDown size={18} />
          </a>
        </div>
      </section>
      <span id="after-top" aria-hidden="true" />

      <Cover state={sealState} onOpen={open} />

      <button
        type="button"
        className={`skip ${skippable ? "is-on" : ""}`}
        onClick={skip}
        tabIndex={skippable ? 0 : -1}
        aria-hidden={!skippable}
      >
        Skip
      </button>
    </>
  );
});

export default OpeningFilm;
