/**
 * Launch Library 2 rocket endpoints (v2.2.0 — do not migrate to 2.3.0, see README).
 */

import type { LauncherConfigDto, PaginatedResponse } from '@/types/api'
import { httpGet } from './http'

/**
 * `mode=detailed` is required, otherwise `description` and other detail fields are missing.
 * `limit=20` is required, the default page size (10) would cut off 3 of the 13 rockets.
 */
const SPACEX_ROCKETS_PARAMS = {
  manufacturer__name: 'SpaceX',
  mode: 'detailed',
  limit: 20,
}

export async function getRockets (signal?: AbortSignal): Promise<LauncherConfigDto[]> {
  const page = await httpGet<PaginatedResponse<LauncherConfigDto>>('/config/launcher/', {
    params: SPACEX_ROCKETS_PARAMS,
    signal,
  })
  return page.results
}

export function getRocketById (id: string, signal?: AbortSignal): Promise<LauncherConfigDto> {
  return httpGet<LauncherConfigDto>(`/config/launcher/${encodeURIComponent(id)}/`, { signal })
}
