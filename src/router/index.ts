import { createRouter, createWebHistory } from 'vue-router'
import RocketList from '../pages/index.vue'
import RocketDetail from '../pages/rockets/[id].vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'rockets', component: RocketList },
    { path: '/rockets/:id', name: 'rocket-detail', component: RocketDetail },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
