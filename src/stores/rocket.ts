import { defineStore } from "pinia";

export interface Rocket {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
  cost_per_launch: number;
  country: string;
  first_flight: string;
  isLocal?: boolean;
}

export const useRocketStore = defineStore("rocket", {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch("https://api.spacexdata.com/v4/rockets");
        if (!res.ok) throw new Error("Failed to fetch rockets");

        const data = await res.json();
        this.rockets = data;
      } catch (err: any) {
        this.error = err.message || "Something went wrong";
      } finally {
        this.loading = false;
      }
    },

    addRocket(payload: Omit<Rocket, "id">) {
      this.rockets.unshift({
        ...payload,
        id: Date.now().toString(),
        isLocal: true,
      });
    },
  },
});
