import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // Production build is served from https://wamboldt-capital.github.io/Life-Roadmap/
  base: command === 'build' ? '/Life-Roadmap/' : '/',
  plugins: [react()],
  server: {
    // Bind to all interfaces and accept proxied hosts so the live preview
    // works in remote / cloud dev environments.
    host: true,
    port: 5173,
    strictPort: false,
    allowedHosts: true,
  },
}))
