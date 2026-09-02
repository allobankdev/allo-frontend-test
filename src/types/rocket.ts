export interface RocketManufacturer {
  id: number
  name: string
  countryCode: string | null
  type: string | null
  imageUrl: string | null
  description: string | null
  administrator: string | null
  /** API returns this as a string (e.g. "2002") */
  foundingYear: string | null
  totalLaunchCount: number | null
  logoUrl: string | null
  infoUrl: string | null
  wikiUrl: string | null
}

/** The shape every component in this app renders. */
export interface Rocket {
  id: number | string
  name: string
  fullName: string
  description: string | null
  family: string | null
  imageUrl: string | null
  launchCost: number | null
  maidenFlight: string | null
  manufacturer: RocketManufacturer | null
  active: boolean
  reusable: boolean
  isCustom: boolean

  // --- field baru ---
  variant: string | null
  alias: string | null
  minStage: number | null
  maxStage: number | null
  length: number | null
  diameter: number | null
  launchMass: number | null
  leoCapacity: number | null
  gtoCapacity: number | null
  toThrust: number | null
  apogee: number | null
  vehicleRange: number | null
  totalLaunchCount: number | null
  successfulLaunches: number | null
  failedLaunches: number | null
  pendingLaunches: number | null
  consecutiveSuccessfulLaunches: number | null
  attemptedLandings: number | null
  successfulLandings: number | null
  failedLandings: number | null
  consecutiveSuccessfulLandings: number | null
  infoUrl: string | null
  wikiUrl: string | null
}

/** The shape every component in this app renders. */
export interface Rocket {
  /** Numeric ids come from the API; custom ids look like "custom-<timestamp>". */
  id: number | string
  name: string
  fullName: string
  description: string | null
  family: string | null
  imageUrl: string | null
  /** Parsed to a number (API returns it as a numeric string, or null). */
  launchCost: number | null
  /** ISO date string (YYYY-MM-DD), or null when unknown. */
  maidenFlight: string | null
  manufacturer: RocketManufacturer | null
  active: boolean
  reusable: boolean
  /** True for rockets added locally through the "Add rocket" form. */
  isCustom: boolean
}

/** Raw manufacturer object as returned by the Launch Library 2 API. */
export interface RocketApiManufacturer {
  id: number
  name: string
  country_code: string | null
  type: string | null
  image_url: string | null
  description: string | null
  administrator: string | null
  founding_year: string | null
  total_launch_count: number | null
  logo_url: string | null
  info_url: string | null
  wiki_url: string | null
}

export interface RocketApiRecord {
  id: number
  name: string
  full_name: string | null
  description: string | null
  family: string | null
  active: boolean
  reusable: boolean
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: RocketApiManufacturer | null

  variant: string | null
  alias: string | null
  min_stage: number | null
  max_stage: number | null
  length: number | null
  diameter: number | null
  launch_mass: number | null
  leo_capacity: number | null
  gto_capacity: number | null
  to_thrust: number | null
  apogee: number | null
  vehicle_range: number | null
  total_launch_count: number | null
  successful_launches: number | null
  failed_launches: number | null
  pending_launches: number | null
  consecutive_successful_launches: number | null
  attempted_landings: number | null
  successful_landings: number | null
  failed_landings: number | null
  consecutive_successful_landings: number | null
  info_url: string | null
  wiki_url: string | null
}export interface RocketListApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: RocketApiRecord[]
}

function mapRocket (raw: any): Rocket {
  return {
    id: raw.id,
    name: raw.name,
    fullName: raw.full_name,
    description: raw.description,
    family: raw.family,
    imageUrl: raw.image_url,
    launchCost: raw.launch_cost ? Number(raw.launch_cost) : null,
    maidenFlight: raw.maiden_flight,
    manufacturer: raw.manufacturer ? mapManufacturer(raw.manufacturer) : null,
    active: raw.active,
    reusable: raw.reusable,
    isCustom: false,

    // --- field baru yang perlu ditambahkan ---
    variant: raw.variant || null,
    alias: raw.alias || null,
    minStage: raw.min_stage ?? null,
    maxStage: raw.max_stage ?? null,
    length: raw.length ?? null,
    diameter: raw.diameter ?? null,
    launchMass: raw.launch_mass ?? null,
    leoCapacity: raw.leo_capacity ?? null,
    gtoCapacity: raw.gto_capacity ?? null,
    toThrust: raw.to_thrust ?? null,
    apogee: raw.apogee ?? null,
    vehicleRange: raw.vehicle_range ?? null,
    totalLaunchCount: raw.total_launch_count ?? null,
    successfulLaunches: raw.successful_launches ?? null,
    failedLaunches: raw.failed_launches ?? null,
    pendingLaunches: raw.pending_launches ?? null,
    consecutiveSuccessfulLaunches: raw.consecutive_successful_launches ?? null,
    attemptedLandings: raw.attempted_landings ?? null,
    successfulLandings: raw.successful_landings ?? null,
    failedLandings: raw.failed_landings ?? null,
    consecutiveSuccessfulLandings: raw.consecutive_successful_landings ?? null,
    infoUrl: raw.info_url ?? null,
    wikiUrl: raw.wiki_url ?? null
  }
}

function mapApiRecordToRocket (raw: RocketApiRecord): Rocket {
  return {
    id: raw.id,
    name: raw.name,
    fullName: raw.full_name ?? raw.name,
    description: raw.description,
    family: raw.family,
    imageUrl: raw.image_url,
    launchCost: raw.launch_cost ? Number(raw.launch_cost) : null,
    maidenFlight: raw.maiden_flight,
    manufacturer: raw.manufacturer ? mapManufacturer(raw.manufacturer) : null,
    active: raw.active,
    reusable: raw.reusable,
    isCustom: false,

    variant: raw.variant || null,
    alias: raw.alias || null,
    minStage: raw.min_stage ?? null,
    maxStage: raw.max_stage ?? null,
    length: raw.length ?? null,
    diameter: raw.diameter ?? null,
    launchMass: raw.launch_mass ?? null,
    leoCapacity: raw.leo_capacity ?? null,
    gtoCapacity: raw.gto_capacity ?? null,
    toThrust: raw.to_thrust ?? null,
    apogee: raw.apogee ?? null,
    vehicleRange: raw.vehicle_range ?? null,
    totalLaunchCount: raw.total_launch_count ?? null,
    successfulLaunches: raw.successful_launches ?? null,
    failedLaunches: raw.failed_launches ?? null,
    pendingLaunches: raw.pending_launches ?? null,
    consecutiveSuccessfulLaunches: raw.consecutive_successful_launches ?? null,
    attemptedLandings: raw.attempted_landings ?? null,
    successfulLandings: raw.successful_landings ?? null,
    failedLandings: raw.failed_landings ?? null,
    consecutiveSuccessfulLandings: raw.consecutive_successful_landings ?? null,
    infoUrl: raw.info_url ?? null,
    wikiUrl: raw.wiki_url ?? null
  }
}

function mapManufacturer (raw: RocketApiManufacturer): RocketManufacturer {
  return {
    id: raw.id,
    name: raw.name,
    countryCode: raw.country_code ?? null,
    type: raw.type ?? null,
    imageUrl: raw.image_url ?? null,
    description: raw.description ?? null,
    administrator: raw.administrator ?? null,
    foundingYear: raw.founding_year ?? null,
    totalLaunchCount: raw.total_launch_count ?? null,
    logoUrl: raw.logo_url ?? null,
    infoUrl: raw.info_url ?? null,
    wikiUrl: raw.wiki_url ?? null
  }
}
