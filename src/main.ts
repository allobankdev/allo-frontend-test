/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import { createPinia } from 'pinia'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

registerPlugins(app)

app.mount('#app')
