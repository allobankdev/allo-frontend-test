import { createRouter, createWebHistory } from "vue-router";
import RocketList from "../pages/RocketList.vue";
import RocketDetail from "../pages/RocketDetail.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "RocketList",
      component: RocketList,
    },
    {
      path: "/rocket/:id",
      name: "RocketDetail",
      component: RocketDetail,
    },
  ],
});

export default router;
