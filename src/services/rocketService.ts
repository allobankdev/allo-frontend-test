import type { Rocket, RocketListResponse } from '@/types/rocket'

const API_BASE = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

const LIST_URL = `${API_BASE}/?manufacturer__name=SpaceX&mode=detailed&limit=20`

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  }).catch(() => {
    throw new Error('Could not reach the API. Check your connection and try again.')
  })

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('The API rate limit was reached. Please wait a moment and try again.')
    }

    throw new Error(`Could not load data from the API (HTTP ${response.status}).`)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new Error('The API returned an invalid response.')
  }
}

export async function getRockets(): Promise<Rocket[]> {
  const payload = await request<RocketListResponse>(LIST_URL)

  if (!Array.isArray(payload.results)) {
    throw new Error('The API returned an unexpected response format.')
  }

  return payload.results
}

export async function getRocketById(id: string | number): Promise<Rocket> {
  return request<Rocket>(`${API_BASE}/${encodeURIComponent(String(id))}/?mode=detailed`)
}
