import { createRouter, createWebHistory } from 'vue-router'
import RocketList from '@/pages/index.vue'
import RocketDetail from '@/pages/RocketDetail.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'rockets', component: RocketList },
    { path: '/rockets/:id', name: 'rocket', component: RocketDetail },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() { return { top: 0 } },
})
