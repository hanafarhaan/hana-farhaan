import { useCallback, useEffect, useRef, useState } from "react";
import { eventConfig as c } from "../../config/eventConfig";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { time12 } from "../../utils/dates";
import { ScheduleGlyph } from "../ui/Icons";
import SectionHeader from "../ui/SectionHeader";

type Geometry = { d: string; length: number; stops: number[]; height: number };

type Pt = { x: number; y: number };

const cubic = (a: number, b: number, c2: number, d: number, t: number) =>
  (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c2 + t ** 3 * d;

/** S-curve through each badge centre, with vertical tangents so the line "winds" down the page. */
function buildPath(points: Pt[]) {
  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const k = (b.y - a.y) * 0.55;
    const c1 = { x: a.x, y: a.y + k };
    const c2 = { x: b.x, y: b.y - k };
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    // Arc length by sampling the curve (avoids getTotalLength on a detached element).
    let prev = a;
    for (let s = 1; s <= 32; s++) {
      const t = s / 32;
      const p = { x: cubic(a.x, c1.x, c2.x, b.x, t), y: cubic(a.y, c1.y, c2.y, b.y, t) };
      length += Math.hypot(p.x - prev.x, p.y - prev.y);
      prev = p;
    }
  }
  return { d, length: Math.ceil(length) + 2 };
}

export default function Timeline() {
  const body = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const badges = useRef<(HTMLSpanElement | null)[]>([]);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [lit, setLit] = useState(0);
  const reduced = useReducedMotion();
  const items = c.schedule;

  const measure = useCallback(() => {
    const el = body.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const centres = badges.current.map((b) => {
      const r = b!.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    });
    if (!centres.length) return;
    const points = [{ x: box.width / 2, y: 0 }, ...centres, { x: box.width / 2, y: box.height }];
    const { d, length } = buildPath(points);
    setGeo({ d, length, stops: centres.map((p) => p.y / box.height), height: box.height });
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (body.current) ro.observe(body.current);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => ro.disconnect();
  }, [measure]);

  // New geometry: sync the line to the current scroll position straight away.
  useEffect(() => {
    if (geo) window.dispatchEvent(new Event("scroll"));
  }, [geo]);

  useScrollProgress(
    body,
    (p) => {
      if (!geo) return;
      const progress = reduced ? 1 : p;
      if (line.current) line.current.style.strokeDashoffset = String(geo.length * (1 - progress));
      const reached = geo.stops.filter((s) => s <= progress + 0.015).length;
      setLit(reached);
    },
    { start: 0.62, end: 0.62, span: "height" },
  );

  return (
    <section className="sec s-wine tl" aria-labelledby="tl-title">
      <div className="sec__in">
        <SectionHeader title="The evening" id="tl-title" />
        <div className="tl__body" ref={body}>
          {geo && (
            <svg className="tl__svg" width="100%" height={geo.height} aria-hidden="true" focusable="false">
              <path d={geo.d} className="tl__track" />
              <path
                ref={line}
                d={geo.d}
                className="tl__line"
                style={{ strokeDasharray: geo.length, strokeDashoffset: reduced ? 0 : geo.length }}
              />
            </svg>
          )}
          <ol className="tl__list">
            {items.map((it, i) => (
              <li key={it.time + it.title} className={`tl__item ${i % 2 ? "is-left" : "is-right"} ${i < lit ? "is-lit" : ""}`}>
                <div className="tl__txt">
                  <time className="tl__time" dateTime={it.time}>
                    {time12(it.time, { compact: true })}
                  </time>
                  <b className="tl__title">{it.title}</b>
                  <span className="tl__sub">{it.subtitle}</span>
                </div>
                <span
                  className="tl__badge"
                  ref={(el) => {
                    badges.current[i] = el;
                  }}
                >
                  <ScheduleGlyph icon={it.icon} size={24} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
