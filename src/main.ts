/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";
import "@/assets/styles/main.scss";

// Composables
import { createApp } from "vue";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

registerPlugins(app);

app.mount("#app");
