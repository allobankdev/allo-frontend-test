import { createRouter, createWebHistory } from 'vue-router'

import RocketListView from '@/views/RocketListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'rocket-list',
      component: RocketListView,
      meta: { title: 'Rocket Fleet' },
    },
    {
      path: '/rockets/:id',
      name: 'rocket-detail',
      component: () => import('@/views/RocketDetailView.vue'),
      meta: { title: 'Rocket Details' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'rocket-list' },
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : 'Rocket Fleet'
  document.title = `${title} · Allo Space`
})

export default router
