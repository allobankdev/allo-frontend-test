import type { AddRocketPayload, ApiRocket, Rocket } from '@/types'

let localIdSeq = 0

function nextLocalId (): string {
  localIdSeq += 1
  return `local-${Date.now()}-${localIdSeq}`
}

export function normalizeRocket (raw: ApiRocket): Rocket {
  return {
    id: String(raw.id),
    fullName: raw.full_name?.trim() || 'Unknown rocket',
    description: raw.description?.trim() || '',
    imageUrl: raw.image_url ?? null,
    launchCost: raw.launch_cost ?? null,
    countryCode: raw.manufacturer?.country_code ?? null,
    maidenFlight: raw.maiden_flight ?? null,
    isLocal: false,
  }
}

export function createLocalRocket (payload: AddRocketPayload): Rocket {
  return {
    id: nextLocalId(),
    fullName: payload.fullName.trim() || 'Untitled rocket',
    description: payload.description?.trim() || '',
    imageUrl: payload.imageUrl ?? null,
    launchCost: payload.launchCost ?? null,
    countryCode: payload.countryCode ?? null,
    maidenFlight: payload.maidenFlight ?? null,
    isLocal: true,
  }
}
