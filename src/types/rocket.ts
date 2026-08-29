// Rocket Interface based on SpaceX API response
export interface Rocket {
  id: string;
  rocket_id: string;
  rocket_name: string;
  rocket_type: string;
  active: boolean;
  country: string;
  company: string;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
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
  flickr_images: string[];
  description: string;
  wikipedia: string;
  engines: {
    number: number;
    type: string;
    version: string;
    layout: string;
    isp: {
      sea_level: number;
      vacuum: number;
    };
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
  payload_weights: Array<{
    id: string;
    name: string;
    kg: number;
    lb: number;
  }>;
  stages: number;
  boosters: number;
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
    payloads: {
      option_1: string;
      composite_fairing: {
        height: {
          meters: number;
          feet: number;
        };
        diameter: {
          meters: number;
          feet: number;
        };
      };
    };
  };
}

// For creating new rockets (since SpaceX API doesn't support POST)
export interface CreateRocketDto {
  rocket_name: string;
  rocket_type: string;
  active: boolean;
  country: string;
  company: string;
  cost_per_launch: number;
  description: string;
  first_flight: string;
  flickr_images: string[];
  success_rate_pct?: number;
  wikipedia?: string;
  image_url?: string;
}

// Filter types
export interface RocketFilters {
  active: boolean | null;
  country: string;
  search: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Component Props types
export interface RocketCardProps {
  rocket: Rocket;
  showDetails?: boolean;
}

export interface RocketFilterProps {
  modelValue: RocketFilters;
  availableCountries?: string[];
}

// Emit Events types
export interface RocketCardEmits {
  (e: "click", id: string): void;
}

export interface RocketFilterEmits {
  (e: "update:modelValue", value: RocketFilters): void;
  (e: "clear"): void;
}
