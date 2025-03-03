import { defineStore } from "pinia";
import axios from "axios";

interface Rocket {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
  cost_per_launch: number;
  country: string;
  first_flight: string;
}

export const useRocketStore = defineStore("rocket", {
  state: () => ({
    rockets: [] as Rocket[],
    isLoading: false,
    error: null as unknown | null,
    search: '',
  }),
  getters: {
    filteredRockets(state) {
      if (!state.rockets) return [];
      return state.rockets.filter((rocket) =>
        rocket.name.toLowerCase().includes(state.search.toLowerCase())
      );
    },
  },
  actions: {
    async fetchRockets() {
      this.isLoading = true;
      this.error = null;

      try {
        const result = await axios.get("https://api.spacexdata.com/v4/rockets");

        this.rockets = result.data;
      } catch (err) {
        this.error = err;
      } finally {
        this.isLoading = false;
      }
    },

    addRocket(rocket: Rocket) {
      const newRocket = {
        ...rocket,
        id: Math.random().toString(),
      };
      this.rockets.push(newRocket);
    },

    setSearch(search: string) {
      this.search = search;
    },
  },
});
