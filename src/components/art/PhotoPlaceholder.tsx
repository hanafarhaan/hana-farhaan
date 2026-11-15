import { eventConfig } from "../../config/eventConfig";
import LineArt, { type LineArtKind } from "./LineArt";

// Shown in place of a photo until the real one is supplied: velvet panel + gold line art.
export default function PhotoPlaceholder({ kind = "monogram", className = "" }: { kind?: LineArtKind; className?: string }) {
  return (
    <div className={`photo-ph ${className}`} role="presentation">
      <div className={`photo-ph__art photo-ph__art--${kind}`}>
        <LineArt kind={kind} monogram={eventConfig.monogram} />
      </div>
      {import.meta.env.DEV && <span className="photo-ph__cap">Photo coming soon</span>}
    </div>
  );
}
