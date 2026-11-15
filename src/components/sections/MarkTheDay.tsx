import { useEffect, useRef, useState } from "react";
import { eventConfig as c } from "../../config/eventConfig";
import { useCountdown } from "../../hooks/useCountdown";
import { dateWords, day, eventStart, month, timeWords, year } from "../../utils/dates";
import { reveal } from "../../utils/reveal";
import AddToCalendar from "../ui/AddToCalendar";
import { IconChevronLeft, IconChevronRight } from "../ui/Icons";
import SectionHeader from "../ui/SectionHeader";

const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function monthLabel(y: number, m: number) {
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" });
}

function monthCells(y: number, m: number) {
  const lead = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7; // Monday-first
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return [...Array<null>(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="cd__unit">
      <span className="cd__num">
        <span key={value} className="cd__roll">
          {value}
        </span>
      </span>
      <span className="cd__label">{label}</span>
    </div>
  );
}

export default function MarkTheDay() {
  const [view, setView] = useState({ y: year, m: month });
  const snapTimer = useRef(0);
  const time = useCountdown(eventStart);

  const isEventMonth = view.y === year && view.m === month;

  const page = (delta: number) => {
    setView((v) => {
      const d = new Date(Date.UTC(v.y, v.m - 1 + delta, 1));
      return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1 };
    });
  };

  // Wander off to another month and the calendar drifts back to the big day.
  useEffect(() => {
    window.clearTimeout(snapTimer.current);
    if (!isEventMonth) snapTimer.current = window.setTimeout(() => setView({ y: year, m: month }), 6000);
    return () => window.clearTimeout(snapTimer.current);
  }, [isEventMonth, view]);

  const cells = monthCells(view.y, view.m);

  return (
    <section className="sec s-cream mark" aria-labelledby="mark-title">
      <div className="sec__in">
        <SectionHeader title="Mark the day" id="mark-title" />

        <div className="cal rv" ref={reveal}>
          <span className="cal__gem" aria-hidden="true" />
          <div className="cal__head">
            <button type="button" className="cal__nav" onClick={() => page(-1)} aria-label="Previous month">
              <IconChevronLeft size={20} />
            </button>
            <div className="cal__title" aria-live="polite">
              <span className="cal__month">{monthLabel(view.y, view.m)}</span>
              <span className="cal__year">{view.y}</span>
            </div>
            <button type="button" className="cal__nav" onClick={() => page(1)} aria-label="Next month">
              <IconChevronRight size={20} />
            </button>
          </div>

          <div className="cal__dow" aria-hidden="true">
            {DOW.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="cal__grid" aria-hidden="true">
            {cells.map((d, i) => (
              <span key={i} className={`cal__d ${isEventMonth && d === day ? "is-day" : ""}`}>
                {d ?? ""}
              </span>
            ))}
          </div>

          <p className="cal__note">
            {dateWords}
            <br />
            at {timeWords(c.startTime)}
          </p>

          <div className="cal__rule" aria-hidden="true" />

          {time.done ? (
            <p className="cd__done">Today we celebrate · Alhamdulillah</p>
          ) : (
            <div className="cd" role="timer" aria-label={`${time.days} days, ${time.hours} hours and ${time.minutes} minutes to go`}>
              <Unit value={time.days} label="Days" />
              <Unit value={time.hours} label="Hours" />
              <Unit value={time.minutes} label="Minutes" />
              <Unit value={time.seconds} label="Seconds" />
            </div>
          )}
        </div>

        <AddToCalendar fill className="mark__atc" />
      </div>
    </section>
  );
}
