// Sends an RSVP to the Google Apps Script Web App (which appends a row to the Google Sheet).
import { eventConfig } from "../config/eventConfig";

export type Attendance = "Yes" | "No" | "Later";

export type RsvpPayload = {
  name: string;
  attendance: Attendance;
  phone: string;
  wish: string;
  type: "new" | "update";
};

export type StoredReply = Omit<RsvpPayload, "type"> & { at: string };

const STORAGE_KEY = "hf-rsvp-reply";

export class RsvpNotConnectedError extends Error {}

export const rsvpConnected = () => eventConfig.rsvp.endpoint.trim().length > 0;

export async function submitRsvp(payload: RsvpPayload): Promise<void> {
  const endpoint = eventConfig.rsvp.endpoint.trim();
  if (!endpoint) throw new RsvpNotConnectedError("RSVP endpoint is not configured");

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 15_000);
  try {
    // text/plain keeps this a "simple" request, so the browser skips the CORS preflight Apps Script can't answer.
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, userAgent: navigator.userAgent.slice(0, 200) }),
      redirect: "follow",
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !data || data.ok !== true) throw new Error(data?.error || `RSVP failed (${res.status})`);
  } finally {
    window.clearTimeout(timer);
  }
}

export function loadReply(): StoredReply | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredReply;
    return parsed && typeof parsed.name === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function saveReply(reply: StoredReply) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reply));
  } catch {
    /* storage unavailable (private mode) — the reply is still sent */
  }
}
