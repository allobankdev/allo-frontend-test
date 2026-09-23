export interface Rocket {
  id: number | string;
  name: string;
  full_name: string;
  description: string;
  image_url: string;
  launch_cost?: string;
  url?: string;
  first_flight?: string;
  manufacturer?: Manufacturer;
  isLocal?: boolean;
   maiden_flight?: string;
}

interface Manufacturer {
  id: number;
  url?: string;
  name?: string;
  featured?: boolean;
  type?: string;
  country_code?: string;
  abbrev?: string;
  description?: string;
  administrator?: string;
  founding_year?: string;
  launchers?: string;
  spacecraft?: string;
  parent?: string | null;
  image_url?: string;
  logo_url?: string;
}

export type CreateRocketPayload = Omit<Rocket, 'id' | 'isLocal'>
