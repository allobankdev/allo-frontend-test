/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import { VueQueryPlugin } from "@tanstack/vue-query";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

const app = createApp(App);
app.use(VueQueryPlugin);

registerPlugins(app);

app.mount("#app");
