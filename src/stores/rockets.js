import { defineStore } from "pinia";

export const useRocketStore = defineStore("rockets", {
  state: () => ({
    rockets: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch("https://api.spacexdata.com/v4/rockets");
        this.rockets = await res.json();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    addRocket(rocket) {
      this.rockets.push(rocket);
    },
  },
});
