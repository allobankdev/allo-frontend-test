// Rocket Types
export interface Rocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  height: {
    meters: number;
    feet: number;
  };
  diameter: {
    meters: number;
    feet: number;
  };
  mass: {
    kg: number;
    lb: number;
  };
  payload_weights: Array<{
    id: string;
    name: string;
    kg: number;
    lb: number;
  }>;
  first_stage: {
    reusable: boolean;
    engines: number;
    fuel_amount_tons: number;
    burn_time_sec: number;
    thrust_sea_level: {
      kN: number;
      lbf: number;
    };
    thrust_vacuum: {
      kN: number;
      lbf: number;
    };
  };
  second_stage: {
    reusable: boolean;
    engines: number;
    fuel_amount_tons: number;
    burn_time_sec: number;
    thrust: {
      kN: number;
      lbf: number;
    };
  };
  engines: {
    number: number;
    type: string;
    version: string;
    layout: string;
    engine_loss_max: number;
    propellant_1: string;
    propellant_2: string;
    thrust_sea_level: {
      kN: number;
      lbf: number;
    };
    thrust_vacuum: {
      kN: number;
      lbf: number;
    };
    thrust_to_weight: number;
  };
  landing_legs: {
    number: number;
    material: string | null;
  };
  flickr_images: string[];
  wikipedia: string;
  description: string;
}

export interface LocalRocket extends Omit<Rocket, 'id' | 'flickr_images'> {
  id?: string;
  flickr_images?: string[];
  imageUrl?: string;
  costPerLaunch?: number;
  firstFlight?: string;
}

export interface NewRocketForm {
  name: string;
  description: string;
  country: string;
  costPerLaunch: string;
  firstFlight: string;
  imageUrl: string;
}

// Store State Types
export interface RocketStoreState {
  rockets: Rocket[];
  loading: boolean;
  error: string | null;
  filterText: string;
}