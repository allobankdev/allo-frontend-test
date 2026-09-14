import axios from 'axios'
import type { Launcher, LauncherListResponse } from '@/types/rocket'

export const LL2_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'
export const SPACEX_LIST_PATH = '/config/launcher/'
export const SPACEX_LIST_PARAMS = {
  manufacturer__name: 'SpaceX',
  mode: 'detailed',
  limit: 20,
} as const

export const spacexClient = axios.create({
  baseURL: LL2_BASE_URL,
  timeout: 15_000,
})

export async function fetchLaunchers (): Promise<Launcher[]> {
  const { data } = await spacexClient.get<LauncherListResponse>(SPACEX_LIST_PATH, {
    params: { ...SPACEX_LIST_PARAMS },
  })
  return data.results ?? []
}

export async function fetchLauncherById (id: number | string): Promise<Launcher> {
  const { data } = await spacexClient.get<Launcher>(`${SPACEX_LIST_PATH}${id}/`)
  return data
}
