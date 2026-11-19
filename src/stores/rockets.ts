import { defineStore } from "pinia";
import { fetchRocketById, fetchRockets } from "@/api";
import { createLocalRocket } from "@/mappers";
import type { AddRocketPayload, RequestStatus, Rocket } from "@/types";
import { getErrorMessage, isNotFoundError, isRequestCanceled } from "@/utils";

function matchesFilter(rocket: Rocket, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    rocket.fullName.toLowerCase().includes(q) ||
    rocket.description.toLowerCase().includes(q)
  );
}

export const useRocketStore = defineStore("rockets", {
  state: () => ({
    rockets: [] as Rocket[],
    localRockets: [] as Rocket[],
    filterQuery: "",
    selectedRocket: null as Rocket | null,
    listStatus: "idle" as RequestStatus,
    listError: null as string | null,
    detailStatus: "idle" as RequestStatus,
    detailError: null as string | null,
  }),

  getters: {
    allRockets(state): Rocket[] {
      return [...state.rockets, ...state.localRockets];
    },

    filteredRockets(): Rocket[] {
      const query = this.filterQuery.trim();
      return this.allRockets.filter((rocket) => matchesFilter(rocket, query));
    },

    getRocketById(state) {
      return (id: string | number): Rocket | undefined => {
        const key = String(id);
        return (
          state.localRockets.find((rocket) => rocket.id === key) ??
          state.rockets.find((rocket) => rocket.id === key) ??
          (state.selectedRocket?.id === key ? state.selectedRocket : undefined)
        );
      };
    },
  },

  actions: {
    setFilterQuery(query: string) {
      this.filterQuery = query;
    },

    addRocket(payload: AddRocketPayload): Rocket {
      const rocket = createLocalRocket(payload);
      this.localRockets.push(rocket);
      return rocket;
    },

    async loadRockets(signal?: AbortSignal) {
      this.listStatus = "loading";
      this.listError = null;

      try {
        this.rockets = await fetchRockets(signal);
        this.listStatus = "success";
      } catch (err) {
        if (isRequestCanceled(err)) return;
        this.listStatus = "error";
        this.listError = getErrorMessage(err, "Failed to load rockets");
      }
    },

    async retryLoadRockets(signal?: AbortSignal) {
      return this.loadRockets(signal);
    },

    async loadRocketDetail(id: string | number, signal?: AbortSignal) {
      const key = String(id);
      this.detailStatus = "loading";
      this.detailError = null;
      this.selectedRocket = null;

      const cached = this.getRocketById(key);
      if (cached?.isLocal) {
        this.selectedRocket = cached;
        this.detailStatus = "success";
        return;
      }

      try {
        const rocket = await fetchRocketById(key, signal);
        this.selectedRocket = rocket;

        const index = this.rockets.findIndex((item) => item.id === rocket.id);
        if (index >= 0) {
          this.rockets[index] = rocket;
        } else {
          this.rockets.push(rocket);
        }

        this.detailStatus = "success";
      } catch (err) {
        if (isRequestCanceled(err)) return;

        this.selectedRocket = null;
        this.detailStatus = "error";
        this.detailError = isNotFoundError(err)
          ? "Rocket not found"
          : getErrorMessage(err, "Failed to load rocket detail");
      }
    },

    async retryLoadRocketDetail(id: string | number, signal?: AbortSignal) {
      return this.loadRocketDetail(id, signal);
    },
  },
});
