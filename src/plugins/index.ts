/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  const queryClient = new QueryClient()

  app
    .use(vuetify)
    .use(router)
    .use(VueQueryPlugin, { queryClient })
}
