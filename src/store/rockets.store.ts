import { getRocketByFilter } from "@/api/rockets.api";
import type { Crew } from "@/types/crew.type";
import type { Rocket } from "@/types/rocket.type";
import { defineStore } from "pinia";

export const useRocketsStore = defineStore("rockets", {
  state: () => ({
    rockets: [] as Rocket[],
    crews: [] as Crew[],
  }),

  actions: {
    async getRockets(name: string, active: string | null) {
      const response = await getRocketByFilter(name, active);
      this.rockets = response.docs;
    },
  },
});
