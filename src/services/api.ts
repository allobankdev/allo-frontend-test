const SPACE_X_BASE_URL = 'https://api.spacexdata.com/v4'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${SPACE_X_BASE_URL}${path}`, init)

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const errorPayload = await response.json() as { error?: string }
      if (errorPayload?.error) message = errorPayload.error
    } catch {
      // Keep default message when payload isn't JSON.
    }

    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}

