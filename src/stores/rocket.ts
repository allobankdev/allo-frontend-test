import { defineStore } from "pinia";
import { getAllRockets, type Rocket } from "@/services/rocket.service";

const STORAGE_KEY = "rockets";

export const useRocketStore = defineStore("rocket", {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: null as string | null,
  }),
  getters: {
    filteredRockets: (state) => {
      return (keyword: string) =>
        state.rockets.filter((r) =>
          r.name.toLowerCase().includes(keyword.toLowerCase())
        );
    },
  },
  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = null;

      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          this.rockets = JSON.parse(saved);
        } else {
          const apiRockets = await getAllRockets();
          this.rockets = apiRockets;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.rockets));
        }
      } catch {
        this.error = "Failed to load rockets. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    addRocket(newRocket: Rocket) {
      const rocketWithId = {
        ...newRocket,
        id: String(Date.now()),
      };
      this.rockets.push(rocketWithId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.rockets));
    },
    getRocketById(id: string) {
      return this.rockets.find((r) => {
        return r.id === id;
      });
    },
  },
});
