import { defineStore } from "pinia";
import { spacexApiClient } from "@/apiclient/spacex-apiclient";
import { RocketSchema } from "@/schema/rocket.schema";
import type { Rocket } from "@/schema/rocket.schema";

export const useRocketStore = defineStore("rocket", {
  state: () => ({
    currentRocketId: undefined as undefined | string,
    rocket: undefined as undefined | Rocket,
    loading: false,
    error: null as string | null,
    total: 0,
  }),

  actions: {
    async getRocket(rocketId: string) {
      this.currentRocketId = rocketId;
      this.loading = true;
      this.error = null;

      try {
        const response = await spacexApiClient.get(`/rockets/${rocketId}`);

        const parsed = RocketSchema.parse(response.data);

        this.rocket = parsed;
      } catch (err) {
        console.error(err);
        this.error = "Failed to fetch rocket data";
      } finally {
        this.loading = false;
      }
    },

    retry() {
      if (this.currentRocketId) {
        this.getRocket(this.currentRocketId);
      }
    },
  },
});
