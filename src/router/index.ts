/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";

const RELOAD_FLAG_KEY = "vuetify:dynamic-reload";

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // Storage may be unavailable in private browsing or restricted contexts.
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Safe to ignore when storage quota or access is restricted.
  }
}

function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Safe to ignore when storage access is restricted.
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routes, { path: "/:pathMatch(.*)*", redirect: "/" }],
  scrollBehavior: () => ({ top: 0 }),
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (readStorage(RELOAD_FLAG_KEY)) {
      console.error("Dynamic import error, reloading page did not fix it", err);
    } else {
      writeStorage(RELOAD_FLAG_KEY, "true");
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

void router
  .isReady()
  .then(() => {
    removeStorage(RELOAD_FLAG_KEY);
  })
  .catch((err) => {
    console.error("Router initialization failed", err);
  });

export default router;
