import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import RocketList from '../pages/RocketList.vue';
import RocketDetail from '../pages/RocketDetail.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'RocketList',
    component: RocketList
  },
  {
    path: '/rocket/:id',
    name: 'RocketDetail',
    component: RocketDetail,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;