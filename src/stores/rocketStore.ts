import { defineStore } from "pinia";
import type { Rocket, CreateRocketDto, RocketFilters } from "../types/rocket";
import { rocketService } from "../services/rocketService";

interface RocketState {
  rockets: Rocket[];
  currentRocket: Rocket | null;
  loading: boolean;
  error: string | null;
  filters: RocketFilters;
}

export const useRocketStore = defineStore("rocket", {
  state: (): RocketState => ({
    rockets: [],
    currentRocket: null,
    loading: false,
    error: null,
    filters: {
      active: null,
      country: "",
      search: "",
    },
  }),

  getters: {
    filteredRockets: (state): Rocket[] => {
      let filtered = [...state.rockets];

      // Filter by status
      if (state.filters.active !== null) {
        filtered = filtered.filter(
          (rocket) => rocket.active === state.filters.active
        );
      }

      // Filter by country
      if (state.filters.country.trim()) {
        filtered = filtered.filter((rocket) =>
          rocket.country
            .toLowerCase()
            .includes(state.filters.country.toLowerCase().trim())
        );
      }

      // Search by name or description
      if (state.filters.search.trim()) {
        const searchTerm = state.filters.search.toLowerCase().trim();
        filtered = filtered.filter(
          (rocket) =>
            rocket.rocket_name.toLowerCase().includes(searchTerm) ||
            rocket.description.toLowerCase().includes(searchTerm)
        );
      }

      return filtered;
    },

    uniqueCountries: (state): string[] => {
      const countries = state.rockets.map((rocket) => rocket.country);
      return [...new Set(countries)].sort();
    },
  },

  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = null;
      try {
        this.rockets = await rocketService.getRockets();
      } catch (error: any) {
        this.error = this.getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchRocketById(id: string) {
      this.loading = true;
      this.error = null;
      try {
        this.currentRocket = await rocketService.getRocketById(id);
      } catch (error: any) {
        this.error = this.getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addRocket(rocketData: CreateRocketDto) {
      this.loading = true;
      try {
        // Pastikan flickr_images ada (convert dari image_url jika perlu)
        const rocketWithImages = {
          ...rocketData,
          flickr_images:
            rocketData.flickr_images ||
            (rocketData.image_url ? [rocketData.image_url] : []),
        };

        // Remove image_url dari data yang akan disimpan
        const { image_url, ...rocketDataToSave } = rocketWithImages;

        const newRocket = await rocketService.createRocket(rocketDataToSave);
        this.rockets.unshift(newRocket);
        return newRocket;
      } catch (error: any) {
        this.error = this.getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setFilters(filters: Partial<RocketFilters>) {
      this.filters = { ...this.filters, ...filters };
    },

    clearFilters() {
      this.filters = {
        active: null,
        country: "",
        search: "",
      };
    },

    clearError() {
      this.error = null;
    },

    getErrorMessage(error: any): string {
      if (error.response) {
        // Server responded with error
        switch (error.response.status) {
          case 404:
            return "Rocket not found. Please check the ID.";
          case 500:
            return "Server error. Please try again later.";
          default:
            return `Error: ${
              error.response.data?.message || "Unknown server error"
            }`;
        }
      } else if (error.request) {
        // Request made but no response
        return "Network error. Please check your internet connection.";
      } else {
        // Something else
        return error.message || "An unexpected error occurred.";
      }
    },
  },
});
