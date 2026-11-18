// Texture layers for the velvet and paper sections. Coded textures are small pre-rendered tiles in
// public/textures/ (see scripts/make-textures.mjs). Real artwork (eventConfig.artwork) is layered on top,
// and is attached only after the page has loaded: the sections sit behind the cover until the seal is
// tapped, so deferring them keeps the first screen fast without any visible change.
import { eventConfig } from "../../config/eventConfig";
import { asset } from "../../utils/asset";

const url = (path: string) => `url("${asset(path)}")`;

export function applyTextures() {
  const root = document.documentElement.style;
  root.setProperty("--tex-velvet-dark", url("textures/velvet-dark.webp"));
  root.setProperty("--tex-velvet-sheen", url("textures/velvet-sheen.webp"));
  root.setProperty("--tex-velvet-grain", url("textures/grain.webp"));
  root.setProperty("--tex-paper-mottle", url("textures/paper-mottle.webp"));
  root.setProperty("--tex-paper-grain", url("textures/grain.webp"));
  root.setProperty("--tex-film-grain", url("textures/grain.webp"));

  const art = eventConfig.artwork;
  const attachArtwork = () => {
    root.setProperty("--tex-velvet-img", art.velvetTexture ? url(art.velvetTexture) : "none");
    root.setProperty("--tex-paper-img", art.paperTexture ? url(art.paperTexture) : "none");
  };
  const whenIdle = () => {
    // Safari has no requestIdleCallback; a short timeout does the same job there.
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(attachArtwork, { timeout: 1200 });
    else setTimeout(attachArtwork, 200);
  };

  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
}

export function applyTheme() {
  const root = document.documentElement.style;
  for (const [token, value] of Object.entries(eventConfig.theme)) root.setProperty(token, value);
}
