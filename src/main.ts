
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import { registerPlugins } from './plugins'

const app = createApp(App)

app.use(createPinia())

registerPlugins(app)

app.mount('#app')