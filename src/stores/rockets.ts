import { defineStore } from "pinia";
import { fetchRocketById, fetchRockets } from "@/api";
import { createLocalRocket } from "@/mappers";
import type { AddRocketPayload, RequestStatus, Rocket } from "@/types";
import { getErrorMessage, isNotFoundError, isRequestCanceled } from "@/utils";

let detailRequestSeq = 0;

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

    isDetailNotFound(state): boolean {
      return (
        state.detailStatus === "error" && state.detailError === "Rocket not found"
      );
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
      const hasData =
        this.rockets.length > 0 || this.localRockets.length > 0;

      if (!hasData) {
        this.listStatus = "loading";
      }
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

    async loadRocketDetail(id: string | number, signal?: AbortSignal) {
      const key = String(id);
      const requestId = ++detailRequestSeq;
      this.detailError = null;

      const cachedRocket =
        this.localRockets.find((rocket) => rocket.id === key) ??
        this.rockets.find((rocket) => rocket.id === key);

      if (cachedRocket) {
        this.selectedRocket = cachedRocket;
        this.detailStatus = "success";
        return;
      }

      this.detailStatus = "loading";
      this.selectedRocket = null;

      try {
        const rocket = await fetchRocketById(key, signal);
        if (requestId !== detailRequestSeq) return;

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
        if (requestId !== detailRequestSeq) return;

        this.selectedRocket = null;
        this.detailStatus = "error";
        this.detailError = isNotFoundError(err)
          ? "Rocket not found"
          : getErrorMessage(err, "Failed to load rocket detail");
      }
    },
  },
});
