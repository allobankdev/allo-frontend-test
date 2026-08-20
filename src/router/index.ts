import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/rockets',
    },
    {
      path: '/rockets',
      name: 'rocket-list',
      component: () => import('@/views/RocketListView.vue'),
      meta: { title: 'SpaceX Rockets' },
    },
    {
      path: '/rockets/:id',
      name: 'rocket-detail',
      component: () => import('@/views/RocketDetailView.vue'),
      props: true,
      meta: { title: 'Rocket Details' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Page Not Found' },
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta?.title as string | undefined
  document.title = title ? `${title} – Allo Bank` : 'SpaceX Rockets – Allo Bank'
})

export default router
