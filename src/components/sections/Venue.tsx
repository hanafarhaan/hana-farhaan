import { useState } from "react";
import { eventConfig as c, isTbc } from "../../config/eventConfig";
import { directionsUrl } from "../../utils/calendar";
import { fromTime, dateWords } from "../../utils/dates";
import { reveal } from "../../utils/reveal";
import Artwork from "../art/Artwork";
import PhotoPlaceholder from "../art/PhotoPlaceholder";
import AddToCalendar from "../ui/AddToCalendar";
import ArchFrame from "../ui/ArchFrame";
import { IconPin } from "../ui/Icons";
import SectionHeader from "../ui/SectionHeader";

export default function Venue() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const { venue } = c;
  const address = isTbc(venue.address) ? venue.city : venue.address;

  return (
    <section className="sec s-cream venue" aria-labelledby="venue-title">
      <div className="sec__in">
        <SectionHeader title="Where" id="venue-title" />

        {/* No zoom on a real photo: it may carry its own composition (crest, lettering) near the edges. */}
        <ArchFrame parallax={!c.artwork.venuePhoto} className="venue__arch">
          <Artwork
            slot="venuePhoto"
            alt={`${venue.name}, ${venue.city}`}
            className="arch__img"
            fallback={<PhotoPlaceholder kind="chandelier" />}
          />
        </ArchFrame>

        <div className="venue__info rv" ref={reveal}>
          <p className="venue__name">{venue.name}</p>
          <p className="venue__addr">{address}</p>
          <p className="venue__when">
            {dateWords}, {fromTime(c.startTime)}
          </p>
        </div>

        <div className="venue__btns rv" ref={reveal}>
          <a className="btn btn--fill" href={directionsUrl()} target="_blank" rel="noopener noreferrer">
            Get directions
          </a>
          <AddToCalendar />
        </div>

        <div className="venue__map rv" ref={reveal}>
          {venue.mapsEmbedUrl ? (
            <iframe
              title={`Map showing ${venue.name}`}
              src={venue.mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={mapLoaded ? "is-ready" : ""}
              onLoad={() => setMapLoaded(true)}
              allowFullScreen
            />
          ) : (
            <a className="map-ph" href={directionsUrl()} target="_blank" rel="noopener noreferrer" aria-label={`Open ${venue.name} in Google Maps`}>
              <svg className="map-ph__lines" viewBox="0 0 360 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <path d="M-10 150 C60 120 90 160 150 130 S260 60 370 90" />
                <path d="M-10 60 C80 80 120 30 200 50 S300 140 370 120" />
                <path d="M120 -10 C110 60 150 110 140 210" />
                <path d="M250 -10 C270 50 230 120 260 210" />
                <path d="M-10 100 H370" className="thin" />
                <path d="M60 -10 V210" className="thin" />
                <path d="M300 -10 V210" className="thin" />
              </svg>
              <span className="map-ph__pin">
                <IconPin size={30} />
              </span>
              <span className="map-ph__label">{venue.name}</span>
              <span className="map-ph__cta">Map coming soon · tap for directions</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
