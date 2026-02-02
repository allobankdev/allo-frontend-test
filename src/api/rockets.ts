import axiosInstance from "./axios";
import type { Rocket } from "@/types/rocket";

export const rocketApi = {
  /**
   * Get all rockets
   */
  getAllRockets: async (): Promise<Rocket[]> => {
    const response = await axiosInstance.get<Rocket[]>("/rockets");
    return response.data;
  },

  /**
   * Get rocket by ID
   */
  getRocketById: async (id: string): Promise<Rocket> => {
    const response = await axiosInstance.get<Rocket>(`/rockets/${id}`);
    return response.data;
  },
};
