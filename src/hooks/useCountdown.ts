import { useEffect, useState } from "react";

export type Countdown = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function remaining(target: number): Countdown {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

/** Live countdown to `target`, updated every second (aligned to the second boundary). */
export function useCountdown(target: Date) {
  const time = target.getTime();
  const [state, setState] = useState(() => remaining(time));

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const next = remaining(time);
      setState(next);
      if (!next.done) timer = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [time]);

  return state;
}
