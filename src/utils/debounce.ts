/**
 * src/utils/debounce.ts
 * Strictly typed debounce utility without `any`.
 */
export function debounce<A extends readonly unknown[], R>(
  func: (...args: A) => R,
  wait = 300
): ((...args: A) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debounced = function (...args: A) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, wait)
  }

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}
