// Date and time phrasing derived from the config, so copy never hard-codes the date.
// Pure functions only: this file is also imported by vite.config.ts (Node).
import { eventConfig as c } from "../config/eventConfig.ts";

const ORDINALS = [
  "", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth",
  "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth",
  "nineteenth", "twentieth", "twenty-first", "twenty-second", "twenty-third", "twenty-fourth", "twenty-fifth",
  "twenty-sixth", "twenty-seventh", "twenty-eighth", "twenty-ninth", "thirtieth", "thirty-first",
];
const HOURS = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"];

export const pad2 = (n: number) => String(n).padStart(2, "0");

const [Y, M, D] = c.date.split("-").map(Number);
const noonUtc = new Date(Date.UTC(Y, M - 1, D, 12));

export const year = Y;
export const month = M; // 1-12
export const day = D;
export const weekday = noonUtc.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
export const monthName = noonUtc.toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" });

/** 17.01.2027 */
export const dateDots = `${pad2(D)}.${pad2(M)}.${Y}`;
/** 17 · 01 · 2027 */
export const dateSpaced = `${pad2(D)} · ${pad2(M)} · ${Y}`;
/** 17 January 2027 */
export const dateLong = `${D} ${monthName} ${Y}`;
/** Sunday, the seventeenth of January */
export const dateWords = `${weekday}, the ${ORDINALS[D]} of ${monthName}`;

function parts(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return { h, m };
}

function partOfDay(h: number) {
  if (h < 12) return "in the morning";
  if (h < 17) return "in the afternoon";
  return "in the evening";
}

/** "7:00 PM" (upper) · "7 pm" (compact) · "7:45 pm" */
export function time12(hhmm: string, opts: { compact?: boolean; upper?: boolean } = {}) {
  const { h, m } = parts(hhmm);
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 || 12;
  const text = opts.compact && m === 0 ? `${h12} ${suffix}` : `${h12}:${pad2(m)} ${suffix}`;
  return opts.upper ? text.toUpperCase() : text;
}

/** "seven in the evening" */
export function timeWords(hhmm: string) {
  const { h, m } = parts(hhmm);
  return m === 0 ? `${HOURS[h % 12]} ${partOfDay(h)}` : `${time12(hhmm)} ${partOfDay(h)}`;
}

/** "from seven o’clock" */
export function fromTime(hhmm: string) {
  const { h, m } = parts(hhmm);
  return m === 0 ? `from ${HOURS[h % 12]} o’clock` : `from ${time12(hhmm)}`;
}

/** A Date for a time on the event day, in the event's UTC offset. */
export function eventDateAt(hhmm: string) {
  return new Date(`${c.date}T${hhmm}:00${c.utcOffset}`);
}

export const eventStart = eventDateAt(c.startTime);
export const eventEnd = (() => {
  const end = eventDateAt(c.endTime);
  if (end <= eventStart) end.setUTCDate(end.getUTCDate() + 1);
  return end;
})();
