import { defineStore } from "pinia";
import { getRockets, getRocketById } from "@/api/spacex";
import type { Rocket } from "@/types/rocket";
import { toRaw } from "vue";
import { useNotificationStore } from "./notification.store";

const notification = useNotificationStore();

export const useRocketStore = defineStore("rocket", {
  state: () => ({
    createdRockets: [] as Rocket[],
    rockets: [] as Rocket[],
    selectedRocket: null as Rocket | null,
    loading: false,
    error: false,
  }),

  actions: {
    async fetchRockets() {
      this.loading = true;
      this.error = false;
      try {
        const res = await getRockets();
        this.rockets = res.data;
      } catch {
        this.error = true;
        notification.notify("Something went wrong", "error");
      } finally {
        this.loading = false;
      }
    },

    async fetchRocket(id: string) {
      this.loading = true;
      this.error = false;

      const rocketClient = this.rockets.find((rocketId) => rocketId.id === id);

      if (!rocketClient) {
        try {
          const res = await getRocketById(id);
          this.selectedRocket = res.data;
        } catch {
          this.error = true;

          notification.notify("Something went wrong", "error");
        } finally {
          this.loading = false;
        }
      } else {
        this.selectedRocket = rocketClient;
        this.loading = false;
      }
    },

    addRocket(data: Rocket) {
      this.rockets.push(toRaw(data));
      this.createdRockets.push(data);
      notification.notify("Success Add Rocket", "success");
    },
  },
});
