import { createRouter, createWebHistory } from "vue-router";
import RocketList from "../pages/RocketList.vue";
import RocketDetail from "../pages/RocketDetail.vue";

const routes = [
  { path: "/", name: "Home", component: RocketList },
  {
    path: "/rocket/:id",
    name: "RocketDetail",
    component: RocketDetail,
    props: true,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
