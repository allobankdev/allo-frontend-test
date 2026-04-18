import { defineStore } from "pinia";
import api from "@/services/api";
import type { Rocket } from "@/types/rocket";

export const useRocketStore = defineStore("rockets", {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: null as string | null,
    search: "",
    rocketDetail: null as Rocket | null,
  }),

  getters: {
    filteredRockets: (state): Rocket[] => {
      if (!state.search) return state.rockets;

      return state.rockets.filter((rocket) =>
        rocket.name.toLowerCase().includes(state.search.toLowerCase()),
      );
    },
  },

  actions: {
    async getRockets() {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.get<Rocket[]>("/rockets");
        this.rockets = res.data;
      } catch (err: any) {
        this.error = err?.message || "Failed to fetch rockets";
      } finally {
        this.loading = false;
      }
    },

    async getRocketById(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get<Rocket>(`/rockets/${id}`);
        this.rocketDetail = res.data;
      } catch (err: any) {
        this.error = err?.message || "Failed to fetch rocket detail";
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
  },
});
