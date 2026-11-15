import { useEffect, useState, type RefObject } from "react";

/** Live "is this element on screen" flag. */
export function useInView(ref: RefObject<Element | null>, rootMargin = "0px", threshold = 0) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold]);
  return inView;
}
