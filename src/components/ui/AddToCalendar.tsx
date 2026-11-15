import { useEffect, useId, useRef, useState } from "react";
import { downloadIcs, googleCalendarUrl } from "../../utils/calendar";
import { IconCalendar, IconDownload } from "./Icons";

/** "Add to calendar" button with a small menu: Google Calendar, or an .ics file for Apple / Outlook. */
export default function AddToCalendar({ fill = false, className = "" }: { fill?: boolean; className?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`atc ${className}`} ref={root}>
      <button
        type="button"
        className={`btn ${fill ? "btn--fill" : ""}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        Add to calendar
      </button>
      <div className={`atc__menu ${open ? "is-open" : ""}`} id={menuId} hidden={!open}>
        <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          <IconCalendar size={18} />
          Google Calendar
        </a>
        <button
          type="button"
          onClick={() => {
            downloadIcs();
            setOpen(false);
          }}
        >
          <IconDownload size={18} />
          Apple / Outlook (.ics)
        </button>
      </div>
    </div>
  );
}
