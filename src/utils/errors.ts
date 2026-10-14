/**
 * utils/errors.ts
 *
 * Error type carrying a user-facing message and whether retrying can help.
 */

export class AppError extends Error {
  readonly retryable: boolean

  constructor (message: string, { retryable = true }: { retryable?: boolean } = {}) {
    super(message)
    this.name = 'AppError'
    this.retryable = retryable
  }
}

export function toAppError (error: unknown): AppError {
  if (error instanceof AppError) return error
  return new AppError('Something went wrong. Please try again.')
}
