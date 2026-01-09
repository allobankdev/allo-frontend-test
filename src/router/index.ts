import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    meta: { title: "Rockets", authRequired: false },
    component: () => import("../components/home/index.vue"),
  },
  {
    path: "/add-rocket",
    name: "NewRocket",
    meta: { title: "Add Rocket", authRequired: false },
    component: () => import("../components/newRockets/CreateRockets.vue"),
  },
  {
    path: "/detail-rocket/:id",
    name: "DetailRocket",
    meta: { title: "Detail Rocket", authRequired: false },
    component: () => import("../components/home/detail_rocket/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Use the HTML5 history API (i.e. normal-looking routes)
  // instead of routes with hashes (e.g. example.com/#/about).
  // This may require some server configuration in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations

  // Simulate native-like scroll behavior when navigating to a new
  // route and using back/forward buttons.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

router.beforeResolve(async (routeTo, routeFrom, next) => {
  document.title = routeTo.meta.title + " ";
  // If we reach this point, continue resolving the route.
  next();
});

export default router;
