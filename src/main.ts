/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";

const pinia = createPinia();

const app = createApp(App);

registerPlugins(app);

app.use(pinia);
app.use(VueQueryPlugin);
app.mount("#app");
