import { apiClient } from ".."
import type { Rocket } from "./types";

export const getRockets = async (): Promise<Rocket[]> => {
  const { data } = await apiClient.get<Rocket[]>("/rockets");
  return data;
}
