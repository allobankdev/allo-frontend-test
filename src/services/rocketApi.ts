import {
  LL2_API_BASE_URL,
  LL2_MANUFACTURER,
  LL2_PAGE_LIMIT,
} from "@/constants/app";
import type { ApiRocket, ApiRocketListResponse, Rocket } from "@/types/rocket";

export class RocketApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "RocketApiError";
    this.status = status;
  }
}

function parseLaunchCost(
  value: number | string | null | undefined,
): number | null {
  if (value == null || value === "") {
    return null;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function normalizeRocket(raw: ApiRocket): Rocket {
  return {
    id: String(raw.id),
    fullName: raw.full_name?.trim() || raw.name?.trim() || "Unnamed Rocket",
    description: raw.description?.trim() || null,
    imageUrl: raw.image_url?.trim() || null,
    launchCost: parseLaunchCost(raw.launch_cost),
    countryCode: raw.manufacturer?.country_code?.trim() || null,
    maidenFlight: raw.maiden_flight?.trim() || null,
  };
}

export async function fetchSpaceXRockets(
  signal?: AbortSignal,
): Promise<Rocket[]> {
  const params = new URLSearchParams({
    manufacturer__name: LL2_MANUFACTURER,
    mode: "detailed",
    limit: String(LL2_PAGE_LIMIT),
  });
  const response = await fetch(`${LL2_API_BASE_URL}/?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new RocketApiError(
      `Failed to load rockets (HTTP ${response.status})`,
      response.status,
    );
  }

  const data = (await response.json()) as ApiRocketListResponse;
  return (data.results ?? []).map(normalizeRocket);
}

export async function fetchRocketById(
  id: string,
  signal?: AbortSignal,
): Promise<Rocket> {
  const url = `${LL2_API_BASE_URL}/${encodeURIComponent(id)}/`;
  const response = await fetch(url, { signal });

  if (response.status === 404) {
    throw new RocketApiError("Rocket not found.", 404);
  }
  if (!response.ok) {
    throw new RocketApiError(
      `Failed to load rocket details (HTTP ${response.status})`,
      response.status,
    );
  }

  const data = (await response.json()) as ApiRocket;
  return normalizeRocket(data);
}
