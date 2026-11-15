import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves the site from https://<user>.github.io/hana-farhaan/
  // Keep this in sync with the repository name. Local dev stays at "/".
  base: command === 'build' ? '/hana-farhaan/' : '/',
}))
