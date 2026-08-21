import request from './api'
import type { Rocket, RocketListResponse } from '@/types/rocket'

export function getRocketList(): Promise<RocketListResponse> {
  return request<RocketListResponse>(
    '/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=40'
  )
}

export function getRocketById(id: number): Promise<Rocket> {
  return request<Rocket>(`/config/launcher/${id}/`)
}
