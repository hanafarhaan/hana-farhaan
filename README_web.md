# README_web — Website Build Spec

**Project:** Engagement invitation for **Hana & Farhaan**
**Live URL:** https://hanafarhaan.github.io/hana-farhaan/ (deploys from `main`; build on `dev`)
**Status:** Spec approved for build. Items marked **`[TBC]`** are placeholders to fill later via `src/config/eventConfig.ts`.

This file is the single source of truth for building the site. Hand it back to Claude with "build README_web.md".

---

## 0. References and ground rules

| Reference | What we take from it |
|---|---|
| `public/videos/film-ruby2_couple-removed.mp4` (8.8 s, 720×1280, 24 fps) | The **opening**, used as-is: glitter falls away → ruby velvet curtains → curtains part → spotlit stage with a diagonal beam, haze, theatre balcony and a glowing rose ring on a round platform. |
| https://invitations-agency.netlify.app/template-4/ | **Everything after the opening**: section order, layout, typography, colour rhythm, interactions and micro-animations. Mobile view is the master. |

**Ground rules**
- Match the template's **layout, structure, rhythm and interactions** as closely as possible.
- **Do not** download or reuse the template's own assets: its images, videos (`hall.mp4`), audio, `seal.png`, flower artwork or code. **Do not** copy its text word for word.
- **Artwork works in two layers** (full details in §10):
  1. **Coded basic version (built now):** every visual piece has a code-drawn version (SVG, CSS or canvas), so the whole site works and looks finished before any artwork exists.
  2. **Real artwork (swapped in later):** the user creates photographic or AI artwork from the [Artwork Brief](https://claude.ai/artifact/VVEaiFzgP6npYvGZFYY2y1) and drops it in `artwork-inbox/`. Claude optimises each file into `public/images/`, and the matching component uses it in place of the coded version. No code changes are needed beyond the optimisation step.
- Leave out the template's "Made with Invitations Agency" credit.
- Mobile first: design at **390×844**, test at 360×800, 375×812, 430×932, 768 and 1440 wide. No horizontal scroll. Tap targets ≥ 44 px.
- Respect `prefers-reduced-motion`: no scratch particles, no path drawing, no parallax; content shows instantly.
- Never invent names, addresses or family details. Use `[TBC]` placeholders from config.

---

## 1. Design system (from template-4)

### Colours
| Token | Hex | Use |
|---|---|---|
| `--wine` | `#4a0d1b` | Wine sections, primary buttons |
| `--wine-deep` | `#3f0a15` | Section shading, gradients |
| `--leather` | `#6d1023` | Cards, calendar box, scratch card |
| `--ink` | `#5c1224` | Headings and body text on cream |
| `--cream` | `#f6eee7` | Cream sections |
| `--satin` | `#f3ece1` | Letter paper, ticket |
| `--blush` | `#ecdcd4` | Soft dividers, input fills on cream |
| `--gold` | `#b8955b` | Rules, icons, borders, frames |
| `--gold-light` | `#d9bf8a` | Highlights, gradient gold text |
| `--onyx` | `#120407` | Opening/video background, ticket stub |

- Sections **alternate wine ↔ cream** (see order in §3).
- Wine sections have a subtle velvet texture (radial vignette plus faint grain). The whole page has a fixed, very light **noise overlay** canvas (≈4% opacity).

### Typography (Google Fonts)
| Role | Font | Notes |
|---|---|---|
| Section titles | **Bodoni Moda**, uppercase, letter-spacing ≈ 0.18em | e.g. "SAVE THE DATE", "THE DAY" |
| Italic sub-lines | **Bodoni Moda Italic** | e.g. "Sunday, the seventeenth of January" |
| Names and script | **Pinyon Script** | "Hana & Farhaan", letter signature, "For her / For him" |
| Body, labels, buttons | **Jost**, labels uppercase with 0.2em tracking | |
| Arabic | **Amiri** | Bismillah |

(Replace the current Great Vibes, Cormorant and DM Sans fonts.)

### Recurring ornaments and components
- **Section header ornament:** a thin gold rule with a small diamond in the centre (`—◆—`), above every section title.
- **Double gold frame:** cards use a 1 px gold border with an inner border inset by ~6 px.
- **Arched photo frame:** a tall arch-topped image with a thin gold outline offset around it (used for the venue and couple photos).
- **Buttons:** `btn--fill` is solid wine with cream uppercase Jost; `btn` is outlined. Min height 48 px.
- **Reveal on scroll (`.rv`):** elements fade up 16 px and unblur as they enter the viewport (IntersectionObserver, once).
- **Sticky RSVP bar:** a full-width wine bar fixed to the bottom, "REPLY TO THE INVITATION", with a gold double border. It appears after the opening, links to `#rsvp`, and hides once the RSVP section is in view or after the guest has replied.
- **Music button:** a small round gold-outlined button, fixed at top-right, with a note icon and an animated equaliser while playing. Music starts only after the guest taps open; the button toggles mute.

---

## 2. Opening sequence (replaces the current coded curtain)

### 2a. Cover (before any interaction)
- Full-screen. The background is the **first frame of the video** (exported as `public/videos/opening-poster.jpg`), a dense ruby glitter field.
- Centre: the existing **gold wax seal** (`WaxSeal.tsx`, H&F monogram) with a soft glowing pulse.
- Under the seal: "Hana & Farhaan" in Pinyon Script, then "TAP THE SEAL TO OPEN YOUR INVITATION" (Jost, small, tracked).
- Bottom: a small pill-shaped **SKIP** button that jumps straight to the final stage state.
- Page scroll stays locked until the opening finishes or the guest skips.

### 2b. Film
- On tap: the seal breaks (the existing break animation plus a gold spark burst), music starts if provided, and the **video plays muted, inline** (`playsInline muted`) full-screen with `object-fit: cover`. The tap gesture guarantees autoplay on iOS and Android.
- The video plays once and **freezes on its last frame**: the open curtains and spotlit stage.
- Desktop and wide screens: the video is centred at its portrait ratio, on a blurred, darkened copy of itself filling the sides.

### 2c. Stage text (overlay on the frozen stage)
Starts fading in at **~5.5 s** (when the curtains have cleared), staggered by 0.3 s per line, with a blur-to-sharp fade-up. It is centred in the upper two-thirds so the glowing ring stays visible below.

```
بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ                (Amiri, gold)
Bismillah ir-Rahman ir-Rahim                  (Bodoni Moda italic)
In the name of Allah, the Most Gracious, the Most Merciful   (Jost, small, muted)

            —◆—

Hana & Farhaan                                (Pinyon Script, large, gold gradient)

together with their families,
request the pleasure of your presence
at their engagement                           (Bodoni Moda italic)

SUNDAY · 17 JANUARY 2027 · 7:00 PM            (Jost, tracked)
BENGALURU

        ⌄  scroll                              (animated chevron)
```
- Soft gold dust drifts in the beam (reuse `useGlitter` with `drift`).
- The text needs a subtle dark radial scrim behind it for contrast against the bright beam (WCAG AA).
- After the text finishes, unlock scroll. Scrolling down reveals the rest of the site, which continues below the stage. The stage section is the page's hero, `#top`.

### 2d. Video optimisation (build step)
- Re-encode to H.264 MP4, ~540×960, CRF ~28, no audio track, `+faststart`. Target **≤ 2 MB**. Also export a WebM (VP9) version as a smaller alternative source.
- Export the poster (first frame) and a last-frame image `opening-stage.jpg`. The last-frame image is used for reduced-motion users (no video, straight to the stage with text) and as the fallback if the video fails to load.
- `preload="auto"` once the cover is shown. Show a subtle loading shimmer on the seal if the video isn't ready when tapped.

---

## 3. Sections after the opening (in order)

| # | Section | Bg | Template equivalent |
|---|---|---|---|
| 1 | Opening stage / hero (`#top`) | onyx (video) | cover + first |
| 2 | Letter from the families | cream | `envsec` |
| 3 | Save the date (scratch) | wine | scratch |
| 4 | Mark the day (calendar + countdown) | cream | `lux` |
| 5 | The evening (timeline) | wine | serpentine timeline |
| 6 | Where (venue, map, getting there) | cream | `venue2` |
| 7 | Dress code | wine | `dress2` |
| 8 | RSVP (`#rsvp`) | cream | rsvp |
| 9 | See you there | wine | `end` |
| 10 | Closing | cream | closing |

Removed from the template: Good to know carousel, FAQ, drinks question, personalised guest links.

### 2 · Letter from the families (cream)
- An **envelope** shaped like a cluster of deep-wine velvet petals, with a satin letter tucked in. Artwork: `envelope-flower.png` and `letter-paper.png`; coded fallbacks are in §10.
- **Scroll-linked:** as the section scrolls into view, the letter slides up out of the envelope. Hint below: *"Scroll to open the letter from us"*, which becomes *"Tap the letter to turn it over"*.
- **Tap the letter to flip it (3D):** the front is the letter text and the back is a monogram seal with "Hana & Farhaan".
- Letter text (Bodoni Moda italic heading, Jost body):
  > **Dear family & friends,**
  > With hearts full of gratitude to Allah, we are delighted to share that Hana and Farhaan are getting engaged. We would be honoured to celebrate this blessed beginning with the people dearest to us. Your presence and duas would mean the world to us.
  > *With love,*
  > *The `[TBC: Bride's family name]` & `[TBC: Groom's family name]` families* (Pinyon Script)

### 3 · Save the date: scratch card (wine)
- Title: SAVE THE DATE.
- A double-framed leather card covered by a **gold foil scratch layer** (canvas) reading *"Brush to reveal the date"*, *"WITH YOUR FINGER"*.
- Brushing with a finger or mouse erases the foil with a soft round brush and gold flakes. When ~55% is cleared, the rest fades away and a gentle gold confetti burst plays.
- Revealed: **17 · 01 · 2027** (Bodoni Moda, large), then *"at seven in the evening"*.
- An accessible underlined button *"Show the date without brushing"* reveals it instantly. It also works for keyboard and reduced-motion users.

### 4 · Mark the day: calendar and countdown (cream)
- Title: MARK THE DAY.
- A leather calendar box with a gold diamond at the top centre: `‹ JANUARY 2027 ›`, weekday header MO–SU, and a day grid. **17** is circled in gold with a soft pulse. The arrows can page months, and the view snaps back to January.
- Line: *"Sunday, the seventeenth of January at seven in the evening"*.
- **Live countdown:** DAYS · HOURS · MINUTES · SECONDS to `2027-01-17T19:00:00+05:30`, using the timezone from config. Digits roll or flip on change. When the time is reached, it is replaced with *"Today we celebrate · Alhamdulillah"*.
- **ADD TO CALENDAR** (`btn--fill`) opens a small menu: Google Calendar link, or Apple/Outlook (downloads an `.ics`). Event: "Hana & Farhaan's Engagement", 7:00 PM to `[TBC: end time, default 11:00 PM]` IST, location = venue name and address.

### 5 · The evening: timeline (wine)
- Title: THE EVENING.
- A **serpentine gold line** winds down the section and **draws itself as you scroll** (SVG `stroke-dashoffset` tied to scroll progress). Items alternate left and right along the curve. Each has a circular gold icon badge, a time in Pinyon Script, a title in tracked Bodoni caps and a sub-line in italics. Items light up as the line reaches them; items not yet reached are dimmed.
- Draft schedule, editable in config:

| Time | Title | Sub-line | Icon |
|---|---|---|---|
| 7:00 pm | GUESTS ARRIVE | Welcome mocktails | coupe glass |
| 7:45 pm | RING CEREMONY | The moment we've waited for | rings |
| 8:30 pm | FAMILY PHOTOGRAPHS | Smile, it's a celebration | camera |
| 9:00 pm | DINNER | Dinner is served | cloche / dinner |
| 10:30 pm | CELEBRATIONS CONTINUE | Late into the night | moon / sparkle |

- Icons are our own simple line SVGs (stroke = gold, 1.25 px).

### 6 · Where (cream)
- Title: WHERE.
- **Arched venue photo** with a gold outline (placeholder `public/images/venue.webp` `[TBC]`), with a slow parallax zoom on scroll.
- Venue name: **MUKTA, CHAMARA VAJRA** (Bodoni caps, wide tracking).
- Address: *`[TBC: full address]`, Bengaluru* (italic).
- *"Sunday, the seventeenth of January, from seven o'clock"*.
- Buttons: **GET DIRECTIONS** (`btn--fill`, opens Google Maps directions to `config.mapsUrl` or `[TBC]`) and **ADD TO CALENDAR** (`btn`).
- **Embedded Google Map** (iframe, lazy-loaded, desaturated cream style via CSS filter, with a custom wine pin overlay). It shows a styled placeholder card until `config.mapsEmbedUrl` / coordinates are filled.
- **Getting there**: two columns with line icons and a centre divider:
  - **BY CAR:** `[TBC: parking details]`
  - **BY CAB:** `[TBC: e.g. drop-off point / landmark]`

### 7 · Dress code (wine)
- Title: DRESS CODE. Sub: *"Cocktail elegance in jewel tones"*.
- **Swatches** (gem-cut octagon shapes with a gold rim and labels in italics): Wine `#4a0d1b` · Ruby `#9b1428` · Emerald `#0f5a46` · Champagne `#d9bf8a` · Onyx `#120407`.
- Two **tilted polaroid-style photos** with gold frames, captioned in Pinyon Script **For her** / **For him** (placeholders `public/images/dress-her.webp`, `dress-him.webp` `[TBC]`). On scroll they settle from a slight rotation.
- Text blocks separated by gold rules:
  - **FOR HER:** Cocktail dresses, sarees or shararas in rich jewel tones.
  - **FOR HIM:** A sharp suit, bandhgala or sherwani; dark tones welcome.
  - **KINDLY AVOID:** `[TBC: e.g. all-white outfits]` (hide this block if left empty in config).

### 8 · RSVP (cream, `#rsvp`)
- Title: WILL YOU JOIN US? Sub: *"Kindly reply at your earliest convenience"*.
- Underlined fields (Jost labels uppercase, small):
  1. **YOUR FULL NAME** (required). Error: *"Please write your name so we know who replied"*.
  2. **WILL YOU COME?** (required, styled radio cards): *Yes, I will be there* · *Sadly, I can't come* · *I'll reply a bit later*. Error: *"Please choose one option"*.
  3. **PHONE OR WHATSAPP FOR REMINDERS** (optional, `tel`). Helper: *"Only for a reminder a week before and to share photos after"*.
  4. **A WISH FOR THE COUPLE** (optional textarea, max 500 characters).
- **SEND MY REPLY** (`btn--fill btn--wide`). While submitting, it shows a spinner and disabled state. On error: *"Something went wrong, please try again"*, and the form data is kept.
- Duplicate guard: disable the button while sending; save `{name, reply, timestamp}` in `localStorage` after success.
- **On success**, the form is replaced by:
  - A thank-you line: *"Thank you for being a part of our happiness. We can't wait to celebrate with you!"* (or a gentle variant for "can't come" / "later").
  - A gold confetti burst (for "Yes" only).
  - An **admit-one ticket**: a satin ticket with a perforated stub. It reads ADMIT · *[guest name]* · DATE 17.01.2027 · TIME 7 pm · PLACE Mukta, Chamara Vajra · DRESS CODE Cocktail, jewel tones, with "Hana & Farhaan" in script.
  - **Save the ticket to my phone**: renders the ticket to PNG (canvas) and triggers a download / share sheet (`navigator.share` with a file where supported).
  - **Change my reply**: reopens the form pre-filled. Re-submitting sends a new row marked `update`.
- Backend: **Google Sheets via Apps Script** (§5).

### 9 · See you there (wine)
- **Arched couple photo** (placeholder `public/images/couple.webp` `[TBC]`) with an offset gold outline, and the **wax seal** (our SVG, in ivory/silver wax with the H&F monogram) overlapping the bottom of the arch.
- SEE YOU THERE (Bodoni caps) · **Hana & Farhaan** (Pinyon Script) · *Sunday, the seventeenth of January 2027* · MUKTA, CHAMARA VAJRA.

### 10 · Closing (cream)
- A wine velvet **flower** (`closing-flower.png`, coded fallback in §10), gently swaying.
- *"Thank you for being part of our story"* · *With love,* · **Hana & Farhaan** (script).
- Small Amiri line: الْحَمْدُ لِلَّهِ.
- Optional: a "Watch the opening again" text button that scrolls to the top and replays the film.

---

## 4. Global behaviour

- **Music:** `public/music/theme.mp3` `[TBC: user will supply]`. Plays after the seal tap at volume 0.5 with a 2 s fade in. The toggle is persistent. If the file is missing, hide the button.
- **Confetti canvas:** shared, fixed, `pointer-events: none`. Used by the scratch reveal and an RSVP "yes".
- **Scroll behaviour:** native smooth scroll; no scroll-jacking. The opening's scroll lock releases after the text animation or on Skip.
- **Performance:** lazy-load all images and the map; WebP/AVIF images ≤ 200 KB each; video ≤ 2 MB; fonts with `display=swap` and only the needed weights. Target Lighthouse mobile performance ≥ 85 and accessibility ≥ 95.
- **SEO and sharing** (`index.html`): title "Hana & Farhaan · Engagement · 17 January 2027"; description; `theme-color` `#4a0d1b`; Open Graph and Twitter tags with a **1200×630 share image** (`public/og-image.jpg`: the spotlit stage frame with the names and date, generated at build time or designed once). Favicon: the H&F seal.

---

## 5. RSVP → Google Sheets

**Architecture:** form → `fetch(POST)` → Google Apps Script Web App → appends a row to the Google Sheet.

- Request: `Content-Type: text/plain;charset=utf-8` (avoids the CORS preflight). The body is JSON: `{ name, attendance, phone, wish, type: "new"|"update", userAgent }`.
- Sheet `RSVP` columns: **A** Timestamp · **B** Guest name · **C** Attendance (`Yes` / `No` / `Later`) · **D** Phone · **E** Wish · **F** Type (`new`/`update`).
- Apps Script (`apps-script/Code.gs`) must:
  - Validate (name 1–100 characters; attendance in the allowed set; phone ≤ 20 characters `[0-9+ ()-]`; wish ≤ 500).
  - Strip leading `= + - @` so values can't be read as formulas, and trim everything.
  - Use `LockService` to prevent concurrent writes, then append the row.
  - Return JSON `{ ok: true }` or `{ ok: false, error }`.
  - Deploy as Web app: *Execute as: Me*, *Who has access: Anyone*.
- The endpoint URL lives only in `eventConfig.rsvpEndpoint`. No keys in the repo.
- If `rsvpEndpoint` is empty, the form shows a clear "RSVP not connected yet" message in dev and does not pretend to succeed.
- Include `apps-script/SETUP.md`: create the sheet, paste the script, deploy, copy the URL into config, test.

---

## 6. Central config (`src/config/eventConfig.ts`)

All copy and data come from here. Components never hard-code names or dates.

```ts
export const eventConfig = {
  bride: "Hana",
  groom: "Farhaan",
  monogram: "H&F",
  families: { bride: "[TBC]", groom: "[TBC]" },

  date: "2027-01-17",
  startTime: "19:00",
  endTime: "23:00",            // [TBC]
  timezone: "Asia/Kolkata",
  utcOffset: "+05:30",

  venue: {
    name: "Mukta, Chamara Vajra",
    address: "[TBC]",
    city: "Bengaluru",
    mapsUrl: "",               // [TBC] Google Maps share link
    mapsEmbedUrl: "",          // [TBC] embed src
    gettingThere: { byCar: "[TBC]", byCab: "[TBC]" },
  },

  schedule: [ /* time, title, subtitle, icon: 'coupe'|'rings'|'camera'|'dinner'|'moon' */ ],

  dressCode: {
    headline: "Cocktail elegance in jewel tones",
    swatches: [ { name: "Wine", hex: "#4a0d1b" }, /* … */ ],
    her: "…", him: "…", avoid: "",   // empty = hidden
  },

  letter: { greeting: "Dear family & friends,", body: "…", signOff: "With love," },
  rsvp: { endpoint: "", replyBy: "" },   // empty replyBy → "at your earliest convenience"
  media: {
    openingVideo: "videos/opening.mp4",
    openingVideoWebm: "videos/opening.webm",
    openingPoster: "videos/opening-poster.jpg",
    openingStage: "videos/opening-stage.jpg",
    music: "",                      // "music/theme.mp3" once supplied; empty = no music button
  },

  // Artwork slots: "" = use the coded fallback (§10). Claude fills each path when the optimised file exists.
  artwork: {
    envelopeFlower: "",   // images/envelope-flower.webp
    closingFlower: "",    // images/closing-flower.webp
    sealGold: "",         // images/seal-gold.webp
    sealIvory: "",        // images/seal-ivory.webp
    velvetTexture: "",    // images/velvet-wine.webp
    paperTexture: "",     // images/paper-cream.webp
    letterPaper: "",      // images/letter-paper.webp
    goldFoil: "",         // images/gold-foil.webp
    venuePhoto: "",       // images/venue.webp
    couplePhoto: "",      // images/couple.webp
    dressHer: "",         // images/dress-her.webp
    dressHim: "",         // images/dress-him.webp
    shareImage: "",       // og-image.jpg (1200×630)
  },
  theme: { /* colour tokens from §1 */ },
};
```
All media paths must resolve against `import.meta.env.BASE_URL` (the site is served under `/hana-farhaan/`).

---

## 7. Code structure

```
src/
  config/eventConfig.ts
  components/
    opening/  Cover.tsx · OpeningFilm.tsx · StageText.tsx · WaxSeal.tsx (existing)
    sections/ Letter.tsx · ScratchDate.tsx · MarkTheDay.tsx · Timeline.tsx · Venue.tsx
              DressCode.tsx · RSVP.tsx · Ticket.tsx · SeeYouThere.tsx · Closing.tsx
    ui/       SectionHeader.tsx · ArchFrame.tsx · Button.tsx · StickyRsvpBar.tsx
              MusicToggle.tsx · Reveal.tsx · Confetti.tsx · NoiseOverlay.tsx · Icons.tsx
  hooks/      useGlitter.ts (existing) · useCountdown.ts · useScrollProgress.ts · useReducedMotion
  utils/      calendar.ts (ics + Google link) · rsvpClient.ts · ticketToPng.ts
  styles/     tokens.css · base.css · sections/*.css
    art/      Artwork.tsx (slot → image or fallback) · VelvetFlower.tsx · EnvelopeFlower.tsx
              LetterCard.tsx · SealArt.tsx · Textures.ts · Monogram.tsx · PhotoPlaceholder.tsx
apps-script/  Code.gs · SETUP.md
scripts/      optimize-art.mjs   (artwork-inbox → public/images, via sharp)
artwork-inbox/                   (raw drops from the user; git-ignored)
public/       videos/ · images/ · music/ · og-image.jpg · favicon.svg
```
- Remove the old ivory sections and unused files: `App.css`, the empty legacy components, `EntranceScreen.tsx` / `dissolveCurtain.ts` (superseded by the film), and `src/assets/react.svg` / `vite.svg`.
- Keep `start.bat`, the `vite.config.ts` base path and `.github/workflows/deploy.yml`.

---

## 8. Build order and acceptance checks

1. Design tokens, fonts, base layout, the section header component, and the **artwork system** (`<Artwork>` slots plus all coded fallbacks from §10, and `npm run art`).
2. Opening: video optimisation → cover with seal → film → stage text → skip and reduced-motion paths.
3. Sections 2 → 10 in order, each checked at 390×844 before moving on.
4. Global: sticky RSVP bar, music, confetti, noise overlay, reveal-on-scroll.
5. RSVP plus Apps Script, tested against a real sheet (success, validation error, network error).
6. SEO and OG image.
7. QA: all listed viewports, keyboard navigation, reduced motion, Lighthouse, no console errors. Then push to `dev`, review, and merge to `main` to go live.

**Done when:** the opening plays smoothly on a mid-range phone; every section matches the template's layout and interactions at 390 px; the RSVP writes a row to the sheet; the WhatsApp preview shows the share image; and no `[TBC]` remains except the ones listed below.

---

## 9. Open items `[TBC]` (to collect before launch)

| Item | Where used |
|---|---|
| Bride's and groom's family names | Letter signature |
| Event end time (default 11:00 PM) | Add to calendar |
| Full venue address + Google Maps link / embed | Where section, directions, calendar |
| Parking and cab notes | Getting there |
| "Kindly avoid" dress-code note (optional) | Dress code |
| Artwork from the brief (flowers, seals, textures, letter card, gold foil) | See §10; coded fallbacks are used until then |
| Photos: venue, couple, for her, for him | Where, See you there, Dress code |
| Music track (MP3, licensed or original, ≤ 3 MB) | Global |
| Google Sheet + Apps Script deployment URL | RSVP |
| Confirm the schedule times and titles | The evening |

---

## 10. Artwork: coded basics now, real artwork later

**Artwork Brief (file names, sizes, AI prompts):** https://claude.ai/artifact/VVEaiFzgP6npYvGZFYY2y1
**Drop folder:** `engagement-invitation/artwork-inbox/` (git-ignored; never deployed)

### How the swap works
- Every visual piece is an **artwork slot**, rendered by `<Artwork slot="…" />`. If `eventConfig.artwork[slot]` has a path, it renders that optimised image (`<picture>`, WebP, lazy-loaded, fixed aspect ratio so nothing shifts). If it's empty, it renders the coded fallback below.
- `scripts/optimize-art.mjs` (npm script `npm run art`) reads `artwork-inbox/`, matches files by name, then resizes, converts to WebP (JPG for the OG image) and writes to `public/images/`. It prints which config slots to fill in. Targets: textures ≤ 150 KB, transparent PNG art ≤ 200 KB, photos ≤ 180 KB.
- Real photos (venue, couple, outfits) get the same treatment plus a gentle warm tone so they sit in the palette.

### Coded basic version for each slot (build these now)
| Slot / file | Where | Coded basic version |
|---|---|---|
| `envelopeFlower` · envelope-flower.png | Letter | SVG dome of ~24 overlapping teardrop petals in 3 rows. Each petal has a radial gradient (`#2a0610` edge → `#6d1023` → `#8e1a2e` highlight), a hairline gold rim on the top row and a soft inner shadow, plus an SVG `feTurbulence` grain filter for a velvet feel. It is split into back and front layers so the letter can slide between them. |
| `closingFlower` · closing-flower.png | Closing | SVG rosette: 5 concentric rings of rotated petals (same gradients and grain), gold-tipped inner petals, a dark core. A slow ±2° sway (CSS) when motion is allowed. |
| `letterPaper` · letter-paper.png | Letter | CSS card: `--satin` fill, faint paper grain (inline SVG noise at 6%), a deckled edge via an SVG `clip-path` with a slightly irregular outline, a gold double rule inset 10 px, and a soft drop shadow. |
| `sealGold` · seal-gold.png | Opening cover | The existing `WaxSeal.tsx` (gold gradient wax blob, bevelled stamp ring, embossed monogram). The monogram is always code, also on top of the real seal image. |
| `sealIvory` · seal-ivory.png | See you there | `WaxSeal.tsx` with an ivory palette (`#fbf6ee` → `#e8dccb` → `#b9a88e`) and a champagne monogram. |
| `velvetTexture` · velvet-wine.jpg | All wine sections | CSS layers: a base `--wine`, two large soft radial highlights (crushed-velvet sheen), a vignette, and an inline-SVG `feTurbulence` noise at ~8% `overlay`. |
| `paperTexture` · paper-cream.jpg | All cream sections | Base `--cream` + inline-SVG fibre noise at ~5% `multiply` + a very faint warm vignette. |
| `goldFoil` · gold-foil.jpg | Scratch card | Canvas fill: a diagonal linear gradient `#8a6a35 → #e9d29c → #b8955b → #f3e2b3 → #9c7a40`, plus random fine crinkle lines and noise drawn once. |
| `venuePhoto`, `couplePhoto` | Where, See you there | `PhotoPlaceholder`: an arch-shaped wine velvet panel with the H&F monogram in gold script and a small caption "Photo coming soon" (visible only in dev). |
| `dressHer`, `dressHim` | Dress code | `PhotoPlaceholder` in polaroid frames showing a simple gold line-art silhouette (dress / suit) on velvet. |
| `shareImage` · og-image.jpg | WhatsApp / social preview | Generated at build time from `opening-stage.jpg` (last video frame) with "Hana & Farhaan" + "17 · 01 · 2027" set in gold over it, 1200×630. |
| Ornaments, frames, arches, icons, calendar | Everywhere | Always code (SVG/CSS); nothing to supply. |

### Quality bar for the coded versions
- The coded versions must look intentional and finished, never like a grey "image missing" box: same palette, gold hairlines and soft lighting as the brief.
- No visible change in layout or size when a real image replaces a fallback. Both use the same aspect-ratio box.
- Fallback SVGs are inline React components (no extra network requests) and skip their animations under reduced motion.

---

## 11. Build notes (first build, 2026-11-16)

Built on `dev` from this spec. Where the implementation differs from the text above:

- **Opening video:** shipped as MP4 only (1.3 MB). The VP9/WebM encode came out larger than the MP4, so it was dropped. The original 5.6 MB film was moved from `public/videos/` to `artwork-inbox/` so it isn't deployed.
- **Folders:** helpers live in `src/utils/` (dates, calendar, RSVP client, ticket PNG, confetti, music, reveal). Reveal-on-scroll is a small `reveal` ref helper rather than a `Reveal.tsx` component. Buttons are CSS classes (`.btn`, `.btn--fill`) rather than a `Button.tsx` component. The monogram is drawn inside `SealArt.tsx` and `LineArt.tsx`.
- **Noise overlay:** a static CSS grain layer instead of a canvas, which is cheaper on phones and looks the same.
- **Dependencies:** `framer-motion` and `lucide-react` were removed (all animation is CSS and canvas; icons are hand-drawn SVG). `sharp` was added as a dev dependency for `npm run art`.
- **Placeholders shown to guests:** an empty address shows only the city; empty parking and cab notes show "Details to follow"; TBC family names sign the letter "The families of Hana & Farhaan"; the "Kindly avoid" block hides when empty; "Get directions" opens a Google Maps search for the venue until `mapsUrl` is set; the map shows a styled placeholder until `mapsEmbedUrl` is set.
- **RSVP:** after a successful reply it is remembered on that phone (localStorage), so returning guests see their ticket and the sticky bar stays hidden. The ticket is shown for "Yes" replies only.
- **Add to calendar:** the menu opens upward, because the next section would otherwise cover it.
- **Textures:** the coded velvet and paper textures are pre-rendered WebP tiles (`public/textures/`, about 70 KB, made by `scripts/make-textures.mjs`) instead of live SVG noise. Rendering the noise live cost phones about 3 seconds of main-thread time.
- **Lighthouse (mobile, production build):** Performance 97 · Accessibility 100 · Best Practices 100 · SEO 100 (LCP 1.6 s, TBT 170 ms, CLS 0).
- **Supplied artwork (2026-11-16):** the cream and maroon section backgrounds and the rose envelope came from the user's images (originals kept in `artwork-inbox/`). The backgrounds are full-resolution WebP (about 160 KB each), shown with `background-size: cover` and attached after page load. The rose is used as a single image: the letter rises from behind it and finishes tucked under the top petals, with extra blank paper at the bottom so no text is hidden. Colour tokens `--cream` and `--wine` were matched to the images' average colours. `start.bat` now serves on port 4173.
- **Changes on 2026-11-18 (requested):** the opening cover's glitter backdrop was replaced with draped oxblood satin recreated in CSS from the user's reference (tapered diagonal folds, fine weave, slow sheen; no glitter), with a divider between the names and "Tap the seal". The user's ivory "H&F" wax seal (`seal-ivory.webp`, 43 KB) is used for every seal (cover, back of the letter, see you there, ticket and the saved ticket image) and as the favicon. Because it already carries the monogram, the coded monogram is no longer drawn on top of real seal artwork. The sticky "Reply to the invitation" bar and the "By car / By cab" notes were removed at the user's request. The glitter poster frame (`opening-poster.jpg`) is no longer used and was deleted.
