/**
 * router/index.ts
 *
 * Application routes
 */

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/index.vue'),
    },
    {
      path: '/:id',
      component: () => import('@/pages/[id].vue'),
    },
  ],
})

export default router
