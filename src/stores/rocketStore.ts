import { rocketApi } from "@/api/rocketApi";
import type { CreateRocketPayload, Rocket } from "@/types/rocket";
import { defineStore } from "pinia";
import { computed, ref } from "vue";


export const useRocketStore = defineStore("rocketStore", () => {
  // state
  const rockets = ref<Rocket[]>([]);
  const selectedRocket = ref<Rocket | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const searchQuery = ref<string>("");
  const successMessage = ref<string | null>("");


  function clearMessage(){
    successMessage.value = null;
    error.value = null;
  }


  async function fetchRockets() {
    loading.value = true;
    error.value = null;
    try {
      const apiRockets = await rocketApi.getRockets()
     const localRockets = rockets.value.filter((r) => r.isLocal)
      rockets.value = [...localRockets, ...apiRockets]
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unknown error occurred";
    } finally {
      loading.value = false;
      setTimeout(() => clearMessage(), 3000);
    }
  }

  async function detailRocket(id: number | string) {
    loading.value = true;
    error.value = null;
    selectedRocket.value = null;

    const localRocket = rockets.value.find(
      (rocket) => rocket.id === id && rocket.isLocal,
    );
    if (localRocket) {
      selectedRocket.value = localRocket;
      loading.value = false;
      console.log("Found local rocket:", selectedRocket);
      return;
    }

    try {
      selectedRocket.value = await rocketApi.getRocketById(id)
    }catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unknown error occurred";
    } finally {
      loading.value = false;
      setTimeout(() => clearMessage(), 3000);
    }
  }

  function addRocket(payload: CreateRocketPayload) {
    console.log("Adding new rocket:", payload);
    const createdRocket: Rocket = {
      ...payload,
      id: `local-${Date.now()}`,
      isLocal: true,
    };
    rockets.value.unshift(createdRocket);
    successMessage.value = "Rocket added successfully!";
    setTimeout(() => clearMessage(), 3000);
  }

  const filteredRockets = computed(() => {
    if (!searchQuery.value.trim()) {
      return rockets.value;
    }
    return rockets.value.filter((rocket) =>
      rocket.full_name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  })

  return {
    rockets,
    selectedRocket,
    loading,
    error,
    searchQuery,
    successMessage,
    fetchRockets,
    detailRocket,
    addRocket,
    clearMessage,
    filteredRockets,
  }
});
