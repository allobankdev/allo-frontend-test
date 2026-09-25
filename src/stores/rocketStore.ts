import { defineStore } from "pinia";
import { ref } from "vue";
import type { Rocket } from "../types/rocket";

export const useRocketStore = defineStore("rocket", () => {
  const localRockets = ref<Rocket[]>([]);
  function addLocalRocket(newRocket: Rocket) {
    localRockets.value.unshift(newRocket);
  }
  return {
    localRockets,
    addLocalRocket,
  };
});
