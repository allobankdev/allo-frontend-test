import { getRocketById, getRockets } from "@/services/rocketServices";
import type { NewRocker, Rocket } from "@/services/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface Error {
  message: string
}

export const useRocketStore = defineStore('rocket', () => {
  const rockets = ref<Rocket[]>([])
  const selectedRocket = ref<Rocket | null>(null)
  const localRockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  // filter
  const filteredRockets = computed<Rocket[]>(() => {
    const all = [...rockets.value, ...localRockets.value]
    return all.filter((rocket) => rocket.name.toLowerCase().includes(searchQuery.value?.toLowerCase()))
  })

  //get list rocket
  async function getRocketLists() {
    loading.value = true
    error.value = null
    try {
      rockets.value = await getRockets()
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch rockets'
    } finally {
      loading.value = false
    }
  }

  // get rocket by id
  async function getRocketDetail(id: string) {
    loading.value = true
    error.value = null
    try {
      selectedRocket.value = await getRocketById(id)
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch rocket detail'
    } finally {
      loading.value = false
    }
  }

  // add rocket
  function addLocalRocket(rocket: NewRocker) {
    localRockets.value.push({
      ...rocket,
      id: `local-${Date.now()}`,
      flickr_images: rocket.flickr_images?.length ? rocket.flickr_images : ['https://placehold.co/600x400?text=Rocket'],
    })
  }

  return {
    rockets,
    selectedRocket,
    localRockets,
    loading,
    error,
    searchQuery,
    getRocketLists,
    getRocketDetail,
    filteredRockets,
    addLocalRocket,
  }
})
