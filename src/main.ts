/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

const pinia = createPinia();
const app = createApp(App);
app.use(VueQueryPlugin);
app.use(pinia);

registerPlugins(app);

app.mount("#app");
