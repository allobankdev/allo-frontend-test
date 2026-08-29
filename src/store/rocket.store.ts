import { defineStore } from "pinia";
import { getRockets } from "@/api/rocket";
import type { TRocket } from "@/types/rocket";

export const useRocketStore = defineStore("rocket", {
  state: () => ({
    rockets: [] as TRocket[],
    loading: false,
    error: null as string | null,

    // filter
    search: "",

    // pagination
    page: 1,
    itemsPerPage: 6,
  }),

  getters: {
    filteredRockets: (state) =>
      state.rockets.filter((r) =>
        r.name.toLowerCase().includes(state.search.toLowerCase()),
      ),

    // pagination
    paginatedRockets(): TRocket[] {
      const start = (this.page - 1) * this.itemsPerPage;
      return this.filteredRockets.slice(start, start + this.itemsPerPage);
    },

    totalPages(): number {
      return Math.ceil(this.filteredRockets.length / this.itemsPerPage);
    },
  },

  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = null;

      try {
        this.rockets = await getRockets();
      } catch (err: any) {
        this.error = err?.message || "Failed to load rockets";
      } finally {
        this.loading = false;
      }
    },

    setSearch(value: string) {
      this.search = value;
      this.page = 1; // reset page
    },

    setPage(page: number) {
      this.page = page;
    },

    addRocket(rocket: TRocket) {
      this.rockets.unshift(rocket);

      this.page = 1;
    },
  },
});
