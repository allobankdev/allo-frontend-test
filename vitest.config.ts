import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

// Unit-test config kept separate from vite.config.mts so tests do not pull in the
// Vuetify/router build plugins. Covers the framework-agnostic service and store logic.
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
