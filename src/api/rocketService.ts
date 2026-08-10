import apiClient from './client'

export const RocketService = {
  // Fetch all rockets
  getAllRockets() {
    return apiClient.get('/rockets')
  },
  
  // Fetch single rocket by ID
  getRocketById(id: string) {
    return apiClient.get(`/rockets/${id}`)
  }
}
