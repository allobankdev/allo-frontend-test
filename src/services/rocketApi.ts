import type { Rocket, RocketListResponse } from '@/types/rocket'

const ROCKET_LIST_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20'
const ROCKET_DETAIL_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/'

export async function fetchRocket (id: number, signal?: AbortSignal): Promise<Rocket> {
  const response = await fetch(`${ROCKET_DETAIL_URL}${id}/`, { signal })

  if (response.status === 404) throw new Error('Roket tidak ditemukan.')

  if (!response.ok) throw new Error('Detail roket gagal dimuat')

  const data: Rocket = await response.json()

  if (!data || data.id !== id) throw new Error('Respons detail roket tidak valid.')
  
  return data
}

export async function fetchRockets (): Promise<RocketListResponse> {
  const response = await fetch(ROCKET_LIST_URL)

  if (!response.ok) {
    throw new Error(`Request gagal: ${response.status}`)
  }

  const data: RocketListResponse = await response.json()

  if (!data || !Array.isArray(data.results)) {
    throw new Error('Respons daftar roket tidak valid.')
  }

  return {
    ...data,
    results: data.results.filter(rocket => rocket && Number.isSafeInteger(rocket.id) && rocket.id > 0),
  }
}
