/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const dynamicReloadKey = 'allo:dynamic-reload'

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((error, to) => {
  if (error?.message?.includes('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem(dynamicReloadKey)) {
      localStorage.setItem(dynamicReloadKey, 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error persisted after a reload.', error)
    }
  } else {
    console.error(error)
  }
})

router.isReady().then(() => {
  localStorage.removeItem(dynamicReloadKey)
})

export default router
