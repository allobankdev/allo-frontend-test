import { createRouter, createWebHistory } from 'vue-router'
import RocketListView from '../views/RocketListView.vue'
import RocketDetailView from '../views/RocketDetailView.vue'
import AddRocketForm from '@/components/AddRocketForm.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: RocketListView },
     { path: '/rocket/new', component: AddRocketForm },
    { path: '/rocket/:id', component: RocketDetailView, props: true }
  ]
})
