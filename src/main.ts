import { createApp } from 'vue'
import { createPinia } from 'pinia'  
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()  // Nama variabel: "pinia"

app.use(pinia)  // Gunakan variabel "pinia"
app.use(router)

app.mount('#app')