import axios from "axios";
import type { Rocket, RocketListResponse } from "@/types/rocket";

const apiClient = axios.create({
  baseURL: "https://lldev.thespacedevs.com/2.2.0",
  timeout: 15000,
});

// Fetch all SpaceX rockets from the API.
export async function fetchRockets(): Promise<Rocket[]> {
  const response = await apiClient.get<RocketListResponse>(
    "/config/launcher/",
    {
      params: {
        manufacturer__name: "SpaceX",
        mode: "detailed",
        limit: 20,
      },
    },
  );
  return response.data.results;
}

// Fetch a single rocket by ID from the API.
export async function fetchRocketById(id: number | string): Promise<Rocket> {
  const response = await apiClient.get<Rocket>(`/config/launcher/${id}/`);
  return response.data;
}
