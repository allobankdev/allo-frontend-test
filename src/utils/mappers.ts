import type { Rocket, RocketApiRecord, RocketApiManufacturer, RocketManufacturer } from '@/types/rocket'

function mapManufacturer (record: RocketApiManufacturer): RocketManufacturer {
  return {
    id: record.id,
    name: record.name,
    countryCode: record.country_code,
    type: record.type,
    imageUrl: record.image_url,
    description: record.description,
    administrator: record.administrator,
    foundingYear: record.founding_year,
    totalLaunchCount: record.total_launch_count,
    logoUrl: record.logo_url,
    infoUrl: record.info_url,
    wikiUrl: record.wiki_url,
  }
}

export function mapApiRecordToRocket (record: RocketApiRecord): Rocket {
  return {
    id: record.id,
    name: record.name,
    fullName: record.full_name || record.name,
    description: record.description,
    family: record.family,
    imageUrl: record.image_url,
    launchCost: record.launch_cost !== null ? Number(record.launch_cost) : null,
    maidenFlight: record.maiden_flight,
    manufacturer: record.manufacturer ? mapManufacturer(record.manufacturer) : null,
    active: record.active,
    reusable: record.reusable,
    isCustom: false,

    variant: record.variant || null,
    alias: record.alias || null,
    minStage: record.min_stage ?? null,
    maxStage: record.max_stage ?? null,
    length: record.length ?? null,
    diameter: record.diameter ?? null,
    launchMass: record.launch_mass ?? null,
    leoCapacity: record.leo_capacity ?? null,
    gtoCapacity: record.gto_capacity ?? null,
    toThrust: record.to_thrust ?? null,
    apogee: record.apogee ?? null,
    vehicleRange: record.vehicle_range ?? null,
    totalLaunchCount: record.total_launch_count ?? null,
    successfulLaunches: record.successful_launches ?? null,
    failedLaunches: record.failed_launches ?? null,
    pendingLaunches: record.pending_launches ?? null,
    consecutiveSuccessfulLaunches: record.consecutive_successful_launches ?? null,
    attemptedLandings: record.attempted_landings ?? null,
    successfulLandings: record.successful_landings ?? null,
    failedLandings: record.failed_landings ?? null,
    consecutiveSuccessfulLandings: record.consecutive_successful_landings ?? null,
    infoUrl: record.info_url ?? null,
    wikiUrl: record.wiki_url ?? null,
  }
}
