import { createRouter, createWebHistory } from 'vue-router'
import RocketList from '../views/RocketList.vue'
import RocketDetail from '../views/RocketDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: RocketList },
    { path: '/rocket/:id', name: 'detail', component: RocketDetail }
  ]
})

export default router