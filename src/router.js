import { createRouter, createWebHistory } from "vue-router";
import RocketList from "./components/RocketList.vue";
import RocketDetail from "./components/RocketDetail.vue";

const routes = [
  { path: "/", component: RocketList },
  { path: "/rocket/:id", component: RocketDetail, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
