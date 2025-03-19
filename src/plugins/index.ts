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
import axios from 'axios'
import  Toast  from 'vue-toastification'
import "vue-toastification/dist/index.css";

const pinia = createPinia();
export function registerPlugins (app: App) {
  app
    .use(pinia)
    .use(vuetify)
    .use(router)
    .use(axios)
    .use(Toast,{
      transition: "Vue-Toastification__bounce",
      maxToasts: 20,
      newestOnTop: true
    })
}
