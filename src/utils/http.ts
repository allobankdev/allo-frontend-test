export async function request<T> (url: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(url)
  } catch {
    throw new Error('We could not reach the rocket data service. Check your connection and try again.')
  }

  if (!response.ok) {
    throw new Error(`The rocket data service returned ${response.status}. Please try again.`)
  }

  return response.json() as Promise<T>
}
