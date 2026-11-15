/**
 * Central configuration for the invitation.
 * Every name, date, place and piece of copy on the site comes from here.
 * Values marked TBC are placeholders: the site shows a graceful fallback until they're filled.
 */

export const TBC = "[TBC]";

export type ScheduleIcon = "coupe" | "rings" | "camera" | "dinner" | "moon";

export type ArtworkSlot =
  | "envelopeFlower"
  | "closingFlower"
  | "sealGold"
  | "sealIvory"
  | "velvetTexture"
  | "paperTexture"
  | "letterPaper"
  | "goldFoil"
  | "venuePhoto"
  | "couplePhoto"
  | "dressHer"
  | "dressHim"
  | "shareImage";

export interface EventConfig {
  siteUrl: string;
  bride: string;
  groom: string;
  monogram: string;
  families: { bride: string; groom: string };

  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm, 24h, local to `timezone`
  endTime: string; // HH:mm
  timezone: string;
  utcOffset: string; // e.g. +05:30

  stage: {
    arabic: string;
    transliteration: string;
    meaning: string;
    invitation: string[];
  };

  venue: {
    name: string;
    address: string;
    city: string;
    mapsUrl: string; // Google Maps share link
    mapsEmbedUrl: string; // Google Maps embed src
    gettingThere: { byCar: string; byCab: string };
  };

  schedule: { time: string; title: string; subtitle: string; icon: ScheduleIcon }[];

  dressCode: {
    headline: string;
    swatches: { name: string; hex: string }[];
    her: string;
    him: string;
    avoid: string; // empty = hidden
    ticketLabel: string;
  };

  letter: { greeting: string; body: string; signOff: string };

  rsvp: {
    endpoint: string; // Google Apps Script Web App URL
    replyBy: string; // empty = "at your earliest convenience"
  };

  closing: { thanks: string; signOff: string; dua: string };

  media: {
    openingVideo: string;
    openingPoster: string;
    openingStage: string;
    music: string; // empty = no music button
  };

  /** "" = use the coded fallback. Fill with the optimised path once `npm run art` has produced it. */
  artwork: Record<ArtworkSlot, string>;

  theme: Record<string, string>;
}

export const eventConfig: EventConfig = {
  siteUrl: "https://hanafarhaan.github.io/hana-farhaan/",

  bride: "Hana",
  groom: "Farhaan",
  monogram: "H&F",
  families: { bride: TBC, groom: TBC },

  date: "2027-01-17",
  startTime: "19:00",
  endTime: "23:00", // TBC: confirm the end time
  timezone: "Asia/Kolkata",
  utcOffset: "+05:30",

  stage: {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    transliteration: "Bismillah ir-Rahman ir-Rahim",
    meaning: "In the name of Allah, the Most Gracious, the Most Merciful",
    invitation: [
      "together with their families,",
      "request the pleasure of your presence",
      "at their engagement",
    ],
  },

  venue: {
    name: "Mukhta, Chamara Vajra",
    address: TBC,
    city: "Bengaluru",
    mapsUrl: "",
    mapsEmbedUrl: "",
    gettingThere: { byCar: TBC, byCab: TBC },
  },

  schedule: [
    { time: "19:00", title: "Guests arrive", subtitle: "Welcome mocktails", icon: "coupe" },
    { time: "19:45", title: "Ring ceremony", subtitle: "The moment we’ve waited for", icon: "rings" },
    { time: "20:30", title: "Family photographs", subtitle: "Smile, it’s a celebration", icon: "camera" },
    { time: "21:00", title: "Dinner", subtitle: "Dinner is served", icon: "dinner" },
    { time: "22:30", title: "Celebrations continue", subtitle: "Late into the night", icon: "moon" },
  ],

  dressCode: {
    headline: "Cocktail elegance in jewel tones",
    swatches: [
      { name: "Wine", hex: "#4a0d1b" },
      { name: "Ruby", hex: "#9b1428" },
      { name: "Emerald", hex: "#0f5a46" },
      { name: "Champagne", hex: "#d9bf8a" },
      { name: "Onyx", hex: "#120407" },
    ],
    her: "Cocktail dresses, sarees or shararas in rich jewel tones.",
    him: "A sharp suit, bandhgala or sherwani; dark tones welcome.",
    avoid: "", // e.g. "All-white outfits." Leave empty to hide.
    ticketLabel: "Cocktail, jewel tones",
  },

  letter: {
    greeting: "Dear family & friends,",
    body:
      "With hearts full of gratitude to Allah, we are delighted to share that Hana and Farhaan are getting engaged. " +
      "We would be honoured to celebrate this blessed beginning with the people dearest to us. " +
      "Your presence and duas would mean the world to us.",
    signOff: "With love,",
  },

  rsvp: {
    endpoint: "", // TBC: paste the Apps Script Web App URL (see apps-script/SETUP.md)
    replyBy: "",
  },

  closing: {
    thanks: "Thank you for being part of our story",
    signOff: "With love,",
    dua: "الْحَمْدُ لِلَّهِ",
  },

  media: {
    openingVideo: "videos/opening.mp4",
    openingPoster: "videos/opening-poster.jpg",
    openingStage: "videos/opening-stage.jpg",
    music: "", // "music/theme.mp3" once supplied
  },

  artwork: {
    envelopeFlower: "", // images/envelope-flower.webp
    closingFlower: "", // images/closing-flower.webp
    sealGold: "", // images/seal-gold.webp
    sealIvory: "", // images/seal-ivory.webp
    velvetTexture: "", // images/velvet-wine.webp
    paperTexture: "", // images/paper-cream.webp
    letterPaper: "", // images/letter-paper.webp
    goldFoil: "", // images/gold-foil.webp
    venuePhoto: "", // images/venue.webp
    couplePhoto: "", // images/couple.webp
    dressHer: "", // images/dress-her.webp
    dressHim: "", // images/dress-him.webp
    shareImage: "og-image.jpg",
  },

  theme: {
    "--wine": "#4a0d1b",
    "--wine-deep": "#3f0a15",
    "--leather": "#6d1023",
    "--ink": "#3a0a14",
    "--cream": "#f6eee7",
    "--satin": "#f3ece1",
    "--blush": "#ecdcd4",
    "--gold": "#b8955b",
    "--gold-light": "#d9bf8a",
    "--onyx": "#120407",
  },
};

/** True when a config value is still a placeholder. */
export const isTbc = (value: string | undefined | null) => !value || value.trim() === "" || value.includes(TBC);
