import type { Rocket, RocketApiResponse } from "@/types/rocket";

const API_BASE_URL = "https://lldev.thespacedevs.com/2.2.0";

const ROCKETS_ENDPOINT =
  `${API_BASE_URL}/config/launcher/` +
  "?manufacturer__name=SpaceX&mode=detailed&limit=20";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function getRockets(): Promise<Rocket[]> {
  const response = await fetchJson<RocketApiResponse>(ROCKETS_ENDPOINT);

  return response.results;
}

export async function getRocketById(id: number | string): Promise<Rocket> {
  return fetchJson<Rocket>(
    `${API_BASE_URL}/config/launcher/${encodeURIComponent(String(id))}/`,
  );
}
