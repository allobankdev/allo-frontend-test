export interface Rocket {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
  cost_per_launch: number;
  country: string;
  first_flight: string;
  height: { meters: number; feet: number };
  mass: { kg: number; lb: number };
}

export interface RocketFilter {
  name: string;
  country: string | null;
}
