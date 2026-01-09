/**
 * main.ts
 *
 * Bootstraps Vuetify, Pinia, and other plugins then mounts the App
 */

// Styles
import '@/assets/styles/main.css'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
