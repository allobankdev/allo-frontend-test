import { defineStore } from "pinia";
import { getDataById, getDatas } from "../api/request";

export const useRocketStore = defineStore("rocket", {
  state: () => ({
    rockets: [] as any[],
    rocket: null as any | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = null;
      try {
        const rest = await getDatas();
        this.rockets = rest.data;
        console.log(this.rockets);
      } catch (error) {
          this.error = 'Failed to fetch rockets';
      } finally {
        this.loading = false;
      }
    },

    async fetchRocketById(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const rest = await getDataById(id);
        this.rocket = rest.data;
        console.log(this.rocket);
      } catch (error) {
        this.error = 'Failed to fetch rocket';
      } finally {
        this.loading = false;
      }
    },

    async AddRocket(rocketData: any) {
      this.rockets.unshift({
        name: rocketData.name,
        description: rocketData.description,
        id: Date.now().toString(),
        image: rocketData.image,
      });
    }
  }

})
