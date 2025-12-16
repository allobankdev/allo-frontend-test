const KEY = 'local-rockets'

export function getLocalRockets() {
  return JSON.parse(localStorage.getItem(KEY) || '[]')
}

export function saveLocalRocket(rocket: any) {
  const rockets = getLocalRockets()
  rockets.push(rocket)
  localStorage.setItem(KEY, JSON.stringify(rockets))
}

export function getLocalRocketById(id: string) {
  return getLocalRockets().find((r: any) => r.id === id)
}