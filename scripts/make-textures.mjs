#!/usr/bin/env node
// Pre-renders the coded velvet / paper / grain textures to small WebP tiles in public/textures/.
// (Rendering SVG fractal noise live costs phones seconds of main-thread time; tiles cost nothing.)
// Run after changing a texture recipe: node scripts/make-textures.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "textures");

/** size = tile size it's displayed at; save = stored pixel size (smooth noise can be stored smaller). */
const TEXTURES = [
  // Crushed velvet: dark blotches + warm sheen.
  { name: "velvet-dark", size: 640, save: 256, freq: "0.0045 0.0065", octaves: 4, seed: 11, rgb: [12, 0, 4], a: -1.2, b: 0.72 },
  { name: "velvet-sheen", size: 640, save: 256, freq: "0.006 0.009", octaves: 3, seed: 29, rgb: [168, 44, 64], a: 0.95, b: -0.52 },
  // Cotton paper: soft mottling.
  { name: "paper-mottle", size: 900, save: 256, freq: "0.0055", octaves: 4, seed: 3, rgb: [120, 82, 52], a: -0.5, b: 0.27 },
  // One fine grain shared by velvet pile, paper fibre and the page-wide film grain.
  { name: "grain", size: 220, save: 220, freq: "0.85", octaves: 2, seed: 5, rgb: [20, 6, 10], a: -0.62, b: 0.37 },
];

function svg(t) {
  const [r, g, b] = t.rgb.map((v) => (v / 255).toFixed(3));
  const matrix = `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  ${t.a} 0 0 0 ${t.b}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${t.size}" height="${t.size}">
  <filter id="n" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="${t.freq}" numOctaves="${t.octaves}" seed="${t.seed}" stitchTiles="stitch"/>
    <feColorMatrix values="${matrix}"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#n)"/>
</svg>`;
}

await mkdir(OUT, { recursive: true });
for (const t of TEXTURES) {
  const buf = await sharp(Buffer.from(svg(t)))
    .resize(t.save, t.save)
    .webp({ quality: 72, alphaQuality: 72, effort: 6 })
    .toBuffer();
  await writeFile(path.join(OUT, `${t.name}.webp`), buf);
  console.log(`✓ textures/${t.name}.webp  ${t.save}px → shown at ${t.size}px  ${(buf.length / 1024).toFixed(1)} KB`);
}
