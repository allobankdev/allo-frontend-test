export interface Dimension {
  meters?: number | null;
  feet?: number | null;
}

export interface Thrust {
  kN: number;
  lbf: number;
}

export interface Mass {
  kg: number;
  lb: number;
}

export interface FirstStage {
  thrust_sea_level: Thrust;
  thrust_vacuum: Thrust;
  reusable: boolean;
  engines: number;
  fuel_amount_tons: number;
  burn_time_sec?: number | null;
}

export interface CompositeFairing {
  height: Dimension;
  diameter: Dimension;
}

export interface PayloadOptions {
  composite_fairing: CompositeFairing;
  option_1: string;
}

export interface SecondStage {
  thrust: Thrust;
  payloads: PayloadOptions;
  reusable: boolean;
  engines: number;
  fuel_amount_tons: number;
  burn_time_sec?: number | null;
}

export interface EngineISP {
  sea_level: number;
  vacuum: number;
}

export interface Engines {
  isp: EngineISP;
  thrust_sea_level: Thrust;
  thrust_vacuum: Thrust;
  number: number;
  type: string;
  version: string;
  layout?: string | null;
  engine_loss_max?: number | null;
  propellant_1: string;
  propellant_2: string;
  thrust_to_weight: number;
}

export interface LandingLegs {
  number: number;
  material?: string | null;
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
  type: string;
  active: boolean;
  first_flight: string;
  country: string;
  company: string;
  flickr_images: string[];
  cost_per_launch: number;
  success_rate_pct: number;
  description: string;
  height?: Dimension;
  diameter?: Dimension;
  mass?: Mass;
  stages?: number;
  boosters?: number;
  first_stage?: FirstStage;
  second_stage?: SecondStage;
  engines?: Engines;
  landing_legs?: LandingLegs;
  payload_weights?: PayloadWeight[];
  wikipedia?: string;
}
