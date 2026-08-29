import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRocketStore = defineStore('rocket', () => {
  const rockets = ref([])
  const launches = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchRockets() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('https://api.spacexdata.com/v4/rockets')
      rockets.value = await res.json()
      console.log(rockets.value, 'sas');
      
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  function addRocket(newRocket) {
    newRocket.id = `local-${Date.now()}`
    rockets.value.unshift(newRocket)
  }

  return { rockets, launches, loading, error, fetchRockets, addRocket }
})
