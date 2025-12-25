import { createRouter, createWebHistory } from 'vue-router'
import RocketListView from '@/pages/RocketListPage.vue'
import RocketDetailView from '@/pages/RocketDetailPage.vue'

const routes = [
  { path: '/', name: 'rockets', component: RocketListView },
  { path: '/rockets/:id', name: 'rocket-detail', component: RocketDetailView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
