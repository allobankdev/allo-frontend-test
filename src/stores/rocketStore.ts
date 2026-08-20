import { defineStore } from "pinia";
import { fetchRockets } from "@/api/spacexApi";
import type { Rocket } from "@/types/Rocket";

export const useRocketStore = defineStore("rocket", {

  state: () => ({
    rockets: [] as Rocket[],
    selectedRocket: null as Rocket | null,

    loading: false,
    error: false
  }),

  actions: {

    async loadRockets() {

      this.loading = true;
      this.error = false;

      try {

        this.rockets = await fetchRockets();

      } catch {

        this.error = true;

      } finally {

        this.loading = false;
      }
    },

    selectRocket(rocket: Rocket) {
      this.selectedRocket = rocket;
    },

    addRocket(rocket: Rocket) {
      this.rockets.unshift(rocket);
    }
  }
});