import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '@/pages/index.vue'
import RocketDetailPage from '@/pages/rockets/[id].vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexPage,
    },
    {
      path: '/rockets/:id',
      name: 'rocket-detail',
      component: RocketDetailPage,
    },
  ],
})

export default router