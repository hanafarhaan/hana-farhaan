import { eventConfig as c } from "../../config/eventConfig";
import { reveal } from "../../utils/reveal";
import Artwork from "../art/Artwork";
import VelvetFlower from "../art/VelvetFlower";

export default function Closing({ onReplay }: { onReplay: () => void }) {
  return (
    <section className="sec s-cream closing" aria-label="Thank you">
      <div className="sec__in">
        <div className="closing__flower rv" ref={reveal}>
          <Artwork slot="closingFlower" alt="" className="closing__img" fallback={<VelvetFlower className="closing__svg" />} />
        </div>
        <div className="closing__text rv" ref={reveal}>
          <p className="closing__thanks">{c.closing.thanks}</p>
          <p className="closing__with">{c.closing.signOff}</p>
          <p className="closing__names">
            {c.bride} <i>&amp;</i> {c.groom}
          </p>
          <p className="closing__dua" lang="ar">
            {c.closing.dua}
          </p>
        </div>
        <button type="button" className="closing__replay" onClick={onReplay}>
          Watch the opening again
        </button>
      </div>
    </section>
  );
}
