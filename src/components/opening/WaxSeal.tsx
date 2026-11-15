import { forwardRef } from "react";
import { eventConfig } from "../../config/eventConfig";
import SealArt from "../art/SealArt";

export type SealState = "idle" | "loading" | "opening";

type Props = { state: SealState; onBreak: () => void };

/** The tappable gold wax seal on the cover. */
const WaxSeal = forwardRef<HTMLButtonElement, Props>(function WaxSeal({ state, onBreak }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={`seal ${state === "loading" ? "is-loading" : ""} ${state === "opening" ? "is-broken" : ""}`}
      onClick={onBreak}
      aria-label={`${eventConfig.monogram} seal: open the invitation`}
      aria-busy={state === "loading"}
      disabled={state !== "idle"}
    >
      <SealArt />
      <span className="seal__shine" aria-hidden="true" />
    </button>
  );
});

export default WaxSeal;
