// Plugins
import vuetify from './vuetify'
import pinia from './pinia'
import router from '../router'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(pinia)
    .use(vuetify)
    .use(router)
}
