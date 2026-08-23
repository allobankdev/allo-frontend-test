import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import IndexPage from '@/pages/index.vue';
import RocketDetailPage from '@/pages/rockets/[id].vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'RocketList',
    component: IndexPage,
  },
  {
    path: '/rockets/:id',
    name: 'RocketDetail',
    component: RocketDetailPage,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
