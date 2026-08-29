import { defineStore } from 'pinia'
import type { DisplayRocket } from "@/schema/rocket.schema";



export const useRocketListDisplayStore = defineStore("display-rocket", {
  state: () => ({
    rockets: [] as DisplayRocket[],
  }),

  actions: {
    store(rockets:DisplayRocket[] ){
      this.rockets = rockets
    }
  },
});
