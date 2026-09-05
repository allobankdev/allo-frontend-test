import type { Rocket, RocketListResponse } from "@/types/rocket";

const API_BASE_URL = "https://lldev.thespacedevs.com/2.2.0";

async function request<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getRockets(signal?: AbortSignal): Promise<RocketListResponse> {
  return request<RocketListResponse>(
    "/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20",
    signal,
  );
}

export function getRocketById(
  id: number | string,
  signal?: AbortSignal,
): Promise<Rocket> {
  return request<Rocket>(
    `/config/launcher/${encodeURIComponent(id)}/?mode=detailed`,
    signal,
  );
}
