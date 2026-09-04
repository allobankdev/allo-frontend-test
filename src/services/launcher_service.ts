import type { Rocket } from "@/types/rocket";
import type { st } from "vue-router/dist/router-CWoNjPRp.mjs";

const API_URL =
  "https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20";

interface Launcher {
  id: number;
  image_url: string;
  full_name: string;
  description: string | null;
  launch_cost: string | null;
  manufacturer: {
    country_code: string | null;
  };
  maiden_flight: string | null;
}

interface LauncherResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Launcher[];
}

export async function getSpaceXRockets(): Promise<Rocket[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fecth rockets: ${response.status}");
  }

  const data: LauncherResponse = await response.json();

  return data.results.map((launcher) => ({
    id: launcher.id,
    image: launcher.image_url,
    name: launcher.full_name,
    description: launcher.description ?? null,
    cost_perlaunch: launcher.launch_cost ?? null,
    country: launcher.manufacturer?.country_code ?? null,
    first_flight: launcher.maiden_flight ?? null,
  }));
}
