import api from '@/services/api'
import type { Rocket } from '@/types/rocket'

export const fetchRocketList = async (): Promise<Rocket[]> => {
    const response = await api.get<Rocket[]>('/rockets')
    if (!response.status) {
      throw new Error(`Failed to fetch rocket data: ${response}`)
    }
    return response.data
}

export const fetchRocketById = async (id: string): Promise<Rocket> => {
    const response = await api.get<Rocket>(`/rockets/${id}`)
    if (!response.status) {
      throw new Error(`Failed to fetch detail rocket data: ${response}`)
    }
    return response.data
}