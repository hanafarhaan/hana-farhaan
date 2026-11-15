// Renders the admit-one ticket to a PNG (drawn on canvas with the page's fonts) and shares or downloads it.
import { eventConfig as c } from "../config/eventConfig";
import { dateDots, time12 } from "./dates";

/** A stable, pretty serial number for a guest's ticket. */
export function ticketSerial(name: string) {
  let h = 2166136261;
  for (const ch of name.trim().toLowerCase()) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const n = ((h >>> 0) % 900) + 100;
  return `${c.date.slice(8, 10)}${c.date.slice(5, 7)}-${n}`;
}

const W = 1080;
const H = 1620;

const SERIF = '"Bodoni Moda", Didot, Georgia, serif';
const SANS = '"Jost", system-ui, sans-serif';
const SCRIPT = '"Pinyon Script", "Snell Roundhand", cursive';

function spaced(ctx: CanvasRenderingContext2D, px: number) {
  if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`;
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, font: (size: number) => string, start: number, maxWidth: number) {
  let size = start;
  ctx.font = font(size);
  while (size > 24 && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = font(size);
  }
  return size;
}

function drawSeal(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    const rr = r * (1 + 0.053 * Math.sin(5 * a) + 0.037 * Math.sin(11 * a + 1.3) + 0.023 * Math.sin(17 * a + 0.4));
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  const wax = ctx.createRadialGradient(-r * 0.3, -r * 0.4, r * 0.1, 0, 0, r * 1.1);
  wax.addColorStop(0, "#fff0c2");
  wax.addColorStop(0.25, "#e9c578");
  wax.addColorStop(0.65, "#b88531");
  wax.addColorStop(1, "#6a4210");
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = r * 0.18;
  ctx.shadowOffsetY = r * 0.06;
  ctx.fillStyle = wax;
  ctx.fill();
  ctx.shadowColor = "transparent";
  const press = ctx.createRadialGradient(r * 0.2, r * 0.3, r * 0.05, 0, 0, r * 0.8);
  press.addColorStop(0, "#e2b766");
  press.addColorStop(1, "#8a5c1b");
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
  ctx.fillStyle = press;
  ctx.fill();
  ctx.strokeStyle = "rgba(251,230,174,0.75)";
  ctx.lineWidth = r * 0.02;
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.round(r * 0.56)}px ${SCRIPT}`;
  ctx.fillStyle = "rgba(255,243,207,0.8)";
  ctx.fillText(c.monogram, -1, r * 0.06 - 1);
  ctx.fillStyle = "#a6742a";
  ctx.fillText(c.monogram, 0, r * 0.06);
  ctx.restore();
}

export async function renderTicket(name: string): Promise<Blob> {
  await Promise.all(
    [`italic 400 40px ${SERIF}`, `400 40px ${SERIF}`, `500 20px ${SANS}`, `400 80px ${SCRIPT}`].map((f) =>
      document.fonts.load(f).catch(() => undefined),
    ),
  );

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Wine velvet backdrop.
  const bg = ctx.createRadialGradient(W / 2, H * 0.4, 80, W / 2, H / 2, H * 0.75);
  bg.addColorStop(0, "#5a1222");
  bg.addColorStop(0.6, "#3f0a15");
  bg.addColorStop(1, "#1e040a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Ticket card.
  const tx = 110;
  const ty = 150;
  const tw = W - tx * 2;
  const th = H - ty * 2;
  const perfY = ty + th * 0.72;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 18;
  const paper = ctx.createLinearGradient(0, ty, 0, ty + th);
  paper.addColorStop(0, "#f8f1e6");
  paper.addColorStop(1, "#efe3cf");
  ctx.fillStyle = paper;
  ctx.fillRect(tx, ty, tw, th);
  ctx.restore();

  // Perforation notches + dotted tear line.
  ctx.fillStyle = "#3f0a15";
  for (const nx of [tx, tx + tw]) {
    ctx.beginPath();
    ctx.arc(nx, perfY, 26, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(184,149,91,0.85)";
  ctx.setLineDash([2, 12]);
  ctx.lineCap = "round";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(tx + 44, perfY);
  ctx.lineTo(tx + tw - 44, perfY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Gold double rule.
  ctx.strokeStyle = "rgba(184,149,91,0.9)";
  ctx.lineWidth = 2;
  ctx.strokeRect(tx + 26, ty + 26, tw - 52, perfY - ty - 60);
  ctx.strokeStyle = "rgba(184,149,91,0.5)";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(tx + 36, ty + 36, tw - 72, perfY - ty - 80);

  const cx = W / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#9c7a40";
  ctx.font = `500 26px ${SANS}`;
  spaced(ctx, 12);
  ctx.fillText("ADMIT ONE", cx + 6, ty + 130);
  spaced(ctx, 0);

  ctx.fillStyle = "#6d1023";
  fitFont(ctx, name, (s) => `400 ${s}px ${SCRIPT}`, 104, tw - 160);
  ctx.fillText(name, cx, ty + 270);

  ctx.fillStyle = "rgba(58,10,20,0.72)";
  ctx.font = `italic 400 38px ${SERIF}`;
  ctx.fillText(`${c.bride} & ${c.groom}’s Engagement`, cx, ty + 345);

  // Divider with diamond.
  ctx.strokeStyle = "#b8955b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 150, ty + 405);
  ctx.lineTo(cx - 16, ty + 405);
  ctx.moveTo(cx + 16, ty + 405);
  ctx.lineTo(cx + 150, ty + 405);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, ty + 395);
  ctx.lineTo(cx + 10, ty + 405);
  ctx.lineTo(cx, ty + 415);
  ctx.lineTo(cx - 10, ty + 405);
  ctx.closePath();
  ctx.stroke();

  const label = (text: string, x: number, y: number) => {
    ctx.fillStyle = "#9c7a40";
    ctx.font = `500 22px ${SANS}`;
    spaced(ctx, 7);
    ctx.fillText(text.toUpperCase(), x + 3.5, y);
    spaced(ctx, 0);
  };
  const value = (text: string, x: number, y: number, size = 44) => {
    ctx.fillStyle = "#3a0a14";
    fitFont(ctx, text, (s) => `400 ${s}px ${SERIF}`, size, tw - 140);
    ctx.fillText(text, x, y);
  };

  label("Date", cx - 180, ty + 500);
  value(dateDots, cx - 180, ty + 556);
  label("Time", cx + 180, ty + 500);
  value(time12(c.startTime, { compact: true }), cx + 180, ty + 556);
  label("Place", cx, ty + 650);
  value(c.venue.name, cx, ty + 706, 42);
  label("Dress code", cx, ty + 800);
  value(c.dressCode.ticketLabel, cx, ty + 856, 40);

  // Stub.
  drawSeal(ctx, cx, perfY + 130, 78);
  ctx.fillStyle = "#6d1023";
  ctx.font = `400 64px ${SCRIPT}`;
  ctx.fillText(`${c.bride} & ${c.groom}`, cx, perfY + 290);
  ctx.fillStyle = "#9c7a40";
  ctx.font = `500 22px ${SANS}`;
  spaced(ctx, 6);
  ctx.fillText(`NO. ${ticketSerial(name)}`, cx + 3, perfY + 340);
  spaced(ctx, 0);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create the ticket image"))), "image/png"),
  );
}

/** Shares the ticket on phones (share sheet → save to Photos), or downloads it elsewhere. */
export async function saveTicket(name: string): Promise<"shared" | "downloaded" | "cancelled"> {
  const blob = await renderTicket(name);
  const filename = `${c.bride}-${c.groom}-ticket.png`.toLowerCase();
  const file = new File([blob], filename, { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse && nav.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: `${c.bride} & ${c.groom} · Ticket` });
      return "shared";
    } catch (err) {
      if ((err as DOMException).name === "AbortError") return "cancelled";
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
  return "downloaded";
}
