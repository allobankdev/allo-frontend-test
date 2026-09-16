import { http } from "./http";
import type {
  RocketApiListResponse,
  RocketApiItem,
  Rocket,
} from "@/types/rocket";
import { mapRocketApiItemToRocket } from "@/types/rocket";

export class RocketApiError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "RocketApiError";
  }
}

export async function fetchRockets(): Promise<Rocket[]> {
  try {
    const { data } = await http.get<RocketApiListResponse>(
      "/config/launcher/",
      {
        params: { manufacturer__name: "SpaceX", mode: "detailed", limit: 20 },
      },
    );
    console.log("Fetched rockets:", data.results);
    return data.results.map(mapRocketApiItemToRocket);
  } catch (err) {
    throw new RocketApiError("Failed to fetch rocket list", err);
  }
}

export async function fetchRocketById(id: number | string): Promise<Rocket> {
  try {
    const { data } = await http.get<RocketApiItem>(`/config/launcher/${id}/`);
    return mapRocketApiItemToRocket(data);
  } catch (err) {
    throw new RocketApiError(`Failed to fetch rocket ${id}`, err);
  }
}
