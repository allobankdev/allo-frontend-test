import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Rocket } from '../types/rocket'

export const useRocketStore = defineStore('rockets', () => {
  const localRockets = ref<Rocket[]>([])

  function addRocket(rocket: Rocket) {
    localRockets.value.unshift(rocket)
  }

  function findLocalRocket(id: string) {
    return localRockets.value.find(
      rocket => String(rocket.id) === id
    )
  }

  return { localRockets, addRocket, findLocalRocket }
})
