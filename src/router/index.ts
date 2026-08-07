import { createRouter, createWebHistory } from 'vue-router'
import RocketListView from '@/pages/index.vue'
import RocketDetailView from '@/pages/rockets/[id].vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'rockets', component: RocketListView },
    { path: '/rockets/:id', name: 'rocket-detail', component: RocketDetailView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
