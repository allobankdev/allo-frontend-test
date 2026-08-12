import type { LauncherListResponse, Rocket } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export async function fetchSpaceXRockets (): Promise<Rocket[]> {
  const url = `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch rockets (status ${response.status})`)
  }

  const data: LauncherListResponse = await response.json()
  return data.results
}