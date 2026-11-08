/**
 * router/index.ts
 *
 * File-based routes generated from `./src/pages/*.vue`:
 *   /               → pages/index.vue          (rocket list)
 *   /rockets/:id    → pages/rockets/[id].vue   (rocket detail)
 *   /:path(.*)*     → pages/[...path].vue      (404)
 */

import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior (to, from, savedPosition) {
    // Back/forward: restore where the user was.
    if (savedPosition) return savedPosition
    // Same page, only the query changed (filters): keep the scroll position.
    if (to.path === from.path) return false
    return { top: 0 }
  },
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
