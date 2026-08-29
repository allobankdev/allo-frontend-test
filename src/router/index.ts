import { createRouter, createWebHistory } from 'vue-router'
import RocketDetailView from '@/pages/RocketDetailView.vue'
import RocketListView from '@/pages/RocketListView.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: RocketListView },
    { path: '/rocket/:id', component: RocketDetailView }
  ]
})

export default router