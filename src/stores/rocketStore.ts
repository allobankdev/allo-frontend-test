import type { Rocket } from "@/types/rocket";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useRocketStore = defineStore("rocketStore", () => {
  const rockets = ref<Rocket[]>([]);
  const detailRocket = ref<Rocket | null>(null);

  const customNewRockets = ref<Rocket[]>(
    JSON.parse(localStorage.getItem("customNewRockets") || "[]")
  );

  const loading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  const fetchRockets = async () => {
    loading.value = true;
    try {
      const res = await fetch("https://api.spacexdata.com/v4/rockets");
      const data: Rocket[] = await res.json();
      rockets.value = data;
    } catch (err) {
      error.value =
        err instanceof Error ? err : new Error("Failed to fetch rockets");
    } finally {
      loading.value = false;
    }
  };

  const fetchRocketById = async (id: string) => {
    loading.value = true;
    try {
      const res = await fetch(`https://api.spacexdata.com/v4/rockets/${id}`);
      if (!res.ok) throw new Error("Rocket not found");
      detailRocket.value = await res.json();
    } catch (err) {
      console.error(err);
      detailRocket.value = null;
    } finally {
      loading.value = false;
    }
  };

  const addRocket = (rocket: Omit<Rocket, "id">) => {
    const newRocket: Rocket = {
      id: `local-${Date.now()}`,
      ...rocket,
    };

    customNewRockets.value.push(newRocket);
    saveToLocalStorage();
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(
      "customNewRockets",
      JSON.stringify(customNewRockets.value)
    );
  };

  const removeRocket = (id: string) => {
    customNewRockets.value = customNewRockets.value.filter((r) => r.id !== id);
    saveToLocalStorage();
  };

  const allRockets = computed<Rocket[]>(() => [
    ...rockets.value,
    ...customNewRockets.value,
  ]);

  return {
    rockets,
    customNewRockets,
    detailRocket,
    loading,
    error,

    fetchRockets,
    fetchRocketById,
    addRocket,
    saveToLocalStorage,
    removeRocket,

    allRockets,
  };
});
