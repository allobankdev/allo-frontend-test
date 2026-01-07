import { defineStore } from "pinia";
import { getRockets, getRocketById } from "../services/spacexApi";

export const useRocketStore = defineStore("rocket", {
  state: () => ({
    rockets: [] as any[],
    loading: false,
    error: false,
  }),
  actions: {
    async fetchRockets() {
      try {
        this.loading = true;
        this.error = false;
        this.rockets = await getRockets();
      } catch {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    async fetchRocketDetail(id: string) {
      try {
        this.loading = true;
        this.error = false;
        return await getRocketById(id);
      } catch {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    addRocket(rocket: any) {
      this.rockets.push(rocket);
    },
  },
});
