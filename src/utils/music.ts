// Background music: starts only after the guest taps (browsers block sound before that).
import { eventConfig } from "../config/eventConfig";
import { asset } from "./asset";

type Listener = (playing: boolean) => void;

const src = eventConfig.media.music ? asset(eventConfig.media.music) : "";
let audio: HTMLAudioElement | null = null;
let fadeTimer = 0;
const listeners = new Set<Listener>();

function emit() {
  const playing = !!audio && !audio.paused;
  listeners.forEach((fn) => fn(playing));
}

function ensureAudio() {
  if (!src) return null;
  if (!audio) {
    audio = new Audio(src);
    audio.loop = true;
    audio.preload = "none";
    audio.volume = 0;
    audio.addEventListener("play", emit);
    audio.addEventListener("pause", emit);
    audio.addEventListener("error", () => {
      available = false;
      emit();
    });
  }
  return audio;
}

let available = !!src;

export const music = {
  get available() {
    return available;
  },
  get playing() {
    return !!audio && !audio.paused;
  },
  /** Call from inside a tap/click handler. Fades in over 2 s. */
  start() {
    const a = ensureAudio();
    if (!a || !a.paused) return;
    a.volume = 0;
    a.play()
      .then(() => {
        window.clearInterval(fadeTimer);
        fadeTimer = window.setInterval(() => {
          a.volume = Math.min(0.5, a.volume + 0.025);
          if (a.volume >= 0.5) window.clearInterval(fadeTimer);
        }, 100);
      })
      .catch(() => emit());
  },
  toggle() {
    const a = ensureAudio();
    if (!a) return;
    if (a.paused) music.start();
    else a.pause();
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
