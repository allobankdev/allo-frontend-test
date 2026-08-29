import { defineStore } from 'pinia';
import apiClient from '@/services/api';

export interface Rocket {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
  cost_per_launch: number;
  country: string;
  first_flight: string;
}

export const useRocketStore = defineStore('rocket', {
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
        const response = await apiClient.get<Rocket[]>('/rockets');
        this.rockets = response.data;
      } catch (err: unknown) {
        this.error = 'Failed to fetch rockets. Please try again.';
        console.error('Error fetching rockets:', err);
      } finally {
        this.loading = false;
      }
    },
    async fetchRocketById(id: string) {
        this.loading = true;
        this.error = null;
        try {
            const response = await apiClient.get<Rocket>(`/rockets/${id}`);
            return response.data;
        } catch (err: unknown) {
            this.error = 'Failed to fetch rocket details.';
             console.error('Error fetching rocket details:', err);
             throw err;
        } finally {
            this.loading = false;
        }
    },
    addRocket(rocket: Rocket) {
        this.rockets.push(rocket);
    }
  },
});
