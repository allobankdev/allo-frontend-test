export interface RocketHeight {
  meters: number | null;
  feet: number | null;
}

export interface RocketDiameter {
  meters: number | null;
  feet: number | null;
}

export interface RocketMass {
  kg: number;
  lb: number;
}

export interface ThrustSeaLevel {
  kN: number;
  lbf: number;
}

export interface ThrustVacuum {
  kN: number;
  lbf: number;
}

export interface RocketEngines {
  isp: {
    sea_level: number;
    vacuum: number;
  };
  thrust_sea_level: ThrustSeaLevel;
  thrust_vacuum: ThrustVacuum;
  number: number;
  type: string;
  version: string;
  layout: string | null;
  engine_loss_max: number | null;
  propellant_1: string;
  propellant_2: string;
  thrust_to_weight: number;
}

export interface RocketLandingLegs {
  number: number;
  material: string | null;
}

export interface PayloadWeight {
  id: string;
  name: string;
  kg: number;
  lb: number;
}

export interface Rocket {
  height: RocketHeight;
  diameter: RocketDiameter;
  mass: RocketMass;
  first_stage: {
    thrust_sea_level: ThrustSeaLevel;
    thrust_vacuum: ThrustVacuum;
    reusable: boolean;
    engines: number;
    fuel_amount_tons: number;
    burn_time_sec: number | null;
  };
  second_stage: {
    thrust: ThrustVacuum;
    payloads: {
      composite_fairing: {
        height: RocketHeight;
        diameter: RocketDiameter;
      };
      option_1: string;
    };
    reusable: boolean;
    engines: number;
    fuel_amount_tons: number;
    burn_time_sec: number | null;
  };
  engines: RocketEngines;
  landing_legs: RocketLandingLegs;
  payload_weights: PayloadWeight[];
  flickr_images: string[];
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
  wikipedia: string;
  description: string;
  id: string;
}

export interface RocketFormData {
  name: string;
  description: string;
  country: string;
  company: string;
  cost_per_launch: number;
  first_flight: string;
  flickr_images: string[];
}
