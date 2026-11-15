#!/usr/bin/env node
// Optimises raw artwork dropped in artwork-inbox/ into public/images/ and reports which
// eventConfig.artwork slots to fill. Run: npm run art        (report only)
//                                          npm run art -- --apply   (also writes the paths into the config)
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INBOX = path.join(ROOT, "artwork-inbox");
const PUBLIC = path.join(ROOT, "public");
const CONFIG = path.join(ROOT, "src", "config", "eventConfig.ts");
const APPLY = process.argv.includes("--apply");

/** File name (without extension) in the inbox → where it goes and how to compress it. */
const SPECS = [
  { name: "envelope-flower", slot: "envelopeFlower", out: "images/envelope-flower.webp", width: 1000, maxKB: 200 },
  { name: "closing-flower", slot: "closingFlower", out: "images/closing-flower.webp", width: 900, maxKB: 200 },
  { name: "seal-gold", slot: "sealGold", out: "images/seal-gold.webp", width: 520, maxKB: 120 },
  { name: "seal-ivory", slot: "sealIvory", out: "images/seal-ivory.webp", width: 420, maxKB: 100 },
  { name: "velvet-wine", slot: "velvetTexture", out: "images/velvet-wine.webp", width: 1200, maxKB: 150 },
  { name: "paper-cream", slot: "paperTexture", out: "images/paper-cream.webp", width: 1200, maxKB: 150 },
  { name: "letter-paper", slot: "letterPaper", out: "images/letter-paper.webp", width: 900, maxKB: 200 },
  { name: "gold-foil", slot: "goldFoil", out: "images/gold-foil.webp", width: 1000, maxKB: 150 },
  { name: "venue", slot: "venuePhoto", out: "images/venue.webp", width: 900, photo: true, maxKB: 180 },
  { name: "couple", slot: "couplePhoto", out: "images/couple.webp", width: 900, photo: true, maxKB: 180 },
  { name: "dress-her", slot: "dressHer", out: "images/dress-her.webp", width: 700, photo: true, maxKB: 140 },
  { name: "dress-him", slot: "dressHim", out: "images/dress-him.webp", width: 700, photo: true, maxKB: 140 },
  {
    name: "share-bg",
    out: "images/share-bg.jpg",
    width: 1200,
    height: 630,
    jpeg: true,
    maxKB: 250,
    note: "Ask Claude to rebuild og-image.jpg (names + date) on top of this background.",
  },
];

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".tif", ".tiff"]);
const AUDIO_EXT = new Set([".mp3", ".m4a"]);
const IGNORE = new Set(["film-ruby2_couple-removed.mp4", ".gitkeep", "readme.txt"]);

// Gentle warm grade so real photos sit inside the wine-and-gold palette.
const WARM = [
  [1.05, 0.03, 0],
  [0.02, 1.0, 0],
  [0, 0.02, 0.93],
];

async function encode(spec, input) {
  for (let quality = 84; ; quality -= 6) {
    let img = sharp(input, { failOn: "none" }).rotate();
    img = spec.height
      ? img.resize(spec.width, spec.height, { fit: "cover", position: "attention" })
      : img.resize({ width: spec.width, withoutEnlargement: true });
    if (spec.photo) img = img.recomb(WARM);
    const buf = spec.jpeg
      ? await img.jpeg({ quality, mozjpeg: true }).toBuffer()
      : await img.webp({ quality, alphaQuality: 90, effort: 6 }).toBuffer();
    if (buf.length <= spec.maxKB * 1024 || quality <= 48) return { buf, quality };
  }
}

async function main() {
  let files;
  try {
    files = await readdir(INBOX);
  } catch {
    console.log(`No artwork-inbox/ folder found at ${INBOX}. Create it and drop artwork there.`);
    return;
  }

  const done = [];
  const unknown = [];
  await mkdir(path.join(PUBLIC, "images"), { recursive: true });

  for (const file of files) {
    if (IGNORE.has(file.toLowerCase())) continue;
    const ext = path.extname(file).toLowerCase();
    const base = path.basename(file, path.extname(file)).toLowerCase();
    const input = path.join(INBOX, file);

    if (AUDIO_EXT.has(ext) && base === "theme") {
      await mkdir(path.join(PUBLIC, "music"), { recursive: true });
      const out = `music/theme${ext}`;
      await copyFile(input, path.join(PUBLIC, out));
      done.push({ file, out, mediaMusic: true, kb: null });
      continue;
    }

    const spec = SPECS.find((s) => s.name === base);
    if (!spec || !IMAGE_EXT.has(ext)) {
      unknown.push(file);
      continue;
    }
    const { buf, quality } = await encode(spec, input);
    await writeFile(path.join(PUBLIC, spec.out), buf);
    done.push({ file, out: spec.out, slot: spec.slot, note: spec.note, kb: Math.round(buf.length / 1024), quality });
  }

  if (!done.length) {
    console.log("Nothing to optimise yet. Expected names: " + SPECS.map((s) => s.name).join(", ") + ", theme.mp3");
  }
  for (const d of done) {
    const size = d.kb == null ? "copied" : `${d.kb} KB @ q${d.quality}`;
    console.log(`✓ ${d.file} → public/${d.out} (${size})${d.note ? `\n    ${d.note}` : ""}`);
  }
  if (unknown.length) console.log(`\nSkipped (name not recognised): ${unknown.join(", ")}`);

  const slots = done.filter((d) => d.slot || d.mediaMusic);
  if (!slots.length) return;

  console.log("\nConfig slots (src/config/eventConfig.ts):");
  for (const d of slots) console.log(d.mediaMusic ? `  media.music: "${d.out}"` : `  artwork.${d.slot}: "${d.out}"`);

  if (APPLY) {
    let src = await readFile(CONFIG, "utf8");
    for (const d of slots) {
      const key = d.mediaMusic ? "music" : d.slot;
      src = src.replace(new RegExp(`(\\b${key}:\\s*)"[^"]*"`), `$1"${d.out}"`);
    }
    await writeFile(CONFIG, src);
    console.log("\nWrote these paths into eventConfig.ts.");
  } else {
    console.log("\nRun `npm run art -- --apply` to write them into eventConfig.ts automatically.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
