/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { createPinia } from 'pinia';
import vuetify from './vuetify'
import router from '../router'
import persistState from 'pinia-plugin-persistedstate'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {

  const persistPinia = createPinia();
  persistPinia.use(persistState);

  app
    .use(vuetify)
    .use(router)
    .use(persistPinia)
}
