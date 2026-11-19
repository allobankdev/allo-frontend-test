import { createPinia } from "pinia";
import type { App } from "vue";
import router from "../router";
import vuetify from "./vuetify";

export function registerPlugins(app: App) {
  app.use(createPinia()).use(vuetify).use(router);
}
