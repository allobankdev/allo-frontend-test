// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
    .use(router)
    .use(createPinia())

registerPlugins(app)

app.mount('#app')
