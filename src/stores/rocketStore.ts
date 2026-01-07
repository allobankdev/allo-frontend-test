import { defineStore } from "pinia";
import { rocketService } from "@/services/rocketService";
import type { Rocket, RocketState, FilterState } from "@/types/rocket";

const STORAGE_KEY = "spacex_rockets_local";

export const useRocketStore = defineStore("rocket", {
  state: (): RocketState => ({
    rockets: [],
    loading: false,
    error: null,
    filters: {
      searchQuery: "",
      activeStatus: "all",
      sortBy: "name",
    },
  }),

  getters: {
    filteredRockets: (state): Rocket[] => {
      let filtered = [...state.rockets];

      // 1. Search by name
      if (state.filters.searchQuery.trim()) {
        const query = state.filters.searchQuery.toLowerCase();
        filtered = filtered.filter((rocket) =>
          rocket.name.toLowerCase().includes(query)
        );
      }

      // 2. Filter by active status
      if (state.filters.activeStatus !== "all") {
        const isActive = state.filters.activeStatus === "active";
        filtered = filtered.filter((rocket) => rocket.active === isActive);
      }

      // 3. Sort
      switch (state.filters.sortBy) {
        case "cost":
          filtered.sort((a, b) => a.cost_per_launch - b.cost_per_launch);
          break;
        case "date":
          filtered.sort(
            (a, b) =>
              new Date(a.first_flight).getTime() -
              new Date(b.first_flight).getTime()
          );
          break;
        case "name":
        default:
          filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      return filtered;
    },

    getRocketById: (state) => {
      return (id: string): Rocket | undefined => {
        return state.rockets.find((rocket) => rocket.id === id);
      };
    },
  },

  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = null;

      try {
        // Fetch from API
        const apiRockets = await rocketService.fetchAllRockets();

        // Load local rockets from localStorage
        const localRockets = this.loadLocalRockets();

        // Combine API and local rockets
        this.rockets = [...apiRockets, ...localRockets];
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to fetch rockets";
        console.error("Error in fetchRockets:", error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 1000); // Simulate loading delay
      }
    },

    addRocket(rocket: Omit<Rocket, "id">) {
      // Generate local ID
      const newRocket: Rocket = {
        ...rocket,
        id: `local-${Date.now()}`,
      };

      this.rockets.push(newRocket);
      this.saveLocalRockets();
      this.fetchRockets();
    },

    setFilter(filters: Partial<FilterState>) {
      this.filters = { ...this.filters, ...filters };
    },

    resetFilters() {
      this.filters = {
        searchQuery: "",
        activeStatus: "all",
        sortBy: "name",
      };
    },

    // LocalStorage helpers
    loadLocalRockets(): Rocket[] {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error("Error loading local rockets:", error);
        return [];
      }
    },

    saveLocalRockets() {
      try {
        const localRockets = this.rockets.filter((r) =>
          r.id.startsWith("local-")
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localRockets));
      } catch (error) {
        console.error("Error saving local rockets:", error);
      }
    },
  },
});
