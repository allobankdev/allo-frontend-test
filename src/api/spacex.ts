const BASE_URL = 'https://api.spacexdata.com/v4'

export async function fetchRockets() {
  const response = await fetch(`${BASE_URL}/rockets`)
  if (!response.ok) {
    throw new Error('Gagal mengambil data roket')
  }
  return response.json()
}

export async function fetchRocketById(id: string) {
  const response = await fetch(`${BASE_URL}/rockets/${id}`)
  if (!response.ok) {
    throw new Error('Gagal mengambil detail roket')
  }
  return response.json()
}