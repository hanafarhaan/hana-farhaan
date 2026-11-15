// Reveal-on-scroll: elements with class "rv" fade up once when they enter the viewport.
// Usage: <div className="rv" ref={reveal}> — the observer sets data-in, which React never overwrites.
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-in", "");
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 },
    );
  }
  return observer;
}

export function reveal(el: Element | null) {
  if (!el) return;
  if (typeof IntersectionObserver === "undefined") {
    el.setAttribute("data-in", "");
    return;
  }
  const io = getObserver();
  io.observe(el);
  return () => io.unobserve(el);
}
