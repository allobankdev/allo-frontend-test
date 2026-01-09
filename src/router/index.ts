import { createRouter, createWebHistory } from 'vue-router'
import RocketListView from '@/views/RocketListView.vue'
import RocketDetailView from '@/views/RocketDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'rocket-list',
      component: RocketListView
    },
    {
      path: '/rockets/:id',
      name: 'rocket-detail',
      component: RocketDetailView,
      props: true
    }
  ]
})

export default router
