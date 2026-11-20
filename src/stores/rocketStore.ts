import { defineStore } from 'pinia';
import type { Rocket } from '@/types/rocket';
import { getSpaceXRockets, getRocketById } from '@/services/rocketApi';

interface RocketState {
  rockets: Rocket[];
  customRockets: Rocket[];
  selectedRocket: Rocket | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterStatus: 'all' | 'active' | 'retired';
  sortBy: 'name' | 'flight' | 'cost';
}

export const useRocketStore = defineStore('rocket', {
  state: (): RocketState => ({
    rockets: [],
    customRockets: [],
    selectedRocket: null,
    loading: false,
    error: null,
    searchQuery: '',
    filterStatus: 'all',
    sortBy: 'name',
  }),

  getters: {
    // All rockets combining API results and newly added custom rockets
    allRockets(state): Rocket[] {
      return [...state.customRockets, ...state.rockets];
    },

    // Filtered and sorted rockets list
    filteredRockets(state): Rocket[] {
      const all = [...state.customRockets, ...state.rockets];

      return all
        .filter((rocket) => {
          // 1. Search Query filter (matches full_name, name, or description)
          const q = state.searchQuery.toLowerCase().trim();
          const matchesQuery =
            !q ||
            rocket.full_name?.toLowerCase().includes(q) ||
            rocket.name?.toLowerCase().includes(q) ||
            rocket.description?.toLowerCase().includes(q);

          // 2. Status filter (active vs retired)
          let matchesStatus = true;
          if (state.filterStatus === 'active') {
            matchesStatus = rocket.active === true;
          } else if (state.filterStatus === 'retired') {
            matchesStatus = rocket.active === false;
          }

          return matchesQuery && matchesStatus;
        })
        .sort((a, b) => {
          if (state.sortBy === 'name') {
            return (a.full_name || '').localeCompare(b.full_name || '');
          }
          if (state.sortBy === 'flight') {
            const dateA = a.maiden_flight ? new Date(a.maiden_flight).getTime() : 0;
            const dateB = b.maiden_flight ? new Date(b.maiden_flight).getTime() : 0;
            return dateB - dateA; // Newest first
          }
          if (state.sortBy === 'cost') {
            const costA = a.launch_cost ? Number(a.launch_cost) : 0;
            const costB = b.launch_cost ? Number(b.launch_cost) : 0;
            return costB - costA; // Highest cost first
          }
          return 0;
        });
    },

    getRocketByIdLocal(state) {
      return (id: string | number): Rocket | undefined => {
        const strId = String(id);
        return [...state.customRockets, ...state.rockets].find(
          (r) => String(r.id) === strId
        );
      };
    },
  },

  actions: {
    async fetchRockets(force = false) {
      // Don't re-fetch if we already have data unless forced
      if (this.rockets.length > 0 && !force) return;

      this.loading = true;
      this.error = null;

      try {
        const data = await getSpaceXRockets();
        this.rockets = data;
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Unknown error occurred while fetching rockets.';
      } finally {
        this.loading = false;
      }
    },

    async fetchRocketDetail(id: string | number) {
      // Check local store first (especially for custom rockets added by user)
      const existing = this.getRocketByIdLocal(id);
      if (existing?.is_custom) {
        this.selectedRocket = existing;
        this.loading = false;
        this.error = null;
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const data = await getRocketById(id);
        this.selectedRocket = data;
      } catch (err: unknown) {
        // Fallback to local if API fails but we had list item
        if (existing) {
          this.selectedRocket = existing;
        } else {
          this.error = err instanceof Error ? err.message : 'Failed to load rocket details.';
        }
      } finally {
        this.loading = false;
      }
    },

    addRocket(newRocket: Omit<Rocket, 'id'>) {
      const customId = `custom-${Date.now()}`;
      const rocket: Rocket = {
        ...newRocket,
        id: customId,
        is_custom: true,
      };

      // Add to front of custom rockets list
      this.customRockets.unshift(rocket);
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    setFilterStatus(status: 'all' | 'active' | 'retired') {
      this.filterStatus = status;
    },

    setSortBy(sort: 'name' | 'flight' | 'cost') {
      this.sortBy = sort;
    },
  },
});
