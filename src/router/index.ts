import { createRouter, createWebHistory } from "vue-router";

// Import menggunakan relative path karena path alias @ mungkin belum berfungsi
import RocketList from "../pages/RocketList.vue";
import RocketDetail from "../pages/RocketDetail.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: RocketList,
    },
    {
      path: "/rocket/:id",
      name: "rocket-detail",
      component: RocketDetail,
      props: true,
    },
  ],
});

export default router;
