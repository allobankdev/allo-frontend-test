import '@mdi/font/css/materialdesignicons.css'
import '@/styles/main.css'
import router from '../router'
import { createPinia } from 'pinia'
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(createPinia())
    .use(router)
}
