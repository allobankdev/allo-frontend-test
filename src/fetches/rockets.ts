import type { RawListResponse, RawRocket, Rocket } from "@/types/rocket";
import { endpoints } from "./endpoints";

export async function fetchRocketsFromApi(
  options: { signal?: AbortSignal } = {},
): Promise<Rocket[]> {
  const response = await fetch(endpoints.rocketList(), {
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(
      `Rocket list request failed with status ${response.status}`,
    );
  }

  const data: RawListResponse = await response.json();
  const results = Array.isArray(data?.results) ? data.results : [];

  return results.map(normalizeRocket);
}

function normalizeRocket(raw: RawRocket): Rocket {
  return {
    id: String(raw?.id ?? ""),
    name: raw?.full_name || raw?.name || null,
    description: raw?.description || null,
    imageUrl: raw?.image_url || null,
    costPerLaunch: raw?.launch_cost || null,
    country: raw?.manufacturer?.country_code || null,
    firstFlight: raw?.maiden_flight || null,
    isLocal: false,
  };
}
