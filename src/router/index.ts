import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import RocketListView from "@/views/RocketListView.vue";
import RocketDetailView from "@/views/RocketDetailView.vue";
import CreateRocketView from "@/views/CreateRocketView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "list",
    component: RocketListView,
    meta: { title: "Home" },
  },
  {
    path: "/rocket/:id",
    name: "detail",
    component: RocketDetailView,
    meta: { title: "Rocket Detail" }, 
  },
  {
    path: "/rockets/new",
    name: "create",
    component: CreateRocketView,
    meta: { title: "Add New Rocket" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
