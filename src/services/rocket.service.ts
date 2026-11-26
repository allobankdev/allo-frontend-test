import type { ServerRocket } from "@/types/rocket"
import { api } from "@/utils/api"

export const rocketService = {
  getAll: () => api.get<ServerRocket[]>("/v4/rockets"),
  getById: (id: string) => api.get<ServerRocket>(`/v4/rockets/${id}`)
}