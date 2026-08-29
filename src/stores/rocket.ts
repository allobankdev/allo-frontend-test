import { defineStore } from "pinia";
import type { Rocket } from "@/services/spacexService";
import { fetchRockets } from "@/services/spacexService";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface RocketState {
  rockets: Rocket[];
  userCreatedRockets: Rocket[];
  status: FetchStatus;
  errorMessage: string | null;
  filterText: string;
}

export const useRocketStore = defineStore("rocket", {
  state: (): RocketState => ({
    rockets: [],
    userCreatedRockets: [],
    status: "idle",
    errorMessage: null,
    filterText: "",
  }),
  getters: {
    allRockets(state): Rocket[] {
      return [...state.rockets, ...state.userCreatedRockets];
    },
    filteredRockets(state): Rocket[] {
      const term = state.filterText.trim().toLowerCase();
      const fromApi = state.rockets;

      const userList = !term
        ? state.userCreatedRockets
        : state.userCreatedRockets.filter((rocket) =>
            rocket.name.toLowerCase().includes(term)
          );

      return [...fromApi, ...userList];
    },
  },
  actions: {
    async fetchRockets(search?: string) {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const term = (search ?? this.filterText).trim();
        const rockets = await fetchRockets({ search: term });
        this.rockets = rockets;
        this.status = "success";
      } catch (error: unknown) {
        this.status = "error";

        let message = "Failed to fetch rockets";

        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === "string") {
          message = error;
        }

        this.errorMessage = message;
      }
    },
    setFilterText(value: string) {
      this.filterText = value;
    },
    addRocket(rocket: Rocket) {
      this.userCreatedRockets.push(rocket);
    },
    getRocketById(id: string): Rocket | undefined {
      return this.allRockets.find((rocket) => rocket.id === id);
    },
  },
});
