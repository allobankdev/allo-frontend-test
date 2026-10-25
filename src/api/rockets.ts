// Types
import type { Rocket } from '@/types/rocket'

export const ROCKETS_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20'

export async function fetchRockets (): Promise<Rocket[]> {
  const response = await fetch(ROCKETS_URL)
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`)

  const data = await response.json()
  return data.results as Rocket[]
}
