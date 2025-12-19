import api from "./api";
import type { Rocket } from "@/types/rocket";

export const getRockets = async (): Promise<Rocket[]> => {
  const response = await api.get<Rocket[]>("/rockets");
  return response.data;
};

export const getRocketById = async (id: string): Promise<Rocket> => {
  const response = await api.get<Rocket>(`/rockets/${id}`);
  return response.data;
};

export const getRocketsSafe = async (): Promise<Rocket[]> => {
  try {
    return await getRockets();
  } catch (error) {
    console.error("Failed to fetch rockets", error);
    throw error;
  }
};
