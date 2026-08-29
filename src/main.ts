/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import router from './router';


// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia';

const app = createApp(App)
app.use(createPinia());
app.use(router);

registerPlugins(app)

app.mount('#app')
