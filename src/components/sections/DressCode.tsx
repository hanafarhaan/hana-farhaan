import { useId } from "react";
import { eventConfig as c } from "../../config/eventConfig";
import { reveal } from "../../utils/reveal";
import Artwork from "../art/Artwork";
import PhotoPlaceholder from "../art/PhotoPlaceholder";
import SectionHeader from "../ui/SectionHeader";

/** Emerald-cut gem swatch with a gold setting and faceting. */
function Gem({ hex }: { hex: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg className="gem" viewBox="0 0 40 52" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path d="M10 2H30L38 10V42L30 50H10L2 42V10Z" fill={hex} />
      <path d="M10 2H30L38 10V42L30 50H10L2 42V10Z" fill={`url(#${id}s)`} />
      <path d="M14.5 9H25.5L31 14.5V37.5L25.5 43H14.5L9 37.5V14.5Z" fill={hex} />
      <path d="M14.5 9H25.5L31 14.5V37.5L25.5 43H14.5L9 37.5V14.5Z" fill="#fff" fillOpacity="0.1" />
      <g stroke="#d9bf8a" strokeOpacity="0.55" strokeWidth="0.5" fill="none">
        <path d="M10 2 14.5 9M30 2 25.5 9M38 10 31 14.5M38 42 31 37.5M30 50 25.5 43M10 50 14.5 43M2 42 9 37.5M2 10 9 14.5" />
        <path d="M14.5 9H25.5L31 14.5V37.5L25.5 43H14.5L9 37.5V14.5Z" />
      </g>
      <path d="M10 2H30L38 10V42L30 50H10L2 42V10Z" fill="none" stroke="#d9bf8a" strokeWidth="1.1" />
    </svg>
  );
}

export default function DressCode() {
  const { dressCode: dc } = c;
  return (
    <section className="sec s-wine dress" aria-labelledby="dress-title">
      <div className="sec__in">
        <SectionHeader title="Dress code" sub={dc.headline} id="dress-title" />

        <ul className="swatches rv" ref={reveal}>
          {dc.swatches.map((s) => (
            <li key={s.name}>
              <Gem hex={s.hex} />
              <span>{s.name}</span>
            </li>
          ))}
        </ul>

        <div className="polaroids">
          <figure className="polaroid polaroid--her rv" ref={reveal}>
            <div className="polaroid__photo">
              <Artwork slot="dressHer" alt="Outfit inspiration for her" fallback={<PhotoPlaceholder kind="dress" />} />
            </div>
            <figcaption>For her</figcaption>
          </figure>
          <figure className="polaroid polaroid--him rv" ref={reveal}>
            <div className="polaroid__photo">
              <Artwork slot="dressHim" alt="Outfit inspiration for him" fallback={<PhotoPlaceholder kind="suit" />} />
            </div>
            <figcaption>For him</figcaption>
          </figure>
        </div>

        <dl className="dress__notes rv" ref={reveal}>
          <div>
            <dt>For her</dt>
            <dd>{dc.her}</dd>
          </div>
          <div>
            <dt>For him</dt>
            <dd>{dc.him}</dd>
          </div>
          {dc.avoid.trim() && (
            <div>
              <dt>Kindly avoid</dt>
              <dd>{dc.avoid}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
