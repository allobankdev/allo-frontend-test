import api from "@/api/axios";
import type { Rocket } from "@/features/rocket/types/rocket.dto";
import { defineStore } from "pinia";

export const useRocketStore = defineStore("rocketStore", () => {
  const rockets = ref<Rocket[]>([]);
  const isLoading = ref(false);
  const isError = ref<string | null>(null);
  const filterRocket = ref({
    name: "",
    active: null as boolean | null,
  });

  const getRockets = async () => {
    isLoading.value = true;
    try {
      const res = await api.get<Rocket[]>("/v4/rockets");
      rockets.value = res.data;
    } catch (error) {
      isError.value = error instanceof Error ? error.message : String(error);
    } finally {
      isLoading.value = false;
    }
  };

  const addRocket = (rocket: Rocket) => {
    rockets.value.push(rocket);
  };

  const filteredRockets = computed(() => {
    return rockets.value.filter((rocket) => {
      const matchesName =
        filterRocket.value.name === "" ||
        rocket.name
          .toLowerCase()
          .includes(filterRocket.value.name.toLowerCase());
      const matchesActive =
        filterRocket.value.active === null ||
        rocket.active === filterRocket.value.active;
      return matchesName && matchesActive;
    });
  });

  const resetFilter = () => {
    filterRocket.value = {
      name: "",
      active: null,
    };
  };

  const applyFilter = (name: string, active: boolean | null) => {
    if (name !== undefined) filterRocket.value.name = name;
    if (active !== undefined) filterRocket.value.active = active;
  };

  return {
    rockets,
    isLoading,
    isError,
    getRockets,
    addRocket,
    resetFilter,
    filterRocket,
    filteredRockets,
    applyFilter,
  };
});
