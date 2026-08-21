const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText} (${path})`)
  }
  return res.json() as Promise<T>
}

export default request
