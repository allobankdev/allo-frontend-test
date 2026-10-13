import type { Root, Result } from "@/types/rocket";

const API_URL =
  "https://lldev.thespacedevs.com/2.2.0/config/launcher/";

export async function getRockets(): Promise<Result[]> {
  const response = await fetch(
    `${API_URL}?manufacturer__name=SpaceX&mode=detailed&limit=20`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch rockets");
  }

  const data: Root = await response.json();

  return data.results;
}

export async function getRocket(id: number): Promise<Result> {
  const response = await fetch(`${API_URL}${id}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch rocket");
  }

  return response.json();
}