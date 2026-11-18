/**
 * Launch Library 2 client (The Space Devs).
 *
 * Uses API 2.2.0 on the lldev host, which has a much higher rate limit than the
 * production host. Override with VITE_LL2_BASE_URL when needed.
 */

const BASE_URL: string =
  import.meta.env.VITE_LL2_BASE_URL ?? 'https://lldev.thespacedevs.com/2.2.0'

/** Shape of a launcher configuration as returned with `mode=detailed` (2.2.0). */
export interface ApiLauncherConfig {
  id: number
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: number | null
  maiden_flight: string | null
  manufacturer: { country_code: string | null } | null
}

interface ApiPage<T> {
  count: number
  next: string | null
  results: T[]
}

export class ApiError extends Error {
  readonly status: number | null

  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Fetches every SpaceX launcher configuration, following pagination if the API ever pages. */
export async function fetchSpaceXRockets(): Promise<ApiLauncherConfig[]> {
  const rockets: ApiLauncherConfig[] = []
  let url: string | null =
    `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`

  while (url) {
    const page: ApiPage<ApiLauncherConfig> = await getJson(url)
    rockets.push(...page.results)
    url = page.next
  }
  return rockets
}

/** Fetches one launcher configuration by its Launch Library id. */
export function fetchRocketById(launcherId: number): Promise<ApiLauncherConfig> {
  return getJson<ApiLauncherConfig>(`${BASE_URL}/config/launcher/${launcherId}/?mode=detailed`)
}

async function getJson<T>(url: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } })
  } catch {
    throw new ApiError('Network request failed')
  }
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status)
  }
  return (await response.json()) as T
}
