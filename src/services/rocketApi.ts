import type { Rocket, RocketListResponse } from '@/types/rocket'
import instance from '@/lib/axios'


export async function getAllRocket (): Promise<Rocket[]> {
  const response = await instance.get(`?manufacturer__name=SpaceX&mode=detailed&limit=20`)
  if (!response) {
    throw new Error(`Internal Server Error`)
  }

  const data: RocketListResponse = await response.data
  return data?.results
}

export async function getRocketById (id: number): Promise<Rocket> {
  const response = await await instance.get(`${id}/?mode=detailed`)

  if (!response) {
    throw new Error(`Failed to fetch rocket`)
  }

  return response?.data
}
