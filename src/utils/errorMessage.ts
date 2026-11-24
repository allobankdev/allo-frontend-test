import { ApiError } from '@/api/rocketApi'

export function isAbortError (error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

export function toErrorMessage (error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  return 'Something went wrong. Please try again.'
}
