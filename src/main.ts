/** Bootstrap the Vue application and mount the root component. */

// Router
import router from '@/router'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import '@/styles/main.scss'

const app = createApp(App)

app.use(router)

app.mount('#app')
