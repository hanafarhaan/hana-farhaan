import { useRef, useState } from "react";
import { eventConfig as c, isTbc } from "../../config/eventConfig";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { dateSpaced } from "../../utils/dates";
import Artwork from "../art/Artwork";
import EnvelopeFlower from "../art/EnvelopeFlower";
import LetterCard from "../art/LetterCard";
import SealArt from "../art/SealArt";

const easeOut = (t: number) => 1 - (1 - t) ** 3;

function familiesLine() {
  const { bride, groom } = c.families;
  if (isTbc(bride) || isTbc(groom)) return `The families of ${c.bride} & ${c.groom}`;
  return `The ${bride} & ${groom} families`;
}

export default function Letter() {
  const stage = useRef<HTMLDivElement>(null);
  const letter = useRef<HTMLDivElement>(null);
  const [risen, setRisen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();
  const hasFlowerArt = !!c.artwork.envelopeFlower;

  useScrollProgress(
    stage,
    (p) => {
      const t = reduced ? 1 : easeOut(p);
      letter.current?.style.setProperty("--rise", t.toFixed(4));
      if (t > 0.92) setRisen(true);
    },
    { start: 0.95, end: 0.3 },
  );

  const flip = () => setFlipped((f) => !f);

  return (
    <section className="sec s-cream letter" aria-label="A letter from the families">
      <div className="sec__in">
        <div className={`env ${flipped ? "is-flipped" : ""}`} ref={stage}>
          {!hasFlowerArt && <EnvelopeFlower layer="back" className="env__back" />}

          <div className="env__letter" ref={letter} onClick={flip}>
            <div className="card3d">
              <div className="card3d__face card3d__front" aria-hidden={flipped}>
                <LetterCard>
                  <p className="lt__greet">{c.letter.greeting}</p>
                  <p className="lt__body">{c.letter.body}</p>
                  <p className="lt__sign">
                    <span className="lt__signoff">{c.letter.signOff}</span>
                    <span className="lt__families">{familiesLine()}</span>
                  </p>
                </LetterCard>
              </div>
              <div className="card3d__face card3d__back" aria-hidden={!flipped}>
                <LetterCard className="lt__backcard">
                  <SealArt className="lt__seal" />
                  <p className="lt__names">
                    {c.bride} <span>&amp;</span> {c.groom}
                  </p>
                  <p className="lt__date">{dateSpaced}</p>
                </LetterCard>
              </div>
            </div>
          </div>

          <div className="env__front">
            <Artwork
              slot="envelopeFlower"
              alt=""
              className="env__front-img"
              fallback={<EnvelopeFlower layer="front" className="env__front-svg" />}
            />
          </div>
        </div>

        {risen || reduced ? (
          <button type="button" className="env__hint env__hint--btn" onClick={flip} aria-pressed={flipped}>
            {flipped ? "Tap the letter to read it again" : "Tap the letter to turn it over"}
          </button>
        ) : (
          <p className="env__hint">Scroll to open the letter from us</p>
        )}
      </div>
    </section>
  );
}
