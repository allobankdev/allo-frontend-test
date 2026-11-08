import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Unit tests cover pure logic (mappers, formatters, filters, store), so they
// run in Node without the Vuetify/router/font plugins used by the app build.
export default defineConfig({
  plugins: [Vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/__tests__/*.spec.ts'],
  },
})
