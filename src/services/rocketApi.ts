import type { Rocket, RocketApiResult, RocketListApiResponse } from '@/types/rocket'

// lldev.thespacedevs.com mirrors the same data as the production host but
// with a much more generous anonymous rate limit — safe to use in dev.
const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export class RocketApiError extends Error {}

function mapResult(result: RocketApiResult): Rocket {
  return {
    id: result.id,
    name: result.name,
    fullName: result.full_name ?? result.name,
    description: result.description ?? null,
    imageUrl: result.image_url ?? null,
    launchCost: result.launch_cost ?? null,
    countryCode: result.manufacturer?.country_code ?? null,
    maidenFlight: result.maiden_flight ?? null,
  }
}

async function request<T> (path: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`)
  } catch {
    throw new RocketApiError('Could not reach the rocket database. Check your connection and try again.')
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new RocketApiError('Too many requests right now. Please wait a moment and try again.')
    }
    throw new RocketApiError(`The rocket database returned an error (${response.status}).`)
  }

  return response.json() as Promise<T>
}

/** Fetches all 13 SpaceX rockets in a single request. */
export async function fetchRockets (): Promise<Rocket[]> {
  const data = await request<RocketListApiResponse>(
    '/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20',
  )
  return data.results.map(mapResult)
}

export async function fetchRocketById (id: number | string): Promise<Rocket> {
  const result = await request<RocketApiResult>(`/config/launcher/${id}/`)
  return mapResult(result)
}
