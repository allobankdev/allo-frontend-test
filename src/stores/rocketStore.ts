import { defineStore } from 'pinia';
import { fetchRocketsApi, fetchRocketByIdApi, type Rocket } from '../services/api';

interface RocketState {
  rockets: Rocket[];
  selectedRocket: Rocket | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export const useRocketStore = defineStore('rocket', {
  state: (): RocketState => ({
    rockets: [],
    selectedRocket: null,
    isLoading: false,
    errorMessage: null,
  }),
  
  getters: {
    filteredRockets: (state) => {
      return (searchQuery: string) => {
        if (!searchQuery) return state.rockets;
        const query = searchQuery.toLowerCase();
        return state.rockets.filter(rocket => 
          rocket.full_name.toLowerCase().includes(query) || 
          (rocket.description && rocket.description.toLowerCase().includes(query))
        );
      };
    }
  },
  
  actions: {
    async fetchRockets() {
      this.isLoading = true;
      this.errorMessage = null;
      try {
        const response = await fetchRocketsApi();
        this.rockets = response.results;
      } catch (error: any) {
        console.error('Error fetching rockets:', error);
        this.errorMessage = 'Failed to fetch rockets data. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchRocketById(id: string | number) {
      this.isLoading = true;
      this.errorMessage = null;
      this.selectedRocket = null; 
      try {
        if (typeof id === 'string' && id.startsWith('fake-')) {
          const fakeRocket = this.rockets.find(r => r.id === id);
          if (fakeRocket) {
            this.selectedRocket = fakeRocket;
            this.isLoading = false;
            return;
          }
        }

        const rocket = await fetchRocketByIdApi(id);
        this.selectedRocket = rocket;
      } catch (error: any) {
        console.error(`Error fetching rocket ${id}:`, error);
        this.errorMessage = 'Failed to fetch rocket details. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    
    addFakeRocket(rocketData: Partial<Rocket>) {
      const newRocket: Rocket = {
        id: `fake-${Date.now()}`,
        full_name: rocketData.full_name || 'Unknown Rocket',
        description: rocketData.description || 'No description provided.',
        image_url: rocketData.image_url || null,
        launch_cost: rocketData.launch_cost || null,
        maiden_flight: rocketData.maiden_flight || null,
        manufacturer: {
          country_code: 'Unknown',
        }
      };

      this.rockets.unshift(newRocket);
    }
  }
});
