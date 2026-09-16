import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "rocket-list",
    component: () => import("@/pages/RocketListView.vue"),
  },
  {
    path: "/rockets/:id",
    name: "rocket-detail",
    component: () => import("@/pages/RocketDetailView.vue"),
    props: true,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
