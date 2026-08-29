const BASE_URL = 'https://api.spacexdata.com/v4/rockets'

export async function getRockets() {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Failed fetch rockets')
  return res.json()
}

export async function getRocketById(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`)
  if (!res.ok) throw new Error('Failed fetch rocket')
  return res.json()
}
