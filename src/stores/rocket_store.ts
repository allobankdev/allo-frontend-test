import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { getSpaceXRockets } from "@/services/launcher_service";
import type { Rocket } from "@/types/rocket";

export const useRocketStore = defineStore("rocket", () => {
  const rockets = ref<Rocket[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const filter = ref("");

  const filteredRockets = computed(() => {
    const keyword = filter.value.trim().toLowerCase();

    if (!keyword) {
      return rockets.value;
    }

    return rockets.value.filter((rocket) =>
      rocket.name.toLowerCase().includes(keyword),
    );
  });

  async function fetchRockets() {
    loading.value = true;
    error.value = null;

    try {
      rockets.value = await getSpaceXRockets();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch rockets";
    } finally {
      loading.value = false;
    }
  }

  function setFilter(value: string) {
    filter.value = value;
  }

  function addRocket(rocket: Rocket) {
    rockets.value.unshift(rocket);
  }

  return {
    rockets,
    loading,
    error,
    filter,
    filteredRockets,
    fetchRockets,
    setFilter,
    addRocket,
  };
});
