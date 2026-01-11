import { defineStore } from "pinia";
import { rocketService } from "@/utils/services/rocket.services";
import { type RocketListDTO } from "@/utils/dto/rocket.dto";

export const useRocketStore = defineStore("rocket", {
  state: () => ({
    list: [] as RocketListDTO[],
    selected: null as RocketListDTO | null,
    loading: false,
    error: false,
    filters: {
      search: "",
      active: null as boolean | null,
    },
    pagination: {
      page: 1,
      itemsPerPage: 10,
    },
  }),

  getters: {
    filteredList: (state) => {
      return state.list.filter((r) => {
        const matchSearch = r.name
          .toLowerCase()
          .includes(state.filters.search.toLowerCase());
        const matchActive =
          state.filters.active === null || r.active === state.filters.active;
        return matchSearch && matchActive;
      });
    },
    paginatedList(state): RocketListDTO[] {
      const start = (state.pagination.page - 1) * state.pagination.itemsPerPage;
      const end = start + state.pagination.itemsPerPage;

      return this.filteredList.slice(start, end);
    },
    totalPages(state): number {
      return Math.ceil(
        this.filteredList.length / state.pagination.itemsPerPage
      );
    },
  },

  actions: {
    async fetchList() {
      this.loading = true;
      this.error = false;
      try {
        this.list = await rocketService.list();
      } catch (err) {
        this.error = true;
        // console.error('Fetch error:', err)
      } finally {
        this.loading = false;
      }
    },

    async fetchDetail(id: string) {
      this.loading = true;
      this.error = false;
      try {
        const cached = this.list.find((r) => r.id === id);
        this.selected = cached ?? (await rocketService.detail(id));
      } catch (err) {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    // Action Reset Filter
    resetFilters() {
      this.filters.search = "";
      this.filters.active = null;
    },

    addRocket(payload: any) {
      const newRocket = {
        ...payload,
        id: crypto.randomUUID(),
        // add default image if no image provided
        flickr_images: payload.flickr_images || [
          "https://images.unsplash.com/photo-1517976487492-5750f3195933",
        ],
      };

      this.list.unshift(newRocket); 
      this.pagination.page = 1; 
    },

    // Insert dummy ID
    addRocketMock(payload: Omit<RocketListDTO, "id">) {
      const newRocket = {
        ...payload,
        id: crypto.randomUUID(), // Generate UUID
      } as RocketListDTO;

      this.list.unshift(newRocket);
    },
  },
});
