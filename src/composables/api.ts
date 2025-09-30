import api from '@/config/axios'

export type ApiRocket = {
  id: string
  name: string
  description: string
  flickr_images: string[]
  country: string
  first_flight: string
  cost_per_launch: number
  company: string;
}

export const rocketsInfo = async (): Promise<ApiRocket[]> => {
  const { data } = await api.get<ApiRocket[]>('/v4/rockets')
  return data
}

export const rocketDetails = async (id: string): Promise<ApiRocket> => {
  const { data } = await api.get<ApiRocket>(`/v4/rockets/${id}`)
  return data
}
