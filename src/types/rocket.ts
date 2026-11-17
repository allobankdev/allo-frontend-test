export interface ManufacturerApi {
  country_code: string | null;
}

export interface LauncherConfigApi {
  id: number;
  full_name: string | null;
  description: string | null;
  image_url: string | null;
  maiden_flight: string | null;
  launch_cost: string | null;
  manufacturer: ManufacturerApi | null;
}

export interface Rocket {
  id: string;
  name: string;
  description: string;
  image: string | null;
  launchCost: string | null;
  country: string | null;
  firstFlight: string | null;
  isLocal: boolean;
}

export interface LauncherConfigListApi {
  count: number;
  results: LauncherConfigApi[];
}
