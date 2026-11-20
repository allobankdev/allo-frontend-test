import type {
  LauncherConfigDto,
  LauncherListResponseDto,
  Rocket,
} from '@/types/rocket'

// Dev host from the assignment: same data as production, much higher rate limit.
const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

/**
 * Error thrown for any failed request. Carrying a user-friendly message lets
 * the UI show it directly in the error state without extra translation.
 */
export class ApiError extends Error {
  readonly status?: number

  constructor (message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Converts the raw API shape into the app's Rocket model.
 * Missing values become `null` so the UI can show a fallback.
 */
export function mapRocket (dto: LauncherConfigDto): Rocket {
  // The API sends cost as a string ("50000000"); convert it to a number.
  // Number(null) would be 0, so we guard first to avoid showing "$0".
  const cost = dto.launch_cost ? Number(dto.launch_cost) : NaN

  return {
    id: String(dto.id), // route params are strings, so keep ids as strings
    name: dto.full_name || dto.name || 'Unnamed rocket',
    description: dto.description || null,
    imageUrl: dto.image_url || null,
    launchCost: Number.isFinite(cost) ? cost : null,
    country: dto.manufacturer?.country_code || null,
    firstFlight: dto.maiden_flight || null,
    isLocal: false,
  }
}

/**
 * Small wrapper around fetch that turns network failures and bad HTTP
 * statuses into ApiError with a readable message.
 */
async function getJson<T> (url: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    // An abort is intentional (e.g. user left the page), so let it pass through.
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new ApiError('Network error. Please check your connection.')
  }

  if (!response.ok) {
    const message = response.status === 429
      ? 'Too many requests. Please wait a moment and retry.'
      : response.status === 404
        ? 'Rocket not found.'
        : `Request failed (${response.status}).`
    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}

/** Fetches all SpaceX rockets in one request (13 items, hence limit=20). */
export async function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const params = new URLSearchParams({
    manufacturer__name: 'SpaceX',
    mode: 'detailed', // required, otherwise description is omitted
    limit: '20', // default page size is 10, which would hide 3 rockets
  })
  const data = await getJson<LauncherListResponseDto>(
    `${BASE_URL}/?${params}`,
    signal,
  )
  return data.results.map(mapRocket)
}

/** Fetches one rocket by id. Used when the detail page is opened directly. */
export async function fetchRocketById (
  id: string,
  signal?: AbortSignal,
): Promise<Rocket> {
  const data = await getJson<LauncherConfigDto>(
    `${BASE_URL}/${encodeURIComponent(id)}/`,
    signal,
  )
  return mapRocket(data)
}
