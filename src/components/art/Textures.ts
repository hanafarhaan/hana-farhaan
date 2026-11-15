// Texture layers for the velvet and paper sections. Coded textures are pre-rendered tiles in
// public/textures/ (see scripts/make-textures.mjs); real artwork, when configured, is layered on top.
import { eventConfig } from "../../config/eventConfig";
import { asset } from "../../utils/asset";

const url = (path: string) => `url("${asset(path)}")`;

export function applyTextures() {
  const root = document.documentElement.style;
  const art = eventConfig.artwork;
  root.setProperty("--tex-velvet-dark", url("textures/velvet-dark.webp"));
  root.setProperty("--tex-velvet-sheen", url("textures/velvet-sheen.webp"));
  root.setProperty("--tex-velvet-grain", url("textures/grain.webp"));
  root.setProperty("--tex-paper-mottle", url("textures/paper-mottle.webp"));
  root.setProperty("--tex-paper-grain", url("textures/grain.webp"));
  root.setProperty("--tex-film-grain", url("textures/grain.webp"));
  root.setProperty("--tex-velvet-img", art.velvetTexture ? url(art.velvetTexture) : "none");
  root.setProperty("--tex-paper-img", art.paperTexture ? url(art.paperTexture) : "none");
}

export function applyTheme() {
  const root = document.documentElement.style;
  for (const [token, value] of Object.entries(eventConfig.theme)) root.setProperty(token, value);
}
