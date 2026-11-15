import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { applyTextures, applyTheme } from "./components/art/Textures";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/ui.css";
import "./styles/art.css";
import "./styles/sections/opening.css";
import "./styles/sections/letter.css";
import "./styles/sections/scratch.css";
import "./styles/sections/calendar.css";
import "./styles/sections/timeline.css";
import "./styles/sections/venue.css";
import "./styles/sections/dress.css";
import "./styles/sections/rsvp.css";
import "./styles/sections/ending.css";

applyTheme();
applyTextures();

// Always start at the cover, not wherever the last visit was scrolled to.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
