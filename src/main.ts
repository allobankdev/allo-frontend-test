/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'


// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

///state management
import { createPinia } from 'pinia'

//router
import router from './router'

const app = createApp(App)

registerPlugins(app)

app.use(createPinia())
app.use(router)

app.mount('#app')
