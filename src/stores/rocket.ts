import { defineStore } from "pinia";
import spacexService from "@/services/spacex";

export interface Rocket {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
  cost_per_launch: number;
  country: string;
  first_flight: string;
  height: { meters: number; feet: number };
  mass: { kg: number; lb: number };
  active: boolean;
  company: string;
}

export const useRocketStore = defineStore("rocket", {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: null as string | null,
  }),
  getters: {
    getRocketById: (state) => (id: string) => {
      return state.rockets.find((rocket) => rocket.id === id);
    },
  },
  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = null;
      try {
        const response = await spacexService.getRockets();
        this.rockets = response.data;
      } catch (err: any) {
        this.error = err.message || "Failed to fetch rockets";
      } finally {
        this.loading = false;
      }
    },
    addRocket(rocket: Rocket) {
      this.rockets.unshift(rocket);
    },
  },
});
