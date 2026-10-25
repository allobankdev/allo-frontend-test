import axios from "axios";

import type { Rocket, RocketListResponse } from "../types/rocket";

const apiClient = axios.create({
  baseURL: "https://lldev.thespacedevs.com/2.2.0/config/launcher",
  timeout: 10000,
});

export const rocketApi = {
  async getSpaceXRockets(): Promise<Rocket[]> {
    const response = await apiClient.get<RocketListResponse>("/", {
      params: {
        manufacturer__name: "SpaceX",
        mode: "detailed",
        limit: 20,
      },
    });
    return response.data.results;
  },

  async getRocketDetail(id: number | string): Promise<Rocket> {
    const response = await apiClient.get<Rocket>(`/${id}/`);
    return response.data;
  },
};
