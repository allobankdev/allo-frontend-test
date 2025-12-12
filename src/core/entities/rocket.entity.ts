export interface Measurement {
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

export interface FirstStage {
  thrustSeaLevel: Thrust;
  thrustVacuum: Thrust;
  isReusable: boolean;
  engines: number;
  fuelAmountTons: number;
  burnTimeSec: number;
}

export interface CompositeFairing {
  height: Measurement;
  diameter: Measurement;
}

export interface Payloads {
  compositeFairing: CompositeFairing;
  option1: string;
}

export interface SecondStage {
  thrust: Thrust;
  payloads: Payloads;
  isReusable: boolean;
  engines: number;
  fuelAmountTons: number;
  burnTimeSec: number;
}

export interface ISP {
  seaLevel: number;
  vacuum: number;
}

export interface Engines {
  isp: ISP;
  thrustSeaLevel: Thrust;
  thrustVacuum: Thrust;
  number: number;
  type: string;
  version: string;
  layout: string;
  engineLossMax: number;
  propellant1: string;
  propellant2: string;
  thrustToWeight: number;
}

export interface LandingLegs {
  number: number;
  material: string;
}

export interface PayloadWeight {
  id: string;
  name: string;
  kg: number;
  lb: number;
}

export interface RocketEntity {
  height: Measurement;
  diameter: Measurement;
  mass: Mass;
  firstStage: FirstStage;
  secondStage: SecondStage;
  engines: Engines;
  landingLegs: LandingLegs;
  payloadWeights: PayloadWeight[];
  flickrImages: string[];
  name: string;
  type: string;
  isActive: boolean;
  stages: number;
  boosters: number;
  costPerLaunch: number;
  successRatePct: number;
  firstFlight: string;
  country: string;
  company: string;
  wikipedia: string;
  description: string;
  id: string;
}
