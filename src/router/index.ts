/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import { routes } from "vue-router/auto-routes";

const route = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/index.vue"),
  },
  {
    path: "/add-rocket",
    name: "AddRocket",
    component: () => import("../pages/add-rocket/index.vue"),
  },
  {
    path: "/view-detail/:id",
    name: "ViewDetail",
    component: () => import("../pages/view-detail/[id].vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routes,...route],
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
