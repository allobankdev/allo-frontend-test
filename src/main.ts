// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// (kalau pakai Vuetify)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)          // ← ini harus ada, sebelum mount
app.use(router)
app.use(vuetify)

app.mount('#app')
