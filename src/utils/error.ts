/**
 * utils/error.ts
 */

export function isAbortError (error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

/** Converts any thrown value into a user-friendly message. */
export function getErrorMessage (error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong. Please try again.'
}
