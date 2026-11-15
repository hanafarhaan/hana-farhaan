import { useSyncExternalStore } from "react";
import { music } from "../../utils/music";
import { IconMusic } from "./Icons";

const getPlaying = () => music.playing;

/** Round gold button (top right) that toggles background music. Hidden when no track is configured. */
export default function MusicToggle({ visible }: { visible: boolean }) {
  const playing = useSyncExternalStore(music.subscribe, getPlaying, () => false);
  if (!music.available) return null;
  return (
    <button
      type="button"
      className={`music ${visible ? "is-on" : ""} ${playing ? "is-playing" : ""}`}
      onClick={() => music.toggle()}
      aria-pressed={playing}
      aria-label={playing ? "Pause music" : "Play music"}
      tabIndex={visible ? 0 : -1}
    >
      <IconMusic size={18} />
      <span className="music__eq" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
