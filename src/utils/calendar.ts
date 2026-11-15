// "Add to calendar" (Google link + .ics download) and directions links, all from the config.
import { eventConfig as c, isTbc } from "../config/eventConfig";
import { eventEnd, eventStart } from "./dates";

const utcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const eventTitle = `${c.bride} & ${c.groom}’s Engagement`;

export function eventLocation() {
  return [c.venue.name, isTbc(c.venue.address) ? "" : c.venue.address, c.venue.city].filter(Boolean).join(", ");
}

function eventDetails() {
  return (
    `Together with their families, ${c.bride} & ${c.groom} request the pleasure of your presence at their engagement.\n` +
    `Invitation: ${c.siteUrl}`
  );
}

export function googleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle,
    dates: `${utcStamp(eventStart)}/${utcStamp(eventEnd)}`,
    details: eventDetails(),
    location: eventLocation(),
    ctz: c.timezone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const icsEscape = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

/** RFC 5545 line folding (75 octets; approximated by characters). */
const fold = (line: string) => line.match(/.{1,73}/g)?.join("\r\n ") ?? line;

export function icsText() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hana & Farhaan//Engagement Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${slug(eventTitle)}-${utcStamp(eventStart)}@${new URL(c.siteUrl).host}`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(eventStart)}`,
    `DTEND:${utcStamp(eventEnd)}`,
    `SUMMARY:${icsEscape(eventTitle)}`,
    `DESCRIPTION:${icsEscape(eventDetails())}`,
    `LOCATION:${icsEscape(eventLocation())}`,
    `URL:${c.siteUrl}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(`Tomorrow: ${eventTitle}`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function downloadIcs() {
  const blob = new Blob([icsText()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug(`${c.bride}-${c.groom}-engagement`)}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** The configured Google Maps link, or a search for the venue until one is set. */
export function directionsUrl() {
  if (c.venue.mapsUrl) return c.venue.mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation())}`;
}
