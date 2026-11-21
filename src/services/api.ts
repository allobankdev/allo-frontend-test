import axios from "axios";
import type { RocketApi, RocketListResponse } from "@/types/rockets";

const api = axios.create({
  baseURL: "https://lldev.thespacedevs.com/2.2.0",
  timeout: 15000,
});

export const fetchRockets = async (): Promise<RocketApi[]> => {
  const response = await api.get<RocketListResponse>(
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
};

export const fetchRocketById = async (
  id: string,
): Promise<RocketApi> => {
  const response = await api.get<RocketApi>(
    `/config/launcher/${id}/`,
  );

  return response.data;
};