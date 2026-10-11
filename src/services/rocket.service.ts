// src/services/rocket.service.ts
import type {RocketApi} from '@/types/api/RocketApi'
import {http} from './http'
import {mapRocketApiDetail, mapRocketApiList} from '@/mappers/rocket.mapper'
import type {Rocket} from '@/types/Rocket'

export const RocketService = {
  async getAll(): Promise<Rocket[]> {
    const {data} = await http.get<RocketApi[]>('/rockets')
    const dataMapping = mapRocketApiList(data)
    return dataMapping
  },

  async getDetail(id: string): Promise<Rocket> {
    const {data} = await http.get<RocketApi>('/rockets/' + id)
    const dataMapping = mapRocketApiDetail(data)
    return dataMapping
  }
}
