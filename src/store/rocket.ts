import { defineStore } from 'pinia';
import axios from 'axios';

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as any[],
    filteredRockets: [] as any[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('https://api.spacexdata.com/v4/rockets');
        this.rockets = response.data;
        this.filteredRockets = response.data;
      } catch (err) {
        this.error = 'Failed to fetch rockets';
      } finally {
        this.loading = false;
      }
    },

    filterRockets(query: string) {
      this.filteredRockets = this.rockets.filter(rocket =>
        rocket.name.toLowerCase().includes(query.toLowerCase())
      );
    },

    addRocket(newRocket: any) {
      this.rockets.push(newRocket);
      this.filteredRockets = [...this.rockets];
    }
  }
});
