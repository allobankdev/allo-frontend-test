import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { getRockets } from "@/api/rockets.api";
import type { Rocket } from "@/types/rocket";

export const useRocketStore = defineStore("rocket", () => {
  const rockets = ref<Rocket[]>([]);
  const localRockets = ref<Rocket[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const allRockets = computed(() => [...localRockets.value, ...rockets.value]);

  async function fetchRockets() {
    loading.value = true;
    error.value = null;

    try {
      const response = await getRockets();
      rockets.value = response.results;
    } catch (err) {
      console.error("Failed to fetch rockets:", err);
      error.value = "Failed to load rockets. Please try again.";
    } finally {
      loading.value = false;
    }
  }

  function addRocket(rocket: Rocket) {
    localRockets.value.unshift(rocket);
  }

  return {
    rockets,
    localRockets,
    allRockets,
    loading,
    error,
    fetchRockets,
    addRocket,
  };
});
