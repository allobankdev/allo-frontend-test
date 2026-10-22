import httpClient from './httpClient'

export const rocketApi = {
  async getRockets() {
    const { data } = await httpClient.get('/launcher/', {
      params: {
        manufacturer__name: 'SpaceX',
        mode: 'detailed',
        limit: 20,
      },
    })
    return data?.results ?? []
  },

  async getRocketById(id: string) {
    const { data } = await httpClient.get(`/launcher/${id}/`, {
      params: { mode: 'detailed' },
    })
    return data
  },
}
