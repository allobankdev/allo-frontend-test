import { defineStore } from "pinia";
import api from "../plugins/axios";
import { handleAxiosError } from "../utils/handleAxiosError";

import type { Rocket } from "../types/rocket";
import type { QueryResponse } from "../types/api";
import type { RocketQueryBody } from "../types/rocket-query";

export const DEFAULT_QUERY: RocketQueryBody = {
  query: {},
  options: {
    page: 1,
    limit: 10,
  },
};

export const useRocketStore = defineStore("rocket", {
  state: () => ({
    rockets: [] as Rocket[],
    loading: true,
    error: false,
    errorMessage: "",

    lastQuery: DEFAULT_QUERY,
    keyword: "",
    activeFilter: null as boolean | null,
  }),

  actions: {
    async queryRockets(body: RocketQueryBody = DEFAULT_QUERY) {
      this.loading = true;
      this.error = false;
      this.lastQuery = body;

      const finalBody: RocketQueryBody = {
        ...DEFAULT_QUERY,
        ...body,
        options: {
          ...DEFAULT_QUERY.options,
          ...body.options,
        },
      };

      try {
        const { data } = await api.post<QueryResponse<Rocket>>(
          "/rockets/query",
          finalBody
        );

        this.rockets = data.docs;
      } catch (error) {
        this.error = true;
        this.errorMessage = handleAxiosError(error);
      } finally {
        this.loading = false;
      }
    },

    async getRocket(id: string): Promise<Rocket | null> {
      this.loading = true;
      this.error = false;

      try {
        const { data } = await api.get<Rocket>(`/rockets/${id}`);

        return data;
      } catch (error) {
        this.error = true;
        this.errorMessage = handleAxiosError(error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    getRocketMockup(id: string): Rocket | null {
      this.loading = false;
      this.error = false;

      return this.rockets.find((rocket) => rocket.id === id) ?? null;
    },

    addRocket(newRocket: Partial<Rocket>) {
      this.rockets = [newRocket as Rocket, ...this.rockets];
    },
  },
});
