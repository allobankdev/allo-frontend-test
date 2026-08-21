/**
 * router/index.ts
 *
 * Manual route definitions for the Rocket app.
 */

import { createRouter, createWebHistory } from 'vue-router'
import RocketListView from '@/views/RocketListView.vue'
import RocketDetailView from '@/views/RocketDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'rocket-list',
      component: RocketListView,
    },
    {
      path: '/rocket/:id',
      name: 'rocket-detail',
      component: RocketDetailView,
    },
    // Fallback – redirect unknown paths to list
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
