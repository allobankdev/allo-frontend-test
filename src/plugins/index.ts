/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { createRulesPlugin } from 'vuetify/labs/rules'
import vuetify from './vuetify'
import pinia from './pinia'
import router from '../router'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(createRulesPlugin({}, vuetify.locale))
    .use(pinia)
    .use(router)
}
