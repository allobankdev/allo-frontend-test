/** Error whose message is safe to show to the user. */
export class ApiError extends Error {
  constructor (
    message: string,
    readonly status: number | null = null,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function messageForStatus (status: number): string {
  if (status === 404) return 'The requested rocket could not be found.'
  if (status === 429) return 'Too many requests to the rocket API. Please wait a moment and try again.'
  if (status >= 500) return 'The rocket API is currently unavailable. Please try again later.'
  return `Request failed with status ${status}.`
}

export function isAbortError (error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function toErrorMessage (error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

export async function getJson<T> (url: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new ApiError('Unable to reach the rocket API. Check your connection and try again.')
  }

  if (!response.ok) {
    throw new ApiError(messageForStatus(response.status), response.status)
  }

  return response.json() as Promise<T>
}
