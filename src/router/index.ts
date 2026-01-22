import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import RocketList from '@/views/RocketList.vue'
import RocketDetail from '@/views/RocketDetail.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'RocketList',
    component: RocketList,
  },
  {
    path: '/rocket/:id',
    name: 'RocketDetail',
    component: RocketDetail,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
