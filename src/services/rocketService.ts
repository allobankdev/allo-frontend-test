import type { RocketApiResponse, RocketItem } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

export async function fetchSpaceXRockets(): Promise<RocketItem[]> {
  const url = `${BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`
  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('API rate limit reached (15 req/hour). Please wait a moment and try again.')
    }
    throw new Error(`Failed to fetch rockets (HTTP ${response.status})`)
  }

  const data: RocketApiResponse = await response.json()
  return data.results || []
}

export async function fetchRocketDetail(id: number | string): Promise<RocketItem> {
  const url = `${BASE_URL}/${id}/`
  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('API rate limit reached (15 req/hour). Please wait a moment and try again.')
    }
    throw new Error(`Failed to fetch rocket detail (HTTP ${response.status})`)
  }

  const data: RocketItem = await response.json()
  return data
}
