export interface Length {
  meters: number | null;
  feet: number | null;
}

export interface Mass {
  kg: number;
  lb: number;
}

export interface Thrust {
  kN: number;
  lbf: number;
}

export interface Isp {
  sea_level: number;
  vacuum: number;
}

export interface RocketFirstStage {
  thrust_sea_level: Thrust;
  thrust_vacuum: Thrust;
  reusable: boolean;
  engines: number;
  fuel_amount_tons: number;
  burn_time_sec: number | null;
}

export interface RocketCompositeFairing {
  height: Length;
  diameter: Length;
}

export interface RocketSecondStagePayloads {
  composite_fairing: RocketCompositeFairing;
  option_1: string;
}

export interface RocketSecondStage {
  thrust: Thrust;
  payloads: RocketSecondStagePayloads;
  reusable: boolean;
  engines: number;
  fuel_amount_tons: number;
  burn_time_sec: number | null;
}

export interface RocketEngines {
  isp: Isp;
  thrust_sea_level: Thrust;
  thrust_vacuum: Thrust;
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
  number: number | null;
  material: string | null;
}

export interface RocketPayloadWeight {
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
  cost_per_launch: number;
  country: string;
  first_flight: string;
  active?: boolean;
  wikipedia?: string;
  company?: string;
  type?: string;
  stages?: number;
  boosters?: number;
  success_rate_pct?: number;

  height?: Length;
  diameter?: Length;
  mass?: Mass;
  first_stage?: RocketFirstStage;
  second_stage?: RocketSecondStage;
  engines?: RocketEngines;
  landing_legs?: RocketLandingLegs;
  payload_weights?: RocketPayloadWeight[];

  source?: "api" | "local";
}

export type NewRocketInput = Pick<
  Rocket,
  "name" | "description" | "cost_per_launch" | "country" | "first_flight"
> & {
  imageUrl?: string;
  active?: boolean;
};
