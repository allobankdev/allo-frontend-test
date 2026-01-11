import { http } from './http'
import { type RocketListDTO } from '@/utils/dto/rocket.dto'

export const rocketService = {
  async list(): Promise<RocketListDTO[]> {
    const { data } = await http.get<RocketListDTO[]>('/rockets')
    return data
  },

  async detail(id: string): Promise<RocketListDTO> {
    const { data } = await http.get<RocketListDTO>(`/rockets/${id}`)
    return data
  }
}