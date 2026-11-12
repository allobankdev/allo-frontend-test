/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import { createPinia } from 'pinia'

// Types
import type { App } from 'vue'

/**
 * Mendaftarkan semua plugin aplikasi (Vuetify, router, Pinia) ke instance Vue.
 *
 * @param app - Instance aplikasi Vue dari `createApp`.
 */
export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(createPinia())
}
