import { eventConfig as c } from "../../config/eventConfig";
import { dateWords, year } from "../../utils/dates";
import { reveal } from "../../utils/reveal";
import Artwork from "../art/Artwork";
import PhotoPlaceholder from "../art/PhotoPlaceholder";
import SealArt from "../art/SealArt";
import ArchFrame from "../ui/ArchFrame";

export default function SeeYouThere() {
  return (
    <section className="sec s-wine end" aria-labelledby="end-title">
      <div className="sec__in">
        <div className="end__photo">
          <ArchFrame variant="outer">
            <Artwork
              slot="couplePhoto"
              alt={`${c.bride} and ${c.groom}`}
              className="arch__img"
              fallback={<PhotoPlaceholder kind="monogram" />}
            />
          </ArchFrame>
          <SealArt palette="ivory" className="end__seal" />
        </div>

        <div className="end__text rv" ref={reveal}>
          <h2 className="end__see" id="end-title">
            See you there
          </h2>
          <p className="end__names">
            <span>{c.bride}</span> <i>&amp;</i> <span>{c.groom}</span>
          </p>
          <p className="end__date">
            {dateWords} {year}
          </p>
          <p className="end__place">{c.venue.name}</p>
        </div>
      </div>
    </section>
  );
}
