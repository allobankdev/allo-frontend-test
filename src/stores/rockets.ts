import { defineStore } from "pinia";
import api from "@/services/api";
import type { Rocket } from "@/types/rocket";

export const useRocketStore = defineStore("rockets", {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: null as string | null,
    search: "",
  }),

  getters: {
    filteredRockets: (state): Rocket[] => {
      if (!state.search) return state.rockets;

      return state.rockets.filter((rocket) =>
        rocket.name.toLowerCase().includes(state.search.toLowerCase()),
      );
    },

    getRocketById: (state) => {
      return (id: string): Rocket | undefined =>
        state.rockets.find((rocket) => rocket.id === id);
    },
  },

  actions: {
    async getRockets() {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.get<Rocket[]>("/rockets");

        await new Promise((resolve) => setTimeout(resolve, 1500));

        this.rockets = res.data;
      } catch (err: any) {
        this.error = err?.message || "Failed to fetch rockets";
      } finally {
        this.loading = false;
      }
    },

    setSearch(value: string) {
      this.search = value;
    },

    addRocket(newRocket: Rocket) {
      this.rockets.unshift(newRocket);
    },

    retry() {
      this.getRockets();
    },
  },
});
