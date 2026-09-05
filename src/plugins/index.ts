/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import { createPinia } from "pinia";
import vuetify from "./vuetify";
import router from "../router";

import type { App } from "vue";

const pinia = createPinia();

export function registerPlugins(app: App) {
  app.use(pinia).use(vuetify).use(router);
}
