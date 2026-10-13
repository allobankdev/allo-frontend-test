import type { Rocket, RocketListResponse } from '../types/rocket'

const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

async function request<T> (path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Permintaan gagal dengan status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getRockets (): Promise<RocketListResponse> {
  return request<RocketListResponse>(
    '/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20',
  )
}

export function getRocketById (id: string): Promise<Rocket> {
  return request<Rocket>(`/config/launcher/${encodeURIComponent(id)}/`)
}
