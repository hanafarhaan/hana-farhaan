import { attachConfettiCanvas } from "../../utils/confetti";

/** The one shared canvas for confetti, sparks and gold flakes. */
export default function Confetti() {
  return (
    <canvas
      className="confetti"
      aria-hidden="true"
      ref={(el) => {
        attachConfettiCanvas(el);
        return () => attachConfettiCanvas(null);
      }}
    />
  );
}
