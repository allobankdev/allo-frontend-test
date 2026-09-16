import { defineStore } from "pinia";
import { fetchRockets, RocketApiError } from "@/api/rockets";
import type { Rocket } from "@/types/rocket";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface RocketsState {
  rockets: Rocket[];
  status: FetchStatus;
  errorMessage: string | null;
  filterQuery: string;
}

export const useRocketsStore = defineStore("rockets", {
  state: (): RocketsState => ({
    rockets: [],
    status: "idle",
    errorMessage: null,
    filterQuery: "",
  }),

  getters: {
    filteredRockets(state): Rocket[] {
      const query = state.filterQuery.trim().toLowerCase();
      if (!query) return state.rockets;

      return state.rockets.filter((rocket) =>
        rocket.name.toLowerCase().includes(query),
      );
    },

    getRocketById: (state) => {
      return (id: number): Rocket | undefined =>
        state.rockets.find((rocket) => rocket.id === id);
    },
  },

  actions: {
    async loadRockets() {
      if (this.status === "loading") return;
      this.status = "loading";
      this.errorMessage = null;

      try {
        this.rockets = await fetchRockets();
        this.status = "success";
      } catch (err) {
        this.status = "error";
        this.errorMessage =
          err instanceof RocketApiError ? err.message : "Something went wrong";
      }
    },

    addRocket(rocket: Omit<Rocket, "id">) {
      const localId = Date.now();
      this.rockets.unshift({ id: localId, ...rocket });
    },

    setFilterQuery(query: string) {
      this.filterQuery = query;
    },
  },
});
