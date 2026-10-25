import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Rocket } from '@/types/rocket'

export const useRocketStore = defineStore('rocketStore', () => {
  const localRockets = ref<Rocket[]>([])

  function addLocalRocket(rocket: Rocket) {
    localRockets.value.push(rocket)
  }

  return {
    localRockets,
    addLocalRocket
  }
})
