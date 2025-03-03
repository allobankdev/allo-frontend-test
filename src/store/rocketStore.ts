import { defineStore } from 'pinia';
import axios from 'axios';

export const useRocketStore = defineStore('rocketStore', {
  state: () => ({
    rockets: [] as any[],
    loading: false,
    error: null as String | null,
  }),
  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('https://api.spacexdata.com/v4/rockets');
        this.rockets = response.data;
      } catch (err) {
        this.error = 'Failed to fetch rockets';
      } finally {
        this.loading = false;
      }
    }
  }
});
