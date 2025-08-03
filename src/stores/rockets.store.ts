import { getRocketByFilter, getRocketById } from "@/api/rockets.api";
import type { ApiResponse } from "@/types/api.type";
import type { Rocket } from "@/types/rocket.type";
import { defineStore } from "pinia";

export const useRocketsStore = defineStore("rockets", {
  state: () => ({
    rockets: [] as Rocket[],
    rocketDetail: {} as Rocket,
  }),

  actions: {
    async getRockets(
      name: string,
      active: string | null
    ): Promise<ApiResponse<Rocket[]>> {
      const response = await getRocketByFilter(name, active);
      this.rockets = response.docs;
      return response;
    },
    async getRocketById(id: string): Promise<{ data: Rocket }> {
      const response = await getRocketById(id);
      this.rocketDetail = response.data;
      return response;
    },
  },
});
