import { getRockets } from "@/api/getRockets";
import type { Rocket } from "@/api/getRockets/type";
import axios from "axios";
import { defineStore } from "pinia";

export const useRocketStore = defineStore("rocket" ,{
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    errorMsg: "",
  }),
  getters: {
    getRocketById: (state) => (id: string) => {
      return state.rockets.find((rocket) => rocket.id === id);
    },
  },
  actions: {
    async fetchRockets() {
      this.loading = true;
      this.errorMsg = "";
      try {
        const data = await getRockets();
        if (data) {
          this.rockets = data;
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          this.errorMsg = error.message ?? "Failed to get rockets";
        } else {
          this.errorMsg = "Failed to get rockets";
        }
      } finally {
        this.loading = false;
      }
    },
    addRocket(rocket: Rocket) {
      this.rockets.unshift(rocket);
    }
  }
})