import { defineStore } from 'pinia';
import { fetchRockets, type Rocket } from '@/services/api';

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    userAddedRockets: [] as Rocket[],
    loading: false,
    error: null as string | null,
    searchQuery: '',
  }),

  actions: {
    async loadRockets() {
      this.loading = true;
      this.error = null;
      try {
        this.rockets = await fetchRockets();
      } catch (err) {
        this.error = 'Failed to load rockets. Please try again.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    addRocket(rocket: Omit<Rocket, 'id'>) {
      const newRocket: Rocket = {
        ...rocket,
        id: `user-${Date.now()}`,
      };
      this.userAddedRockets.unshift(newRocket);
    }
  },

  getters: {
    allRockets: (state) => {
      return [...state.userAddedRockets, ...state.rockets];
    },
    filteredRockets(): Rocket[] {
      const query = this.searchQuery.toLowerCase();
      return this.allRockets.filter(r => 
        r.name.toLowerCase().includes(query) || 
        r.description.toLowerCase().includes(query)
      );
    },
    getRocketById: (state) => (id: string) => {
      return [...state.userAddedRockets, ...state.rockets].find(r => r.id === id);
    }
  }
});
