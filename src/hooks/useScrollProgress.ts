import { useEffect, useRef, type RefObject } from "react";

type Options = {
  /** Viewport fraction (0 = top, 1 = bottom) where the element's top must be for progress 0. */
  start?: number;
  /** Viewport fraction where the element's top must be for progress 1. */
  end?: number;
  /** Measure against the element's full height instead (progress 1 when its bottom reaches `end`). */
  span?: "top" | "height";
};

/**
 * Calls `onProgress(p)` (0..1) as the element moves through the viewport, at most once per frame.
 * Callers write styles directly in the callback, so scrolling never re-renders React.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  { start = 0.9, end = 0.3, span = "top" }: Options = {},
) {
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      let p: number;
      if (span === "height") {
        const from = vh * start;
        const to = vh * end;
        p = (from - rect.top) / Math.max(1, rect.height + from - to);
      } else {
        p = (vh * start - rect.top) / Math.max(1, vh * (start - end));
      }
      cb.current(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, start, end, span]);
}
