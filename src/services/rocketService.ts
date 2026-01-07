// src/services/rocketService.ts

import type { Rocket } from "@/types/rocket";

const API_BASE_URL = "https://api.spacexdata.com/v4";

export const rocketService = {
  async fetchAllRockets(): Promise<Rocket[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/rockets`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching rockets:", error);
      throw error;
    }
  },

  async getRocketById(id: string): Promise<Rocket> {
    try {
      const response = await fetch(`${API_BASE_URL}/rockets/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching rocket detail:", error);
      throw error;
    }
  },
};
