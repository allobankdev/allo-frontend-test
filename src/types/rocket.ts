export interface Dimension {
  meters: number;
  feet: number;
}

export interface Mass {
  kg: number;
  lb: number;
}

export interface Thrust {
  kN: number;
  lbf: number;
}

export interface PayloadWeight {
  id: string;
  name: string;
  kg: number;
  lb: number;
}

export interface Rocket {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
  height: Dimension;
  diameter: Dimension;
  mass: Mass;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  payload_weights: PayloadWeight[];
}
