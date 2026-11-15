import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { reveal } from "../../utils/reveal";

type Props = {
  children: ReactNode;
  /** "inner": thin light outline inset inside the photo. "outer": gold outline offset around it. */
  variant?: "inner" | "outer";
  /** Slow zoom-out of the photo as it scrolls through the viewport. */
  parallax?: boolean;
  className?: string;
};

/** Tall arch-topped frame for photos (venue, couple). */
export default function ArchFrame({ children, variant = "inner", parallax = false, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useScrollProgress(
    root,
    (p) => {
      if (!parallax || reduced || !media.current) return;
      media.current.style.transform = `scale(${(1.14 - p * 0.14).toFixed(4)})`;
    },
    { start: 1, end: 0.15, span: "height" },
  );

  return (
    <div className={`arch arch--${variant} rv ${className}`} ref={(el) => {
      root.current = el;
      return reveal(el);
    }}>
      <div className="arch__clip">
        <div className="arch__media" ref={media}>
          {children}
        </div>
      </div>
    </div>
  );
}
