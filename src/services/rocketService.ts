import type {
  LauncherApiItem,
  LauncherApiResponse,
  Rocket,
} from "@/types/rocket";

const API_BASE_URL = "https://lldev.thespacedevs.com/2.2.0";

const ROCKET_LIST_ENDPOINT = `${API_BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`;

function mapLauncherToRocket(item: LauncherApiItem): Rocket {
  return {
    id: String(item.id),
    name: item.full_name || "Unknown Rocket",
    description: item.description || "",
    imageUrl: item.image_url || null,
    launchCost: item.launch_cost || null,
    country: item.manufacturer?.country_code || null,
    firstFlight: item.maiden_flight || null,
  };
}

export async function getRockets(): Promise<Rocket[]> {
  const response = await fetch(ROCKET_LIST_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Failed to fetch rockets (${response.status})`);
  }

  const data: LauncherApiResponse = await response.json();

  return data.results.map(mapLauncherToRocket);
}

export async function getRocketById(id: string): Promise<Rocket> {
  const response = await fetch(
    `${API_BASE_URL}/config/launcher/${encodeURIComponent(id)}/`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch rocket (${response.status})`);
  }

  const data: LauncherApiItem = await response.json();

  return mapLauncherToRocket(data);
}
