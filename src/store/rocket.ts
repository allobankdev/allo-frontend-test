import { defineStore } from 'pinia';
import { fetchRockets } from '@/services/spaceXApi';
import type { IDataRocket } from '@/types/rocket';

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as IDataRocket[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Fetch the rockets from the API
    async loadRockets() {
      this.loading = true;
      this.error = null;
      try {
        this.rockets = await fetchRockets();
      } catch (err) {
        this.error = 'Failed to fetch rockets.';
      } finally {
        this.loading = false;
      }
    },

    // Add a rocket to the list
    addRocket(rocket: IDataRocket) {
      console.log('Adding rocket:');

      this.rockets.push(rocket);
    }
  }
});
