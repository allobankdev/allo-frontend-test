import { getRocketByFilter, getRocketById } from "@/api/rockets.api";
import type { ApiResponse } from "@/types/api.type";
import type { Rocket } from "@/types/rocket.type";
import { defineStore } from "pinia";

const STORAGE_KEY = "custom_rockets";

export const useRocketsStore = defineStore("rockets", {
  state: () => ({
    rockets: [] as Rocket[],
    rocketDetail: {} as Rocket,
    customRockets: [] as Rocket[],
  }),

  getters: {
    getAllRockets(): Rocket[] {
      return [...this.rockets, ...this.customRockets];
    },
  },

  actions: {
    loadCustomRockets() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.customRockets = JSON.parse(stored);
        }
      } catch (error) {
        console.error("Error loading custom rockets:", error);
        this.customRockets = [];
      }
    },

    saveCustomRockets() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.customRockets));
      } catch (error) {
        console.error("Error saving custom rockets:", error);
      }
    },

    addRocket(rocket: Omit<Rocket, "id">): string {
      const newRocket: Rocket = {
        ...rocket,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      this.customRockets.push(newRocket);
      this.saveCustomRockets();
      return newRocket.id;
    },

    async getRockets(
      name: string,
      active: string | null
    ): Promise<ApiResponse<Rocket[]>> {
      this.loadCustomRockets();

      const response = await getRocketByFilter(name, active);
      this.rockets = response.docs;

      let filteredCustomRockets = this.customRockets;

      if (name) {
        filteredCustomRockets = filteredCustomRockets.filter((rocket) =>
          rocket.name.toLowerCase().includes(name.toLowerCase())
        );
      }

      if (active !== null && active !== "") {
        const isActive = active === "true";
        filteredCustomRockets = filteredCustomRockets.filter(
          (rocket) => rocket.active === isActive
        );
      }

      const combinedDocs = [...response.docs, ...filteredCustomRockets];
      return {
        ...response,
        docs: combinedDocs,
        totalDocs: (response.totalDocs || 0) + filteredCustomRockets.length,
      };
    },

    async getRocketById(id: string): Promise<{ data: Rocket }> {
      if (id.startsWith("custom_")) {
        this.loadCustomRockets();
        const customRocket = this.customRockets.find(
          (rocket) => rocket.id === id
        );
        if (customRocket) {
          this.rocketDetail = customRocket;
          return { data: customRocket };
        }
        throw new Error("Custom rocket not found");
      }

      const response = await getRocketById(id);
      this.rocketDetail = response.data;
      return response;
    },
  },
});
