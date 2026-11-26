import { useDebouncedRef } from "@/composables/useDebouncedRef";
import { useLocalStorage } from "@/composables/useLocalStorage";
import { rocketService } from "@/services/rocket.service";
import type { UIState } from "@/types/app";
import type { LocalRocket, ServerRocket, UnifiedRocket } from "@/types/rocket";
import { defineStore } from "pinia";
import { computed, ref, shallowReactive } from "vue";

const STORAGE_KEY = "local-rockets"

export const useRocketStore = defineStore("rocket", () => {
  const query = useDebouncedRef("")
  const state = shallowReactive<Record<"list" | "details", UIState>>({
    list: "idle",
    details: "idle"
  })
  const rocket = ref<UnifiedRocket | null>(null)
  const localRockets = useLocalStorage<LocalRocket[]>(STORAGE_KEY, [])
  const serverRockets = ref<ServerRocket[]>([])

  const allRockets = computed<UnifiedRocket[]>(() => {
    return [...localRockets.value, ...serverRockets.value]
  })

  const filteredRockets = computed(() => {
    const q = query.value.toLowerCase()
    return allRockets.value.filter((r) => {
      return (
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      )
    })
  })

  const getServerRockets = async () => {
    state.list = "loading"

    try {
      serverRockets.value = await rocketService.getAll()
      state.list = "success"
    } catch (error) {
      state.list = "error"
      console.error("an error occurred while fetching rockets", error)
    }
  }

  const getRocketById = async (id: string) => {
    state.details = "loading"

    const cached = allRockets.value.find((r) => r.id === id)
    if (cached) {
      rocket.value = cached
      state.details = "success"
      return
    }

    try {
      rocket.value = await rocketService.getById(id)
      state.details = "success"
    } catch (error) {
      state.details = "error"
      console.error("an error occurred while fetching rockets", error)
    }
  }

  const storeLocalRocket = (payload: Omit<LocalRocket, "id">) => {
    localRockets.value = [
      {
        ...payload,
        id: `local-${Date.now()}`
      },
      ...localRockets.value
    ]
  }

  return {
    query,
    state,
    rocket,
    rockets: filteredRockets,
    getServerRockets,
    getRocketById,
    storeLocalRocket
  }
})