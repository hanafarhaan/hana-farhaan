# Hana & Farhaan · Engagement Invitation

A cinematic, mobile-first digital invitation. An ivory wax seal on draped oxblood satin opens onto a velvet curtain film, Bismillah appears in the spotlight, and the guest scrolls through the letter, the date, the evening, the venue, the dress code and the RSVP.

**Live:** https://hanafarhaan.github.io/hana-farhaan/ (published from the `main` branch)
**Build spec:** [README_web.md](README_web.md) · **Artwork brief:** https://claude.ai/artifact/VVEaiFzgP6npYvGZFYY2y1

---

## Preview it on your computer

Double-click **`start.bat`**. It starts the site with live reload and opens http://localhost:4173. Run it again to stop it.

Or from a terminal:

```bash
npm install     # first time only
npm run dev -- --port 4173   # http://localhost:4173 (same as start.bat)
npm run build   # production build into dist/
```

## Change names, dates, venue or wording

Everything lives in **[`src/config/eventConfig.ts`](src/config/eventConfig.ts)**, so no component needs editing.

| What | Field |
|---|---|
| Names, monogram, family names (letter signature) | `bride`, `groom`, `monogram`, `families` |
| Date, start/end time, timezone | `date`, `startTime`, `endTime`, `timezone`, `utcOffset` |
| Bismillah + invitation lines on the stage | `stage` |
| Venue name, address, Google Maps link and map embed | `venue` |
| The evening's schedule (time, title, line, icon) | `schedule` |
| Dress code headline, swatches, her/him/avoid | `dressCode` |
| Letter text | `letter` |
| RSVP endpoint and "reply by" date | `rsvp` |
| Music, opening film and stills | `media` |
| Real artwork (replaces the coded versions) | `artwork` |

Values marked `[TBC]` show a graceful fallback (for example "Details to follow") until you fill them. The page title and the WhatsApp preview text are generated from the same config at build time.

## Artwork

Every visual has a **coded version** (velvet petals, wax seals, paper, foil, photo placeholders), so the site always looks finished. To use real artwork:

1. Make the pieces listed in the [Artwork Brief](https://claude.ai/artifact/VVEaiFzgP6npYvGZFYY2y1), using its exact file names.
2. Drop them into **`artwork-inbox/`**. This folder is private and git-ignored.
3. Run `npm run art -- --apply`. It compresses each file into `public/images/` and fills in the matching `artwork` slots in the config.

Real photos (venue, couple, outfits) get a gentle warm tone so they sit in the palette. A track named `theme.mp3` in the inbox becomes the background music.

## RSVP → Google Sheets

Replies go to a Google Sheet you own, through a small Google Apps Script. Follow **[apps-script/SETUP.md](apps-script/SETUP.md)** (about 10 minutes), then paste the Web app URL into `rsvp.endpoint`. Until then, the form tells guests that replies aren't open yet; it never pretends to succeed.

## Publishing

- Work happens on the **`dev`** branch. Pushing `dev` does not change the live site.
- Merging into **`main`** publishes automatically through GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)), usually within a minute or two.
- The site is served from `/hana-farhaan/`. If the repository is ever renamed, update `base` in [vite.config.ts](vite.config.ts) and `siteUrl` in the config.

## How it's built

React 19 + TypeScript + Vite, with plain CSS (no UI framework or animation library).

```
src/
  config/        eventConfig.ts (all content) · meta.ts (title + sharing tags)
  components/
    opening/     Cover (seal) · OpeningFilm (video, stage, skip, replay) · StageText · WaxSeal
    sections/    Letter · ScratchDate · MarkTheDay · Timeline · Venue · DressCode · RSVP · Ticket · SeeYouThere · Closing
    art/         Artwork slots + coded fallbacks (EnvelopeFlower, VelvetFlower, LetterCard, SealArt, Textures…)
    ui/          SectionHeader · ArchFrame · AddToCalendar · MusicToggle · Confetti · Icons
  hooks/         countdown, scroll progress, glitter, reduced motion, scroll lock
  utils/         dates, calendar (.ics + Google), RSVP client, ticket → PNG, confetti, music
  styles/        tokens · base · ui · art · sections/*
apps-script/     Code.gs + SETUP.md (RSVP backend)
scripts/         optimize-art.mjs (npm run art) · make-textures.mjs (velvet/paper tiles)
public/          videos/ (opening film + stills) · textures/ · og-image.jpg · favicon.svg
```

- **Opening film:** `public/videos/opening.mp4`, 1.3 MB at 540×960, re-encoded from the original in `artwork-inbox/`. The poster and stage stills are its first and last frames.
- **WhatsApp preview:** `public/og-image.jpg` (1200×630), rendered from the stage still with the names and date. Ask Claude to regenerate it if names or the date change.
- **Textures:** the coded velvet and paper textures are pre-rendered tiles in `public/textures/` (about 70 KB in total). To change a recipe, edit `scripts/make-textures.mjs` and run `node scripts/make-textures.mjs`.
- **Accessibility:** keyboard-reachable controls, labelled form fields, and a reduced-motion mode that skips the film and the animations.
- **Lighthouse (mobile, production build):** Performance 97 · Accessibility 100 · Best Practices 100 · SEO 100.
