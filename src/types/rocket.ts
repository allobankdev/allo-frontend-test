export interface Rocket {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  launchCost: number | null;
  countryCode: string | null;
  maidenFlight: string | null; // ISO date "YYYY-MM-DD"
}

export type NewRocket = Omit<Rocket, "id">;

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
