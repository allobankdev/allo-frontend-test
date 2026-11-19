import { normalizeRocket } from '@/mappers'
import type { ApiRocket, ApiRocketListResponse, Rocket } from '@/types'
import { LAUNCHER_PATH, ROCKET_LIST_PARAMS } from './constants'
import { http } from './http'

export async function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const { data } = await http.get<ApiRocketListResponse>(LAUNCHER_PATH, {
    params: ROCKET_LIST_PARAMS,
    signal,
  })

  return (data.results ?? []).map(normalizeRocket)
}

export async function fetchRocketById (
  id: string | number,
  signal?: AbortSignal,
): Promise<Rocket> {
  const { data } = await http.get<ApiRocket>(`${LAUNCHER_PATH}${id}/`, {
    signal,
  })

  return normalizeRocket(data)
}
