import type {
  Rocket,
  RocketListResponse,
} from '@/types/rocket'

const API_BASE_URL =
  'https://lldev.thespacedevs.com/2.2.0'


export async function getRockets(): Promise<Rocket[]> {
  const url =
    `${API_BASE_URL}/config/launcher/` +
    '?manufacturer__name=SpaceX&mode=detailed&limit=20'

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Failed to load rockets (${response.status})`,
    )
  }

  const data: RocketListResponse =
    await response.json()

  return data.results
}


export async function getRocketById(
  id: string | number,
): Promise<Rocket> {
  const response = await fetch(
    `${API_BASE_URL}/config/launcher/${id}/`,
  )

  if (!response.ok) {
    throw new Error(
      `Failed to load rocket detail (${response.status})`,
    )
  }

  return response.json()
}