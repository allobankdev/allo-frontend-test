import type { Rocket, RocketListResponse } from "@/types/rocket";

const API_URL = "https://lldev.thespacedevs.com/2.2.0/config/launcher/";

export async function getRockets(): Promise<RocketListResponse> {
  const params = new URLSearchParams({
    manufacturer__name: "SpaceX",
    mode: "detailed",
    limit: "20",
  });

  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rockets: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<RocketListResponse>;
}

export async function getRocketById(id: string): Promise<Rocket> {
  const response = await fetch(`${API_URL}${id}/`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rocket: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<Rocket>;
}
