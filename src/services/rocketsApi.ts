import type { Rocket } from "@/types/rocket";
import api from "@/lib/api";

export async function fetchAllRockets(): Promise<Rocket[]> {
  try {
    const response = await api.get<Rocket[]>('/rockets');
    if (!response.data) {
      throw new Error("Failed to fetch rockets");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching rockets:", error);
    throw error;
  }
}

export async function fetchRocketById(id: string): Promise<Rocket> {
  try {
    const response = await api.get<Rocket>(`/rockets/${id}`);
    if (!response.data) {
      throw new Error("Failed to fetch rocket");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching rocket:", error);
    throw error;
  }
}