/**
 * plugins/index.ts
 *
 * Registers all plugins with the Vue application instance.
 */

import vuetify from './vuetify'
import router from '../router'
import { createPinia } from 'pinia'

import type { App } from 'vue'

export function registerPlugins(app: App) {
  app
    .use(createPinia())
    .use(vuetify)
    .use(router)
}
