/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { routes as autoRoutes } from 'vue-router/auto-routes'

const customRoutes = [
  {
    path: '/',
    name: 'RocketList',
    component: () => import('../components/views/RocketList.vue')
  },
  {
    path: '/rocket-detail/:id',
    name: 'RocketDetail',
    component: () => import('../components/views/RocketDetail.vue')
  },
  {
    path: '/add-new-rocket',
    name: 'RocketAdd',
    component: () => import('../components/views/RocketAdd.vue')
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...autoRoutes,
    ...customRoutes
  ]
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
