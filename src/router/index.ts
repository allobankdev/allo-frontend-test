import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[
    {
      path: '/',
      name: 'rocket-list',
      component: () => import('@/pages/RocketList.vue'),
    },
    {
      path: '/rockets/:id',
      name: 'rocket-detail',
      component: () => import('@/pages/RocketDetail.vue'),
      props: true,
    },
    //routes untuk catch all / handle 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ] ,
  //function untuk scroll ke atas ketika berpindah route
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router

