import { defineStore } from 'pinia'
import { spacexApiClient } from '@/apiclient/spacex-apiclient'
import { RocketQuerySchema } from '@/schema/rocket.schema'
import type { Rocket } from '@/schema/rocket.schema'



export const useRocketListStore = defineStore("rocket-list", {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: null as string | null,
    total: 0,
    search: "",
  }),

  actions: {
    async queryAllRockets(search= "") {
      this.search = search
      this.loading = true;
      this.error = null;

      try {
        const response = await spacexApiClient.post("/rockets/query", {
          query: this.search
            ? {
                name: {
                  $regex: this.search,
                  $options: "i", 
                },
              }
            : {},
          options: {
            pagination: false,
          },
        });

        const parsed = RocketQuerySchema.parse(response.data);

        this.rockets = parsed.docs;
        this.total = parsed.totalDocs;
      } catch (err) {
        console.error(err);
        this.error = "Failed to fetch rocket data";
      } finally {
        this.loading = false;
      }
    },

    retry() {
      this.queryAllRockets();
    },
  },
});
