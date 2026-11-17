import type {
  LauncherConfigApi,
  LauncherConfigListApi,
  Rocket,
} from "@/types/rocket";

const API_BASE = import.meta.env.VITE_API_BASE;

if (!API_BASE) {
  throw new Error("VITE_API_BASE is not configured");
}
const LIST_URL = `${API_BASE}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`;
const DETAIL_URL = (id: string) => `${API_BASE}/config/launcher/${id}/`;

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Api error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

function mapToRocket(raw: LauncherConfigApi): Rocket {
  return {
    id: String(raw.id),
    name: raw.full_name ?? "Unknown Rocket",
    description: raw.description ?? "No description available",
    image: raw.image_url,
    launchCost: raw.launch_cost,
    country: raw.manufacturer?.country_code ?? null,
    firstFlight: raw.maiden_flight,
    isLocal: false,
  };
}
export async function fetchRockets(): Promise<Rocket[]> {
  const data = await getJson<LauncherConfigListApi>(LIST_URL);
  return data.results.map(mapToRocket);
}

export async function fetchRocketById(id: string): Promise<Rocket> {
  const data = await getJson<LauncherConfigApi>(DETAIL_URL(id));
  return mapToRocket(data);
}
