import type { Rocket } from "@/types/rockets";
import { apiClient } from "./base";

export async function getAllRockets(): Promise<Rocket[]> {
  const res = await apiClient.get<Rocket[]>("/");
  return res.data;
}

export async function getOneRocket(id: string | string[]): Promise<Rocket> {
  const res = await apiClient.get<Rocket>(`/${id}`);
  return res.data;
}
