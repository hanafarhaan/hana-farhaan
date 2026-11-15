// Page title and social-sharing metadata, injected into index.html at build time (see vite.config.ts).
import { eventConfig as c } from "./eventConfig.ts";
import { dateLong, time12, weekday } from "../utils/dates.ts";

export function pageMeta(): Record<string, string> {
  const names = `${c.bride} & ${c.groom}`;
  const title = `${names} · Engagement · ${dateLong}`;
  const description =
    `${names}, together with their families, request the pleasure of your presence at their engagement. ` +
    `${weekday}, ${dateLong} at ${time12(c.startTime, { upper: true })}, ${c.venue.name}, ${c.venue.city}.`;
  return {
    TITLE: title,
    DESCRIPTION: description,
    URL: c.siteUrl,
    IMAGE: new URL(c.artwork.shareImage || "og-image.jpg", c.siteUrl).toString(),
    IMAGE_ALT: `${names}: engagement invitation, ${dateLong}`,
  };
}
