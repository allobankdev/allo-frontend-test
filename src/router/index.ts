import { createRouter, createWebHistory } from 'vue-router'
import RocketListView from '../pages/RocketListView.vue'
import RocketDetailView from '../pages/RocketDetailView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'rocket-list', component: RocketListView },
    { path: '/rockets/:id', name: 'rocket-detail', component: RocketDetailView, props: true },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
