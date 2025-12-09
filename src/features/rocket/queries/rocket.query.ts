import api from "@/api/axios";
import { useQuery } from "@tanstack/vue-query";
import type { Rocket } from "../types/rocket.dto";

export const getRockets = async () => {
  api.get("/v4/rockets").then((response) => {
    return response.data;
  });
};

export const useRocketsQuery = () => {
  return useQuery({
    queryKey: ["rockets"],
    queryFn: async () =>
      await api.get<Rocket[]>("/v4/rockets").then((response) => response.data),
  });
};

export const useDetailRocketQuery = (id: string) => {
  return useQuery({
    queryKey: ["rocket", id],
    queryFn: async () =>
      await api
        .get<Rocket>(`/v4/rockets/${id}`)
        .then((response) => response.data),
  });
};
