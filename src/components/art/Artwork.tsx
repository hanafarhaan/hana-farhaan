import type { ReactNode } from "react";
import { eventConfig, type ArtworkSlot } from "../../config/eventConfig";
import { asset } from "../../utils/asset";

type Props = {
  slot: ArtworkSlot;
  /** Describe the image for screen readers; "" for decorative artwork. */
  alt: string;
  /** What to show while no real artwork is configured for this slot. */
  fallback: ReactNode;
  className?: string;
  loading?: "lazy" | "eager";
};

/** Renders the optimised artwork for a slot if one is configured, otherwise the coded fallback. */
export default function Artwork({ slot, alt, fallback, className, loading = "lazy" }: Props) {
  const path = eventConfig.artwork[slot];
  if (!path) return <>{fallback}</>;
  return <img className={className} src={asset(path)} alt={alt} loading={loading} decoding="async" draggable={false} />;
}
