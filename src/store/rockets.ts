import { defineStore } from 'pinia';
import axios from 'axios';
import type { Rocket, RocketFormData } from '@/types/rocket';

export const useRocketStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: false,
  }),
  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = false;
      try {
        const res = await axios.get('https://api.spacexdata.com/v4/rockets');
        this.rockets = res.data;
      } catch (e) {
        console.error('Error fetching rockets:', e);
        this.error = true;
        this.loading = false;
      } finally {
        this.loading = false;
      }
    },
    addRocket(rocket: RocketFormData) {
      this.loading = true;
      const newRocket: Rocket = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
        ...rocket
      };
      this.rockets.push(newRocket);
      this.loading = false;
    },
  }
});
