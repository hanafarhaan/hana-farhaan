import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { pageMeta } from './src/config/meta.ts'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Fills %META_*% placeholders in index.html from src/config (title, description, share image). */
function eventMeta(): Plugin {
  return {
    name: 'event-meta',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const meta = pageMeta()
        return html.replace(/%META_([A-Z_]+)%/g, (match, key: string) =>
          key in meta ? escapeHtml(meta[key]) : match,
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react(), eventMeta()],
  // GitHub Pages serves the site from https://<user>.github.io/hana-farhaan/
  // Keep this in sync with the repository name. `npm run preview` mirrors it; local dev stays at "/".
  base: command === 'build' || isPreview ? '/hana-farhaan/' : '/',
}))
