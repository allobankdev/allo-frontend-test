import type { Rocket, RocketApi } from "@/types/rockets";

const getCountry = (rocket: RocketApi): string | null => {
  return rocket.manufacturer?.country_code ?? null;
};

export const mapRocket = (data: RocketApi): Rocket => {
  return {
    id: String(data.id),
    name: data.name?.trim() || "Unknown Rocket",
    image: data.image_url || null,
    description: data.description?.trim() || "",
    costPerLaunch: data.launch_cost ?? null,
    country: getCountry(data),
    firstFlight: data.maiden_flight || null,
  };
};

export const mapRockets = (data: RocketApi[]): Rocket[] => {
  return data.map(mapRocket);
};