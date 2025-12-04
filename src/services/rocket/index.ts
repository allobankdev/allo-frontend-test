import type { Rocket } from "@/types/rockets";
import { apiClient } from "./base";

export async function getRockets(): Promise<Rocket[]> {
  const res = await apiClient.get<Rocket[]>("/");
  return res.data;
}
