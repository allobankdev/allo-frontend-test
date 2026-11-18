import type { ApiLauncherConfig } from '@/api/launchLibrary'
import type { NewRocketInput, Rocket } from '@/types/rocket'

/** Maps an API launcher to the UI model. Missing values become `null`, never `undefined`. */
export function toRocket(raw: ApiLauncherConfig): Rocket {
  return {
    id: `api-${raw.id}`,
    name: raw.full_name?.trim() || 'Unnamed',
    description: raw.description?.trim() || null,
    imageUrl: raw.image_url || null,
    launchCost: typeof raw.launch_cost === 'number' ? raw.launch_cost : null,
    country: raw.manufacturer?.country_code || null,
    firstFlight: raw.maiden_flight || null,
    source: 'api',
  }
}

let localCounter = 0

/** Builds a locally added rocket from the form input. */
export function fromNewRocketInput(input: NewRocketInput): Rocket {
  localCounter += 1
  return {
    id: `local-${Date.now()}-${localCounter}`,
    name: input.name,
    description: input.description,
    imageUrl: input.imageUrl,
    launchCost: input.launchCost,
    country: input.country,
    firstFlight: input.firstFlight,
    source: 'local',
  }
}
