import type { LauncherApiResponse, Rocket, RocketForm } from "@/types/rocket";

const API_URL =
  "https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20";

const toRocket = (item: LauncherApiResponse): Rocket => ({
  id: item.id,
  imageUrl: item.image_url ?? null,
  name: item.full_name?.trim() || "Unnamed rocket",
  description: item.description?.trim() || null,
  launchCost: item.launch_cost ?? null,
  country: item.manufacturer?.country_code ?? null,
  maidenFlight: item.maiden_flight ?? null,
});

export const fetchRockets = async (): Promise<Rocket[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Unable to load rockets (${response.status})`);
  }

  const data = (await response.json()) as { results?: LauncherApiResponse[] };
  return (data.results ?? []).map(toRocket);
};

export const rocketFromForm = (form: RocketForm): Rocket => ({
  id: `local-${Date.now()}`,
  imageUrl: form.imageUrl.trim() || null,
  name: form.name.trim() || "Unnamed rocket",
  description: form.description.trim() || null,
  launchCost: form.launchCost ? Number(form.launchCost) : null,
  country: form.country.trim() || null,
  maidenFlight: form.maidenFlight || null,
  isLocal: true,
});
