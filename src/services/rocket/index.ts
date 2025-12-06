import type { QueryRocket, Rocket, RocketFilter } from "@/types/rockets";
import { apiClient } from "./base";



export async function getAllRockets(): Promise<Rocket[]> {
  const res = await apiClient.get<Rocket[]>("/");
  return res.data;
}

export async function getOneRocket(id: string | string[]): Promise<Rocket> {
  const res = await apiClient.get<Rocket>(`/${id}`);
  return res.data;
}

export async function findRockets(filter: RocketFilter): Promise<Rocket[]> {
  const query: any = {};
  const options: any = {};

  const body = {
    query,
    options,
  };

  if (filter.search) {
    query.name = { $regex: filter.search, $options: "i" };
  }

  if (filter.active !== undefined) {
    query.active = filter.active;
  }

  if (filter.sortBy) {
    if (filter.sortBy === "asc") {
      query.success_rate_pct = { $gt: 50 };
    } else {
      query.success_rate_pct = { $lt: 50 };
    }
  }

  const res = await apiClient.post<QueryRocket>("/query", body);
  return res.data?.docs;
}
