import { defineStore } from "pinia";
import { ref } from "vue";
import type { Rocket } from "@/types/rocket";
import { fetchRockets } from "@/services/api";

export const useRocketStore = defineStore("rocket", () => {
  const rockets = ref<Rocket[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await fetchRockets();
      rockets.value = data;
    } catch (err) {
      error.value = "Failed to fetch rockets.";
    } finally {
      loading.value = false;
    }
  };

  const addRocket = (newRocket: Rocket) => {
    rockets.value.unshift(newRocket);
  };

  const getRocketById = (id: string) => {
    return rockets.value.find((r) => r.id === id);
  };

  return { rockets, loading, error, loadData, addRocket, getRocketById };
});
