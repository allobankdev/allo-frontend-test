import { request } from '@/utils/http'
import type { LauncherApi, LauncherListResponse } from '@/types/rocket'

const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'
const LIST_URL = `${API_BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`

export function fetchRockets (): Promise<LauncherListResponse> {
  return request(LIST_URL)
}

export function fetchRocket (id: string): Promise<LauncherApi> {
  return request(`${API_BASE_URL}/${encodeURIComponent(id)}/?mode=detailed`)
}
