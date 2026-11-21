import { defineStore } from "pinia";
import { ref } from "vue";
import type { Rocket } from "@/types/rockets";

export const useRocketStore = defineStore("rocket", () => {
  const localRockets = ref<Rocket[]>([]);

  const addRocket = (rocket: Rocket) => {
    localRockets.value.push({
      ...rocket,
      isLocal: true,
    });
  };

  const getLocalRocketById = (id: string) => {
    return localRockets.value.find((rocket: { id: string; }) => rocket.id === id);
  };

  return {
    localRockets,
    addRocket,
    getLocalRocketById,
  };
});