import type { LauncherConfigApi } from '@/types/rocket-api'
import type { Rocket } from '@/types/rocket'

export function mapApiRocket(raw: LauncherConfigApi): Rocket {
  return {
    id: raw.id,
    name: raw.full_name ?? 'Unknown Rocket',
    description: raw.description ?? null,
    imageUrl: raw.image_url ?? null,
    launchCost: raw.launch_cost ?? null,
    country: raw.manufacturer?.country_code ?? null,
    maidenFlight: raw.maiden_flight ?? null,
    isLocal: false,
  }
}
