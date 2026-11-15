import type { ReactNode } from "react";
import { eventConfig } from "../../config/eventConfig";
import { asset } from "../../utils/asset";
import { deckledClipPath } from "./petals";

// Coded fallback for letter-paper.png: aged satin paper with a deckled edge and a gold double rule.
const DECKLE = deckledClipPath();

export default function LetterCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const art = eventConfig.artwork.letterPaper;
  return (
    <div
      className={`letter-card ${art ? "has-art" : ""} ${className}`}
      style={art ? { backgroundImage: `url("${asset(art)}")` } : { clipPath: DECKLE }}
    >
      {children}
    </div>
  );
}
