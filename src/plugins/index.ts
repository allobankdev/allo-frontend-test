/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import { createPinia } from 'pinia' // 1. Import createPinia

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  const pinia = createPinia() // 2. Create the Pinia instance

  app
    .use(vuetify)
    .use(router)
    .use(pinia) // 3. Register Pinia with the app
}
