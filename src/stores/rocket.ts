import { ref } from "vue";
import { defineStore } from "pinia";
import type { Rocket } from "@/types/Rocket";

export const useRocketStore = defineStore("rockets", () => {
  // state
  const rockets = ref<Rocket[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // action: fetch semua rocket dari API
  const fetchRockets = async () => {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(
        "https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20",
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();

      rockets.value = data.results;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Something error to fetch data";
    } finally {
      loading.value = false;
    }
  };

  const fetchRocketsById = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(
        `https://lldev.thespacedevs.com/2.2.0/config/launcher/${id}/`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();

      rockets.value.push(data);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Something error to fetch data";
    } finally {
      loading.value = false;
    }
  };

  const addRocket = (newRocketData: Omit<Rocket, "id">) => {
    const maxId =
      rockets.value.length > 0
        ? Math.max(...rockets.value.map((r) => r.id))
        : 0;

    const newRocket: Rocket = {
      id: maxId + 1,
      ...newRocketData,
    };

    rockets.value.push(newRocket);
  };

  return { rockets, loading, error, fetchRockets, addRocket, fetchRocketsById };
});
