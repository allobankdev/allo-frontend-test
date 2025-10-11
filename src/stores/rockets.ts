import { defineStore } from 'pinia';
import { fetchRockets } from '@/api/spacex';
import type { NewRocket, Rocket, RocketState } from '@/types/rocket';

export const useRocketsStore = defineStore('rockets', {
  state: (): RocketState => ({
      rockets: [],
      loading: false,
      error: null,
      filter: '',
      filteredRockets: [],
      pagination: {
          page: 0,
          limit: 0,
          totalDocs: 0,
          totalPages: 0
      }
  }),

  getters: {
    getRocketById: (state) => (id: string) => {
      return state.rockets.find(rocket => rocket.id === id);
    }
  },

  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = null;

      try {
        let rockets = [];
        const queryObject = {
          query: {},
          options: {}
        }
        if (this.filter) {
          const filterLower = this.filter.toLowerCase();
          queryObject.query = {
            $or: [
              { name: { $regex: filterLower, $options: 'i' } },
              { description: { $regex: filterLower, $options: 'i' } },
              { country: { $regex: filterLower, $options: 'i' } }
            ]
          };
          rockets = await fetchRockets(queryObject);
          this.addRockets(rockets.docs)
        } else {
          rockets = await fetchRockets();
          this.addRockets(rockets)
        }


      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch rockets';
      } finally {
        this.loading = false;
      }
    },


    setFilter(filter: string) {
      this.filter = filter;
      this.fetchRockets()
    },

    addRockets(rockets: any[]) {
      this.rockets = [];
      for (const newRocket of rockets) {
        const rocket: Rocket = {
          id: newRocket.id,
          name: newRocket.name,
          description: newRocket.description,
          cost_per_launch: newRocket.cost_per_launch,
          country: newRocket.country,
          first_flight: newRocket.first_flight,
          flickr_images: newRocket.flickr_images,
          active: true
        };
        this.rockets.push(rocket);
      }
    },

    addRocket(newRocket: NewRocket) {
      const id = `custom-${Date.now().toString(36)}`;

      const rocket: Rocket = {
        id,
        name: newRocket.name,
        description: newRocket.description,
        cost_per_launch: newRocket.cost_per_launch,
        country: newRocket.country,
        first_flight: newRocket.first_flight,
        flickr_images: [newRocket.image_url],
        active: true
      };

      this.rockets.push(rocket);
    }
  }
});